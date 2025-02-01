// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: appview.ipynb

// based on https://docs.deno.com/examples/chat_app_tutorial/

interface ChatServerClient {
  ws: WebSocket;
  did?: string | undefined;
}

type BroadcastFilter = (client: ChatServerClient) => boolean;

export default class ChatServer {
  private connectedClients = new Map<string, ChatServerClient>();

  public handleConnection(ws: WebSocket, additionalData: object) {
    const id = `${Math.random() * 100000000}`;

    ws.onclose = () => {
      this.clientDisconnected(id);
    };

    this.connectedClients.set(id, Object.assign({ ws }, additionalData));
    console.log(">>>>>>> connectedClients", this.connectedClients.size);
  }

  private clientDisconnected(id: string) {
    this.connectedClients.delete(id);
    console.log(`Client ${id} disconnected`);
  }

  public broadcast(message: string, filter?: BroadcastFilter | undefined) {
    for (const client of this.connectedClients.values()) {
      console.log(">>>>>>> sending message to", client);
      if (!filter || filter(client)) {
        client.ws.send(message);
      }
    }
  }

  public broadcastFn(fn: (client: ChatServerClient) => string) {
    for (const client of this.connectedClients.values()) {
      try {
        client.ws.send(fn(client));
      } catch (e) {
        console.error("Error broadcasting to client", client, "error is:", e);
      }
    }
  }
}
import { Hono } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { upgradeWebSocket } from "hono/deno";
import { Message } from "@tinychat/ui/message.tsx";
import { ChannelLabel } from "@tinychat/ui/channel.tsx";
import { createMiddleware } from "hono/factory";
import { TinychatOAuthClient } from "tinychat/oauth.ts";
import { TinychatAgent } from "tinychat/agent.ts";
import { getDatabase } from "tinychat/db.ts";
import type { Database } from "tinychat/db.ts";
import { ActorView } from "tinychat/api/types/chat/tinychat/actor/defs.ts";
import {
  validateMessageView,
} from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { ids } from "tinychat/api/lexicons.ts";
import { getProfile } from "tinychat/bsky.ts";
import { Messaging } from "tinychat/core/messaging.ts";
import { Servers } from "tinychat/core/servers.ts";

export type AppContext = {
  agent: () => Promise<TinychatAgent | undefined>;
  user: () => Promise<ActorView | undefined>;
  db?: Database | undefined;
};

export type HonoServer = Hono<{
  Variables: {
    ctx: AppContext;
  };
}>;

const app = new Hono();
const chatServer = new ChatServer();

app.use(
  "*",
  createMiddleware(async (c, next) => {
    const authorization = c.req.header("Authorization");
    const { client: oauthClient, user } = authorization
      ? await TinychatOAuthClient.fromAuthorizationHeader(authorization)
      : {};
    c.set("ctx", {
      oauthClient,
      session: undefined,
      agent: async () => await TinychatAgent.create(oauthClient, user),
      user: async () => await Promise.resolve(undefined),
      db: getDatabase(),
    });
    await next();
  }),
);

app.get(
  "/",
  (c) => c.redirect("https://github.com/callmephilip/tinychat-at-proto"),
);

// app.use("/ws", cors());
app.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      onOpen: (_, ws) => {
        if (!ws.raw) {
          return;
        }
        chatServer.handleConnection(ws.raw, c.req.query());
      },
    };
  }),
);

"";
import {
  DeleteMembershipRecord,
  DeleteMessageRecord,
  DeleteServerRecord,
  NewMembershipRecord,
  NewMessageRecord,
  NewServerRecord,
  startJetstream,
} from "tinychat/firehose.ts";

type AppViewShutdown = () => Promise<void>;
type AppViewContext = {
  database?: Database | undefined;
};

