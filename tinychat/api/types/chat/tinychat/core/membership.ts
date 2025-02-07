/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util.ts'
import { lexicons } from '../../../../lexicons.ts'
import { CID } from 'multiformats/cid'

export interface Record {
  /** Reference (AT-URI) to the server record (chat.tinychat.core.server). */
  server: string
  /** Client-declared timestamp when she joined. */
  createdAt: string
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'chat.tinychat.core.membership#main' ||
      v.$type === 'chat.tinychat.core.membership')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('chat.tinychat.core.membership#main', v)
}
