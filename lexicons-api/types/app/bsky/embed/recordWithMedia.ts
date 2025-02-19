/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as AppBskyEmbedRecord from "./record.ts";
import * as AppBskyEmbedImages from "./images.ts";
import * as AppBskyEmbedVideo from "./video.ts";
import * as AppBskyEmbedExternal from "./external.ts";

export interface Main {
  record: AppBskyEmbedRecord.Main;
  media:
    | AppBskyEmbedImages.Main
    | AppBskyEmbedVideo.Main
    | AppBskyEmbedExternal.Main
    | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.embed.recordWithMedia#main" ||
      v.$type === "app.bsky.embed.recordWithMedia")
  );
}

export function validateMain(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.recordWithMedia#main", v);
}

export interface View {
  record: AppBskyEmbedRecord.View;
  media:
    | AppBskyEmbedImages.View
    | AppBskyEmbedVideo.View
    | AppBskyEmbedExternal.View
    | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export function isView(v: unknown): v is View {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.recordWithMedia#view"
  );
}

export function validateView(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.recordWithMedia#view", v);
}
