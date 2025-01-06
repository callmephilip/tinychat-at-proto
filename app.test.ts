import { assert } from "jsr:@std/assert";
import { app } from "tinychat/app.ts";

Deno.test("app", () => {
  assert(app);
});
