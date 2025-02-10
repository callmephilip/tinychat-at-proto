/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatCoreDefs from "./defs.ts";

export interface Record {
  /** Reference (AT-URI) to the server record (chat.tinychat.core.server). */
  server: string;
  /** Channel id. */
  channel: string;
  /** Message URI. */
  message: string;
  content:
    | ChatTinychatCoreDefs.EmojiReaction
    | { $type: string; [k: string]: unknown };
  /** Client-declared timestamp. */
  createdAt: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "chat.tinychat.core.reaction#main" ||
      v.$type === "chat.tinychat.core.reaction")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.reaction#main", v);
}
