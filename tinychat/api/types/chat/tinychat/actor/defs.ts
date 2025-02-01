/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatServerDefs from "../server/defs.ts";

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

/** Chat server actor instance view */
export interface ActorViewWithDetails {
  did: string;
  handle: string;
  displayName?: string;
  description?: string;
  avatar?: string;
  servers: ChatTinychatServerDefs.ServerSummaryView[];
  [k: string]: unknown;
}

export function isActorViewWithDetails(v: unknown): v is ActorViewWithDetails {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.actor.defs#actorViewWithDetails"
  );
}

export function validateActorViewWithDetails(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.actor.defs#actorViewWithDetails", v);
}
