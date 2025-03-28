import { z } from "zod";
import { Record as Message } from "@tinychat/lexicons/types/chat/tinychat/core/message.ts";
import { atURIFromParts, getTimeus } from "tinychat/utils.ts";
import { Jetstream } from "@skyware/jetstream";
import { ids } from "@tinychat/lexicons/lexicons.ts";
import type { Database } from "tinychat/db.ts";
import { fetchView } from "tinychat/db.ts";
import { MessageView, validateMessageView } from "tinychat/core/base.ts";
import { syncUser } from "tinychat/core/users.ts";
import EventEmitter from "node:events";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: core/messaging.ipynb

// schema for getting new message from form submission

export const newMessageSchema = z.object({
  server: z.string(),
  channel: z.string(),
});

const newMessageRecordSchema = z.object({
  did: z.string(),
  time_us: z.number(),
  commit: z.object({
    rev: z.string(),
    operation: z.string(),
    collection: z.string(),
    rkey: z.string(),
    cid: z.string().optional(),
    record: z.custom<Message>(),
  }),
}).transform((d) => {
  if (!d.commit) {
    throw new Error(`Invalid record: ${JSON.stringify(d, null, 2)}`);
  }
  return Object.assign({}, d, {
    time_us: `${d.time_us}`,
    uri: atURIFromParts({
      did: d.did,
      collection: d.commit.collection,
      rkey: d.commit.rkey,
    }),
  });
});

type NewMessageRecord = z.infer<typeof newMessageRecordSchema>;

const deleteMessageRecordSchema = z
  .object({
    did: z.string(),
    time_us: z.number(),
    commit: z.object({
      rev: z.string(),
      operation: z.string(),
      collection: z.string(),
      rkey: z.string(),
      cid: z.string().optional(),
    }),
  })
  .transform((d) => {
    if (!d.commit) {
      throw new Error(`Invalid record: ${JSON.stringify(d, null, 2)}`);
    }
    return Object.assign({}, d, {
      uri: atURIFromParts({
        did: d.did,
        collection: d.commit.collection,
        rkey: d.commit.rkey,
      }),
    });
  });

type DeleteMessageRecord = z.infer<typeof deleteMessageRecordSchema>;

export class MessageCursor {
  constructor(public timestamp: string, public direction: "past" | "future") {}

  public static fromString(base64Str: string): MessageCursor {
    const decoded = atob(base64Str);
    const [timestamp, direction] = decoded.split(":");
    return new MessageCursor(timestamp, direction as "past" | "future");
  }

  public toString(): string {
    return btoa(`${this.timestamp}:${this.direction}`);
  }
}

export class Messaging extends EventEmitter {
  constructor(protected db: Database) {
    super();
  }

  public connectToJetstream(jetstream: Jetstream) {
    jetstream.on(ids.ChatTinychatCoreMessage, async (event) => {
      // we only do creates for now
      if (event.commit.operation === "create") {
        const data = newMessageRecordSchema.parse(event);
        await syncUser({ did: event.did, db: this.db });
        this.receiveMessage(
          Object.assign({}, data, {
            cid: data.commit.cid!,
            m: data.commit.record,
            sender: event.did,
          }),
        );
      } else if (event.commit.operation === "delete") {
        this.deleteMessage(deleteMessageRecordSchema.parse(event));
      }
    });
  }

  public deleteMessage({ uri }: DeleteMessageRecord) {
    const deletedRecord = {
      createdAt: new Date().toISOString(),
      text: "<deleted>",
    };
    this.db
      .prepare(
        `UPDATE messages SET deleted_at = :time, record = :deletedRecord WHERE uri = :uri`,
      )
      .run({ uri, deletedRecord, time: new Date().toISOString() });
  }

  public markAllMessagesAsRead({
    channel,
    server,
    user,
  }: {
    channel: string;
    server: string;
    user: string;
  }) {
    this.db
      .prepare(
        `INSERT OR REPLACE INTO read_receipts (channel, server, user, time_us) VALUES (:channel, :server, :user, :time)`,
      )
      .run({ channel, user, server, time: getTimeus() });
  }