export const runAppView = (
  { database }: AppViewContext = {},
): AppViewShutdown => {
  const db = database || getDatabase();
  const messaging = new Messaging(db);
  const servers = new Servers(db);

  console.log("Starting appview with db", db);

  // Cleanup function
  const cleanup = () => {
    console.log("goodbye");
    Deno.removeSignalListener("SIGINT", cleanup);
    Deno.removeSignalListener("SIGTERM", cleanup);
    Deno.exit(0);
  };

  // Handle shutdown signals

  Deno.addSignalListener("SIGINT", cleanup);
  Deno.addSignalListener("SIGTERM", cleanup);

  console.log("Service started");

  const shutdownJetstream = startJetstream({
    db,
    onNewServer: (m: NewServerRecord) => {
      servers.syncServer(m);
    },
    onDeleteServer: (m: DeleteServerRecord) => {
      servers.deleteServer(m);
    },
    onNewMembership: (m: NewMembershipRecord) => {
      servers.createMembership(m);
    },
    onNewMessage: (m: NewMessageRecord) => {
      messaging.receiveMessage({
        m: m.commit.record,
        uri: m.uri,
        sender: m.did,
        time_us: `${m.time_us}`,
      });

      // grab new message + sender info and broadcast to chat

      const { messages } = new Messaging(db).getMessages({ uri: m.uri });
      const msgHTML = Message({ message: messages[0], oob: true }).toString();
      // chatServer.broadcast(
      //   JSON.stringify({
      //     data: ,
      //     html: ,
      //   }),
      //   (c: ChatServerClient) =>
      // );

      chatServer.broadcastFn((c: ChatServerClient) => {
        const servers = new Servers(db).getServers({
          uris: [m.commit.record.server],
          viewer: c.did,
        });
        const channels = servers.length !== 0 ? servers[0].channels : [];
        return JSON.stringify({
          data: { message: messages[0], channels },
          html: (c.did !== m.did ? msgHTML : "") +
            channels
              .map((channel) => ChannelLabel({ channel }).toString())
              .join(""),
        });
      });
    },
    onDeleteMessage: (m: DeleteMessageRecord) => {
      messaging.deleteMessage(m);
    },
    onDeleteMembership: (m: DeleteMembershipRecord) => {
      console.log(">>>>>>>>>>>>>>>>>>>>>>> Deleting membership", m);
    },
  });

  const server = Deno.serve(
    { port: parseInt(Deno.env.get("APPVIEW_PORT") || "8000") },
    app.fetch,
  );

  return async () => {
    try {
      shutdownJetstream();
      console.log("Shutting down server");
      await server.shutdown();
      console.log("Server shut down");
      Deno.removeSignalListener("SIGINT", cleanup);
      Deno.removeSignalListener("SIGTERM", cleanup);
    } catch (e) {
      console.error("Error shutting down server", e);
    }
  };
};
app.post(`/xrpc/${ids.ChatTinychatServerCreateServer}`, async (c) => {
  const agent = await c.var.ctx.agent();
  const { name } = z
    .object({
      name: z.string(),
    })
    .parse(await c.req.json());

  return c.json({
    server: await (new Servers(c.var.ctx.db!).createServer({
      name,
      tc: agent!,
    })),
  });
});

"";
app.get(`/xrpc/${ids.ChatTinychatActorGetProfile}`, async (c) => {
  const { db } = c.var.ctx;
  if (!db) {
    throw new HTTPException(500, { message: "DB not available" });
  }
  const { actor } = c.req.query();
  console.log(">>>>>>>>>>>>>. getting profile for actor", actor);
  return c.json(await getProfile(actor));
});

"";
app.get(`/xrpc/${ids.ChatTinychatServerGetServers}`, async (c) => {
  const { db } = c.var.ctx;
  const agent = await c.var.ctx.agent();

  if (!db) {
    throw new HTTPException(500, { message: "DB not available" });
  }

  const { did } = c.req.query();
  const { uris } = c.req.queries();

  console.log(">>>>>>>>>>>>>. getting servers for", uris, did);

  const servers = new Servers(db!).getServers({
    uris,
    did,
    viewer: agent?.agent.did,
  });

  console.log(">>>>>>>>>>>>>. servers", servers);

  // const r = {
  //   servers: servers.map((s: ServerData) => ({
  //     uri: s.uri,
  //     creator: s.creator,
  //     name: s.name,
  //   })),
  // };
  return c.json({ servers });
});

"";
app.get(`/xrpc/${ids.ChatTinychatServerFindServers}`, (c) => {
  const servers = new Servers(c.var.ctx.db!).findServers({});
  return c.json({ servers });
});

"";
app.get(`/xrpc/${ids.ChatTinychatServerGetMessages}`, (c) => {
  const { channel, server, cursor, limit, sort } = c.req.query();
  console.log(">>>>>>>>>>>>>. getting messages for channel", c.req.query());
  return c.json(new Messaging(c.var.ctx.db!).getMessages({
    channel,
    server,
    cursor,
    limit: limit ? parseInt(limit) : 10,
    // @ts-ignore "latest" | "chronological" | undefined
    sort,
  }));
});

