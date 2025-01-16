// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: firehose.ipynb

import { Jetstream } from "@skyware/jetstream";
import { ids } from "tinychat/api/lexicons.ts";
import { z } from "zod";
import { Database } from "tinychat/db.ts";
import { getProfile } from "tinychat/bsky.ts";

const atURI = (did: string, collection: string, rkey: string) =>
  `at://${did}/${collection}/${rkey}`;

const baseCommitSchema = z.object({
  rev: z.string(),
  operation: z.string(),
  collection: z.string(),
  rkey: z.string(),
  cid: z.string(),
});

// Change to object schema that can be extended
const makeBaseSchema = <T extends z.ZodTypeAny>(recordSchema: T) =>
  z
    .object({
      did: z.string(),
      commit: baseCommitSchema.extend({
        record: recordSchema,
      }),
    })
    .transform((d) => {
      if (!d.commit) {
        throw new Error(`Invalid record: ${JSON.stringify(d, null, 2)}`);
      }
      return Object.assign({}, d, {
        uri: atURI(d.did, d.commit.collection, d.commit.rkey),
      });
    });

const newServerRecordSchema = makeBaseSchema(
  z.object({
    $type: z.literal(ids.ChatTinychatCoreServer),
    name: z.string(),
  }),
);

const newChannelRecordSchema = makeBaseSchema(
  z.object({
    $type: z.literal(ids.ChatTinychatCoreChannel),
    name: z.string(),
    server: z.string(),
  }),
);

const newMembershipRecordSchema = makeBaseSchema(
  z.object({
    $type: z.literal(ids.ChatTinychatCoreMembership),
    createdAt: z.string(),
    server: z.string(),
  }),
);

const newMessageRecordSchema = makeBaseSchema(
  z.object({
    $type: z.literal(ids.ChatTinychatCoreMessage),
    channel: z.string(),
    createdAt: z.string(),
    server: z.string(),
    text: z.string(),
  }),
);

export type NewServerRecord = z.infer<typeof newServerRecordSchema>;
export type NewChannelRecord = z.infer<typeof newChannelRecordSchema>;
export type NewMembershipRecord = z.infer<typeof newMembershipRecordSchema>;
export type NewMessageRecord = z.infer<typeof newMessageRecordSchema>;

const jetstream = new Jetstream({
  wantedCollections: Deno.env.get("JETSTREAM_WANTED_COLLECTIONS")!.split(","),
  endpoint: Deno.env.get("JETSTREAM_URL")!,
  // cursor: Number(cursorFile),
});

type JetstreamCleanup = () => void;

type JetstreamConfig = {
  db: Database;
  onNewServer: (m: NewServerRecord) => void;
  onNewChannel: (m: NewChannelRecord) => void;
  onNewMembership: (m: NewMembershipRecord) => void;
  onNewMessage: (m: NewMessageRecord) => void;
};

export function startJetstream(
  { onNewServer, onNewMembership, onNewChannel, onNewMessage, db }:
    JetstreamConfig,
): JetstreamCleanup {
  console.log("Starting jetstream");

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

  const syncUser = async (did: string) => {
    const profile = await getProfile(did);
    db.prepare(
      `
        INSERT INTO users (did, handle, display_name, avatar, description) VALUES (
          :did, :handle, :displayName, :avatar, :description
        ) ON CONFLICT(did) DO UPDATE SET
          handle = COALESCE(:handle, handle),
          display_name = COALESCE(:displayName, display_name),
          avatar = COALESCE(:avatar, avatar),
          description = COALESCE(:description, description
        )`,
    ).run({
      did,
      handle: profile.handle,
      displayName: profile.displayName,
      avatar: profile.avatar,
      description: profile.description,
    });
  };

  // handle server updates
  jetstream.on(ids.ChatTinychatCoreServer, async (event) => {
    // we only do creates for now
    if (event.commit.operation !== "create") {
      return;
    }
    await syncUser(event.did);
    onNewServer(newServerRecordSchema.parse(event));
  });

  // handle membership updates
  jetstream.on(ids.ChatTinychatCoreMembership, async (event) => {
    // we only do creates for now
    if (event.commit.operation !== "create") {
      return;
    }
    await syncUser(event.did);
    onNewMembership(newMembershipRecordSchema.parse(event));
  });

  // handle channel updates
  jetstream.on(ids.ChatTinychatCoreChannel, async (event) => {
    // we only do creates for now
    if (event.commit.operation !== "create") {
      return;
    }
    await syncUser(event.did);
    onNewChannel(newChannelRecordSchema.parse(event));
  });

  // handle new message
  jetstream.on(ids.ChatTinychatCoreMessage, async (event) => {
    // we only do creates for now
    if (event.commit.operation !== "create") {
      return;
    }
    await syncUser(event.did);
    onNewMessage(newMessageRecordSchema.parse(event));
  });

  jetstream.start();
  console.log("Jetstream started");

  return () => {
    console.log("Stopping jetstream");
    jetstream.removeAllListeners();
    jetstream.close();
    console.log("Jetstream stopped");
  };
}
