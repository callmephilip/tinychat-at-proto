import { spawn } from "node:child_process";

const cloudflared = spawn("cloudflared", [
  "tunnel",
  "run",
  Deno.env.get("CLOUDFLARED_TUNNEL_NAME")!,
]);

cloudflared.stderr.on("data", (data) => console.log(data.toString()));
cloudflared.on("close", (code) => {
  console.log(`cloudflared exited with code ${code}`);
});

const apps = spawn("deno", ["task", "dev:apps"], {
  stdio: "inherit",
});

const playwright = spawn("npx", ["playwright", "test", "--ui"]);

// Handle cleanup
const cleanup = () => {
  console.log("bye");
  cloudflared.kill("SIGTERM");
  playwright.kill("SIGTERM");
  apps.kill("SIGTERM");
  Deno.exit(0);
};

await new Deno.Command("open", {
  args: [Deno.env.get("PUBLIC_URL")!],
}).output();

// Add signal handlers
Deno.addSignalListener("SIGINT", cleanup);
Deno.addSignalListener("SIGTERM", cleanup);
