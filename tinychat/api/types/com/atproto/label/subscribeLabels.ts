/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from "@atproto/xrpc";
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ComAtprotoLabelDefs from "./defs.ts";

export interface Labels {
  seq: number;
  labels: ComAtprotoLabelDefs.Label[];
  [k: string]: unknown;
}

export function isLabels(v: unknown): v is Labels {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.label.subscribeLabels#labels"
  );
}

export function validateLabels(v: unknown): ValidationResult {
  return lexicons.validate("com.atproto.label.subscribeLabels#labels", v);
}

export interface Info {
  name: "OutdatedCursor" | (string & {});
  message?: string;
  [k: string]: unknown;
}

export function isInfo(v: unknown): v is Info {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "com.atproto.label.subscribeLabels#info"
  );
}

export function validateInfo(v: unknown): ValidationResult {
  return lexicons.validate("com.atproto.label.subscribeLabels#info", v);
}
