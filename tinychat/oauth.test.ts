import { OAuthClient, OAuthSession } from "@atproto/oauth-client";
import { createHash, randomBytes } from "node:crypto";
import { JoseKey, NodeSavedSession, NodeSavedState, toDpopKeyStore } from "tinychat/atproto/auth.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: oauth.ipynb

abstract class MyLittleStorage {
  public abstract set(k: string, val: string): Promise<void>;
  public abstract get(k: string): Promise<string | undefined>;
  public abstract del(k: string): Promise<void>;
}

class _TestStorage extends MyLittleStorage {
  private store: Record<string, string> = {};

  public async set(k: string, val: string): Promise<void> {
    this.store[k] = val;
    return await Promise.resolve();
  }

  public async get(k: string): Promise<string | undefined> {
    return await Promise.resolve(this.store[k]);
  }

  public async del(k: string): Promise<void> {
    delete this.store[k];
    return await Promise.resolve();
  }
}

class DenoKVStorage extends MyLittleStorage {
  public async set(k: string, val: string): Promise<void> {
    const kv = await Deno.openKv();
    await kv.set([k], val);
  }

  public async get(k: string): Promise<string | undefined> {
    const kv = await Deno.openKv();
    return (await kv.get<string | undefined>([k])).value || undefined;
  }

  public async del(k: string): Promise<void> {
    const kv = await Deno.openKv();
    await kv.delete([k]);
  }
}

class OneValueStorage extends MyLittleStorage {
  constructor(private value: string) {
    super();
  }

  public async set(_k: string, _val: string): Promise<void> {
    return await Promise.resolve();
  }

  public async get(_k: string): Promise<string | undefined> {
    return await Promise.resolve(this.value);
  }

  public async del(_k: string): Promise<void> {
    return await Promise.resolve();
  }
}

export { OAuthClient } from "@atproto/oauth-client";

// set this to the public URL of the app
const publicUrl = Deno.env.get("PUBLIC_URL");

export class TinychatOAuthClient extends OAuthClient {
  constructor(private storage: MyLittleStorage = new DenoKVStorage()) {
    super({
      handleResolver: "https://api.bsky.app", // backend instances should use a DNS based resolver
      responseMode: "query",
      clientMetadata: {
        client_name: "tinychat",
        client_id: publicUrl?.replace(/\/$/gi, "") + "/client-metadata.json",
        client_uri: publicUrl,
        redirect_uris: [`${publicUrl}/oauth/callback`],
        scope: "atproto transition:generic",
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        application_type: "web",
        token_endpoint_auth_method: "none",
        dpop_bound_access_tokens: true,
      },

      stateStore: toDpopKeyStore({
        // A store for saving state data while the user is being redirected to the
        // authorization server.

        async set(key: string, internalState: NodeSavedState) {
          await storage.set(key, JSON.stringify(internalState));
        },
        async get(key: string): Promise<NodeSavedState | undefined> {
          const v = await storage.get(key);
          return v && JSON.parse(v);
        },
        async del(key: string) {
          await storage.del(key);
        },
      }),

      // @ts-ignore yolo
      sessionStore: toDpopKeyStore({
        // A store for saving session data.
        // @ts-ignore yolo
        async set(sub: string, session: NodeSavedSession) {
          console.log("storing session", sub, session);
          await storage.set(sub, JSON.stringify(session));
        },
        async get(sub: string): Promise<NodeSavedSession | undefined> {
          const v = await storage.get(sub);
          console.log("retrieved session", sub, v);
          return Promise.resolve(v && JSON.parse(v));
        },
        async del(sub: string) {
          console.log("deleting session", sub);
          await storage.del(sub);
        },
      }),

      runtimeImplementation: {
        // A runtime specific implementation of the crypto operations needed by the
        // OAuth client. See "@atproto/oauth-client-browser" for a browser specific
        // implementation. The following example is suitable for use in NodeJS.

        createKey(algs: string[]) {
          return JoseKey.generate(algs);
        },
        getRandomValues: randomBytes,
        digest(bytes: Uint8Array, algorithm: { name: string }) {
          return createHash(algorithm.name).update(bytes).digest();
        },
      },
    });
  }

  public async getAuthorizationHeader(
    user: string,
  ): Promise<string | undefined> {
    const v = await this.storage.get(user);
    return v && btoa(v);
  }

  public static fromAuthorizationHeader(
    header: string,
  ): { client: TinychatOAuthClient; user: string } {
    const v = atob(header);
    const user = JSON.parse(v).tokenSet.sub;
    return { client: new TinychatOAuthClient(new OneValueStorage(v)), user };
  }

  public static async restoreSessionFromAuthorizationHeader(
    header: string,
  ): Promise<OAuthSession> {
    const { client, user } = TinychatOAuthClient.fromAuthorizationHeader(
      header,
    );
    return await client.restore(user);
  }
}

/** ----------------tests ---------------- **/

import { assert } from "asserts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: oauth.ipynb

Deno.test("test storage", async () => {
  const storage = new _TestStorage();

  assert(await storage.get("foo") === undefined);
  await storage.set("foo", "bar");
  assert(await storage.get("foo") === "bar");
  await storage.del("foo");
  assert(await storage.get("foo") === undefined);

  const storage2 = new OneValueStorage("bar");
  assert(await storage2.get("foo") === "bar");
  await storage2.set("foo", "baz");
  assert((await storage2.get("foo")) === "bar");
  await storage2.del("foo");
  assert(await storage2.get("foo") === "bar");
});

Deno.test("TinychatOAuthClient", async () => {
  const getRawToken = () => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2);
    return {
      tokenSet: {
        aud: "https://bsky.callmephilip.com/",
        sub: "did:plc:ubdeopbbkbgedccgbum7dhsh",
        iss: "https://bsky.callmephilip.com",
        scope: "atproto transition:generic",
        refresh_token: "ref-17d390867baee1bbdfa63e13be3f9762bf848479129a77d80b8c0ac3b5887cd6",
        access_token: "tok-a94fe6d405c54d331309a6f8ddf94850",
        token_type: "DPoP",
        expires_at: expiresAt.toISOString(),
      },
      dpopJwk: {
        kty: "EC",
        use: "sig",
        crv: "P-256",
        x: "fCO3FyJ0pNLelDN-YYxHc65JIGpbzliT-_6ZCM4Aq0s",
        y: "Tg0h3I1qoVK7ByvLDnx7X8tFV8vzZt_YAp1xEk5J-Yw",
        d: "q7abdoIrMs1VngI8-NG4I74yP2ucM0WD7YDhRYMyUIg",
        key_ops: ["sign"],
        ext: true,
      },
    };
  };
  const testStorage = new _TestStorage();
  const t = getRawToken();
  const user = "did:plc:ubdeopbbkbgedccgbum7dhsh";
  testStorage.set(user, JSON.stringify(t));

  const client = new TinychatOAuthClient(testStorage);
  const header = await client.getAuthorizationHeader(user);

  if (!header) {
    assert(false);
  }

  const { user: newUser } = TinychatOAuthClient.fromAuthorizationHeader(header);

  assert(user === newUser);
});
