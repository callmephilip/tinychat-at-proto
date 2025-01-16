/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatRichtextFacet from "../richtext/facet.ts";
import * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";

export interface Record {
  /** The primary message content. May be an empty string, if there are embeds. */
  text: string;
  /** Reference (AT-URI) to the server record (chat.tinychat.core.server). */
  server: string;
  /** Reference (AT-URI) to the channel record (chat.tinychat.core.channel). */
  channel: string;
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: ChatTinychatRichtextFacet.Main[];
  reply?: ReplyRef;
  /** Client-declared timestamp when this post was originally created. */
  createdAt: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "chat.tinychat.core.message#main" ||
      v.$type === "chat.tinychat.core.message")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.message#main", v);
}

export interface ReplyRef {
  root: ComAtprotoRepoStrongRef.Main;
  parent: ComAtprotoRepoStrongRef.Main;
  [k: string]: unknown;
}

export function isReplyRef(v: unknown): v is ReplyRef {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "chat.tinychat.core.message#replyRef"
  );
}

export function validateReplyRef(v: unknown): ValidationResult {
  return lexicons.validate("chat.tinychat.core.message#replyRef", v);
}
