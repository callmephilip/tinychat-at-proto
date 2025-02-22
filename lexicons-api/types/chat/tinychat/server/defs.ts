/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatActorDefs from "../actor/defs.ts";

/** Chat server instance view */
export interface ServerView {
  uri: string;
  name: string;
  creator: ChatTinychatActorDefs.ActorView;
  channels: ChannelView[];
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

/** Chat server instance overview */
export interface ServerSummaryView {
  uri: string;
  name: string;
  creator: ChatTinychatActorDefs.ActorView;
  [k: string]: unknown;
}

export function isServerSummaryView(v: unknown): v is ServerSummaryView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.server.defs#serverSummaryView"
  );
}

export function validateServerSummaryView(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.server.defs#serverSummaryView", v);
}

/** Chat server channel instance view */
export interface ChannelView {
  id: string;
  name: string;
  server: string;
  latestMessageReceivedTime?: string;
  lastMessageReadTime?: string;
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
