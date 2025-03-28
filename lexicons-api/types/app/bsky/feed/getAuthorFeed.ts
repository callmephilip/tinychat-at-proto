/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as AppBskyFeedDefs from "./defs.ts";

export interface QueryParams {
  actor: string;
  limit?: number;
  cursor?: string;
  /** Combinations of post/repost types to include in response. */
  filter?:
    | "posts_with_replies"
    | "posts_no_replies"
    | "posts_with_media"
    | "posts_and_author_threads"
    | "posts_with_video"
    | (string & {});
  includePins?: boolean;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  feed: AppBskyFeedDefs.FeedViewPost[];
  [k: string]: unknown;
}

export interface CallOptions {
  signal?: AbortSignal;
  headers?: HeadersMap;
}

export interface Response {
  success: boolean;
  headers: HeadersMap;
  data: OutputSchema;
}

export class BlockedActorError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message, src.headers, { cause: src });
  }
}

export class BlockedByActorError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message, src.headers, { cause: src });
  }
}

export function toKnownErr(e: any) {
  if (e instanceof XRPCError) {
    if (e.error === "BlockedActor") return new BlockedActorError(e);
    if (e.error === "BlockedByActor") return new BlockedByActorError(e);
  }

  return e;
}