  public receiveMessage({
    m,
    cid,
    uri,
    sender,
    time_us,
  }: {
    m: Message;
    cid: string;
    uri: string;
    sender: string;
    time_us: string;
  }) {
    this.db
      .prepare(
        `
      INSERT INTO messages (record, uri, cid, channel, server, sender, created_at, time_us, reply_to, reply_to_root) VALUES (
        :record, :uri, :cid, :channel, :server, :sender, :created_at, :time_us, :reply_to, :reply_to_root
      )`,
      )
      .run({
        record: JSON.stringify(m),
        uri,
        cid,
        channel: m.channel,
        server: m.server,
        sender,
        created_at: m.createdAt,
        time_us: time_us,
        reply_to: m.reply ? m.reply.parent.uri : null,
        reply_to_root: m.reply ? m.reply.root.uri : null,
      });
    this.emit("message", { uri });
  }

  public getMessages({
    server,
    channel,
    parent,
    uri,
    cursor,
    limit,
    sort = "latest",
  }: {
    server?: string;
    channel?: string;
    parent?: string;
    uri?: string;
    cursor?: string;
    limit?: number;
    sort?: "latest" | "chronological";
  }): {
    messages: MessageView[];
    prevCursor?: string;
    nextCursor?: string;
  } {
    if (!channel && !server && !uri) {
      return {
        messages: [],
      };
    }

    const parsedCursor = cursor && MessageCursor.fromString(cursor);
    const cursorWhere = (c: MessageCursor) => c.direction === "past" ? `ts < ${c.timestamp}` : `ts > ${c.timestamp}`;
    let messages: MessageView[] = [];

    if (uri) {
      messages = fetchView<MessageView>({
        db: this.db,
        sql: `SELECT * FROM message_view WHERE uri = '${uri}'`,
        validate: validateMessageView,
      });
    } else {
      messages = fetchView<MessageView>({
        db: this.db,
        sql: `SELECT * FROM message_view WHERE ${
          parent ? `replyToRoot = '${parent}'` : "replyToRoot IS NULL"
        } AND channel = '${channel}' AND server = '${server}' ${parsedCursor ? `AND ${cursorWhere(parsedCursor)}` : ""} ORDER BY ${
          sort === "chronological" ? "ts ASC" : "ts DESC"
        } LIMIT ${limit || 10}`,
        validate: validateMessageView,
      });
    }

    if (sort === "latest") {
      return Object.assign(
        {
          messages,
        },
        messages.length === limit
          ? {
            prevCursor: new MessageCursor(
              messages[messages.length - 1].ts,
              "past",
            ).toString(),
          }
          : {},
        cursor
          ? {
            nextCursor: new MessageCursor(
              messages[0].ts,
              "future",
            ).toString(),
          }
          : {},
      );
    }

    // chronological ordering
    // need to check if we have older messages for the prev cursor

    const hasPreviousMessages = messages.length !== 0 &&
      this.db
          .prepare(
            `SELECT uri FROM message_view
          WHERE ${parent ? `replyToRoot = '${parent}'` : "replyToRoot IS NULL"} AND channel = :channel AND server = :server AND ts < :time_us
          ORDER BY ts DESC LIMIT :limit`,
          )
          .all<{ uri: string }>({
            channel,
            server,
            time_us: messages[0].ts,
            limit: 1,
          }).length > 0;

    return Object.assign(
      {
        messages,
      },
      messages.length === limit
        ? {
          nextCursor: new MessageCursor(
            messages[messages.length - 1].ts,
            "future",
          ).toString(),
        }
        : {},
      hasPreviousMessages
        ? {
          prevCursor: new MessageCursor(messages[0].ts, "past").toString(),
        }
        : {},
    );
  }
}

/** ----------------tests ---------------- **/

import { TinychatAgent } from "tinychat/agent.ts";
import { startJetstream } from "tinychat/firehose.ts";
import { getDatabase, TestDatabase, waitForSync } from "tinychat/db.ts";
import { Servers } from "tinychat/core/servers.ts";
import { assert, assertEquals } from "asserts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: core/messaging.ipynb

