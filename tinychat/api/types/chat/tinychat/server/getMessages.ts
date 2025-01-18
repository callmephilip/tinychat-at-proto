/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatServerDefs from "./defs.ts";

export interface QueryParams {
  /** Channel AT-URI to return messages for. */
  channel: string;
  /** Maximum number of messages to return */
  limit: number;
  /** Cursor for pagination. Pagination goes backwards - from more recent messages to older ones */
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  messages: ChatTinychatServerDefs.MessageView[];
  /** Cursor for pagination */
  cursor?: string;
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
