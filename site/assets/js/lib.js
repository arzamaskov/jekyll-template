let indexPromise;

function withBase(path) {
  const base = document.body.dataset.baseurl || "";
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

export function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(withBase("/assets/search-index.json"))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load search index");
        }
        return response.json();
      })
      .catch(() => []);
  }
  return indexPromise;
}

export function getQueryState() {
  const params = new URLSearchParams(window.location.search);
  const tagsParam = params.get("tags") || "";
  return {
    q: (params.get("q") || "").trim(),
    category: (params.get("category") || "").trim(),
    tags: tagsParam
      ? tagsParam
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
  };
}

export function setQueryState({ q, category, tags }, { replace = true } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (tags && tags.length) params.set("tags", tags.join(","));

  const query = params.toString();
  const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", next);
}

export function filterPosts(posts, { q, category, tags }) {
  const query = (q || "").toLocaleLowerCase();
  const selectedTags = tags || [];

  return posts.filter((post) => {
    if (category && post.category !== category) {
      return false;
    }

    if (selectedTags.length > 0) {
      const postTags = post.tags || [];
      const hasAll = selectedTags.every((tag) => postTags.includes(tag));
      if (!hasAll) return false;
    }

    if (!query) return true;

    const haystack = [
      post.title,
      post.excerpt,
      post.category,
      ...(post.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    return haystack.includes(query);
  });
}

export function renderPostList(container, posts, { readingLabel }) {
  container.innerHTML = posts
    .map((post) => {
      const tags = (post.tags || [])
        .map(
          (tag) =>
            `<li><a class="tag" href="${withBase("/tags/")}?tags=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a></li>`
        )
        .join("");

      const image = post.image
        ? `<a class="post-teaser__image" href="${escapeAttr(post.url)}" tabindex="-1" aria-hidden="true">
            <img src="${escapeAttr(post.image)}" alt="" loading="lazy" decoding="async" width="160" height="100">
           </a>`
        : "";

      const category = post.category
        ? `<span aria-hidden="true">·</span>
           <a href="${withBase("/categories/")}?category=${encodeURIComponent(post.category)}">${escapeHtml(post.category)}</a>`
        : "";

      return `<li class="post-list__item">
        <article class="post-teaser">
          <div class="post-teaser__body">
            <p class="post-teaser__meta">
              <time datetime="${escapeAttr(post.date)}">${escapeHtml(post.dateDisplay)}</time>
              ${category}
              <span aria-hidden="true">·</span>
              <span>${post.readingMinutes} ${escapeHtml(readingLabel)}</span>
            </p>
            <h2 class="post-teaser__title">
              <a href="${escapeAttr(post.url)}">${escapeHtml(post.title)}</a>
            </h2>
            ${post.excerpt ? `<p class="post-teaser__excerpt">${escapeHtml(post.excerpt)}</p>` : ""}
            ${tags ? `<ul class="tag-list tag-list--compact">${tags}</ul>` : ""}
          </div>
          ${image}
        </article>
      </li>`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
