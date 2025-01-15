/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";

export interface Record {
  /** Reference (AT-URI) to the server record (chat.tinychat.server). */
  server: string;
  /** Client-declared timestamp when she joined. */
  createdAt: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "chat.tinychat.graph.membership#main" ||
      v.$type === "chat.tinychat.graph.membership")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.graph.membership#main", v);
}
