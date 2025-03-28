import linkifyStr from "linkify-string";
import path from "node:path";
import { walk } from "jsr:@std/fs/walk";
import { ids } from "@tinychat/lexicons/lexicons.ts";
import { ChannelView } from "@tinychat/lexicons/types/chat/tinychat/server/defs.ts";
import { MessageView } from "tinychat/core/base.ts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: utils.ipynb

export const slugify = (str: string) => str.toLowerCase().replace(/\s/g, "-");
export const removeNulls = (input: object): object => {
  if (input === null || input === undefined) {
    return input;
  }

  if (Array.isArray(input)) {
    return input
      .filter((item) => item !== null)
      .map((item) => removeNulls(item));
  }

  if (typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input as object)
        .filter(([, value]) => value !== null)
        .map(([key, value]) => [
          key,
          typeof value === "object" ? removeNulls(value) : value,
        ]),
    );
  }

  return input;
};

export const linkify = (
  input: string,
  className?: string | undefined,
): string => linkifyStr(input, { target: "_blank", className });

export const getProjectRoot = (
  dir: string = Deno.cwd(),
  d = 0,
  maxD = 10,
): string => {
  if (d >= maxD) throw new Error("max depth reached");

  try {
    const f = path.join(dir, "deno.json");
    Deno.lstatSync(f);
    return path.dirname(f);
  } catch {
    return getProjectRoot(path.join(dir, "../"), d + 1);
  }
};
const processLine = (line: string): string => {
  if (!line.trim().match(/^import|export/ig)) {
    return line;
  }
  const module = line.split("from").pop()?.trim().replaceAll(/'|"|;/ig, "");
  if (!module || !module.startsWith(".") || module.endsWith(".ts")) {
    return line;
  }
  return line.replace(module!, `${module}.ts`);
};
const processFile = async (file: string): Promise<string> => {
  const text = await Deno.readTextFile(file);
  const modifiedText = text.split("\n").map(processLine).join("\n");
  await Deno.writeTextFile(file, modifiedText);
  return modifiedText;
};

export const unslopifyModules = async (dir: string) => {
  for await (const dirEntry of walk(dir, { exts: ["ts"] })) {
    await processFile(dirEntry.path);
  }
};
export const getTimeus = (): string => `${new Date().getTime() * 1000}`;
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const shortIdFromAtUri = (atUri: string) => {
  return atUri.split("/").pop();
};
export const atURIFromParts = ({
  did,
  collection,
  rkey,
}: {
  did: string;
  collection: string;
  rkey: string;
}): string => `at://${did}/${collection}/${rkey}`;

export const serverAtURIFromUrl = (url: string, prefix: string = "chat") => {
  const parts = url.split("?")[0].split("/" + prefix)[1].replace(/^\//ig, "")
    .split(
      "/",
    );
  return `at://did:plc:${parts[0]}/${ids.ChatTinychatCoreServer}/${parts[1]}`;
};

export const urlFromServerAtURI = (atUri: string, prefix: string = "chat") => {
  const parts = atUri.split(ids.ChatTinychatCoreServer);
  //@ts-ignore yolo
  const did = parts[0].split(":").pop().replace("/", "");
  //@ts-ignore yolo
  const rkey = parts[1].replace("/", "");
  return `/${prefix}/${did}/${rkey}`;
};

export const urlForChannelMessageList = (channel: ChannelView) => {
  return urlFromServerAtURI(channel.server).replace("/chat", "/messages/list") +
    "/" + channel.id;
};

export const urlForMessageThread = (message: MessageView) => {
  return (
    urlFromServerAtURI(message.record.server).replace(
      "/chat",
      "/messages/list",
    ) +
    "/" +
    message.record.channel +
    `?parent=${encodeURIComponent(message.uri)}&sort=chronological`
  );
};

export const parseURLForChannelMessageList = (
  url: string,
): { server: string; channel: string } => {
  const parts = url.replace("/messages/list/", "").split("/");
  // "/messages/list/ubdeopbbkbgedccgbum7dhsh/3lgawfvbbtx2b/abc";
  console.log(parts);
  return {
    server: `at://did:plc:${parts[0]}/${ids.ChatTinychatCoreServer}/${parts[1]}`,
    channel: parts[2],
  };
};
/**
 * Javascript uses utf16-encoded strings while most environments and specs
 * have standardized around utf8 (including JSON).
 *
 * After some lengthy debated we decided that richtext facets need to use
 * utf8 indices. This means we need tools to convert indices between utf8
 * and utf16, and that's precisely what this library handles.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export interface UtfString {
  u16: string;
  u8: Uint8Array;
}

export const createUtfString = (utf16: string): UtfString => {
  return {
    u16: utf16,
    u8: encoder.encode(utf16),
  };
};

export const getUtf8Length = (utf: UtfString) => {
  return utf.u8.byteLength;
};

export const sliceUtf8 = (utf: UtfString, start?: number, end?: number) => {
  return decoder.decode(utf.u8.slice(start, end));
};

const TRIM_HOST_RE = /^www\./;
const PATH_MAX_LENGTH = 18;

export const toShortUrl = (uri: string): string => {
  try {
    const url = new URL(uri);
    const protocol = url.protocol;

    const host = url.host.replace(TRIM_HOST_RE, "");
    const pathname = url.pathname;

    const path = (pathname === "/" ? "" : pathname) + url.search + url.hash;

    if (protocol === "http:" || protocol === "https:") {
      if (path.length > PATH_MAX_LENGTH) {
        return host + path.slice(0, PATH_MAX_LENGTH - 1) + "…";
      }

      return host + path;
    }
  } catch {
    // noop
  }

  return uri;
};

/** ----------------tests ---------------- **/

import { assertEquals } from "asserts";
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: utils.ipynb

Deno.test("slugify", () => {
  assertEquals(slugify("Hello World"), "hello-world");
  assertEquals(slugify("Another Example"), "another-example");
});
Deno.test("removeNulls", () => {
  assertEquals(
    removeNulls({ a: 1, b: null, c: 3 }),
    { a: 1, c: 3 },
    "works for basic cases",
  );
  assertEquals(
    removeNulls({ a: 1, b: { d: null, e: "foo" }, c: 3 }),
    {
      a: 1,
      b: { e: "foo" },
      c: 3,
    },
    "works for nested objects",
  );
  assertEquals(
    removeNulls({ a: 1, b: [null, "foo"], c: 3 }),
    {
      a: 1,
      b: ["foo"],
      c: 3,
    },
    "works for arrays",
  );
  assertEquals(
    removeNulls([
      { a: 1, b: null, c: 3 },
      { d: 4, e: { f: null, g: 7 }, h: 9 },
    ]),
    [
      { a: 1, c: 3 },
      { d: 4, e: { g: 7 }, h: 9 },
    ],
    "works for array of objects",
  );
});
Deno.test("linkify", () => {
  assertEquals(
    linkify("Hello https://example.com!"),
    'Hello <a href="https://example.com" target="_blank">https://example.com</a>!',
    "works for basic cases",
  );
  assertEquals(
    linkify("Hello https://example.com. How are you?"),
    'Hello <a href="https://example.com" target="_blank">https://example.com</a>. How are you?',
    "works for multiple links",
  );
  assertEquals(
    linkify("Hello https://example.com. How are you?", "text-bold underline"),
    'Hello <a href="https://example.com" class="text-bold underline" target="_blank">https://example.com</a>. How are you?',
    "works with className",
  );
});
Deno.test("processLine", () => {
  assertEquals(
    processLine(
      `export * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification";`,
    ),
    `export * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.ts";`,
  );
  assertEquals(
    processLine(
      `import * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification";`,
    ),
    `import * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.ts";`,
  );
  assertEquals(processLine(`export class ChatNS {`), `export class ChatNS {`);
  assertEquals(
    processLine(
      `import * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.ts";`,
    ),
    `import * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.ts";`,
  );
});
Deno.test("processFile", async () => {
  const td = await Deno.makeTempDir({});
  await Deno.writeTextFile(
    `${td}/test.ts`,
    `
    export * as Foo from "./foo";
    import { bar } from "./bar";

    export class ChatNS {
      public foo: Foo;
      public bar: bar;
    }
  `,
  );
  await processFile(`${td}/test.ts`);
  assertEquals(
    await Deno.readTextFile(`${td}/test.ts`),
    `
    export * as Foo from "./foo.ts";
    import { bar } from "./bar.ts";

    export class ChatNS {
      public foo: Foo;
      public bar: bar;
    }
  `,
  );
});
Deno.test("shortIdFromAtUri", () => {
  assertEquals(
    shortIdFromAtUri(
      "at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.server/3lfu4indvy72b",
    ),
    "3lfu4indvy72b",
  );
});
Deno.test("atURIFromParts", () => {
  assertEquals(
    atURIFromParts({
      did: "did:plc:ubdeopbbkbgedccgbum7dhsh",
      collection: "chat.tinychat.server",
      rkey: "3lfu4indvy72b",
    }),
    "at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.server/3lfu4indvy72b",
  );
});
Deno.test("serverAtURIFromUrl", () => {
  assertEquals(
    serverAtURIFromUrl(
      "https://tinychat.ngrok.app/chat/ubdeopbbkbgedccgbum7dhsh/3lgawfvbbtx2b",
    ),
    "at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.core.server/3lgawfvbbtx2b",
  );
  assertEquals(
    serverAtURIFromUrl(
      "https://tinychat.ngrok.app/chat/ubdeopbbkbgedccgbum7dhsh/3lgawfvbbtx2b?a=1&b=2",
    ),
    "at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.core.server/3lgawfvbbtx2b",
  );
});

Deno.test("urlFromServerAtURI", () => {
  assertEquals(
    urlFromServerAtURI(
      "at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.core.server/3lgawfvbbtx2b",
    ),
    "/chat/ubdeopbbkbgedccgbum7dhsh/3lgawfvbbtx2b",
  );
});

Deno.test("urlForChannelMessageList", () => {
  assertEquals(
    urlForChannelMessageList({
      id: "abc",
      server: "at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.core.server/3lgawfvbbtx2b",
      name: "foo",
    }),
    "/messages/list/ubdeopbbkbgedccgbum7dhsh/3lgawfvbbtx2b/abc",
  );
});

Deno.test("parseURLForChannelMessageList", () => {
  assertEquals(
    parseURLForChannelMessageList(
      "/messages/list/ubdeopbbkbgedccgbum7dhsh/3lgawfvbbtx2b/abc",
    ),
    {
      server: "at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.core.server/3lgawfvbbtx2b",
      channel: "abc",
    },
  );
});
