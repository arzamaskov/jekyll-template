export function initCodeCopy() {
  const blocks = document.querySelectorAll(".post__content pre");
  if (!blocks.length) return;

  const copyLabel = document.body.dataset.uiCopy || "Copy";
  const copiedLabel = document.body.dataset.uiCopied || "Copied";

  blocks.forEach((pre) => {
    if (pre.closest(".code-block")) return;

    const target = pre.closest(".highlight") || pre;
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    target.parentNode.insertBefore(wrapper, target);
    wrapper.appendChild(target);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-block__copy";
    button.textContent = copyLabel;
    wrapper.appendChild(button);

    button.addEventListener("click", async () => {
      const text = pre.innerText;
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = copiedLabel;
        window.setTimeout(() => {
          button.textContent = copyLabel;
        }, 1600);
      } catch {
        button.textContent = copyLabel;
      }
    });
  });
}
