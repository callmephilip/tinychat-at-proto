import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

document.body.addEventListener("htmx:afterSettle", function (evt) {
  if (evt.detail.target.id !== "main") {
    return;
  }
  mermaid.run();
});
