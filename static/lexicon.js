import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

document.body.addEventListener("htmx:afterSettle", function (evt) {
  if (evt.detail.target.id !== "main") {
    return;
  }

  document.getElementById("download-diagram").addEventListener("click", () => {
    const svg = document.querySelector("[id*=mermaid]");

    let triggerDownload = (imgURI, fileName) => {
      let a = document.createElement("a");

      a.setAttribute("download", "image.svg");
      a.setAttribute("href", imgURI);
      a.setAttribute("target", "_blank");

      a.click();
    };

    const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml;charset=utf-8",
    });
    triggerDownload(URL.createObjectURL(svgBlob));
  });

  mermaid.run({
    querySelector: ".mermaid",
    postRenderCallback: (id) => {
      // resize svg to fit the content for very big diagrams
      const mermaidWidth = parseInt(
        document.getElementById(id).style["max-width"].replace("px", ""),
      );
      const mainContainerWidth = document.getElementById("main").offsetWidth;
      if (mermaidWidth > mainContainerWidth) {
        document.getElementById(id).setAttribute("width", `${mermaidWidth}px`);
      }
    },
  });
});
