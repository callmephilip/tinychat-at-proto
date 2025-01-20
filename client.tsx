import { serveStatic } from "hono/deno";
import { app } from "tinychat/client.ts";
import { ChatPage } from "@tinychat/ui/pages/chat.tsx";
import { Message } from "@tinychat/ui/message.tsx";
import { sleep } from "tinychat/utils.ts";

// reset env vars - if we want to test oauth properly
Deno.env.delete("TEST_AGENT_SERVICE");
Deno.env.delete("TEST_AGENT_IDENTIFIER");
Deno.env.delete("TEST_AGENT_PASSWORD");

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/chat/:server?", async (c) => {
  const { server } = c.req.param();
  const agent = await c.var.ctx.agent();

  // got a fully qualified route, let's go!
  if (server) {
    console.log("server iz", server);
    const s = await agent?.chat.tinychat.server.getServers({ uris: [server] });
    const serverData = s?.data.servers[0];
    return c.html(
      ChatPage({
        auth: {
          user: await c.var.ctx.user(),
        },
        server: {
          server: serverData,
          currentChannel: serverData &&
            (serverData.channels ? serverData.channels[0] : undefined),
        },
      }),
    );
  }

  // XX: this is to get smth rolling quickly for test purposes
  const availableServers = await agent?.chat.tinychat.server.getServers();

  if (availableServers?.data.servers.length === 0) {
    console.log("no servers found, let's create one");

    // this will throw if we are not logged in, btw

    try {
      const s = await agent?.chat.tinychat.core.server.create(
        {
          repo: agent?.agent.assertDid,
        },
        {
          name: "tinychat-dev",
        },
      );
      await sleep(1000);
      await agent?.chat.tinychat.core.channel.create(
        { repo: agent?.agent.assertDid },
        { name: "general", server: s?.uri! },
      );
      await sleep(1000);
      return c.redirect(`/chat/${encodeURIComponent(s?.uri!)}`);
    } catch {
      return c.redirect("/login");
    }
  }

  return c.redirect(
    `/chat/${encodeURIComponent(availableServers?.data.servers[0].uri!)}`,
  );
});

app.post("/messages/send", async (c) => {
  const agent = await c.var.ctx.agent();
  const data = await c.req.formData();
  await agent?.chat.tinychat.server.sendMessage({
    channel: data.get("channel")!.toString(),
    text: data.get("msg")!.toString(),
    server: data.get("server")!.toString(),
  });
  return c.html("ok");
});

app.get("/messages/list/:channel", async (c) => {
  const { channel } = c.req.param();
  const agent = await c.var.ctx.agent();
  const d = await agent?.chat.tinychat.server.getMessages({
    channel,
    limit: 40,
  });

  // load_previous = Div(
  //       cls="messages-loading htmx-indicator", hx_get=f"/c/messages/{cid}?c={prev_cursor}", hx_indicator=".messages-loading",
  //       hx_trigger="intersect once", hx_target=f"#channel-{cid}", hx_swap=f"beforeend show:#chat-message-{msgs[-1].id}:top"
  //   ) if len(msgs) == settings.message_history_page_size else None

  return c.html(
    (d?.data.messages || [])
      .map((message) => Message({ message, oob: false }).toString())
      .join(""),
  );
});

Deno.serve(
  {
    port: parseInt(Deno.env.get("CLIENT_PORT") || "8000"),
  },
  app.fetch,
);
