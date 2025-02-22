import { z } from "zod";
import { Record as Server } from "@tinychat/lexicons/types/chat/tinychat/core/server.ts";
import { Record as Membership } from "@tinychat/lexicons/types/chat/tinychat/core/membership.ts";
import { atURIFromParts } from "tinychat/utils.ts";
import { Jetstream } from "@skyware/jetstream";
import type { Database } from "tinychat/db.ts";
import { fetchView, seedMessages, waitForSync } from "tinychat/db.ts";
import { TinychatAgent } from "tinychat/agent.ts";
import { ids } from "@tinychat/lexicons/lexicons.ts";
import { TID } from "@atproto/common";
import { ServerSummaryView, ServerView, validateServerSummaryView, validateServerView } from "@tinychat/lexicons/types/chat/tinychat/server/defs.ts";
import { syncUser } from "tinychat/core/users.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: core/servers.ipynb

const newServerRecordSchema = z.object({
  did: z.string(),
  time_us: z.number(),
  commit: z.object({
    rev: z.string(),
    operation: z.string(),
    collection: z.string(),
    rkey: z.string(),
    cid: z.string().optional(),
    record: z.custom<Server>(),
  }),
}).transform((d) => {
  if (!d.commit) {
    throw new Error(`Invalid record: ${JSON.stringify(d, null, 2)}`);
  }
  return Object.assign({}, d, {
    uri: atURIFromParts({
      did: d.did,
      collection: d.commit.collection,
      rkey: d.commit.rkey,
    }),
  });
});

type NewServerRecord = z.infer<typeof newServerRecordSchema>;

const newMembershipRecordSchema = z
  .object({
    did: z.string(),
    time_us: z.number(),
    commit: z.object({
      rev: z.string(),
      operation: z.string(),
      collection: z.string(),
      rkey: z.string(),
      cid: z.string().optional(),
      record: z.custom<Membership>(),
    }),
  })
  .transform((d) => {
    if (!d.commit) {
      throw new Error(`Invalid record: ${JSON.stringify(d, null, 2)}`);
    }
    return Object.assign({}, d, {
      uri: atURIFromParts({
        did: d.did,
        collection: d.commit.collection,
        rkey: d.commit.rkey,
      }),
    });
  });

type NewMembershipRecord = z.infer<typeof newMembershipRecordSchema>;

const deleteServerRecordSchema = z
  .object({
    did: z.string(),
    time_us: z.number(),
    commit: z.object({
      rev: z.string(),
      operation: z.string(),
      collection: z.string(),
      rkey: z.string(),
      cid: z.string().optional(),
    }),
  })
  .transform((d) => {
    if (!d.commit) {
      throw new Error(`Invalid record: ${JSON.stringify(d, null, 2)}`);
    }
    return Object.assign({}, d, {
      uri: atURIFromParts({
        did: d.did,
        collection: d.commit.collection,
        rkey: d.commit.rkey,
      }),
    });
  });

const deleteMembershipRecordSchema = z
  .object({
    did: z.string(),
    time_us: z.number(),
    commit: z.object({
      rev: z.string(),
      operation: z.string(),
      collection: z.string(),
      rkey: z.string(),
      cid: z.string().optional(),
    }),
  })
  .transform((d) => {
    if (!d.commit) {
      throw new Error(`Invalid record: ${JSON.stringify(d, null, 2)}`);
    }
    return Object.assign({}, d, {
      uri: atURIFromParts({
        did: d.did,
        collection: d.commit.collection,
        rkey: d.commit.rkey,
      }),
    });
  });

type DeleteServerRecord = z.infer<typeof deleteServerRecordSchema>;
type DeleteMembershipRecord = z.infer<typeof deleteMembershipRecordSchema>;

export class Servers {
  constructor(protected db: Database) {}

  public connectToJetstream(jetstream: Jetstream) {
    // keep an eye on servers
    jetstream.on(ids.ChatTinychatCoreServer, async (event) => {
      // we only do creates for now
      if (event.commit.operation === "create") {
        const data = newServerRecordSchema.parse(event);
        await syncUser({ did: event.did, db: this.db });
        this.syncServer(data);
      } else if (event.commit.operation === "delete") {
        this.deleteServer(deleteServerRecordSchema.parse(event));
      }
    });
    // and server memberships
    jetstream.on(ids.ChatTinychatCoreMembership, async (event) => {
      // we only do creates for now
      if (event.commit.operation === "create") {
        const data = newMembershipRecordSchema.parse(event);
        await syncUser({ did: event.did, db: this.db });
        await this.syncMembership(data);
      } else if (event.commit.operation === "delete") {
        this.deleteMembership(deleteMembershipRecordSchema.parse(event));
      }
    });
  }

