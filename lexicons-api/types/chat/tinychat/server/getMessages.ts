/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatCoreDefs from "../core/defs.ts";

export interface QueryParams {
  /** Server AT-URI */
  server: string;
  /** Channel id */
  channel: string;
  /** Parent message at-uri. Use this to pull messages from a specific thread */
  parent?: string;
  /** Maximum number of messages to return */
  limit: number;
  /** Cursor for pagination. Pagination goes backwards - from more recent messages to older ones */
  cursor?: string;
  /** Specifies how to sort messages: latest first VS chronological order */
  sort?: "latest" | "chronological" | (string & {});
}

export type InputSchema = undefined;

export interface OutputSchema {
  messages: ChatTinychatCoreDefs.MessageView[];
  /** Cursor for fetching previous page */
  prevCursor?: string;
  /** Cursor for fetching next page */
  nextCursor?: string;
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

export function toKnownErr(e: any) {
  return e;
}
