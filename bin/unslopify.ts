import { unslopifyModules } from "tinychat/utils.ts";

if (import.meta.main) {
  const args = Deno.args;

  if (args.length !== 1) {
    console.error(
      "Usage: deno run --allow-read --allow-write ./bin/unslopify.ts <path>",
    );
    Deno.exit(1);
  }

  await unslopifyModules(args[0]);
}