  async createServer({
    name,
    tc,
  }: {
    name: string;
    tc: TinychatAgent;
  }): Promise<ServerView> {
    const { uri } = await waitForSync<{ uri: string }>({
      db: this.db,
      op: () => {
        return tc.chat.tinychat.core.server.create(
          {
            repo: tc.agent.assertDid,
          },
          {
            name,
            channels: [
              { name: "general", id: TID.nextStr() },
              { name: "random", id: TID.nextStr() },
              { name: "meta", id: TID.nextStr() },
            ],
          },
        );
      },
      sql: ({ uri }) => `SELECT uri FROM servers WHERE uri = '${uri}'`,
    });

    await this.joinServer({ server: uri, tc });

    return (await this.getServers({ uris: [uri] }))[0];
  }

  async joinServer({
    server,
    tc,
  }: {
    server: string;
    tc: TinychatAgent;
  }): Promise<{ uri: string }> {
    return await waitForSync<{ uri: string }>({
      db: this.db,
      op: () => {
        return tc.chat.tinychat.core.membership.create(
          { repo: tc.agent.assertDid },
          {
            server,
            createdAt: new Date().toISOString(),
          },
        );
      },
      sql: ({ uri }) => `SELECT uri FROM server_memberships WHERE uri = '${uri}'`,
    });
  }

  syncServer(server: NewServerRecord) {
    const createChannel = this.db.prepare(
      `INSERT INTO channels (id, name, server) VALUES (:id, :name, :server) ON CONFLICT(id, server) DO NOTHING`,
    );

    this.db.transaction(() => {
      this.db
        .prepare(
          `
        INSERT INTO servers (uri, name, creator) VALUES (
          :uri, :name, :creator
        )`,
        )
        .run({
          uri: server.uri,
          name: server.commit.record.name,
          creator: server.did,
        });

      for (const channel of server.commit.record.channels) {
        createChannel.run({
          id: channel.id,
          name: channel.name,
          server: server.uri,
        });
      }
    })();
  }

  public async syncMembership(m: NewMembershipRecord) {
    this.db
      .prepare(
        `INSERT INTO server_memberships (user, server, uri) VALUES (
        :user, :server, :uri
      )`,
      )
      .run({
        uri: m.uri,
        user: m.did,
        server: m.commit.record.server,
      });

    if (Deno.env.get("SEED_MESSAGES_AFTER_SERVER_CREATION")) {
      console.log(
        "SEED_MESSAGES_AFTER_SERVER_CREATION is set, checking if we need to seed messages",
      );
      const messageCount = this.db
        .prepare(
          `SELECT COUNT(*) FROM messages WHERE server = '${m.commit.record.server}'`,
        )
        .value()![0];

      console.log(
        "Message count: ",
        messageCount,
        "for server: ",
        m.commit.record.server,
      );

      if (messageCount === 0) {
        console.log("Seeding messages for server: ", m.commit.record.server);
        await seedMessages({ db: this.db, server: m.commit.record.server });
      }
    } else {
      console.log(
        "SEED_MESSAGES_AFTER_SERVER_CREATION is NOT set; not seeding messages",
      );
    }
  }

  deleteServer(server: DeleteServerRecord) {
    this.db.prepare(`DELETE FROM servers WHERE uri = '${server.uri}'`).run();
  }

  deleteMembership(membership: DeleteMembershipRecord) {
    this.db
      .prepare(
        `DELETE FROM server_memberships WHERE user = '${membership.did}' AND server = '${membership.uri}'`,
      )
      .run();
  }

  public getServers({
    uris,
    did,
  }: // viewer,
    {
      uris?: string[] | undefined;
      did?: string | undefined;
      viewer?: string | undefined;
    }): ServerView[] {
    let baseWhere = "";
    if (uris && uris.length > 0) {
      baseWhere = `uri IN (${uris.map((u) => `'${u}'`).join(", ")})`;
    } else if (did) {
      baseWhere = `creator__did = '${did}'`;
    }

    // viewer ? `viewer = '${viewer}'` : "",
    const where = [baseWhere]
      .filter((q) => q)
      .join(" AND ")
      .trim();

    return fetchView<ServerView>({
      db: this.db,
      sql: `SELECT * FROM  server_view ${where ? `WHERE ${where}` : ""}`,
      validate: validateServerView,
    });
  }

  public getServersForMember({ did }: { did: string }): ServerView[] {
    return fetchView<ServerView>({
      db: this.db,
      sql: `SELECT * FROM server_with_members_view WHERE member = '${did}'`,
      validate: validateServerView,
    });
  }

  public findServers({
    query,
  }: {
    query?: string | undefined;
  }): ServerSummaryView[] {
    console.log("Finding servers with query: ", query);
    return fetchView<ServerSummaryView>({
      db: this.db,
      sql: "SELECT * FROM  server_view",
      validate: validateServerSummaryView,
    });
  }
}
