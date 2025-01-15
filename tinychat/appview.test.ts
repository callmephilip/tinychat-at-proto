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
import { upgradeWebSocket } from "hono/deno";
import {
  NewChannelRecord,
  NewMembershipRecord,
  NewMessageRecord,
  NewServerRecord,
  startJetstream,
} from "tinychat/firehose.ts";
// import { message } from "@tinychat/ui/message.tsx";
import { createMiddleware } from "hono/factory";
import { TinychatOAuthClient } from "tinychat/oauth.ts";
import { TinychatAgent } from "tinychat/agent.ts";
import { getDatabase } from "tinychat/db.ts";

export type AppContext = {
  agent: () => Promise<TinychatAgent | undefined>;
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
    });
    await next();
  }),
);

app.get("/", (c) => c.redirect("https://github.com/callmephilip/tinychat"));

app.get("/__test", (c) =>
  c.html(`<!DOCTYPE html>
<html>
<head>
    <title>HTMX Chat</title>
    <script src="https://unpkg.com/htmx.org@2.0.4"></script>
    <script src="https://unpkg.com/htmx.org/dist/ext/ws.js"></script>
    <style>
        .chat-container { max-width: 600px; margin: 20px auto; }
        .messages { height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
        .message { margin: 5px 0; padding: 5px; border-radius: 5px; background: #f0f0f0; }
        .input-form { display: flex; gap: 10px; }
        input { flex-grow: 1; padding: 5px; }
    </style>
</head>
<body>
    <div class="chat-container" hx-ext="ws" ws-connect="/ws">
        <div id="messages" class="messages">
        </div>
        <form class="input-form" ws-send>
            <input type="text" name="message" placeholder="Type a message..." autocomplete="off">
            <button type="submit">Send</button>
        </form>
    </div>
</body>
</html>`));

// app.get("/xrpc/chat.tinychat.getServers", async (c) => {
//   const ta = await c.var.ctx.agent();

//   if (!ta) {
//     return c.json({ error: "Unauthorized" }, 401);
//   }

//   await ta.chat.tinychat.server.create(
//     {
//       repo: ta.agent.assertDid,
//     },
//     {
//       name: "Test Servers",
//     }
//   );

//   return c.json({ message: "ok" });
// });

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
type AppViewShutdown = () => Promise<void>;

export const runAppView = (): AppViewShutdown => {
  const db = getDatabase();
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
    // onMessage: (msg) => {
    //   console.log(">>>>>>> received message", msg);
    //   chatServer.broadcast(message(msg).toString());
    // },
    onNewServer: (m: NewServerRecord) => console.log(m),
    onNewChannel: (m: NewChannelRecord) => console.log(m),
    onNewMembership: (m: NewMembershipRecord) => console.log(m),
    onNewMessage: (m: NewMessageRecord) => console.log(m),
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

/** ----------------tests ---------------- **/

import { testClient } from "hono/testing";
import { assert, assertEquals } from "asserts";
import { sleep } from "tinychat/utils.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: appview.ipynb

Deno.test("/", async () => {
  // @ts-ignore cannot figure out type of test client
  const res = await testClient(app)["/"].$get();
  assertEquals(res.status, 302);
  // assertEquals(await res.json(), { status: "ok" });
});

// Deno.test("/xrpc/chat.tinychat.getServers", async () => {
//   // @ts-ignore cannot figure out type of test client
//   const res = await testClient(app)["/xrpc/chat.tinychat.getServers"].$get();
//   assertEquals(res.status, 200);
// });

Deno.test("test app view", async (t) => {
  const shutdown = runAppView();
  const agent = await TinychatAgent.create();
  const repo = await agent.agent.assertDid;

  // let's create a new chat server and watch it propagate through the system

  const chatServer = await agent.chat.tinychat.server.create({
    repo,
  }, {
    name: "test Server",
  });

  console.log("chatServer", chatServer);

  await t.step("basic assert", async () => {
    assert(10 === 10);
    await sleep(2000);
  });

  console.log("done done");

  await shutdown();

  await sleep(2000);
});
