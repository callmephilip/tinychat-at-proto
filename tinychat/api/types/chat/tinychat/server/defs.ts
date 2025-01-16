/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";

/** Chat server instance view */
export interface ServerView {
  uri: string;
  creator: string;
  [k: string]: unknown;
}

export function isServerView(v: unknown): v is ServerView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.server.defs#serverView"
  );
}

export function validateServerView(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.server.defs#serverView", v);
}
