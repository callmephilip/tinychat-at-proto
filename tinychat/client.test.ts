import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { getIronSession, IronSession } from "iron-session";
import { createMiddleware } from "hono/factory";
import { TinychatOAuthClient } from "tinychat/oauth.ts";
import { TinychatAgent } from "tinychat/agent.ts";
import type { Database } from "tinychat/db.ts";
import { ActorViewWithDetails } from "@tinychat/lexicons/types/chat/tinychat/actor/defs.ts";
import { LoginForm } from "@tinychat/ui/login.tsx";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: client.ipynb

export type Session = {
  did: string | undefined;
  redirectAfterLogin: string | undefined;
  // testing purposes
  t: string | undefined;
};

export type AppContext = {
  session: IronSession<Session> | undefined;
  oauthClient: TinychatOAuthClient | undefined;
  agent: () => Promise<TinychatAgent | undefined>;
  user: () => Promise<ActorViewWithDetails | undefined>;
  db?: Database | undefined;
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

    console.log(">>>>>>> client middleware session is", session);

    const oauthClient = new TinychatOAuthClient();
    const getAgent = async () => await TinychatAgent.create(oauthClient, session.did);

    c.set("ctx", {
      session,
      oauthClient,
      agent: async () => {
        try {
          return await getAgent();
        } catch (e) {
          console.error("get agent failed with", e);
          console.error("gonna ask for login");
        }
      },
      user: async () => {
        try {
          const a = await getAgent();
          const d = a &&
            (await a.chat.tinychat.actor.getProfile({
              actor: a.agent.assertDid,
            }));
          return d && d.data;
        } catch (e) {
          console.error("get user failed with", e);
          return undefined;
        }
      },
    });

    await next();
  }),
);

"";
app.get(
  "/",
  (c) => c.redirect("https://github.com/callmephilip/tinychat-at-proto"),
);

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
  const r = session?.redirectAfterLogin ? `${session?.redirectAfterLogin}` : "/chat";

  console.log("oauth callback: oauthSession", oauthSession);
  console.log("gonna redirect to", r);
  session!.did = oauthSession.did;
  session!.redirectAfterLogin = undefined;
  await session?.save();
  return c.redirect(r);
});

app.get("/login", async (c) => {
  const { session } = c.var.ctx;
  const { r } = c.req.query();

  if (session && r) {
    session.redirectAfterLogin = r;
    await session?.save();
  }

  return c.html(LoginForm());
});

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
    console.error("Error with POST /login", e);
    return c.redirect("/login");
  }
});

"";
// import { ChatPage } from "@tinychat/ui/pages/chat.tsx";

// app.get("/chat", async (c) =>
//   c.html(
//     ChatPage({
//       user: await c.var.ctx.user(),
//     })
//   )
// );

"";

/** ----------------tests ---------------- **/

import { testClient } from "hono/testing";
import { assert, assertEquals } from "asserts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: client.ipynb

Deno.test("/", async () => {
  // @ts-ignore cannot figure out type of test client
  const res = await testClient(app).$get();
  assertEquals(await res.status, 302);
});

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

// Deno.test("chat", async () => {
//   // @ts-ignore cannot figure out type of test client
//   const res = await testClient(app).chat.$get();
//   assertEquals(await res.status, 200, "chat page should be accessible");
// });
