/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from "@atproto/lexicon";
import { hasProp, isObj } from "../../../../util.ts";
import { lexicons } from "../../../../lexicons.ts";
import { CID } from "multiformats/cid";

/** A representation of some externally linked content (eg, a URL and 'card'), embedded in a Bluesky record (eg, a post). */
export interface Main {
  external: External;
  [k: string]: unknown;
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bsky.embed.external#main" ||
      v.$type === "app.bsky.embed.external")
  );
}

export function validateMain(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.external#main", v);
}

export interface External {
  uri: string;
  title: string;
  description: string;
  thumb?: BlobRef;
  [k: string]: unknown;
}

export function isExternal(v: unknown): v is External {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.external#external"
  );
}

export function validateExternal(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.external#external", v);
}

export interface View {
  external: ViewExternal;
  [k: string]: unknown;
}

export function isView(v: unknown): v is View {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.external#view"
  );
}

export function validateView(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.external#view", v);
}

export interface ViewExternal {
  uri: string;
  title: string;
  description: string;
  thumb?: string;
  [k: string]: unknown;
}

export function isViewExternal(v: unknown): v is ViewExternal {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    v.$type === "app.bsky.embed.external#viewExternal"
  );
}

export function validateViewExternal(v: unknown): ValidationResult {
  return lexicons.validate("app.bsky.embed.external#viewExternal", v);
}
