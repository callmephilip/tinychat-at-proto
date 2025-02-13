/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as AppBskyGraphDefs from "./defs.ts";
import * as AppBskyRichtextFacet from "../richtext/facet.ts";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

export interface Record {
  purpose: AppBskyGraphDefs.ListPurpose;
  /** Display name for list; can not be empty. */
  name: string;
  description?: string;
  descriptionFacets?: AppBskyRichtextFacet.Main[];
  avatar?: BlobRef;
  labels?:
    | ComAtprotoLabelDefs.SelfLabels
    | { $type: string; [k: string]: unknown };
  createdAt: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.graph.list#main" ||
      v.$type === "app.bsky.graph.list")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.graph.list#main", v);
}
