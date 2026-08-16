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

  const searchInput = document.querySelector("[data-search-input]");
  const clearButton = document.querySelector("[data-search-clear]");
  const staticArchive = root.querySelector("[data-static-archive]");
  const filteredArchive = root.querySelector("[data-filtered-archive]");
  const filteredList = root.querySelector("[data-filtered-list]");
  const filteredEmpty = root.querySelector("[data-filtered-empty]");
  const readingLabel = root.dataset.uiReading || "";
  const emptyLabel = root.dataset.uiEmpty || "";

  async function refresh({ writeUrl = true } = {}) {
    const state = {
      q: searchInput?.value.trim() || "",
      category: "",
      tags: [],
    };

    if (writeUrl) setQueryState(state);
    if (clearButton) clearButton.hidden = !state.q;

    if (!state.q) {
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
      filteredEmpty.textContent = emptyLabel;
      return;
    }

    filteredEmpty.hidden = true;
    renderPostList(filteredList, filtered, { readingLabel });
  }

  function applyQueryFromUrl() {
    const state = getQueryState();
    if (searchInput) searchInput.value = state.q || "";
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

  searchInput?.addEventListener("search-cleared", () => {
    refresh({ writeUrl: false });
  });

  window.addEventListener("popstate", () => {
    applyQueryFromUrl();
    refresh({ writeUrl: false });
  });

  applyQueryFromUrl();
  if (getQueryState().q) {
    refresh({ writeUrl: false });
  }
}
