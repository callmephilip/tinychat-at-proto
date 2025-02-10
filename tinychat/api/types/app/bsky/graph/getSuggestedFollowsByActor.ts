/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as AppBskyActorDefs from "../actor/defs.ts";

export interface QueryParams {
  actor: string;
}

export type InputSchema = undefined;

export interface OutputSchema {
  suggestions: AppBskyActorDefs.ProfileView[];
  /** If true, response has fallen-back to generic results, and is not scoped using relativeToDid */
  isFallback: boolean;
  /** Snowflake for this recommendation, use when submitting recommendation events. */
  recId?: number;
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