"";
app.post(`/xrpc/${ids.ChatTinychatServerSendMessage}`, async (c) => {
  const agent = await c.var.ctx.agent();

  if (!agent) {
    throw new HTTPException(401, { message: "Agent not available" });
  }

  const { server, channel, text } = z.object({
    channel: z.string(),
    server: z.string(),
    text: z.string(),
  }).parse(await c.req.json());

  const createdAt = new Date().toISOString();
  const d = await agent.chat.tinychat.core.message.create(
    { repo: agent.agent.assertDid },
    {
      server,
      channel,
      text,
      createdAt,
    },
  );

  const v = validateMessageView({
    uri: d.uri,
    channel,
    server,
    text,
    createdAt,
    sender: await getProfile(agent.agent.assertDid),
    ts: `${new Date().getTime() * 1000}`,
  });

  if (!v.success) {
    console.error("Error validating message in sendMessage", v);
  }

  return c.json({
    // @ts-ignore yolo
    message: v.value,
  });
});

"";
app.post(`/xrpc/${ids.ChatTinychatServerMarkAllMessagesAsRead}`, async (c) => {
  const { db } = c.var.ctx;
  const agent = await c.var.ctx.agent();

  if (!agent) {
    throw new HTTPException(401, { message: "Agent not available" });
  }

  const { channel, server } = z.object({
    server: z.string(),
    channel: z.string(),
  }).parse(await c.req.json());
  new Messaging(db!).markAllMessagesAsRead({
    channel,
    server,
    user: agent.agent.assertDid,
  });
  return c.json({});
});

"";
app.post(`/xrpc/${ids.ChatTinychatServerJoinServer}`, async (c) => {
  const agent = await c.var.ctx.agent();
  const { server } = z
    .object({
      server: z.string(),
    })
    .parse(await c.req.json());

  await (
    new Servers(c.var.ctx.db!).joinServer({
      server,
      tc: agent!,
    })
  );

  return c.json({});
});

"";

/** ----------------tests ---------------- **/

