import { app } from "tinychat/client.ts";

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
  const ta = await c.var.ctx.agent();
  if (!ta) {
    return c.redirect("/login");
  }
  console.log(">>>>>>>>>>>> servers are", await ta.chat.tinychat.getServers());
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
