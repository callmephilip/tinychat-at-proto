// import { Hono } from "hono";
// import { logger } from "hono/logger";
// import { poweredBy } from "hono/powered-by";
// import { Database } from "sqlite";

// const db = new Database("data/test.db");

// const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
// console.log(version);

// db.prepare(
//   `
//   CREATE TABLE IF NOT EXISTS messages (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     message TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   )
// `
// ).run();

// const app = new Hono();

// app.use("*", logger(), poweredBy());
// app.get("/", (c) => {
//   const recs = [];
//   const messages = db
//     .prepare(
//       `
//     SELECT id, message, created_at
//     FROM messages
//     ORDER BY created_at DESC
//   `
//     )
//     .all();

//   console.log("\nCurrent messages:");
//   for (const msg of messages) {
//     recs.push(`#${msg.id}: ${msg.message} (${msg.created_at})`);
//   }

//   return c.text(recs.join("\n"));
// });

// Deno.serve(app.fetch);

import { runAppView } from "tinychat/appview.ts";

runAppView();
