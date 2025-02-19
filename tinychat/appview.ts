import { Hono } from "hono";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { upgradeWebSocket } from "hono/deno";
import { Message } from "@tinychat/ui/message.tsx";
import { ChannelLabel } from "@tinychat/ui/channel.tsx";
import { createMiddleware } from "hono/factory";
import { TinychatOAuthClient } from "tinychat/oauth.ts";
import { TinychatAgent } from "tinychat/agent.ts";
import type { Database } from "tinychat/db.ts";
import { getDatabase } from "tinychat/db.ts";
import { ActorView } from "@tinychat/lexicons/types/chat/tinychat/actor/defs.ts";
import { ids } from "@tinychat/lexicons/lexicons.ts";
import { getProfile } from "tinychat/bsky.ts";
import { Messaging } from "tinychat/core/messaging.ts";
import { Servers } from "tinychat/core/servers.ts";
import { startJetstream } from "tinychat/firehose.ts";
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

type AppViewShutdown = () => Promise<void>;
type AppViewContext = {
  database?: Database | undefined;
};

export const runAppView = async (
  { database }: AppViewContext = {},
): Promise<AppViewShutdown> => {
  const db = database || getDatabase();

  const messaging = new Messaging(db);
  const servers = new Servers(db);

  messaging.on("message", ({ uri }: { uri: string }) => {
    // grab new message + sender info and broadcast to chat
    const { messages } = new Messaging(db).getMessages({ uri });
    const m = messages[0];
    const msgHTML = Message({ message: m, oob: true }).toString();

    chatServer.broadcastFn((c: ChatServerClient) => {
      const s = servers.getServers({ uris: [m.record.server], viewer: c.did });
      const channels = s.length !== 0 ? s[0].channels : [];
      return JSON.stringify({
        data: { message: messages[0], channels },
        html: (c.did !== m.did ? msgHTML : "") +
          channels
            .map((channel) => ChannelLabel({ channel }).toString())
            .join(""),
      });
    });
  });

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

  const { cleanup: shutdownJetstream, jetstream } = await startJetstream({
    db,
  });

  servers.connectToJetstream(jetstream);
  messaging.connectToJetstream(jetstream);

  const server = Deno.serve(
    { port: parseInt(Deno.env.get("APPVIEW_PORT") || "8000") },
    app.fetch,
  );

  return async () => {
    try {
      messaging.removeAllListeners();
      await shutdownJetstream();
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
  const [profile, servers] = await Promise.all([
    getProfile(actor),
    new Servers(db!).getServersForMember({ did: actor }),
  ]);

  return c.json(Object.assign(profile, { servers }));
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
  const { channel, server, cursor, limit, sort, parent } = c.req.query();
  return c.json(new Messaging(c.var.ctx.db!).getMessages({
    channel,
    server,
    parent,
    cursor,
    limit: limit ? parseInt(limit) : 10,
    // @ts-ignore "latest" | "chronological" | undefined
    sort,
  }));
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
