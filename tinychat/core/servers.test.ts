// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: core/servers.ipynb

import type { Database } from "tinychat/db.ts";
import { fetchView } from "tinychat/db.ts";
import { NewServerRecord } from "tinychat/firehose.ts";
import {
  //  ServerSummaryView,
  ServerView,
  // validateServerSummaryView,
  validateServerView,
} from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { seedMessages } from "tinychat/core/messaging.ts";

export class Servers {
  constructor(protected db: Database) {}

  createServer(server: NewServerRecord) {
    const createChannel = this.db.prepare(
      `INSERT INTO channels (id, name, server) VALUES (:id, :name, :server) ON CONFLICT(id, server) DO NOTHING`,
    );

    this.db.transaction(() => {
      this.db.prepare(`
        INSERT INTO servers (uri, name, creator) VALUES (
          :uri, :name, :creator
        )`).run({
        uri: server.uri,
        name: server.commit.record.name,
        creator: server.did,
      });

      this.db.prepare(
        `INSERT INTO server_memberships (user, server) VALUES (
            :creator, :server
          ) ON CONFLICT(user, server) DO NOTHING`,
      ).run({ creator: server.did, server: server.uri });

      for (const channel of server.commit.record.channels) {
        createChannel.run({
          id: channel.id,
          name: channel.name,
          server: server.uri,
        });
      }
    })();

    // seed messages if needed
    if (Deno.env.get("SEED_MESSAGES_AFTER_SERVER_CREATION")) {
      seedMessages({ db: this.db, server: server.uri });
    }
  }

  public getServers({
    uris,
    did,
    viewer,
  }: {
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

    const where = [viewer ? `viewer = '${viewer}'` : "", baseWhere]
      .filter((q) => q)
      .join(" AND ")
      .trim();

    return fetchView<ServerView>({
      db: this.db,
      sql: `SELECT * FROM ${
        viewer ? "server_view_with_viewer" : "server_view"
      } ${where ? `WHERE ${where}` : ""}`,
      validate: validateServerView,
    });
  }
}

/** ----------------tests ---------------- **/

import { assertEquals } from "asserts";
import { getDatabase } from "tinychat/db.ts";
import { createDefaultTestUser } from "tinychat/core/users.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: core/servers.ipynb

// test server creation

const s = {
  did: "did:plc:ubdeopbbkbgedccgbum7dhsh",
  time_us: 1738230288999577,
  commit: {
    rev: "3lgx75ibpx22b",
    operation: "create",
    collection: "chat.tinychat.core.server",
    rkey: "3lgx75ib5fc2b",
    cid: "bafyreigoeopnd7knsghm4xdxfenvf4kwfxoio6yxjp6io7nt6a4wly3fvy",
    record: {
      $type: "chat.tinychat.core.server",
      name: "test-3lgx75hnhht2l",
      channels: [{ id: "3lgx75hnocm2l", name: "general" }],
    },
  },
  uri:
    "at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.core.server/3lgx75ib5fc2b",
};

Deno.test("createServer", () => {
  const db = getDatabase({ reset: true });
  const servers = new Servers(db);
  createDefaultTestUser({ db });
  servers.createServer(s);
  // spot check db
  assertEquals(
    db.prepare(`SELECT * FROM servers`).all().length,
    1,
    "got a server",
  );
});

Deno.test("getServers", () => {
  const db = getDatabase({ reset: true });
  const servers = new Servers(db);
  createDefaultTestUser({ db });
  servers.createServer(s);

  assertEquals(
    servers.getServers({}).length,
    1,
    "got a server using empty query",
  );
  assertEquals(
    servers.getServers({ did: s.did }).length,
    1,
    "got a server using did",
  );
  assertEquals(
    servers.getServers({ uris: [s.uri] }).length,
    1,
    "got a server using uri",
  );

  // with viewer option
  assertEquals(
    servers.getServers({ viewer: s.did }).length,
    1,
    "got a server using empty query with viewer",
  );
  assertEquals(
    servers.getServers({ did: s.did, viewer: s.did }).length,
    1,
    "got a server using did and viewer",
  );
  assertEquals(
    servers.getServers({ uris: [s.uri], viewer: s.did }).length,
    1,
    "got a server using uri and viewer",
  );
});
