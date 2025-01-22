import { serveStatic } from "hono/deno";
import { TID } from "@atproto/common";
import { app } from "tinychat/client.ts";
import { ChatPage } from "@tinychat/ui/pages/chat.tsx";
import { LoadMoreMessages, Message } from "@tinychat/ui/message.tsx";
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
            ? serverData.channels?.find((c) => c.id === ch)
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
  const data = await c.req.formData();
  const d = await agent?.chat.tinychat.server.sendMessage({
    channel: data.get("channel")!.toString(),
    text: data.get("msg")!.toString(),
    server: data.get("server")!.toString(),
  });
  return c.html(Message({ message: d?.data.message!, oob: false }).toString());
});

app.get("/messages/list/:did/:rkey1/:rkey2", async (c) => {
  const limit = 40;
  const { server, channel } = parseURLForChannelMessageList(c.req.path);
  const agent = await c.var.ctx.agent();
  const d = await agent?.chat.tinychat.server.getMessages({
    server,
    channel,
    limit,
  });

  console.log(
    ">>>>>>>>>>>>>>>>>>>>>> got messages",
    d?.data.messages,
    "for",
    server,
    channel,
  );

  return c.html(
    (d?.data.messages || [])
      .map((message) => (<Message message={message} oob={false} />).toString())
      .join("") +
      (
        <LoadMoreMessages
          messages={d?.data.messages || []}
          url={c.req.path + `?cursor=${d?.data.cursor}`}
        />
      ).toString(),
  );
});

app.post("/mark-all-as-read", async (c) => {
  const data = await c.req.formData();
  const agent = await c.var.ctx.agent();
  await agent?.chat.tinychat.server.markAllMessagesAsRead({
    channel: data.get("channel")!.toString(),
    server: data.get("server")!.toString(),
  });
  return c.json({ success: true });
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
