export function initLightbox() {
  const images = document.querySelectorAll(".post__content img, .post__cover img");
  if (!images.length) return;

  const dialog = document.createElement("div");
  dialog.className = "lightbox";
  dialog.hidden = true;
  const closeLabel = document.body.dataset.uiClose || "Close";
  dialog.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="${closeLabel}">${closeLabel}</button>
    <img class="lightbox__img" alt="">
  `;
  document.body.appendChild(dialog);

  const img = dialog.querySelector(".lightbox__img");
  const closeButton = dialog.querySelector(".lightbox__close");
  let lastFocus = null;

  function open(source) {
    lastFocus = document.activeElement;
    img.src = source.currentSrc || source.src;
    img.alt = source.alt || "";
    dialog.hidden = false;
    closeButton.focus();
  }

  function close() {
    dialog.hidden = true;
    img.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  }

  images.forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.addEventListener("click", () => open(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(image);
      }
    });
  });

  closeButton.addEventListener("click", close);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dialog.hidden) close();
  });
}
