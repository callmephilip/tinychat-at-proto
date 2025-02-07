/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util.ts'
import { lexicons } from '../../../../lexicons.ts'
import { CID } from 'multiformats/cid'
import * as ChatTinychatServerDefs from './defs.ts'

export interface QueryParams {}

export interface InputSchema {
  /** Channel id to return messages for. */
  channel: string
  /** Server AT-URI to return messages for. */
  server: string
  /** Message content. */
  text: string
  [k: string]: unknown
}

export interface OutputSchema {
  message: ChatTinychatServerDefs.MessageView
  [k: string]: unknown
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
  qp?: QueryParams
  encoding?: 'application/json'
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}
