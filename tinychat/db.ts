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
