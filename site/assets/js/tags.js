import {
  filterPosts,
  getQueryState,
  loadIndex,
  renderPostList,
  setQueryState,
} from "./lib.js";

export function initTagsPage() {
  const root = document.querySelector("[data-tags-page]");
  if (!root) return;

  const picker = root.querySelector("[data-tag-picker]");
  const buttons = [...root.querySelectorAll("[data-tag]")];
  const resetButton = root.querySelector("[data-tags-reset]");
  const staticBlock = root.querySelector("[data-tags-static]");
  const filteredBlock = root.querySelector("[data-tags-filtered]");
  const filteredList = root.querySelector("[data-filtered-list]");
  const filteredEmpty = root.querySelector("[data-filtered-empty]");
  const readingLabel = root.dataset.uiReading || "";
  const emptyTagsLabel = root.dataset.uiEmptyTags || "";

  if (picker) picker.hidden = false;

  let state = getQueryState();
  applyButtons(state.tags);

  async function refresh({ writeUrl = true } = {}) {
    const tags = buttons
      .filter((btn) => btn.getAttribute("aria-pressed") === "true")
      .map((btn) => btn.dataset.tag);

    if (writeUrl) setQueryState({ ...getQueryState(), tags, q: "", category: "" });
    if (resetButton) resetButton.hidden = tags.length === 0;

    if (tags.length === 0) {
      staticBlock.hidden = false;
      filteredBlock.hidden = true;
      return;
    }

    const posts = await loadIndex();
    const filtered = filterPosts(posts, { tags, q: "", category: "" });

    staticBlock.hidden = true;
    filteredBlock.hidden = false;

    if (filtered.length === 0) {
      filteredList.innerHTML = "";
      filteredEmpty.hidden = false;
      filteredEmpty.textContent = emptyTagsLabel;
      return;
    }

    filteredEmpty.hidden = true;
    renderPostList(filteredList, filtered, { readingLabel });
  }

  function applyButtons(tags) {
    buttons.forEach((btn) => {
      const pressed = tags.includes(btn.dataset.tag);
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
      btn.classList.toggle("is-active", pressed);
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pressed = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", pressed ? "false" : "true");
      btn.classList.toggle("is-active", !pressed);
      refresh();
    });
  });

  resetButton?.addEventListener("click", () => {
    applyButtons([]);
    refresh();
  });

  window.addEventListener("popstate", () => {
    state = getQueryState();
    applyButtons(state.tags);
    refresh({ writeUrl: false });
  });

  if (state.tags.length) {
    refresh({ writeUrl: false });
  }
}
