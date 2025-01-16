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
  name: string;
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

/** Chat server channel instance view */
export interface ChannelView {
  uri: string;
  name: string;
  [k: string]: unknown;
}

export function isChannelView(v: unknown): v is ChannelView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.server.defs#channelView"
  );
}

export function validateChannelView(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.server.defs#channelView", v);
}

/** Chat server actor instance view */
export interface ActorView {
  did: string;
  handle: string;
  displayName: string;
  description?: string;
  avatar?: string;
  [k: string]: unknown;
}

export function isActorView(v: unknown): v is ActorView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.server.defs#actorView"
  );
}

export function validateActorView(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.server.defs#actorView", v);
}

/** Message view */
export interface MessageView {
  uri: string;
  server?: string;
  channel?: string;
  sender: ActorView;
  text: string;
  createdAt: string;
  [k: string]: unknown;
}

export function isMessageView(v: unknown): v is MessageView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.server.defs#messageView"
  );
}

export function validateMessageView(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.server.defs#messageView", v);
}
