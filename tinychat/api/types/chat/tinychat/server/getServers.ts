/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util.ts'
import { lexicons } from '../../../../lexicons.ts'
import { CID } from 'multiformats/cid'
import * as ChatTinychatServerDefs from './defs.ts'

export interface QueryParams {
  /** List of server AT-URIs to return hydrated views for. */
  uris?: string[]
  /** Did of the person to get servers for. This returns servers person is member of. */
  did?: string
}

export type InputSchema = undefined

export interface OutputSchema {
  servers: ChatTinychatServerDefs.ServerView[]
  [k: string]: unknown
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}
