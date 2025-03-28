/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as AppBskyUnspeccedDefs from "./defs.ts";

export interface QueryParams {
  /** DID of the account making the request (not included for public/unauthenticated queries). Used to boost followed accounts in ranking. */
  viewer?: string;
  limit?: number;
}

export type InputSchema = undefined;

export interface OutputSchema {
  topics: AppBskyUnspeccedDefs.TrendingTopic[];
  suggested: AppBskyUnspeccedDefs.TrendingTopic[];
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
