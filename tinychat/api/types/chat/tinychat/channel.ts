/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../util.ts";
import { lexicons } from "../../../lexicons.ts";
import { CID } from "multiformats/cid";

export interface Record {
  /** Channel name */
  name: string;
  /** Reference (AT-URI) to the server record (chat.tinychat.server). */
  server: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "chat.tinychat.channel#main" ||
      v.$type === "chat.tinychat.channel")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.channel#main", v);
}
