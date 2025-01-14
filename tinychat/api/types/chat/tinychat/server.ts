/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../util.ts";
import { lexicons } from "../../../lexicons.ts";
import { CID } from "multiformats/cid";

export interface Record {
  /** Server name */
  name: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "chat.tinychat.server#main" ||
      v.$type === "chat.tinychat.server")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.server#main", v);
}
