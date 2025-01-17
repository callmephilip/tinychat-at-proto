import { serveStatic } from "hono/deno";
import { app } from "tinychat/client.ts";
import { ChatPage } from "@tinychat/ui/pages/chat.tsx";

// reset env vars - if we want to test oauth properly
Deno.env.delete("TEST_AGENT_SERVICE");
Deno.env.delete("TEST_AGENT_IDENTIFIER");
Deno.env.delete("TEST_AGENT_PASSWORD");

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/chat", async (c) => {
  const agent = await c.var.ctx.agent();
  console.log("chat page >>>>>>>>>>>>>");

  // XX: this is to get smth rolling quickly for test purposes
  console.log(await agent?.chat.tinychat.server.getServers());

  return c.html(
    ChatPage({
      user: await c.var.ctx.user(),
    }),
  );
});

Deno.serve(
  {
    port: parseInt(Deno.env.get("CLIENT_PORT") || "8000"),
  },
  app.fetch,
);
