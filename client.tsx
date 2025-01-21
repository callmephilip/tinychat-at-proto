import { serveStatic } from "hono/deno";
import { app } from "tinychat/client.ts";
import { ChatPage } from "@tinychat/ui/pages/chat.tsx";
import { Message } from "@tinychat/ui/message.tsx";
import { sleep } from "tinychat/utils.ts";
import { HTTPException } from "hono/http-exception";
import { serverAtURIFromUrl, urlFromServerAtURI } from "tinychat/utils.ts";

// reset env vars - if we want to test oauth properly
Deno.env.delete("TEST_AGENT_SERVICE");
Deno.env.delete("TEST_AGENT_IDENTIFIER");
Deno.env.delete("TEST_AGENT_PASSWORD");

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/chat/:did?/:rkey?", async (c) => {
  const { did, rkey } = c.req.param();
  const { ch } = c.req.query();
  const agent = await c.var.ctx.agent();

  // got a fully qualified route, let's go!
  if (did && rkey) {
    console.log("server iz", serverAtURIFromUrl(c.req.url));
    const s = await agent?.chat.tinychat.server.getServers({
      uris: [serverAtURIFromUrl(c.req.url)],
    });
    const serverData = s?.data.servers[0];
    console.log(">>>>>>>>>>>>>>>>>>>>>> serverData", serverData);

    if (!serverData) {
      throw new HTTPException(404, { message: "Server not found" });
    }

    return c.html(
      ChatPage({
        auth: {
          user: await c.var.ctx.user(),
        },
        server: {
          server: serverData,
          currentChannel: ch
            ? serverData.channels?.find((c) => c.uri.endsWith(ch))
            : serverData.channels[0],
        },
        noShell: typeof c.req.header("hx-request") !== "undefined",
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
      await agent?.chat.tinychat.core.channel.create(
        { repo: agent?.agent.assertDid },
        { name: "random", server: s?.uri! },
      );
      await sleep(2000);
      return c.redirect(urlFromServerAtURI(s?.uri!));
    } catch {
      return c.redirect("/login");
    }
  }

  return c.redirect(urlFromServerAtURI(availableServers?.data.servers[0].uri!));
});

app.post("/messages/send", async (c) => {
  const agent = await c.var.ctx.agent();
  const data = await c.req.formData();
  const d = await agent?.chat.tinychat.server.sendMessage({
    channel: data.get("channel")!.toString(),
    text: data.get("msg")!.toString(),
    server: data.get("server")!.toString(),
  });
  return c.html(Message({ message: d?.data.message!, oob: false }).toString());
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

app.post("/mark-all-as-read", async (c) => {
  const data = await c.req.formData();
  const agent = await c.var.ctx.agent();
  await agent?.chat.tinychat.server.markAllMessagesAsRead({
    channel: data.get("channel")!.toString(),
  });
  return c.json({ success: true });
});

Deno.serve(
  {
    port: parseInt(Deno.env.get("CLIENT_PORT") || "8000"),
  },
  app.fetch,
);
