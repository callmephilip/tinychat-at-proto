import { serveStatic } from "hono/deno";
import { app } from "tinychat/client.ts";

app.use("/static/*", serveStatic({ root: "./" }));

Deno.serve(
  {
    port: parseInt(Deno.env.get("CLIENT_PORT") || "8000"),
  },
  app.fetch,
);
