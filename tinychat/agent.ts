import { Agent, AtpAgent } from '@atproto/api';
import { XrpcClient } from '@atproto/xrpc';
import { AppBskyNS, ChatNS, ComAtprotoNS } from 'tinychat/api/index.ts';
import { TinychatOAuthClient } from 'tinychat/oauth.ts';
import { lexicons } from 'tinychat/api/lexicons.ts';
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: agent.ipynb


const routeRequest = (url: URL, pdsUrl: string): URL => {
  if (!url.toString().includes("xrpc/com.atproto")) {
    return url;
  }

  const u = url.toString().split("xrpc")[0].replace(/\/$/ig, "");
  return new URL(url.toString().replace(u, pdsUrl.replace(/\/$/gi, "")));
};
/*
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/multikey/v1",
    "https://w3id.org/security/suites/secp256k1-2019/v1"
  ],
  id: "did:plc:ubdeopbbkbgedccgbum7dhsh",
  alsoKnownAs: [ "at://callmephilip.com" ],
  verificationMethod: [
    {
      id: "did:plc:ubdeopbbkbgedccgbum7dhsh#atproto",
      type: "Multikey",
      controller: "did:plc:ubdeopbbkbgedccgbum7dhsh",
      publicKeyMultibase: "zQ3shhg799nhPas7trxdmf4sM1u87uqcd6GjyDLChWSjT29Uv"
    }
  ],
  service: [
    {
      id: "#atproto_pds",
      type: "AtprotoPersonalDataServer",
      serviceEndpoint: "https://bsky.callmephilip.com"
    }
  ]
}
*/

const getPdsForDid = async (did: string): Promise<string> => {
  const r = await fetch(`https://plc.directory/${did}`);
  const { service } = await r.json();
  // @ts-ignore need type for s
  return service.find((s) => s.type === "AtprotoPersonalDataServer")
    .serviceEndpoint;
};






export class TinychatAgent {
  constructor(
    public agent: Agent,
    public chat: ChatNS,
    public atProto: ComAtprotoNS,
    public appBsky: AppBskyNS,
  ) {}

  static async create(
    oauthClient?: TinychatOAuthClient | undefined,
    did?: string | undefined,
  ): Promise<TinychatAgent> {
    if (oauthClient && did) {
      console.log(
        "tinychat agent: got did and oauthclient - creating regular authenticated agent",
      );
      const agent = new Agent(await oauthClient.restore(did));
      return new TinychatAgent(
        agent,
        new ChatNS(
          new XrpcClient(
            {
              service: Deno.env.get("APPVIEW_URL")!,
              headers: {
                Authorization: await oauthClient.getAuthorizationHeader(
                  agent.assertDid,
                ),
              },
              fetch: async (input, init) => {
                const u = routeRequest(
                  // @ts-ignore input should be URL
                  input,
                  await getPdsForDid(agent.assertDid),
                );

                if (u.toString() !== input.toString()) {
                  // @ts-ignore init can be undefined
                  return agent.sessionManager.fetchHandler(u, init);
                }

                return globalThis.fetch(
                  // @ts-ignore input should be URL
                  u,
                  init,
                );
              },
            },
            lexicons,
          ),
        ),
        new ComAtprotoNS(agent),
        new AppBskyNS(agent),
      );
    }

    const [service, identifier, password] = [
      Deno.env.get("TEST_AGENT_SERVICE"),
      Deno.env.get("TEST_AGENT_IDENTIFIER"),
      Deno.env.get("TEST_AGENT_PASSWORD"),
    ];

    let fallbackAgent: Agent | AtpAgent;

    if (!service || !identifier || !password) {
      console.log(
        "tinychat agent: missing service, identifier or password - creating fallback agent with appview url",
      );
      fallbackAgent = new Agent(`${Deno.env.get("APPVIEW_URL")!}/xrpc`);
    } else {
      console.log(
        "tinychat agent: got service, identifier and password - creating fallback agent and logging in using test user",
      );
      fallbackAgent = new AtpAgent({ service });
      // @ts-ignore it's safe, babe
      await fallbackAgent.login({ identifier, password });
    }

    return new TinychatAgent(
      fallbackAgent,
      new ChatNS(
        new XrpcClient(
          {
            service: Deno.env.get("APPVIEW_URL")!,
            fetch: async (input, init) => {
              // fallbackAgent.dispatchUrl.toString();
              const alternativeServiceUrl = fallbackAgent.did
                ? await getPdsForDid(fallbackAgent.assertDid)
                : "https://public.api.bsky.app";

              const u = routeRequest(
                // @ts-ignore input should be URL
                input,
                alternativeServiceUrl,
              );

              if (u.toString() !== input.toString()) {
                // @ts-ignore init can be undefined
                return fallbackAgent.fetchHandler(u, init);
              }

              return globalThis.fetch(
                // routeRequest(input, alternativeServiceUrl),
                input,
                init,
              );
            },
          },
          lexicons,
        ),
      ),
      new ComAtprotoNS(fallbackAgent),
      new AppBskyNS(fallbackAgent),
    );
  }
}