Deno.test("ingesting messages", async () => {
  const agent = await TinychatAgent.create();
  const repo = await agent.agent.assertDid;
  const db = getDatabase({ reset: true });
  const servers = new Servers(db);
  const messaging = new Messaging(db);
  const receivedMessages: string[] = [];
  const { jetstream, cleanup } = await startJetstream({ db });

  messaging.on("message", ({ uri }) => {
    receivedMessages.push(uri);
  });

  servers.connectToJetstream(jetstream);
  messaging.connectToJetstream(jetstream);

  // make sure there are no messages in the system
  assertEquals(
    db.prepare("SELECT * FROM messages").all().length,
    0,
    "no messages in the system",
  );

  // create test server
  const server = await servers.createServer({ name: "test server", tc: agent });

  // send a message
  const { uri: messageURI, cid } = await waitForSync({
    db,
    op: () =>
      agent.chat.tinychat.core.message.create({ repo }, {
        channel: server.channels[0].id,
        server: server.uri,
        text: "Hello world",
        createdAt: new Date().toISOString(),
      }),
    sql: (m) => `SELECT * FROM messages WHERE uri = '${m.uri}'`,
  });

  // reply to the original message
  const { uri: replyURI } = await waitForSync({
    db,
    op: () =>
      agent.chat.tinychat.core.message.create(
        { repo },
        {
          channel: server.channels[0].id,
          server: server.uri,
          text: "re: Hello world",
          createdAt: new Date().toISOString(),
          langs: ["en"],
          facets: [
            {
              index: {
                byteEnd: 152,
                byteStart: 126,
              },
              features: [
                {
                  uri: "https://github.com/callmephilip/tinychat-at-proto",
                  $type: "app.bsky.richtext.facet#link",
                },
              ],
            },
          ],
          reply: {
            root: {
              uri: messageURI,
              cid,
            },
            parent: {
              uri: messageURI,
              cid,
            },
          },
        },
      ),
    sql: (m) => `SELECT * FROM messages WHERE uri = '${m.uri}' AND reply_to = '${messageURI}'`,
  });

  // delete message

  await waitForSync({
    db,
    op: () =>
      agent.chat.tinychat.core.message.delete({
        repo,
        rkey: messageURI.split("/").pop(),
      }),
    sql: `SELECT * FROM messages WHERE uri = '${messageURI}' AND deleted_at is NOT NULL`,
  });

  // confirm content is cleaned up
  // assertEquals(
  // db.prepare("SELECT * FROM messages WHERE uri = :uri").get<{ record: string }>(
  //     { uri: messageURI },
  // )!.record,
  // "<deleted>",
  // "message content is deleted",
  // );

  // delete reply

  await waitForSync({
    db,
    op: () =>
      agent.chat.tinychat.core.message.delete({
        repo,
        rkey: replyURI.split("/").pop(),
      }),
    sql: `SELECT * FROM messages WHERE uri = '${replyURI}' AND deleted_at is NOT NULL`,
  });

  assertEquals(receivedMessages.length, 2, "received 2 messages");

  await cleanup();
});

