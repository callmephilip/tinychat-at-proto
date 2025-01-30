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
