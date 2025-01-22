// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: utils.ipynb

import { assert } from "asserts";
import path from "node:path";

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

import { walk } from "jsr:@std/fs/walk";

export const unslopifyModules = async (dir: string) => {
  for await (const dirEntry of walk(dir, { exts: ["ts"] })) {
    await processFile(dirEntry.path);
  }
};
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export async function assertWithWait<T>(
  fn: () => Promise<T>,
  expected: T,
  delay: number = 5000,
) {
  await sleep(delay);
  assert((await fn()) === expected);
}
export const shortIdFromAtUri = (atUri: string) => {
  return atUri.split("/").pop();
};
import { ids } from "tinychat/api/lexicons.ts";
import { ChannelView } from "tinychat/api/types/chat/tinychat/server/defs.ts";

export const serverAtURIFromUrl = (url: string) => {
  const parts = url.split("?")[0].split("/chat")[1].replace(/^\//ig, "").split(
    "/",
  );
  return `at://did:plc:${parts[0]}/${ids.ChatTinychatCoreServer}/${parts[1]}`;
};

export const urlFromServerAtURI = (atUri: string) => {
  const parts = atUri.split(ids.ChatTinychatCoreServer);
  //@ts-ignore yolo
  const did = parts[0].split(":").pop().replace("/", "");
  //@ts-ignore yolo
  const rkey = parts[1].replace("/", "");
  return `/chat/${did}/${rkey}`;
};

export const urlForChannelMessageList = (channel: ChannelView) => {
  return urlFromServerAtURI(channel.server).replace("/chat", "/messages/list") +
    "/" + channel.id;
};

export const parseURLForChannelMessageList = (
  url: string,
): { server: string; channel: string } => {
  const parts = url.replace("/messages/list/", "").split("/");
  // "/messages/list/ubdeopbbkbgedccgbum7dhsh/3lgawfvbbtx2b/abc";
  console.log(parts);
  return {
    server: `at://did:plc:${parts[0]}/${ids.ChatTinychatCoreServer}/${
      parts[1]
    }`,
    channel: parts[2],
  };
};
