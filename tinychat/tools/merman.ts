// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: tools/merman.ipynb

import { Hono } from "hono";

export const merman = (
  yaml: string,
  header: string | undefined = undefined,
  ports: number[] = [7000, 8000],
) => {
  const port = Math.floor(Math.random() * (ports[1] - ports[0] + 1)) + ports[0];
  const app = new Hono();
  app.get("/", (c) =>
    c.html(`<html>
      <body>
        ${header || ""}
        <pre class="mermaid">
          ${yaml}        
        </pre>
        <script type="module">
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
          mermaid.initialize({ startOnLoad: true });
        </script>
      </body>
    </html>`));

  const server = Deno.serve({ port }, app.fetch);
  setTimeout(() => server.shutdown(), 5000);
  return Deno.jupyter
    .html`<iframe style="background-color:#ffffff;" src="http://localhost:${port}" width="100%" height="600px"></iframe>`;
};
