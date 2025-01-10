/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";

export interface QueryParams {}

export type InputSchema = undefined;

export interface CallOptions {
  signal?: AbortSignal;
  headers?: HeadersMap;
  qp?: QueryParams;
}

export interface Response {
  success: boolean;
  headers: HeadersMap;
}

export function toKnownErr(e: any) {
  return e;
}
