import { serveStatic } from "hono/deno";
import { app } from "tinychat/client.ts";
import { landing } from "@tinychat/ui/landing.tsx";
import { chat } from "@tinychat/ui/chat.tsx";

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => c.html(landing()));
app.get("/chat", (c) => c.html(chat()));

app.get("/session", async (c) => {
  const ta = await c.var.ctx.agent();
  if (!ta) {
    return c.redirect("/login");
  }
  return c.html("ok");
});

app.get("/login", (c) => {
  return c.html(
    <form method="post" action="/login">
      <input
        value="callmephilip.com"
        name="handle"
        placeholder="your bsky handle"
      />
    </form>,
  );
});

Deno.serve(
  {
    port: parseInt(Deno.env.get("CLIENT_PORT") || "8000"),
  },
  app.fetch,
);
