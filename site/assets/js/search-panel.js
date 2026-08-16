import { getQueryState, setQueryState } from "./lib.js";

export function initSearchPanel() {
  const toggle = document.querySelector("[data-search-toggle]");
  const panel = document.querySelector("[data-search-panel]");
  const form = document.querySelector("[data-search-form]");
  const input = document.querySelector("[data-search-input]");
  const clearButton = document.querySelector("[data-search-clear]");
  if (!toggle || !panel || !input) return;

  const onArchive = Boolean(document.querySelector("[data-archive]"));

  function isOpen() {
    return !panel.hidden;
  }

  function open() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => input.focus());
  }

  function close({ clearQuery = true } = {}) {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");

    if (!clearQuery) return;

    if (input.value) {
      input.value = "";
      if (clearButton) clearButton.hidden = true;
      if (onArchive) {
        setQueryState({ q: "", category: "", tags: [] });
        input.dispatchEvent(new Event("search-cleared"));
      }
    }
  }

  toggle.addEventListener("click", () => {
    if (isOpen()) close();
    else open();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      close();
      toggle.focus();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = input.value.trim();
    if (!onArchive && q) {
      const base = document.body.dataset.baseurl || "";
      window.location.href = `${base}/?q=${encodeURIComponent(q)}`;
    }
  });

  const state = getQueryState();
  if (state.q && onArchive) {
    input.value = state.q;
    if (clearButton) clearButton.hidden = false;
    open();
  }
}
