/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as AppBskyRichtextFacet from "../richtext/facet.ts";

export interface Record {
  /** Display name for starter pack; can not be empty. */
  name: string;
  description?: string;
  descriptionFacets?: AppBskyRichtextFacet.Main[];
  /** Reference (AT-URI) to the list record. */
  list: string;
  feeds?: FeedItem[];
  createdAt: string;
  [k: string]: unknown;
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.graph.starterpack#main" ||
      v.$type === "app.bsky.graph.starterpack")
  );
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.graph.starterpack#main", v);
}

export interface FeedItem {
  uri: string;
  [k: string]: unknown;
}

export function isFeedItem(v: unknown): v is FeedItem {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.graph.starterpack#feedItem"
  );
}

export function validateFeedItem(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.graph.starterpack#feedItem", v);
}
