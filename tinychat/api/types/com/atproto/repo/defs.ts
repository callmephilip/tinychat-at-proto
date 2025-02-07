/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util.ts'
import { lexicons } from '../../../../lexicons.ts'
import { CID } from 'multiformats/cid'

export interface CommitMeta {
  cid: string
  rev: string
  [k: string]: unknown
}

export function isCommitMeta(v: unknown): v is CommitMeta {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'com.atproto.repo.defs#commitMeta'
  )
}

export function validateCommitMeta(v: unknown): ValidationResult {
  return lexicons.validate('com.atproto.repo.defs#commitMeta', v)
}
