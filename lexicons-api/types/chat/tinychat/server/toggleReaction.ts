/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatCoreDefs from "../core/defs.ts";

export interface QueryParams {}

export interface InputSchema {
  /** Server AT-URI */
  server?: string;
  /** Channel ID */
  channel?: string;
  /** Message AT-URI */
  message: string;
  reaction:
    | ChatTinychatCoreDefs.EmojiReaction
    | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export interface OutputSchema {
  [k: string]: unknown;
}

export interface CallOptions {
  signal?: AbortSignal;
  headers?: HeadersMap;
  qp?: QueryParams;
  encoding?: "application/json";
}

export interface Response {
  success: boolean;
  headers: HeadersMap;
  data: OutputSchema;
}

export function toKnownErr(e: any) {
  return e;
}
