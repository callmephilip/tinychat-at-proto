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
  /** Search query string; syntax, phrase, boolean, and faceting is unspecified, but Lucene query syntax is recommended. */
  q: string;
  /** DID of the account making the request (not included for public/unauthenticated queries). */
  viewer?: string;
  limit?: number;
  /** Optional pagination mechanism; may not necessarily allow scrolling through entire result set. */
  cursor?: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  cursor?: string;
  /** Count of search hits. Optional, may be rounded/truncated, and may not be possible to paginate through all hits. */
  hitsTotal?: number;
  starterPacks: AppBskyUnspeccedDefs.SkeletonSearchStarterPack[];
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

export class BadQueryStringError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message, src.headers, { cause: src });
  }
}

export function toKnownErr(e: any) {
  if (e instanceof XRPCError) {
    if (e.error === "BadQueryString") return new BadQueryStringError(e);
  }

  return e;
}
