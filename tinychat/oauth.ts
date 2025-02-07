import { OAuthClient, OAuthSession } from '@atproto/oauth-client';
import { createHash, randomBytes } from 'node:crypto';
import { JoseKey, NodeSavedSession, NodeSavedState, toDpopKeyStore } from 'tinychat/atproto/auth.ts';
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