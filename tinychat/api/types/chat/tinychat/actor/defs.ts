/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";

/** Chat server actor instance view */
export interface ActorView {
  did: string;
  handle: string;
  displayName?: string;
  description?: string;
  avatar?: string;
  [k: string]: unknown;
}

export function isActorView(v: unknown): v is ActorView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.actor.defs#actorView"
  );
}

export function validateActorView(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.actor.defs#actorView", v);
}
