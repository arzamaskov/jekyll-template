import { getQueryState } from "./lib.js";

export function initCategoriesPage() {
  const root = document.querySelector("[data-categories-page]");
  if (!root) return;

  const { category } = getQueryState();
  if (!category) return;

  const section = root.querySelector(`[data-category-section="${cssEscape(category)}"]`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section.querySelector(".taxonomy-section__title")?.setAttribute("tabindex", "-1");
    section.querySelector(".taxonomy-section__title")?.focus({ preventScroll: true });
  }
}

function cssEscape(value) {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return value.replace(/["\\]/g, "\\$&");
}
