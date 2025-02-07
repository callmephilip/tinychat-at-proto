/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util.ts'
import { lexicons } from '../../../../lexicons.ts'
import { CID } from 'multiformats/cid'
import * as ChatTinychatActorDefs from '../actor/defs.ts'

export interface MessageView {
  uri: string
  cid: string
  author: ChatTinychatActorDefs.ActorView
  /** Instance of chat.tinychat.core.message record */
  record: {}
  threadSummary?: ThreadSummaryView
  indexedAt: string
  reactions?: MessageReaction[]
  [k: string]: unknown
}

export function isMessageView(v: unknown): v is MessageView {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'chat.tinychat.core.defs#messageView'
  )
}

export function validateMessageView(v: unknown): ValidationResult {
  return lexicons.validate('chat.tinychat.core.defs#messageView', v)
}

export interface MessageReaction {
  count: number
  content: EmojiReaction | { $type: string; [k: string]: unknown }
  [k: string]: unknown
}

export function isMessageReaction(v: unknown): v is MessageReaction {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'chat.tinychat.core.defs#messageReaction'
  )
}

export function validateMessageReaction(v: unknown): ValidationResult {
  return lexicons.validate('chat.tinychat.core.defs#messageReaction', v)
}

export interface EmojiReaction {
  emoji: string
  [k: string]: unknown
}

export function isEmojiReaction(v: unknown): v is EmojiReaction {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'chat.tinychat.core.defs#emojiReaction'
  )
}

export function validateEmojiReaction(v: unknown): ValidationResult {
  return lexicons.validate('chat.tinychat.core.defs#emojiReaction', v)
}

/** Overview of the thread associated with a message - includes participants and overall message count */
export interface ThreadSummaryView {
  /** Number of messages in the thread */
  size: number
  participants: ChatTinychatActorDefs.ActorView[]
  [k: string]: unknown
}

export function isThreadSummaryView(v: unknown): v is ThreadSummaryView {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'chat.tinychat.core.defs#threadSummaryView'
  )
}

export function validateThreadSummaryView(v: unknown): ValidationResult {
  return lexicons.validate('chat.tinychat.core.defs#threadSummaryView', v)
}
