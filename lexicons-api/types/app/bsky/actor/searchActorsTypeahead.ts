/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "./defs.ts";

export interface QueryParams {
  /** DEPRECATED: use 'q' instead. */
  term?: string;
  /** Search query prefix; not a full query string. */
  q?: string;
  limit?: number;
}

export type InputSchema = undefined;

export interface OutputSchema {
  actors: AppBskyActorDefs.ProfileViewBasic[];
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
