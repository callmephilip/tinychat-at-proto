import { runClient } from "../client.tsx";
import { runAppView } from "tinychat/appview.ts";

Deno.env.set("SEED_MESSAGES_AFTER_SERVER_CREATION", "yass");

runAppView();
runClient();
