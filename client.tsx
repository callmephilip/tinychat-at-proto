import { serveStatic } from "hono/deno";
import { TID } from "@atproto/common";
import { app } from "tinychat/client.ts";
import { ChatPage } from "@tinychat/ui/pages/chat.tsx";
import { LoadMoreMessages, Message } from "@tinychat/ui/message.tsx";
import { ServersPage } from "@tinychat/ui/pages/servers.tsx";
import { ServerPage } from "@tinychat/ui/pages/server.tsx";
import { ChannelPage } from "@tinychat/ui/pages/channel.tsx";
import { sleep } from "tinychat/utils.ts";
import { HTTPException } from "hono/http-exception";
import {
  parseURLForChannelMessageList,
  serverAtURIFromUrl,
  urlFromServerAtURI,
} from "tinychat/utils.ts";

// reset env vars - if we want to test oauth properly
Deno.env.delete("TEST_AGENT_SERVICE");
Deno.env.delete("TEST_AGENT_IDENTIFIER");
Deno.env.delete("TEST_AGENT_PASSWORD");

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/chat/:did?/:rkey?", async (c) => {
  const { did, rkey } = c.req.param();
  const { ch } = c.req.query();
  const agent = await c.var.ctx.agent();

  if (!agent) {
    return c.redirect("/login");
  }

  // got a fully qualified route, let's go!
  if (did && rkey) {
    const user = await c.var.ctx.user();

    if (user) {
      await agent.chat.tinychat.server.joinServer({
        server: serverAtURIFromUrl(c.req.url),
      });
    }

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
          user,
        },
        server: {
          server: serverData,
          currentChannel: ch
            ? serverData.channels?.find((c) => c.id === ch)
            : serverData.channels[0],
        },
      }),
    );
  }

  // XX: this is to get smth rolling quickly for test purposes
  const availableServers = await agent?.chat.tinychat.server.findServers({});

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
          channels: [
            { name: "general", id: TID.nextStr() },
            { name: "random", id: TID.nextStr() },
            { name: "meta", id: TID.nextStr() },
          ],
        },
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

  if (!agent) {
    return c.redirect("/login");
  }

  const data = await c.req.formData();
  const d = await agent?.chat.tinychat.server.sendMessage({
    channel: data.get("channel")!.toString(),
    text: data.get("msg")!.toString(),
    server: data.get("server")!.toString(),
  });
  return c.html(<Message message={d?.data.message!} oob={false} />);
});

app.get("/messages/list/:did/:rkey1/:rkey2", async (c) => {
  const limit = 40;
  const { server, channel } = parseURLForChannelMessageList(c.req.path);
  const agent = await c.var.ctx.agent();
  const d = await agent?.chat.tinychat.server.getMessages({
    server,
    channel,
    limit,
    cursor: c.req.query("cursor"),
  });
  const loadMore = d?.data.prevCursor
    ? (
      <LoadMoreMessages
        messages={d?.data.messages || []}
        url={c.req.path + `?cursor=${d?.data.prevCursor}`}
      />
    )
    : null;

  return c.html(
    (d?.data.messages || [])
      .map((message) => (<Message message={message} oob={false} />).toString())
      .join("") + (loadMore ? loadMore.toString() : ""),
  );
});

app.post("/mark-all-as-read", async (c) => {
  const data = await c.req.formData();
  const agent = await c.var.ctx.agent();
  await agent?.chat.tinychat.server.markAllMessagesAsRead({
    channel: data.get("channel")!.toString(),
    server: data.get("server")!.toString(),
  });
  console.log("mark-all-as-read", data);
  return c.json({ success: true });
});

app.get("/servers", async (c) => {
  const agent = await c.var.ctx.agent();
  const availableServers = await agent?.chat.tinychat.server.findServers({});
  return c.html(<ServersPage servers={availableServers?.data.servers || []} />);
});

app.get("/server/:did/:rkey/:slug", async (c) => {
  const agent = await c.var.ctx.agent();
  const server = serverAtURIFromUrl(c.req.url, "server");
  const r = await agent?.chat.tinychat.server.getServers({
    uris: [server],
  });

  if (!r?.data.servers[0]) {
    throw new HTTPException(404, { message: "Server not found" });
  }

  return c.html(<ServerPage server={r?.data.servers[0]} />);
});

// /server/ubdeopbbkbgedccgbum7dhsh/3lglfblyv672b/test-3lglfblgww32h/3lglfblgyum2h

app.get("/server/:did/:rkey/:slug/:channel", async (c) => {
  // loose channel id
  const parts = c.req.path.split("/");
  parts.pop();
  const { channel } = c.req.param();
  const agent = await c.var.ctx.agent();
  const server = serverAtURIFromUrl(parts.join("/"), "server");
  const r = await agent?.chat.tinychat.server.getServers({
    uris: [server],
  });

  if (!r?.data.servers[0]) {
    throw new HTTPException(404, { message: "Server not found" });
  }

  const d = await agent?.chat.tinychat.server.getMessages({
    server,
    channel,
    limit: 10,
    sort: "chronological",
    cursor: c.req.query("cursor"),
  });

  return c.html(
    <ChannelPage
      server={r.data.servers[0]}
      channel={channel}
      messages={d?.data.messages || []}
      nextCursor={d?.data.nextCursor}
      prevCursor={d?.data.prevCursor}
    />,
  );
});

export const runClient = () => {
  Deno.serve(
    {
      port: parseInt(Deno.env.get("CLIENT_PORT") || "8000"),
    },
    app.fetch,
  );
};

if (import.meta.main) {
  runClient();
}
