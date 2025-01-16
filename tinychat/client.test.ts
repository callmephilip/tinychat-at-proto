// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: client.ipynb

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { getIronSession, IronSession } from "iron-session";
import { createMiddleware } from "hono/factory";
import { TinychatOAuthClient } from "tinychat/oauth.ts";
import { TinychatAgent } from "tinychat/agent.ts";

export type Session = {
  did: string | undefined;
  // testing purposes
  t: string | undefined;
};

export type AppContext = {
  session: IronSession<Session> | undefined;
  oauthClient: TinychatOAuthClient | undefined;
  agent: () => Promise<TinychatAgent | undefined>;
};

declare module "hono" {
  interface ContextVariableMap {
    ctx: AppContext;
  }
}

export type HonoServer = Hono<{
  Variables: {
    ctx: AppContext;
  };
}>;

export const app = new Hono();

app.use("*", logger());

"";
app.use(
  "*",
  createMiddleware(async (c, next) => {
    if (!Deno.env.get("SESSION_COOKIE_KEY")) {
      throw new Error("SESSION_COOKIE_KEY is not set");
    }

    const session = await getIronSession<Session>(c.req.raw, c.res, {
      cookieName: "sid",
      password: Deno.env.get("SESSION_COOKIE_KEY")!,
      cookieOptions: {
        httpOnly: Deno.env.get("SESSION_COOKIE_ALLOW_INSECURE") ? false : true,
        secure: true, // set this to false in local (non-HTTPS) development
        sameSite: "lax", // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax
        path: "/",
      },
    });

    const oauthClient = new TinychatOAuthClient();

    c.set("ctx", {
      session,
      oauthClient,
      agent: async () => {
        if (!session.did) {
          c.redirect("/login");
          return;
        }
        return await TinychatAgent.create(oauthClient, session.did);
      },
    });

    await next();
  }),
);

"";
import { Landing } from "@tinychat/ui/landing.tsx";

app.get("/", (c) => c.html(Landing()));

"";
app.get("/health", (c) => c.json({ status: "ok", t: c.var.ctx.session!.t }));
app.get("/set-session-t", async (c) => {
  if (!c.var.ctx.session) {
    throw new HTTPException(500, { message: "Session not found" });
  }

  c.var.ctx.session!.t = "foo";
  await c.var.ctx.session!.save();
  return c.json({ status: "ok", t: c.var.ctx.session!.t });
});

"";
import { LoginForm } from "@tinychat/ui/login.tsx";

app.get(
  "/client-metadata.json",
  (c) => c.json(c.var.ctx.oauthClient?.clientMetadata),
);

app.get("/oauth/callback", async (c) => {
  const { session, oauthClient } = c.var.ctx;

  if (!oauthClient) {
    throw new HTTPException(500, { message: "OAuth client not found" });
  }

  const params = new URLSearchParams(c.req.url.split("?")[1]);
  const { session: oauthSession } = await oauthClient.callback(
    params,
  );
  session!.did = oauthSession.did;
  await session?.save();
  return c.redirect("/");
});

app.get("/login", (c) => c.html(LoginForm()));

app.post("/login", async (c) => {
  try {
    const body = await c.req.parseBody();
    // @ts-ignore it's a string, yo
    const handle: string | undefined = body?.handle;

    if (!handle) {
      throw new HTTPException(400, { message: "Missing handle" });
    }

    if (!c.var.ctx.oauthClient) {
      throw new HTTPException(500, { message: "OAuth client not found" });
    }

    const url = await c.var.ctx.oauthClient.authorize(handle, {
      scope: "atproto transition:generic",
    });

    return c.redirect(url.toString());
  } catch (e) {
    console.error(e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

"";
import { Chat } from "@tinychat/ui/chat.tsx";

app.get("/chat", (c) => c.html(Chat({ user: undefined })));

"";

/** ----------------tests ---------------- **/

import { testClient } from "hono/testing";
import { assert, assertEquals } from "asserts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: client.ipynb

Deno.test("/health", async () => {
  // @ts-ignore cannot figure out type of test client
  const res = await testClient(app).health.$get();
  assertEquals(await res.json(), { status: "ok" });
});

Deno.test("/set-session-t", async () => {
  // @ts-ignore cannot figure out type of test client
  const r1 = await testClient(app)["set-session-t"].$get();
  assertEquals(await r1.json(), { status: "ok", t: "foo" });
  assert(r1.headers.get("set-cookie"));
  // @ts-ignore cannot figure out type of test client
  const r2 = await testClient(app)["health"].$get(
    {},
    {
      headers: {
        Cookie: r1.headers.get("set-cookie"),
      },
    },
  );
  assertEquals(await r2.json(), { status: "ok", t: "foo" });
});

Deno.test("auth checks", async () => {
  // @ts-ignore cannot figure out type of test client
  const res = await testClient(app).chat.$get();
  assertEquals(await res.status, 200, "chat page should be accessible");
});
