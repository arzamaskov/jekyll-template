import {
  filterPosts,
  getQueryState,
  loadIndex,
  renderPostList,
  setQueryState,
} from "./lib.js";

export function initArchive() {
  const root = document.querySelector("[data-archive]");
  if (!root) return;

  const searchInput = root.querySelector("[data-search-input]");
  const clearButton = root.querySelector("[data-search-clear]");
  const categorySelect = root.querySelector("[data-filter-category]");
  const tagButtons = [...root.querySelectorAll("[data-tag]")];
  const resetButton = root.querySelector("[data-filter-reset]");
  const staticArchive = root.querySelector("[data-static-archive]");
  const filteredArchive = root.querySelector("[data-filtered-archive]");
  const filteredList = root.querySelector("[data-filtered-list]");
  const filteredEmpty = root.querySelector("[data-filtered-empty]");
  const readingLabel = root.dataset.uiReading || "";
  const emptyLabel = root.dataset.uiEmpty || "";
  const emptyTagsLabel = root.dataset.uiEmptyTags || "";

  let state = getQueryState();
  applyControls(state);

  async function refresh({ writeUrl = true } = {}) {
    state = {
      q: searchInput?.value.trim() || "",
      category: categorySelect?.value || "",
      tags: tagButtons.filter((btn) => btn.getAttribute("aria-pressed") === "true").map((btn) => btn.dataset.tag),
    };

    if (writeUrl) setQueryState(state);

    const active = Boolean(state.q || state.category || state.tags.length);
    if (clearButton) clearButton.hidden = !state.q;
    if (resetButton) resetButton.hidden = !(state.category || state.tags.length || state.q);

    if (!active) {
      staticArchive.hidden = false;
      filteredArchive.hidden = true;
      return;
    }

    const posts = await loadIndex();
    const filtered = filterPosts(posts, state);

    staticArchive.hidden = true;
    filteredArchive.hidden = false;

    if (filtered.length === 0) {
      filteredList.innerHTML = "";
      filteredEmpty.hidden = false;
      filteredEmpty.textContent = state.tags.length ? emptyTagsLabel : emptyLabel;
      return;
    }

    filteredEmpty.hidden = true;
    renderPostList(filteredList, filtered, { readingLabel });
  }

  function applyControls(next) {
    if (searchInput) searchInput.value = next.q || "";
    if (categorySelect) categorySelect.value = next.category || "";
    tagButtons.forEach((btn) => {
      const pressed = next.tags.includes(btn.dataset.tag);
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
      btn.classList.toggle("is-active", pressed);
    });
  }

  searchInput?.addEventListener("input", () => {
    window.clearTimeout(searchInput._timer);
    searchInput._timer = window.setTimeout(() => refresh(), 120);
  });

  clearButton?.addEventListener("click", () => {
    searchInput.value = "";
    refresh();
    searchInput.focus();
  });

  categorySelect?.addEventListener("change", () => refresh());

  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pressed = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", pressed ? "false" : "true");
      btn.classList.toggle("is-active", !pressed);
      refresh();
    });
  });

  resetButton?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (categorySelect) categorySelect.value = "";
    tagButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
      btn.classList.remove("is-active");
    });
    refresh();
  });

  window.addEventListener("popstate", () => {
    state = getQueryState();
    applyControls(state);
    refresh({ writeUrl: false });
  });

  if (state.q || state.category || state.tags.length) {
    refresh({ writeUrl: false });
  }
}