Deno.test("message seeding", async () => {
  const tdb = await TestDatabase.setup();
  assert(
    tdb.db.prepare("SELECT COUNT(*) FROM messages").value<[number]>()![0] > 80,
    "messaging seeding works",
  );
});
Deno.test("message cursor", () => {
  const t = `${new Date().getTime() * 1000}`;
  const cursor = MessageCursor.fromString(
    new MessageCursor(t, "past").toString(),
  );
  assert(cursor.timestamp === t, "timestamp matches");
  assert(cursor.direction === "past", "direction matches");
});
Deno.test("message loading and pagination with default latest sorting", async (t) => {
  const tdb = await TestDatabase.setup({ messages: false });
  const messaging = new Messaging(tdb.db);
  const db = tdb.db;

  //throw a bunch of messages into the db
  for (let i = 0; i < 1000; i++) {
    // offset ts by i minutes
    const timestamp = `${(new Date().getTime() + 60 * (i * 1000)) * 1000}`;
    await tdb.user1MessagesChannel1(`[${i}] hello world`, timestamp);
  }

  await t.step("test get by uri", () => {
    const uri = db.prepare("SELECT uri FROM messages").get<{ uri: string }>()!.uri;
    const { messages } = messaging.getMessages({ uri });
    assertEquals(messages.length, 1, "got 1 message");
    assertEquals(messages[0].uri, uri, "got the right message");
  });

  await t.step("test pagination and order for the first batch", () => {
    const { messages, prevCursor, nextCursor } = messaging.getMessages({
      server: TestDatabase.server,
      channel: TestDatabase.channel1,
      limit: 10,
    });

    assertEquals(messages.length, 10, "got 10 messages");
    assertEquals(
      messages[0].record.text,
      "[999] hello world",
      "the latest message comes first",
    );
    assertEquals(
      messages[9].record.text,
      "[990] hello world",
      "the oldest message comes last",
    );
    assert(
      messages[0].record.text > messages[9].record.text,
      "latest messages come first",
    );

    assert(
      !nextCursor,
      "no next cursor for the first fetch with the latest messages",
    );
    assert(prevCursor, "got a prev cursor for the first fetch");
    assert(
      MessageCursor.fromString(prevCursor!).timestamp === messages[9].ts,
      "prev cursor points to the oldest in the batch",
    );
    assert(
      MessageCursor.fromString(prevCursor!).direction === "past",
      "prev cursor points to the past",
    );
  });

  await t.step(
    "test pagination and order for the second batch going into past",
    () => {
      const firstBatch = messaging.getMessages({
        server: TestDatabase.server,
        channel: TestDatabase.channel1,
        limit: 10,
      });
      const { messages, nextCursor, prevCursor } = messaging.getMessages({
        server: TestDatabase.server,
        channel: TestDatabase.channel1,
        limit: 10,
        cursor: firstBatch.prevCursor,
      });

      assertEquals(messages.length, 10, "past batch has 10 messages");
      assert(nextCursor, "past batch has next cursor");
      assert(prevCursor, "past batch has prev cursor");
      assert(
        Number(messages[0].ts) <
          Number(firstBatch.messages[firstBatch.messages.length - 1].ts),
        "past batch latest messages is older than the first batch's last message",
      );
      assert(
        MessageCursor.fromString(nextCursor).timestamp === messages[0].ts,
        "past batch next cursor points to its newest message",
      );
      assert(
        MessageCursor.fromString(nextCursor).direction === "future",
        "past batch next cursor points to the future",
      );
      assert(
        MessageCursor.fromString(prevCursor).timestamp ===
          messages[messages.length - 1].ts,
        "past batch prev cursor points to its oldest message",
      );
      assert(
        MessageCursor.fromString(prevCursor).direction === "past",
        "past batch prev cursor points to the past",
      );
    },
  );

  await t.step(
    "test pagination and order going forward from the second batch",
    () => {
      const firstBatch = messaging.getMessages({
        server: TestDatabase.server,
        channel: TestDatabase.channel1,
        limit: 10,
      });
      const secondBatch = messaging.getMessages({
        server: TestDatabase.server,
        channel: TestDatabase.channel1,
        limit: 10,
        cursor: firstBatch.prevCursor,
      });
      const { messages, nextCursor, prevCursor } = messaging.getMessages({
        server: TestDatabase.server,
        channel: TestDatabase.channel1,
        limit: 10,
        cursor: secondBatch.nextCursor,
      });

      assertEquals(messages.length, 10, "got 10 messages");
      assert(
        messages[0].ts > messages[messages.length - 1].ts,
        "new messages comes first",
      );
      assert(prevCursor, "got prev cursor for the new batch");
      assert(nextCursor, "got next cursor for the new batch");
    },
  );
});
Deno.test(
  "message loading and pagination with chronological sorting",
  async (t) => {
    const tdb = await TestDatabase.setup({ messages: false });
    const messaging = new Messaging(tdb.db);

    //throw a bunch of messages into the db
    for (let i = 0; i < 1000; i++) {
      // offset ts by i minutes
      const timestamp = `${(new Date().getTime() + 60 * (i * 1000)) * 1000}`;
      await tdb.user1MessagesChannel1(`[${i}] hello world`, timestamp);
    }

    await t.step("test pagination and order for the first batch", () => {
      const { messages, prevCursor, nextCursor } = messaging.getMessages({
        server: TestDatabase.server,
        channel: TestDatabase.channel1,
        limit: 10,
        sort: "chronological",
      });

      assertEquals(messages.length, 10, "got 10 messages");
      assertEquals(
        messages[0].record.text,
        "[0] hello world",
        "first message comes first",
      );
      assertEquals(
        messages[9].record.text,
        "[9] hello world",
        "later message comes last",
      );

      assert(nextCursor, "got next cursor for the first batch");
      assert(!prevCursor, "no previous cursor");
      assert(
        MessageCursor.fromString(nextCursor!).timestamp === messages[9].ts,
        "next cursor points to the newest message in the batch",
      );
      assert(
        MessageCursor.fromString(nextCursor!).direction === "future",
        "next cursor points to the future",
      );
    });

    await t.step(
      "test pagination and order for the second batch going into future",
      () => {
        const firstBatch = messaging.getMessages({
          server: TestDatabase.server,
          channel: TestDatabase.channel1,
          limit: 10,
          sort: "chronological",
        });
        const { messages, nextCursor, prevCursor } = messaging.getMessages({
          server: TestDatabase.server,
          channel: TestDatabase.channel1,
          limit: 10,
          cursor: firstBatch.nextCursor,
          sort: "chronological",
        });

        assertEquals(messages.length, 10, "future batch has 10 messages");
        assert(nextCursor, "future batch has next cursor");
        assert(prevCursor, "future batch has prev cursor");
        assert(
          Number(messages[0].ts) >
            Number(firstBatch.messages[firstBatch.messages.length - 1].ts),
          "future batch first message is newer than the last message of the previous batch",
        );
        assert(
          MessageCursor.fromString(prevCursor).timestamp === messages[0].ts,
          "future batch prev cursor points to its first message",
        );
        assert(
          MessageCursor.fromString(nextCursor).direction === "future",
          "future batch next cursor points to the future",
        );
        assert(
          MessageCursor.fromString(prevCursor).timestamp === messages[0].ts,
          "future batch prev cursor points to its oldest message",
        );
        assert(
          MessageCursor.fromString(prevCursor).direction === "past",
          "future batch prev cursor points to the past",
        );
      },
    );

    await t.step(
      "test pagination and order going backwards from the second batch",
      () => {
        const firstBatch = messaging.getMessages({
          server: TestDatabase.server,
          channel: TestDatabase.channel1,
          limit: 10,
          sort: "chronological",
        });
        const secondBatch = messaging.getMessages({
          server: TestDatabase.server,
          channel: TestDatabase.channel1,
          limit: 10,
          cursor: firstBatch.nextCursor,
          sort: "chronological",
        });

        // back to the first batch
        const { messages, nextCursor, prevCursor } = messaging.getMessages({
          server: TestDatabase.server,
          channel: TestDatabase.channel1,
          limit: 10,
          cursor: secondBatch.prevCursor,
          sort: "chronological",
        });

        assertEquals(messages.length, 10, "got 10 messages");
        assertEquals(
          messages[0].record.text,
          "[0] hello world",
          "got the first message",
        );
        assert(
          messages[0].ts < messages[messages.length - 1].ts,
          "odlers messages comes first",
        );
        assert(!prevCursor, "there is no prev cursor for the new batch");
        assert(nextCursor, "got next cursor for the new batch");
      },
    );
  },
);

Deno.test("threads", async () => {
  const tdb = await TestDatabase.setup({ messages: false });
  const messaging = new Messaging(tdb.db);

  const messageURI = await tdb.user1MessagesChannel1("hello");
  await tdb.user1RespondsToMessage("re: hello", messageURI);

  // top level messages by default
  const topLevelMessages = messaging.getMessages({
    server: TestDatabase.server,
    channel: TestDatabase.channel1,
    limit: 10,
    sort: "chronological",
  });

  assertEquals(topLevelMessages.messages.length, 1, "got 1 top level message");
  assertEquals(
    topLevelMessages.messages[0].record.text,
    "hello",
    "got the right top level message",
  );
  assert(
    topLevelMessages.messages[0].threadSummary,
    "top level messages have thread summary",
  );

  // pull thread
  const thread = messaging.getMessages({
    server: TestDatabase.server,
    channel: TestDatabase.channel1,
    parent: messageURI,
    limit: 10,
    sort: "chronological",
  });

  assertEquals(thread.messages.length, 1, "got 1 thread message");
  assertEquals(
    thread.messages[0].record.text,
    "re: hello",
    "got the right thread message",
  );
  assert(
    !thread.messages[0].threadSummary,
    "messages inside thread do not have thread summary",
  );
});