import { testClient } from "hono/testing";
import { assert, assertEquals } from "asserts";
import { sleep } from "tinychat/utils.ts";
import { ServerView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { TID } from "@atproto/common";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: appview.ipynb

Deno.test("/", async () => {
  // @ts-ignore cannot figure out type of test client
  const res = await testClient(app)["/"].$get();
  assertEquals(res.status, 302);
});

Deno.test("test xrpc", async (t) => {
  Deno.env.set("APPVIEW_URL", "http://localhost:8001");

  const agent: TinychatAgent = await TinychatAgent.create();
  const repo = agent.agent.assertDid;
  const db = getDatabase({ reset: true });
  const shutdown = runAppView({ database: db });

  // populate db, shall we?
  let chatServer: ServerView | undefined;
  let anotherChatServer: ServerView | undefined;

  // create a server

  await t.step("create servers", async () => {
    const { data: d1 } = await agent.chat.tinychat.server.createServer({
      name: "test server for xrpc",
    });
    assert(d1, "created a server");
    assert(d1.server.name === "test server for xrpc", "got the right server");
    chatServer = d1.server;

    const { data: d2 } = await agent.chat.tinychat.server.createServer({
      name: "another test server for xrpc",
    });
    assert(d2, "created another server");
    assert(
      d2.server.name === "another test server for xrpc",
      "got the right server",
    );
    anotherChatServer = d2.server;
  });

  assert(chatServer, "chatServer is defined");
  assert(anotherChatServer, "anotherChatServer is defined");

  await agent.chat.tinychat.core.message.create(
    { repo },
    {
      server: chatServer.uri,
      channel: chatServer.channels[0].id,
      text: "hello",
      createdAt: new Date().toISOString(),
    },
  );

  await t.step("get profile", async () => {
    const { data } = await agent.chat.tinychat.actor.getProfile({
      actor: repo,
    });
    assert(data.did === repo, "got the right profile");
  });

  await t.step("list available servers", async () => {
    const { data } = await agent.chat.tinychat.server.getServers();
    assert(data.servers.length > 0, "got a least 1 server");
    assert(
      data.servers.find((s) => s.name === chatServer?.name),
      "found our server",
    );
    assert(
      data.servers.find((s) => s.name === anotherChatServer?.name),
      "found another server",
    );
  });

  await t.step("list servers by uris", async () => {
    const { data } = await agent.chat.tinychat.server.getServers({
      uris: [chatServer!.uri],
    });
    assert(data.servers.length === 1, "got 1 server for specific URI");
    assert(data.servers[0].name === chatServer?.name, "found our server");

    const { data: data1 } = await agent.chat.tinychat.server.getServers({
      uris: [chatServer!.uri, anotherChatServer!.uri],
    });

    assert(data1.servers.length === 2, "got 2 servers for specific URIs");
    assert(
      data1.servers.find((s) => s.name === chatServer?.name),
      "found our server",
    );
    assert(
      data1.servers.find((s) => s.name === anotherChatServer?.name),
      "found another server",
    );
  });

  await t.step("list servers by did", async () => {
    const { data } = await agent.chat.tinychat.server.getServers({
      did: repo,
    });
    assert(data.servers.length === 2, "got 2 server for the user");
    assert(
      data.servers.find((s) => s.name === chatServer?.name),
      "found our server",
    );
    assert(
      data.servers.find((s) => s.name === anotherChatServer?.name),
      "found another server",
    );
  });

  await t.step("find servers", async () => {
    const { data } = await agent.chat.tinychat.server.findServers({});
    assert(data.servers.length === 2, "found 2 server");
  });

  // // send another message

  await t.step("send message via xrpc", async () => {
    await agent.chat.tinychat.server.sendMessage({
      server: chatServer!.uri,
      channel: chatServer!.channels[0].id,
      text: "message via xrpc",
    });
    await sleep(2000);

    const messages = db
      .prepare("SELECT * FROM messages")
      .all<{ text: string }>();
    assert(messages.length === 2, "expecting 2 messages");
    assert(
      messages.find((m) => m.text === "message via xrpc"),
      "found our new xrpc message",
    );
  });

  await shutdown();
  await sleep(2000);
});

Deno.test("test app view", async (t) => {
  Deno.env.set("APPVIEW_URL", "http://localhost:8001");

  const db = getDatabase({ reset: true });
  const shutdown = runAppView({ database: db });
  const serverName = `test-${TID.nextStr()}`;
  const agent = await TinychatAgent.create();
  const repo = agent.agent.assertDid;
  const receivedMessages: { data: string; html: string }[] = [];

  // create websocket connection to chat server
  const clientWS = new WebSocket("ws://localhost:8001/ws?did=hello");
  clientWS.onmessage = (event) => {
    console.log(">>>>>>>>>>>>>>>>> received message >>>>>>>>>>>>>", event.data);
    receivedMessages.push(JSON.parse(event.data));
  };

  // let's create a new chat server and watch it propagate through the system
  // should see new elements synced with the db

  let server: ServerView | undefined;

  await t.step("create server", async () => {
    const { data } = await agent.chat.tinychat.server.createServer({
      name: serverName,
    });
    server = data.server;
    assert(server, "server created");
  });

  await t.step("send message", async () => {
    // add message
    await agent.chat.tinychat.core.message.create(
      { repo },
      {
        server: server!.uri,
        channel: server!.channels[0].id,
        text: "hello",
        createdAt: new Date().toISOString(),
      },
    );

    await sleep(2000);

    assert(
      db.prepare(`SELECT * FROM messages`).all().length === 1,
      "message added to the db",
    );
  });

  await t.step("confirm messages get received over ws", () => {
    assert(receivedMessages.length === 1, "got one message");
    z.object({
      data: z.object({
        message: z.object({
          uri: z.string(),
          channel: z.string(),
          server: z.string(),
          text: z.string(),
          createdAt: z.string(),
          sender: z.object({
            did: z.string(),
            handle: z.string(),
            displayName: z.string().optional(),
            avatar: z.string().optional(),
            description: z.string().optional(),
          }),
        }),
        channels: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            latestMessageReceivedTime: z.string().optional(),
            lastMessageReadTime: z.string().optional(),
          }),
        ),
      }),
      html: z.string(),
    }).parse(receivedMessages[0]);
    assert(receivedMessages[0].html.includes("hello"));
  });

  await t.step("test get messages", async () => {
    await agent.chat.tinychat.core.message.create(
      { repo },
      {
        server: server!.uri,
        channel: server!.channels[0].id,
        text: "cursor test message",
        createdAt: new Date().toISOString(),
        time_us: `${new Date().getTime() * 1000}`,
      },
    );
    await sleep(2000);
    await agent.chat.tinychat.core.message.create(
      { repo },
      {
        server: server!.uri,
        channel: server!.channels[0].id,
        text: "cursor test message: latest",
        createdAt: new Date().toISOString(),
        time_us: `${new Date().getTime() * 1000}`,
      },
    );
    await sleep(2000);

    const { data } = await agent.chat.tinychat.server.getMessages({
      channel: server!.channels[0].id,
      server: server!.uri,
      limit: 1,
    });

    assert(data.messages.length === 1, "got 1 message");
  });

  await t.step("mark all messages as read in a channel", async () => {
    await agent.chat.tinychat.server.markAllMessagesAsRead({
      server: server!.uri,
      channel: server!.channels[0].id,
    });
  });

  // clean up and shutdown

  await shutdown();
  clientWS.close();
  await sleep(2000);
});
