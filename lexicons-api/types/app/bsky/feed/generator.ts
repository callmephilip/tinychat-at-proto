/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as AppBskyRichtextFacet from "../richtext/facet.ts";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";

export interface Record {
  did: string;
  displayName: string;
  description?: string;
  descriptionFacets?: AppBskyRichtextFacet.Main[];
  avatar?: BlobRef;
  /** Declaration that a feed accepts feedback interactions from a client through app.bsky.feed.sendInteractions */
  acceptsInteractions?: boolean;
  labels?:
    | ComAtprotoLabelDefs.SelfLabels
    | { $type: string; [k: string]: unknown };
  contentMode?:
    | "app.bsky.feed.defs#contentModeUnspecified"
    | "app.bsky.feed.defs#contentModeVideo"
    | (string & {});
  createdAt: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.feed.generator#main" ||
      v.$type === "app.bsky.feed.generator")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.feed.generator#main", v);
}
