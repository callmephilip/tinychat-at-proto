/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ComAtprotoModerationDefs from "./defs.ts";
import * as ComAtprotoAdminDefs from "../admin/defs.ts";
import * as ComAtprotoRepoStrongRef from "../repo/strongRef.ts";

export interface QueryParams {}

export interface InputSchema {
  reasonType: ComAtprotoModerationDefs.ReasonType;
  /** Additional context about the content and violation. */
  reason?: string;
  subject:
    | ComAtprotoAdminDefs.RepoRef
    | ComAtprotoRepoStrongRef.Main
    | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export interface OutputSchema {
  id: number;
  reasonType: ComAtprotoModerationDefs.ReasonType;
  reason?: string;
  subject:
    | ComAtprotoAdminDefs.RepoRef
    | ComAtprotoRepoStrongRef.Main
    | { $type: string; [k: string]: unknown };
  reportedBy: string;
  createdAt: string;
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
