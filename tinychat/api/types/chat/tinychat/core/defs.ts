/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatActorDefs from "../actor/defs.ts";
import * as ChatTinychatCoreServer from "./server.ts";

export interface MessageView {
  uri: string;
  cid: string;
  replyTo?: string;
  replyToRoot?: string;
  /** Message timestamp */
  ts: string;
  author: ChatTinychatActorDefs.ActorView;
  /** Instance of chat.tinychat.core.message record */
  record: {};
  threadSummary?: ThreadSummaryView;
  indexedAt: string;
  reactions?: MessageReaction[];
  [k: string]: unknown;
}

export function isMessageView(v: unknown): v is MessageView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.core.defs#messageView"
  );
}

export function validateMessageView(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.defs#messageView", v);
}

export interface MessageReaction {
  count: number;
  authors?: ChatTinychatActorDefs.ActorView[];
  content: EmojiReaction | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export function isMessageReaction(v: unknown): v is MessageReaction {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.core.defs#messageReaction"
  );
}

export function validateMessageReaction(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.defs#messageReaction", v);
}

export interface EmojiReaction {
  emoji: string;
  [k: string]: unknown;
}

export function isEmojiReaction(v: unknown): v is EmojiReaction {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.core.defs#emojiReaction"
  );
}

export function validateEmojiReaction(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.defs#emojiReaction", v);
}

/** Overview of the thread associated with a message - includes participants and overall message count */
export interface ThreadSummaryView {
  /** Number of messages in the thread */
  size: number;
  participants: ChatTinychatActorDefs.ActorView[];
  [k: string]: unknown;
}

export function isThreadSummaryView(v: unknown): v is ThreadSummaryView {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.core.defs#threadSummaryView"
  );
}

export function validateThreadSummaryView(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.defs#threadSummaryView", v);
}

export interface Notification {
  /** Reference (AT-URI) to the server record (chat.tinychat.core.server). */
  server: string;
  channel: ChatTinychatCoreServer.ChannelRef;
  details?:
    | NewMessageNotification
    | MentionNotification
    | { $type: string; [k: string]: unknown };
  createdAt: string;
  [k: string]: unknown;
}

export function isNotification(v: unknown): v is Notification {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.core.defs#notification"
  );
}

export function validateNotification(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.defs#notification", v);
}

export interface NewMessageNotification {
  count: number;
  [k: string]: unknown;
}

export function isNewMessageNotification(
  v: unknown,
): v is NewMessageNotification {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.core.defs#newMessageNotification"
  );
}

export function validateNewMessageNotification(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.defs#newMessageNotification", v);
}

export interface MentionNotification {
  messageUri: string;
  [k: string]: unknown;
}

export function isMentionNotification(v: unknown): v is MentionNotification {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.core.defs#mentionNotification"
  );
}

export function validateMentionNotification(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.defs#mentionNotification", v);
}
