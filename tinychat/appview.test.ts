// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: appview.ipynb

// based on https://docs.deno.com/examples/chat_app_tutorial/

export default class ChatServer {
  private connectedClients = new Map<string, WebSocket>();

  public handleConnection(ws: WebSocket) {
    const id = `${Math.random() * 100000}`;

    ws.onclose = () => {
      this.clientDisconnected(id);
    };

    this.connectedClients.set(id, ws);
    console.log(">>>>>>> connectedClients", this.connectedClients.size);
  }

  private clientDisconnected(id: string) {
    this.connectedClients.delete(id);
    console.log(`Client ${id} disconnected`);
  }

  public broadcast(message: string) {
    for (const client of this.connectedClients.values()) {
      console.log(">>>>>>> sending message to", client);
      client.send(message);
    }
  }
}
import { Hono } from "hono";
// import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { upgradeWebSocket } from "hono/deno";
import { Message } from "@tinychat/ui/message.tsx";
import { createMiddleware } from "hono/factory";
import { TinychatOAuthClient } from "tinychat/oauth.ts";
import { TinychatAgent } from "tinychat/agent.ts";
import { getDatabase } from "tinychat/db.ts";
import type { Database } from "tinychat/db.ts";
import { ActorView } from "tinychat/api/types/chat/tinychat/actor/defs.ts";
import { MessageView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { ids } from "tinychat/api/lexicons.ts";
import { getProfile } from "tinychat/bsky.ts";
import { Messaging } from "tinychat/core/messaging.ts";

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

app.get("/", (c) => c.redirect("https://github.com/callmephilip/tinychat"));

// app.use("/ws", cors());
app.get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onOpen: (_, ws) => {
        if (!ws.raw) {
          return;
        }
        chatServer.handleConnection(ws.raw);
      },
    };
  }),
);
import {
  NewChannelRecord,
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
      db.prepare(`
      INSERT INTO servers (uri, name, creator) VALUES (
        :uri, :name, :creator
      )`).run({
        uri: m.uri,
        name: m.commit.record.name,
        creator: m.did,
      });
      db.prepare(
        `INSERT INTO server_memberships (user, server) VALUES (
          :creator, :server
        ) ON CONFLICT(user, server) DO NOTHING`,
      ).run({
        creator: m.did,
        server: m.uri,
      });
    },
    onNewChannel: (m: NewChannelRecord) => {
      try {
        db.prepare(
          `INSERT INTO channels (uri, name, server) VALUES (
          :uri, :name, :server
        ) ON CONFLICT(uri) DO NOTHING`,
        ).run({
          uri: m.uri,
          name: m.commit.record.name,
          server: m.commit.record.server,
        });
      } catch (e) {
        console.error(
          ">>>>>>>>>>>>>>>>> ERRR >>>>>>>>>>>>>>>>>Error adding channel",
          e,
        );
        console.log("Adding channel", m);
      }
    },
    onNewMembership: (m: NewMembershipRecord) => {
      // add server memberships record
      try {
        db.prepare(
          `INSERT INTO server_memberships (user, server) VALUES (
          :creator, :server
        ) ON CONFLICT(user, server) DO NOTHING`,
        ).run({
          creator: m.did,
          server: m.commit.record.server,
        });
      } catch (e) {
        // normally this happens when creating a server and adding the creator to the server
        // membership gets processed before the server creation wraps up
        console.error("Error adding server membership", e);
      }
    },
    onNewMessage: (m: NewMessageRecord) => {
      messaging.receiveMessage({
        m: m.commit.record,
        uri: m.uri,
        sender: m.did,
        time_us: `${m.time_us}`,
      });

      // grab new message + sender info and broadcast to chat
      const { messages } = pullMessagesFromDb({ db, uri: m.uri, limit: 1 });

      chatServer.broadcast(
        JSON.stringify({
          data: messages[0],
          html: Message({ message: messages[0], oob: true }).toString(),
        }),
      );
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
interface ServerData {
  uri: string;
  creator: string;
  name: string;
  channels: {
    uri: string;
    name: string;
  }[];
}

const runServerQuery = ({
  uris,
  did,
  db,
}: {
  db: Database;
  uris: string[] | undefined;
  did: string | undefined;
}): ServerData[] => {
  const sql = (where: string = "") =>
    db.prepare(`SELECT 
      s.uri,
      s.name,
      s.creator,
      json_group_array(
        json_object(
          'uri', c.uri,
          'name', c.name
        )
      ) as channels
    FROM servers s
    INNER JOIN channels c ON c.server = s.uri
    ${where ? `WHERE ${where}` : ""}
    GROUP BY s.uri, s.name, s.creator`);

  if (uris && uris.length > 0) {
    return sql(`s.uri IN (${uris.map((u) => `'${u}'`).join(", ")})`).all<
      ServerData
    >();
  } else if (did) {
    return sql(`s.creator = :did`).all<ServerData>({
      did,
    });
  }

  return sql().all<ServerData>();
};

app.get(`/xrpc/${ids.ChatTinychatServerGetServers}`, (c) => {
  const { db } = c.var.ctx;

  if (!db) {
    throw new HTTPException(500, { message: "DB not available" });
  }

  const { did } = c.req.query();
  const { uris } = c.req.queries();

  console.log(">>>>>>>>>>>>>. getting servers for", uris, did);

  const servers = runServerQuery({ db, uris, did });

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
interface ChannelData {
  name: string;
  uri: string;
}

app.get(`/xrpc/${ids.ChatTinychatServerGetChannels}`, (c) => {
  const { db } = c.var.ctx;

  if (!db) {
    throw new HTTPException(500, { message: "DB not available" });
  }

  const { server } = c.req.query();

  const channels = db.prepare(
    `SELECT name, uri FROM channels WHERE server = :server`,
  ).all<ChannelData>({
    server,
  });

  return c.json({ channels });
});

"";
interface Message {
  uri: string;
  channel: string;
  server: string;
  text: string;
  createdAt: string;
  time_us: string;
  // user
  did: string;
  handle: string;
  displayName: string;
  avatar?: string;
  description?: string;
}

const pullMessagesFromDb = ({
  db,
  channel,
  uri,
  cursor,
  limit,
}: {
  db: Database;
  channel?: string;
  uri?: string;
  cursor?: string;
  limit: number;
}): {
  messages: MessageView[];
  cursor?: string;
} => {
  if (!channel && !uri) {
    return {
      messages: [],
    };
  }

  const messages = (
    channel
      ? db
        .prepare(
          `
      SELECT uri, channel, server, text, sender, created_at as createdAt, time_us,
        users.did, users.handle, users.display_name as displayName, users.avatar, users.description
      FROM messages
      INNER JOIN users ON messages.sender = users.did
      WHERE channel = :channel ${cursor ? `AND time_us < :cursor` : ""}
      ORDER BY time_us DESC
      LIMIT :limit
    `,
        )
        .all<Message>(
          Object.assign({ channel, limit }, cursor ? { cursor } : {}),
        )
      : db
        .prepare(
          `
      SELECT uri, channel, server, text, sender, created_at as createdAt, time_us,
        users.did, users.handle, users.display_name as displayName, users.avatar, users.description
      FROM messages
      INNER JOIN users ON messages.sender = users.did
      WHERE uri = :uri ${cursor ? `AND time_us < :cursor` : ""}
      ORDER BY time_us DESC
      LIMIT :limit
    `,
        )
        .all<Message>(Object.assign({ uri, limit }, cursor ? { cursor } : {}))
  ).map((m: Message) => ({
    uri: m.uri,
    channel: m.channel,
    server: m.server,
    text: m.text,
    createdAt: m.createdAt,
    time_us: m.time_us,
    sender: {
      did: m.did,
      handle: m.handle,
      displayName: m.displayName,
      avatar: m.avatar,
      description: m.description,
    },
  }));

  return {
    messages,
    cursor: messages.length > 0
      ? `${messages[messages.length - 1].time_us}`
      : undefined,
  };
};

app.get(`/xrpc/${ids.ChatTinychatServerGetMessages}`, (c) => {
  const { db } = c.var.ctx;
  if (!db) {
    throw new HTTPException(500, { message: "DB not available" });
  }
  const { channel, cursor, limit } = c.req.query();
  console.log(
    ">>>>>>>>>>>>>. getting messages for channel",
    channel,
    cursor,
    limit,
    typeof limit,
  );
  return c.json(
    pullMessagesFromDb({
      db,
      channel,
      cursor,
      limit: limit ? parseInt(limit) : 10,
    }),
  );
});

"";

import { z } from "zod";

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

  await agent.chat.tinychat.core.message.create(
    { repo: agent.agent.assertDid },
    {
      server,
      channel,
      text,
      createdAt: new Date().toISOString(),
    },
  );

  return c.json({});
});

"";
app.post(`/xrpc/${ids.ChatTinychatServerJoinServer}`, async (c) => {
  const agent = await c.var.ctx.agent();

  if (!agent) {
    throw new HTTPException(401, { message: "Agent not available" });
  }

  const { server } = z
    .object({
      server: z.string(),
    })
    .parse(await c.req.json());

  await agent.chat.tinychat.core.membership.create(
    { repo: agent.agent.assertDid },
    {
      server,
      createdAt: new Date().toISOString(),
    },
  );

  return c.json({});
});

/** ----------------tests ---------------- **/

import { TID } from "@atproto/common";
import { testClient } from "hono/testing";
import { assert, assertEquals } from "asserts";
import { sleep } from "tinychat/utils.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: appview.ipynb

Deno.test("/", async () => {
  // @ts-ignore cannot figure out type of test client
  const res = await testClient(app)["/"].$get();
  assertEquals(res.status, 302);
});

Deno.test("test xrpc", async (t) => {
  const agent = await TinychatAgent.create();
  const repo = agent.agent.assertDid;
  const serverName = `test-${TID.nextStr()}`;
  const anotherServerName = `test-${TID.nextStr()}`;
  const db = getDatabase({ reset: true });
  const shutdown = runAppView({ database: db });

  // populate db, shall we?
  const chatServer = await agent.chat.tinychat.core.server.create(
    {
      repo,
    },
    {
      name: serverName,
    },
  );
  const anotherChatServer = await agent.chat.tinychat.core.server.create(
    {
      repo,
    },
    {
      name: anotherServerName,
    },
  );

  await sleep(4000);

  const channel = await agent.chat.tinychat.core.channel.create({ repo }, {
    server: chatServer.uri,
    name: "general",
  });

  await agent.chat.tinychat.core.channel.create(
    { repo },
    {
      server: anotherChatServer.uri,
      name: "general",
    },
  );

  await agent.chat.tinychat.core.message.create(
    { repo },
    {
      server: chatServer.uri,
      channel: channel.uri,
      text: "hello",
      createdAt: new Date().toISOString(),
    },
  );

  await sleep(1000);

  await t.step("get profile", async () => {
    const { data } = await agent.chat.tinychat.actor.getProfile({
      actor: repo,
    });
    assert(data.did === repo, "got the right profile");
  });

  await t.step("list available servers", async () => {
    const { data } = await agent.chat.tinychat.server.getServers();
    assert(data.servers.length > 0, "got a least 1 server");
    assert(data.servers.find((s) => s.name === serverName), "found our server");
    assert(
      data.servers.find((s) => s.name === anotherServerName),
      "found another server",
    );
  });

  await t.step("list servers by uris", async () => {
    const { data } = await agent.chat.tinychat.server.getServers({
      uris: [chatServer.uri],
    });
    assert(data.servers.length === 1, "got 1 server for specific URI");
    assert(data.servers[0].name === serverName, "found our server");

    const { data: data1 } = await agent.chat.tinychat.server.getServers({
      uris: [chatServer.uri, anotherChatServer.uri],
    });
    assert(data1.servers.length === 2, "got 2 servers for specific URIs");
    assert(
      data1.servers.find((s) => s.name === serverName),
      "found our server",
    );
    assert(
      data1.servers.find((s) => s.name === anotherServerName),
      "found another server",
    );
  });

  await t.step("list servers by did", async () => {
    const { data } = await agent.chat.tinychat.server.getServers({
      did: repo,
    });
    assert(data.servers.length === 2, "got 2 server for the user");
    assert(
      data.servers.find((s) => s.name === serverName),
      "found our server",
    );
    assert(
      data.servers.find((s) => s.name === anotherServerName),
      "found another server",
    );
  });

  await t.step("list available channels", async () => {
    const { data } = await agent.chat.tinychat.server.getChannels({
      server: chatServer.uri,
    });
    assert(data.channels.length > 0, "got a least 1 channel");
    assert(
      data.channels.find((c) => c.name === "general"),
      "found our channel",
    );
  });

  await t.step("list messages", async () => {
    const { data } = await agent.chat.tinychat.server.getMessages({
      channel: channel.uri,
      limit: 10,
    });
    assert(data.messages.length > 0, "got a least 1 message");
    assert(data.messages.find((m) => m.text === "hello"), "found our message");
    console.log(">>>>>>>>>>>>>>>>> messages cursor", data.cursor);
    assert(typeof data.cursor === "string", "got a cursor for messages");
  });

  // send another message

  await t.step("send message via xrpc", async () => {
    await agent.chat.tinychat.server.sendMessage({
      server: chatServer.uri,
      channel: channel.uri,
      text: "message via xrpc",
    });
    await sleep(2000);

    const messages = db.prepare("SELECT * FROM messages").all<Message>();
    assert(messages.length === 2, "expecting 2 messages");
    assert(
      messages.find((m) => m.text === "message via xrpc"),
      "found our new xrpc message",
    );
  });

  // join a server

  await t.step("join a server", async () => {
    await agent.chat.tinychat.server.joinServer({
      server: chatServer.uri,
    });
  });

  await shutdown();
  await sleep(2000);
});

Deno.test("test app view", async (t) => {
  const db = getDatabase({ reset: true });
  const shutdown = runAppView({ database: db });
  const serverName = `test-${TID.nextStr()}`;
  const agent = await TinychatAgent.create();
  const repo = agent.agent.assertDid;
  const receivedMessages: { data: string; html: string }[] = [];

  // create websocket connection to chat server
  const clientWS = new WebSocket("ws://localhost:8001/ws");
  clientWS.onmessage = (event) => {
    receivedMessages.push(JSON.parse(event.data));
  };

  // let's create a new chat server and watch it propagate through the system
  // should see new elements synced with the db

  let server = "no server yet";
  let channel = "no channel yet";

  await t.step("create server", async () => {
    const chatServer = await agent.chat.tinychat.core.server.create(
      {
        repo,
      },
      {
        name: serverName,
      },
    );
    server = chatServer.uri;

    await agent.chat.tinychat.core.membership.create(
      { repo },
      {
        server,
        createdAt: new Date().toISOString(),
      },
    );

    await sleep(2000);

    assert(
      db.prepare(`SELECT * FROM users`).all().length === 1,
      "user added to the db",
    );
    assert(
      db.prepare(`SELECT * FROM servers`).all().length === 1,
      "server added to the db",
    );
    assert(
      db.prepare(`SELECT * FROM server_memberships`).all().length === 1,
      "server membership added to the db",
    );
  });

  await t.step("create channel", async () => {
    const c = await agent.chat.tinychat.core.channel.create(
      { repo },
      {
        server,
        name: "general",
      },
    );
    channel = c.uri;

    await sleep(2000);

    assert(
      db.prepare(`SELECT * FROM channels`).all().length === 1,
      "channel added to the db",
    );
  });

  await t.step("send message", async () => {
    // add message
    await agent.chat.tinychat.core.message.create(
      { repo },
      {
        server,
        channel,
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

  await t.step("create another server", async () => {
    await agent.chat.tinychat.core.server.create(
      { repo },
      { name: serverName + "2" },
    );

    await sleep(2000);

    assert(
      db.prepare(`SELECT * FROM servers`).all().length === 2,
      "expecting 2 servers",
    );
  });

  await t.step("confirm messages get received over ws", () => {
    assert(receivedMessages.length === 1, "got one message");
    z.object({
      data: z.object({
        uri: z.string(),
        channel: z.string(),
        server: z.string(),
        text: z.string(),
        createdAt: z.string(),
        sender: z.object({
          did: z.string(),
          handle: z.string(),
          displayName: z.string(),
          avatar: z.string().nullable(),
          description: z.string().nullable(),
        }),
      }),
      html: z.string(),
    }).parse(receivedMessages[0]);

    assert(receivedMessages[0].html.includes("hello"));
  });

  await t.step("test message cursor", async () => {
    await agent.chat.tinychat.core.message.create(
      { repo },
      {
        server,
        channel,
        text: "cursor test message",
        createdAt: new Date().toISOString(),
      },
    );
    await sleep(2000);
    await agent.chat.tinychat.core.message.create(
      { repo },
      {
        server,
        channel,
        text: "cursor test message: latest",
        createdAt: new Date().toISOString(),
      },
    );
    await sleep(2000);

    const { data } = await agent.chat.tinychat.server.getMessages({
      channel,
      limit: 1,
    });

    assert(data.messages.length === 1, "got 1 message");
    assert(
      data.messages[0].text === "cursor test message: latest",
      "got the latest message",
    );
    assert(data.cursor, "got a cursor to work with");

    console.log(">>>>>>>>>>>>>>>>> messages data with cursor", data);

    const { data: data2 } = await agent.chat.tinychat.server.getMessages({
      channel,
      cursor: data.cursor,
      limit: 1,
    });

    assert(data2.messages.length === 1, "got 1 message");
    assert(
      data2.messages[0].text === "cursor test message",
      "got previous cursor message",
    );
  });

  // clean up and shutdown

  await shutdown();
  clientWS.close();
  await sleep(2000);
});
