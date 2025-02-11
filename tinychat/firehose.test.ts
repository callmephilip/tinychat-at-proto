import { Jetstream } from "@skyware/jetstream";
import { Database } from "tinychat/db.ts";
import { sleep } from "tinychat/utils.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: firehose.ipynb

const jetstream = new Jetstream({
  wantedCollections: Deno.env.get("JETSTREAM_WANTED_COLLECTIONS")!.split(","),
  endpoint: Deno.env.get("JETSTREAM_URL")!,
  // cursor: Number(cursorFile),
});

type StartJetstreamResult = {
  jetstream: Jetstream<string, string>;
  cleanup: () => void;
};

type JetstreamConfig = {
  db: Database;
};

export async function startJetstream({
  db,
}: JetstreamConfig): Promise<StartJetstreamResult> {
  console.log("Starting jetstream with db", db);

  // let intervalID: NodeJS.Timeout;
  // const cursorFile = fs.readFileSync("cursor.txt", "utf8");
  // if (cursorFile) ctx.logger.info(`Initiate jetstream at cursor ${cursorFile}`);

  jetstream.on("error", (err) => console.error(err));
  // jetstream.on("close", () => clearInterval(intervalID));

  jetstream.on("open", () => {
    // intervalID = setInterval(() => {
    //   if (jetstream.cursor) {
    //     fs.writeFile("cursor.txt", jetstream.cursor.toString(), (err) => {
    //       if (err) console.log(err);
    //     });
    //   }
    // }, 60000);
  });

  jetstream.start();
  await sleep(500);
  console.log("Jetstream started");

  return {
    jetstream,
    cleanup: async () => {
      console.log("Stopping jetstream");
      jetstream.removeAllListeners();
      jetstream.close();
      console.log("Jetstream stopped");
      await sleep(500);
    },
  };
}

/** ----------------tests ---------------- **/

import { getDatabase } from "tinychat/db.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: firehose.ipynb

Deno.test("jetstream", async () => {
  const { cleanup } = await startJetstream({
    db: getDatabase({ reset: true }),
  });
  await sleep(500);
  await cleanup();
});
