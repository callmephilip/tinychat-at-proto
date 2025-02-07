/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util.ts'
import { lexicons } from '../../../../lexicons.ts'
import { CID } from 'multiformats/cid'

export interface Record {
  /** Server name */
  name: string
  /** Channels on this server */
  channels: ChannelRef[]
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'chat.tinychat.core.server#main' ||
      v.$type === 'chat.tinychat.core.server')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('chat.tinychat.core.server#main', v)
}

export interface ChannelRef {
  id: string
  /** Channel name */
  name: string
  [k: string]: unknown
}

export function isChannelRef(v: unknown): v is ChannelRef {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'chat.tinychat.core.server#channelRef'
  )
}

export function validateChannelRef(v: unknown): ValidationResult {
  return lexicons.validate('chat.tinychat.core.server#channelRef', v)
}
