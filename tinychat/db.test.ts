// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: db.ipynb

import { Database } from "@db/sqlite";

export type { Database } from "@db/sqlite";
const tables: Record<string, string> = {
  users: `
    CREATE TABLE users (
      did TEXT PRIMARY KEY,
      handle TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar TEXT,
      description TEXT
    )`,
  servers: `
    CREATE TABLE servers (
      uri TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      creator TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator) REFERENCES users(did)
    );`,
  channels: `CREATE TABLE channels (
  uri TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  server TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (server) REFERENCES servers(uri)
);`,
  server_memberships: `CREATE TABLE server_memberships (
  user TEXT NOT NULL,
  server TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user, server),
  FOREIGN KEY (server) REFERENCES servers(uri)
  FOREIGN KEY (user) REFERENCES users(did)
);`,
  messages: `CREATE TABLE messages (
  uri TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  server TEXT NOT NULL,
  text TEXT NOT NULL,
  sender TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  time_us TEXT NOT NULL,
  FOREIGN KEY (channel) REFERENCES channels(uri),
  FOREIGN KEY (server) REFERENCES servers(uri)
  FOREIGN KEY (sender) REFERENCES users(did)
);`,
  read_receipts: `CREATE TABLE read_receipts (
  channel TEXT NOT NULL,
  user TEXT NOT NULL,
  time_us TEXT NOT NULL,
  PRIMARY KEY (user, channel),
  FOREIGN KEY (channel) REFERENCES channels(uri),
  FOREIGN KEY (user) REFERENCES users(did)
);`,
};

let __db: Database | null = null;

export const getDatabase = (
  { reset }: { reset: boolean } = { reset: false },
): Database => {
  if (__db && !reset) {
    return __db;
  }

  __db = new Database(Deno.env.get("DB_URL") || ":memory:");

  const existingTables = __db
    .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all<{ name: string }>();

  Object.keys(tables).forEach((table) => {
    if (!existingTables.some((t) => t.name === table)) {
      __db && __db.prepare(tables[table]).run();
    }
  });

  return __db;
};

/** ----------------tests ---------------- **/

import { assert, assertThrows } from "asserts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: db.ipynb

Deno.test("getDatabase", () => {
  const db = getDatabase();
  const ts = db.prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all<{
      name: string;
    }>();
  assert(ts.length === 6, "got 6 tables");
  assert(ts.some((t) => t.name === "users"), "got users table");
  assert(ts.some((t) => t.name === "servers"), "got servers table");
  assert(ts.some((t) => t.name === "channels"), "got channels table");
  assert(
    ts.some((t) => t.name === "server_memberships"),
    "got server_memberships table",
  );
  assert(ts.some((t) => t.name === "messages"), "got messages table");
  assert(ts.some((t) => t.name === "read_receipts"), "got read_receipts table");
});

Deno.test("test keys for memberships", () => {
  const db = getDatabase();

  assertThrows(() => {
    db.prepare(
      "INSERT INTO server_memberships (server, user) VALUES (:server, :user)",
    ).run({
      server: "1",
      user: "2",
    });
  }, "foreign key constraints");

  db.prepare(
    "INSERT INTO users (did, handle, display_name) VALUES (:did, :handle, :display_name)",
  ).run({
    did: "1",
    handle: "user1",
    display_name: "User 1",
  });

  db.prepare(
    "INSERT INTO servers (uri, name, creator) VALUES (:uri, :name, :creator)",
  ).run({
    uri: "1",
    name: "Server 1",
    creator: "1",
  });

  db.prepare(
    "INSERT INTO server_memberships (server, user) VALUES (:server, :user)",
  ).run({
    server: "1",
    user: "1",
  });

  // try select in

  assert(
    db
      .prepare(
        `SELECT * FROM server_memberships WHERE user IN (${
          ["1"]
            .map((id) => `'${id}'`)
            .join(",")
        })`,
      )
      .all().length === 1,
  );

  // try inserting duplicate membership

  assertThrows(() => {
    db.prepare(
      "INSERT INTO server_memberships (server, user) VALUES (:server, :user)",
    ).run({
      server: "1",
      user: "1",
    });
  }, "duplicate server membership");
});
