import { app } from "tinychat/client.ts";
import { XrpcClient } from "@atproto/xrpc";
import { ChatNS } from "tinychat/api/index.ts";
import { lexicons } from "tinychat/api/lexicons.ts";

app.get("/", (c) => {
  return c.html(
    <>
      <h1>Welcome to tinychat</h1>
      <form method="post" action="/send-message">
        <textarea name="message" placeholder="your message"></textarea>
        <button type="submit">Send</button>
      </form>
    </>,
  );
});

app.get("/session", async (c) => {
  await c.var.ctx.agent();

  const ta = await c.var.ctx.agent();

  if (!ta) {
    return c.redirect("/login");
  }

  await ta.chat.tinychat.server.create(
    { repo: ta.agent.assertDid },
    {
      name: "appview-client",
    },
  );

  const client = new XrpcClient(
    {
      service: Deno.env.get("APPVIEW_URL")!,
      headers: {
        Authorization: await c.var.ctx.oauthClient.getAuthorizationHeader(
          ta.agent.assertDid,
        ),
      },
    },
    lexicons,
  );

  const chat = new ChatNS(client);

  console.log(await chat.tinychat.getServers());

  return c.html("ok");
});

app.get("/login", (c) => {
  return c.html(
    <form method="post" action="/login">
      <input
        value="callmephilip.com"
        name="handle"
        placeholder="your bsky handle"
      />
    </form>,
  );
});

Deno.serve(
  {
    port: parseInt(Deno.env.get("CLIENT_PORT") || "8000"),
  },
  app.fetch,
);
