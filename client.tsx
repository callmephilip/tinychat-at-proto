import { serveStatic } from "hono/deno";
import { TID } from "@atproto/common";
import { app } from "tinychat/client.ts";
import { ChatPage } from "@tinychat/ui/pages/chat.tsx";
import { LoadMoreMessages } from "@tinychat/ui/message.tsx";
import { ServersPage } from "@tinychat/ui/pages/servers.tsx";
import { ServerPage } from "@tinychat/ui/pages/server.tsx";
import { ChannelPage } from "@tinychat/ui/pages/channel.tsx";
import { Message, MessageThread } from "@tinychat/ui/message.tsx";
import { LexiconPage } from "@tinychat/ui/pages/lexicon.tsx";
import { LexiconDefinition } from "@tinychat/ui/lexicon/definition.tsx";
import { CreateServerPage } from "@tinychat/ui/pages/create-server.tsx";
import { HTTPException } from "hono/http-exception";
import { parseURLForChannelMessageList, serverAtURIFromUrl, urlFromServerAtURI } from "tinychat/utils.ts";
import { validateRecord } from "@tinychat/lexicons/types/chat/tinychat/core/message.ts";
import { getRichText } from "tinychat/bsky.ts";

// reset env vars - if we want to test oauth properly
Deno.env.delete("TEST_AGENT_SERVICE");
Deno.env.delete("TEST_AGENT_IDENTIFIER");
Deno.env.delete("TEST_AGENT_PASSWORD");

app.use("/static/*", serveStatic({ root: "./" }));
app.get("/lexicon", (c) => c.render(<LexiconPage />));
app.get("/lexicon/def", (c) => {
  const { n } = c.req.query();
  // detect if request is from htmx
  if (c.req.header("hx-request")) {
    return c.html(<LexiconDefinition name={n} />);
  }
  return c.html(<LexiconPage name={n} />);
});
app.get("/whiteboard", (c) => c.redirect("https://excalidraw.com/#json=0m7kFsHTC4Pg9e1IW2Pp-,zsWy4awOAjtVX8gJNa_vYw"));

app.get("/logout", async (c) => {
  const { session } = c.var.ctx;
  await session?.destroy();
  return c.redirect("/login");
});

app.get("/chat/:did/:rkey", async (c) => {
  // const { did, rkey } = c.req.param();
  const { ch } = c.req.query();
  const agent = await c.var.ctx.agent();
  const user = await c.var.ctx.user();
  const s = await agent?.chat.tinychat.server.getServers({
    uris: [serverAtURIFromUrl(c.req.url)],
  });
  const serverData = s?.data.servers[0];

  if (!serverData) {
    throw new HTTPException(404, { message: "Server not found" });
  }

  return c.html(
    ChatPage({
      auth: {
        user,
        isMemberOf: (server) => {
          if (!user) {
            return false;
          }
          return user.servers?.some((s) => s.uri === server);
        },
      },
      server: {
        server: serverData,
        currentChannel: ch ? serverData.channels?.find((c) => c.id === ch) : serverData.channels[0],
      },
    })
  );
});

app.post("/messages/send", async (c) => {
  const agent = await c.var.ctx.agent();
  const user = await c.var.ctx.user();

  if (!agent || !user) {
    return c.redirect("/login");
  }

  const data = await c.req.formData();
  const rt = await getRichText(data.get("msg")!.toString());
  const rec = validateRecord({
    id: TID.nextStr(),
    server: data.get("server")!.toString(),
    channel: data.get("channel")!.toString(),
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
    reply: data.get("reply") ? JSON.parse(data.get("reply")!.toString()) : undefined,
    // @ts-ignore yolo
  }).value!;

  console.log("send message", rec);

  const { uri, cid } = await agent.chat.tinychat.core.message.create({ repo: agent.agent.assertDid }, rec);

  return c.html(
    <Message
      message={{
        ts: `${new Date().getTime() * 1000}`,
        indexedAt: new Date().toISOString(),
        uri,
        cid,
        author: user,
        record: rec,
      }}
      oob={false}
    />
  );
});

app.get("/messages/list/:did/:rkey1/:rkey2", async (c) => {
  const limit = 40;
  const { server, channel } = parseURLForChannelMessageList(c.req.path);
  const agent = await c.var.ctx.agent();
  const parent = c.req.query("parent");
  const d = await agent?.chat.tinychat.server.getMessages({
    server,
    channel,
    limit,
    cursor: c.req.query("cursor"),
    parent,
    sort: c.req.query("sort"),
  });
  const loadMore = d?.data.prevCursor ? (
    <LoadMoreMessages
      // @ts-ignore yolo
      messages={d.data.messages}
      url={c.req.path + `?cursor=${d?.data.prevCursor}`}
    />
  ) : null;

  if (parent) {
    console.log("thread data", d?.data.messages);
    // @ts-ignore yolo
    return c.html(<MessageThread messages={d?.data.messages || []} />);
  }

  return c.html(
    (d?.data.messages || [])
      // @ts-ignore yolo
      .map((message) => (<Message message={message} oob={false} />).toString())
      .join("") + (loadMore ? loadMore.toString() : "")
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
  return c.html(<ServersPage servers={(availableServers?.data.servers || []).filter((s) => s.name === "tinychat-dev")} />);
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
      messages={[]} // d?.data.messages ||
      nextCursor={d?.data.nextCursor}
      prevCursor={d?.data.prevCursor}
    />
  );
});

app.get("/new", async (c) => {
  const user = await c.var.ctx.user();

  if (!user) {
    return c.redirect("/login");
  }

  return c.html(<CreateServerPage />);
});
app.post("/new", async (c) => {
  const data = await c.req.formData();
  const agent = await c.var.ctx.agent();
  const d = await agent?.chat.tinychat.server.createServer({
    name: data.get("name")!.toString(),
  });
  return c.redirect(urlFromServerAtURI(d?.data.server.uri!));
});

app.post("/join", async (c) => {
  const data = await c.req.formData();
  const agent = await c.var.ctx.agent();
  await agent?.chat.tinychat.server.joinServer({
    server: data.get("server")!.toString(),
  });
  return c.redirect(urlFromServerAtURI(data.get("server")!.toString()));
});

export const runClient = () => {
  Deno.serve(
    {
      port: parseInt(Deno.env.get("CLIENT_PORT") || "8000"),
    },
    app.fetch
  );
};

if (import.meta.main) {
  runClient();
}
