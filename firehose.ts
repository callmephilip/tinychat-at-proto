import { Database } from "sqlite";

const db = new Database("data/test.db");

const [version] = db.prepare("select sqlite_version()").value<[string]>()!;
console.log(version);

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

// Deno signal handling
let isRunning = true;

// Cleanup function
const cleanup = () => {
  console.log("goodbye");
  isRunning = false;
  db.close();
  Deno.exit(0);
};

// Handle shutdown signals
Deno.addSignalListener("SIGINT", cleanup);
Deno.addSignalListener("SIGTERM", cleanup);

console.log("Service started");

// Main service loop using async/await
while (isRunning) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const stmt = db.prepare(`
        INSERT INTO messages (message)
        VALUES (?)
    `);
  const result = stmt.run(`${Math.random()}`);
  console.log(result);
}
