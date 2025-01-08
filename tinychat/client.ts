// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: client.ipynb

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Agent } from "@atproto/api";
import { TID } from "@atproto/common";
import { logger } from "hono/logger";
import { getIronSession, IronSession } from "iron-session";
import { createMiddleware } from "hono/factory";
import { getOAuthClient, OAuthClient } from "tinychat/oauth.ts";

export type Session = {
  did: string | undefined;
  // testing purposes
  t: string | undefined;
  atprotoSession: Map<string, string>;
};

export type AppContext = {
  session: IronSession<Session>;
  oauthClient: OAuthClient;
  agent: () => Promise<Agent | undefined>;
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

    const oauthClient = await getOAuthClient();

    c.set("ctx", {
      session,
      oauthClient,
      agent: async () => {
        if (!session.did) {
          throw new HTTPException(401, { message: "Unauthorized" });
        }
        return new Agent(await oauthClient.restore(session.did));
      },
    });

    await next();
  }),
);
app.get("/health", (c) => c.json({ status: "ok", t: c.var.ctx.session.t }));
app.get("/set-session-t", async (c) => {
  c.var.ctx.session.t = "foo";
  await c.var.ctx.session.save();
  return c.json({ status: "ok", t: c.var.ctx.session.t });
});
app.get(
  "/client-metadata.json",
  (c) => c.json(c.var.ctx.oauthClient.clientMetadata),
);

app.get("/oauth/callback", async (c) => {
  const { session } = c.var.ctx;
  const params = new URLSearchParams(c.req.url.split("?")[1]);
  const { session: oauthSession } = await c.var.ctx.oauthClient.callback(
    params,
  );
  session.did = oauthSession.did;
  await session.save();
  return c.redirect("/");
});

app.post("/login", async (c) => {
  try {
    const body = await c.req.parseBody();
    // @ts-ignore it's a string, yo
    const handle: string | undefined = body?.handle;

    if (!handle) {
      throw new HTTPException(400, { message: "Missing handle" });
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
app.post("/send-message", async (c) => {
  const agent = await c.var.ctx.agent();

  const body = await c.req.parseBody();
  // @ts-ignore it's a string, yo
  const message: string | undefined = body?.message;

  if (!agent) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  if (!message) {
    throw new HTTPException(400, { message: "Missing message" });
  }

  await agent.com.atproto.repo.putRecord({
    repo: agent.assertDid, // The user
    collection: "xyz.statusphere.status", // The collection
    rkey: TID.nextStr(), // The record key
    record: {
      // The record value
      status: message,
      createdAt: new Date().toISOString(),
    },
  });

  return c.json({ status: "ok" });
});
