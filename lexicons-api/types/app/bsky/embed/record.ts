/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";
import * as ComAtprotoRepoStrongRef from "../../../com/atproto/repo/strongRef.ts";
import * as AppBskyFeedDefs from "../feed/defs.ts";
import * as AppBskyGraphDefs from "../graph/defs.ts";
import * as AppBskyLabelerDefs from "../labeler/defs.ts";
import * as AppBskyActorDefs from "../actor/defs.ts";
import * as ComAtprotoLabelDefs from "../../../com/atproto/label/defs.ts";
import * as AppBskyEmbedImages from "./images.ts";
import * as AppBskyEmbedVideo from "./video.ts";
import * as AppBskyEmbedExternal from "./external.ts";
import * as AppBskyEmbedRecordWithMedia from "./recordWithMedia.ts";

export interface Main {
  record: ComAtprotoRepoStrongRef.Main;
  [k: string]: unknown;
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.embed.record#main" ||
      v.$type === "app.bsky.embed.record")
  );
}

export function validateMain(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.record#main", v);
}

export interface View {
  record:
    | ViewRecord
    | ViewNotFound
    | ViewBlocked
    | ViewDetached
    | AppBskyFeedDefs.GeneratorView
    | AppBskyGraphDefs.ListView
    | AppBskyLabelerDefs.LabelerView
    | AppBskyGraphDefs.StarterPackViewBasic
    | { $type: string; [k: string]: unknown };
  [k: string]: unknown;
}

export function isView(v: unknown): v is View {
  return (
    isObj(v) && hasProp(v, "$type") && v.$type === "app.bsky.embed.record#view"
  );
}

export function validateView(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.record#view", v);
}

export interface ViewRecord {
  uri: string;
  cid: string;
  author: AppBskyActorDefs.ProfileViewBasic;
  /** The record data itself. */
  value: {};
  labels?: ComAtprotoLabelDefs.Label[];
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  quoteCount?: number;
  embeds?: (
    | AppBskyEmbedImages.View
    | AppBskyEmbedVideo.View
    | AppBskyEmbedExternal.View
    | View
    | AppBskyEmbedRecordWithMedia.View
    | { $type: string; [k: string]: unknown }
  )[];
  indexedAt: string;
  [k: string]: unknown;
}

export function isViewRecord(v: unknown): v is ViewRecord {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.record#viewRecord"
  );
}

export function validateViewRecord(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.record#viewRecord", v);
}

export interface ViewNotFound {
  uri: string;
  notFound: true;
  [k: string]: unknown;
}

export function isViewNotFound(v: unknown): v is ViewNotFound {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.record#viewNotFound"
  );
}

export function validateViewNotFound(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.record#viewNotFound", v);
}

export interface ViewBlocked {
  uri: string;
  blocked: true;
  author: AppBskyFeedDefs.BlockedAuthor;
  [k: string]: unknown;
}

export function isViewBlocked(v: unknown): v is ViewBlocked {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.record#viewBlocked"
  );
}

export function validateViewBlocked(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.record#viewBlocked", v);
}

export interface ViewDetached {
  uri: string;
  detached: true;
  [k: string]: unknown;
}

export function isViewDetached(v: unknown): v is ViewDetached {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.record#viewDetached"
  );
}

export function validateViewDetached(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.record#viewDetached", v);
}
