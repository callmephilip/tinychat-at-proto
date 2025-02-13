/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";

/** width:height represents an aspect ratio. It may be approximate, and may not correspond to absolute dimensions in any given unit. */
export interface AspectRatio {
  width: number;
  height: number;
  [k: string]: unknown;
}

export function isAspectRatio(v: unknown): v is AspectRatio {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.defs#aspectRatio"
  );
}

export function validateAspectRatio(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.defs#aspectRatio", v);
}
