import { app } from "tinychat/client.ts";

app.get("/login", (c) => {
  return c.html(
    <form method="post" action="/login">
      <input name="handle" placeholder="your bsky handle" />
    </form>,
  );
});

Deno.serve(app.fetch);
