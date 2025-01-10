/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util";
import { lexicons } from "../../../../lexicons";
import { CID } from "multiformats/cid";
import * as ComAtprotoLabelDefs from "../label/defs";

export interface QueryParams {
  since?: number;
  limit?: number;
}

export type InputSchema = undefined;

export interface OutputSchema {
  labels: ComAtprotoLabelDefs.Label[];
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
