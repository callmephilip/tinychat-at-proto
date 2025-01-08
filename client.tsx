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

Deno.serve(app.fetch);
