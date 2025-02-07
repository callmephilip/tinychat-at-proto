/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { isObj, hasProp } from '../../../../util.ts'
import { lexicons } from '../../../../lexicons.ts'
import { CID } from 'multiformats/cid'
import * as AppBskyRichtextFacet from '../../../app/bsky/richtext/facet.ts'
import * as AppBskyFeedPost from '../../../app/bsky/feed/post.ts'
import * as AppBskyEmbedImages from '../../../app/bsky/embed/images.ts'
import * as AppBskyEmbedVideo from '../../../app/bsky/embed/video.ts'
import * as AppBskyEmbedExternal from '../../../app/bsky/embed/external.ts'
import * as AppBskyEmbedRecord from '../../../app/bsky/embed/record.ts'
import * as AppBskyEmbedRecordWithMedia from '../../../app/bsky/embed/recordWithMedia.ts'
import * as ComAtprotoLabelDefs from '../../../com/atproto/label/defs.ts'

export interface Record {
  /** Reference (AT-URI) to the server record (chat.tinychat.core.server). */
  server: string
  /** Reference (tid) to the channel within server record. */
  channel: string
  /** The primary post content. May be an empty string, if there are embeds. */
  text: string
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: AppBskyRichtextFacet.Main[]
  reply?: AppBskyFeedPost.ReplyRef
  embed?:
    | AppBskyEmbedImages.Main
    | AppBskyEmbedVideo.Main
    | AppBskyEmbedExternal.Main
    | AppBskyEmbedRecord.Main
    | AppBskyEmbedRecordWithMedia.Main
    | { $type: string; [k: string]: unknown }
  /** Indicates human language of post primary text content. */
  langs?: string[]
  labels?:
    | ComAtprotoLabelDefs.SelfLabels
    | { $type: string; [k: string]: unknown }
  /** Additional hashtags, in addition to any included in post text and facets. */
  tags?: string[]
  /** Client-declared timestamp when this post was originally created. */
  createdAt: string
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'chat.tinychat.core.message#main' ||
      v.$type === 'chat.tinychat.core.message')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('chat.tinychat.core.message#main', v)
}
