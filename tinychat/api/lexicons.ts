/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { LexiconDoc, Lexicons } from "@atproto/lexicon";

export const schemaDict = {
  ChatTinychatActorProfile: {
    lexicon: 1,
    id: "chat.tinychat.actor.profile",
    defs: {
      main: {
        type: "record",
        description: "Person's or org's profile on tinychat",
        key: "literal:self",
        record: {
          type: "object",
          properties: {
            handle: {
              type: "string",
              description: "Account handle",
              maxGraphemes: 64,
              maxLength: 640,
            },
          },
        },
      },
    },
  },
  ChatTinychatCoreChannel: {
    lexicon: 1,
    id: "chat.tinychat.core.channel",
    defs: {
      main: {
        type: "record",
        description: "Chat channel that is part of chat server",
        key: "any",
        record: {
          type: "object",
          required: ["name", "server"],
          properties: {
            name: {
              type: "string",
              description: "Channel name",
              maxGraphemes: 64,
              maxLength: 640,
            },
            server: {
              type: "string",
              format: "at-uri",
              description:
                "Reference (AT-URI) to the server record (chat.tinychat.server).",
            },
          },
        },
      },
    },
  },
  ChatTinychatCoreMembership: {
    lexicon: 1,
    id: "chat.tinychat.core.membership",
    defs: {
      main: {
        type: "record",
        description: "Person's membership in a chat server",
        key: "any",
        record: {
          type: "object",
          required: ["server", "createdAt"],
          properties: {
            server: {
              type: "string",
              format: "at-uri",
              description:
                "Reference (AT-URI) to the server record (chat.tinychat.core.server).",
            },
            createdAt: {
              type: "string",
              format: "datetime",
              description: "Client-declared timestamp when she joined.",
            },
          },
        },
      },
    },
  },
  ChatTinychatCoreMessage: {
    lexicon: 1,
    id: "chat.tinychat.core.message",
    defs: {
      main: {
        type: "record",
        description: "Chat message from a given channel",
        key: "any",
        record: {
          type: "object",
          required: ["text", "server", "channel", "createdAt"],
          properties: {
            text: {
              type: "string",
              maxLength: 3000,
              maxGraphemes: 300,
              description:
                "The primary message content. May be an empty string, if there are embeds.",
            },
            server: {
              type: "string",
              format: "at-uri",
              description:
                "Reference (AT-URI) to the server record (chat.tinychat.core.server).",
            },
            channel: {
              type: "string",
              format: "at-uri",
              description:
                "Reference (AT-URI) to the channel record (chat.tinychat.core.channel).",
            },
            facets: {
              type: "array",
              description:
                "Annotations of text (mentions, URLs, hashtags, etc)",
              items: {
                type: "ref",
                ref: "lex:chat.tinychat.richtext.facet",
              },
            },
            reply: {
              type: "ref",
              ref: "lex:chat.tinychat.core.message#replyRef",
            },
            createdAt: {
              type: "string",
              format: "datetime",
              description:
                "Client-declared timestamp when this post was originally created.",
            },
          },
        },
      },
      replyRef: {
        type: "object",
        required: ["root", "parent"],
        properties: {
          root: {
            type: "ref",
            ref: "lex:com.atproto.repo.strongRef",
          },
          parent: {
            type: "ref",
            ref: "lex:com.atproto.repo.strongRef",
          },
        },
      },
    },
  },
  ChatTinychatCoreServer: {
    lexicon: 1,
    id: "chat.tinychat.core.server",
    defs: {
      main: {
        type: "record",
        description: "Chat server instance",
        key: "any",
        record: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              description: "Server name",
              maxGraphemes: 64,
              maxLength: 640,
            },
          },
        },
      },
    },
  },
  ChatTinychatRichtextFacet: {
    lexicon: 1,
    id: "chat.tinychat.richtext.facet",
    defs: {
      main: {
        type: "object",
        description: "Annotation of a sub-string within rich text.",
        required: ["index", "features"],
        properties: {
          index: {
            type: "ref",
            ref: "lex:chat.tinychat.richtext.facet#byteSlice",
          },
          features: {
            type: "array",
            items: {
              type: "union",
              refs: [
                "lex:chat.tinychat.richtext.facet#mention",
                "lex:chat.tinychat.richtext.facet#link",
                "lex:chat.tinychat.richtext.facet#tag",
              ],
            },
          },
        },
      },
      mention: {
        type: "object",
        description:
          "Facet feature for mention of another account. The text is usually a handle, including a '@' prefix, but the facet reference is a DID.",
        required: ["did"],
        properties: {
          did: {
            type: "string",
            format: "did",
          },
        },
      },
      link: {
        type: "object",
        description:
          "Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL.",
        required: ["uri"],
        properties: {
          uri: {
            type: "string",
            format: "uri",
          },
        },
      },
      tag: {
        type: "object",
        description:
          "Facet feature for a hashtag. The text usually includes a '#' prefix, but the facet reference should not (except in the case of 'double hash tags').",
        required: ["tag"],
        properties: {
          tag: {
            type: "string",
            maxLength: 640,
            maxGraphemes: 64,
          },
        },
      },
      byteSlice: {
        type: "object",
        description:
          "Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text. NOTE: some languages, like Javascript, use UTF-16 or Unicode codepoints for string slice indexing; in these languages, convert to byte arrays before working with facets.",
        required: ["byteStart", "byteEnd"],
        properties: {
          byteStart: {
            type: "integer",
            minimum: 0,
          },
          byteEnd: {
            type: "integer",
            minimum: 0,
          },
        },
      },
    },
  },
  ChatTinychatServerDefs: {
    lexicon: 1,
    id: "chat.tinychat.server.defs",
    defs: {
      serverView: {
        type: "object",
        description: "Chat server instance view",
        required: ["uri", "name", "creator"],
        properties: {
          uri: {
            type: "string",
            format: "at-uri",
          },
          name: {
            type: "string",
          },
          creator: {
            type: "string",
            format: "did",
          },
        },
      },
      channelView: {
        type: "object",
        description: "Chat server channel instance view",
        required: ["uri", "name"],
        properties: {
          uri: {
            type: "string",
            format: "at-uri",
          },
          name: {
            type: "string",
          },
        },
      },
      actorView: {
        type: "object",
        description: "Chat server actor instance view",
        required: ["did", "handle", "displayName"],
        properties: {
          did: {
            type: "string",
            format: "did",
          },
          handle: {
            type: "string",
            format: "handle",
          },
          displayName: {
            type: "string",
            maxGraphemes: 64,
            maxLength: 640,
          },
          description: {
            type: "string",
            maxGraphemes: 256,
            maxLength: 2560,
          },
          avatar: {
            type: "string",
            format: "uri",
          },
        },
      },
      messageView: {
        type: "object",
        description: "Message view",
        required: ["uri", "sender", "text", "createdAt"],
        properties: {
          uri: {
            type: "string",
            format: "at-uri",
          },
          server: {
            type: "string",
            format: "at-uri",
          },
          channel: {
            type: "string",
            format: "at-uri",
          },
          sender: {
            type: "ref",
            ref: "lex:chat.tinychat.server.defs#actorView",
          },
          text: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "datetime",
          },
        },
      },
    },
  },
  ChatTinychatServerGetChannels: {
    lexicon: 1,
    id: "chat.tinychat.server.getChannels",
    defs: {
      main: {
        type: "query",
        description:
          "Gets a list of channels for a given chat server instance.",
        parameters: {
          type: "params",
          required: ["server"],
          properties: {
            server: {
              type: "string",
              format: "at-uri",
              description: "Server AT-URI to return channels for.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["channels"],
            properties: {
              channels: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:chat.tinychat.server.defs#channelView",
                },
              },
            },
          },
        },
      },
    },
  },
  ChatTinychatServerGetMessages: {
    lexicon: 1,
    id: "chat.tinychat.server.getMessages",
    defs: {
      main: {
        type: "query",
        description: "Gets a list of of messages for a given channel.",
        parameters: {
          type: "params",
          required: ["channel"],
          properties: {
            channel: {
              type: "string",
              format: "at-uri",
              description: "Channel AT-URI to return messages for.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["messages"],
            properties: {
              messages: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:chat.tinychat.server.defs#messageView",
                },
              },
            },
          },
        },
      },
    },
  },
  ChatTinychatServerGetServers: {
    lexicon: 1,
    id: "chat.tinychat.server.getServers",
    defs: {
      main: {
        type: "query",
        description: "Gets a list of chat server instances.",
        parameters: {
          type: "params",
          properties: {
            uris: {
              type: "array",
              description:
                "List of server AT-URIs to return hydrated views for.",
              items: {
                type: "string",
                format: "at-uri",
              },
              maxLength: 25,
            },
            did: {
              type: "string",
              format: "did",
              description:
                "Did of the person to get servers for. This returns servers person is member of.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["servers"],
            properties: {
              servers: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:chat.tinychat.server.defs#serverView",
                },
              },
            },
          },
        },
      },
    },
  },
  ChatTinychatServerJoinServer: {
    lexicon: 1,
    id: "chat.tinychat.server.joinServer",
    defs: {
      main: {
        type: "procedure",
        description: "User joins server.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["server"],
            properties: {
              server: {
                type: "string",
                format: "at-uri",
                description: "Server AT-URI.",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {},
          },
        },
      },
    },
  },
  ChatTinychatServerSendMessage: {
    lexicon: 1,
    id: "chat.tinychat.server.sendMessage",
    defs: {
      main: {
        type: "procedure",
        description:
          "Sends message to specified channel on the specified chat server.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["channel", "server", "text"],
            properties: {
              channel: {
                type: "string",
                format: "at-uri",
                description: "Channel AT-URI to return messages for.",
              },
              server: {
                type: "string",
                format: "at-uri",
                description: "Server AT-URI to return messages for.",
              },
              text: {
                type: "string",
                description: "Message content.",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {},
          },
        },
      },
    },
  },
  ComAtprotoAdminDefs: {
    lexicon: 1,
    id: "com.atproto.admin.defs",
    defs: {
      statusAttr: {
        type: "object",
        required: ["applied"],
        properties: {
          applied: {
            type: "boolean",
          },
          ref: {
            type: "string",
          },
        },
      },
      accountView: {
        type: "object",
        required: ["did", "handle", "indexedAt"],
        properties: {
          did: {
            type: "string",
            format: "did",
          },
          handle: {
            type: "string",
            format: "handle",
          },
          email: {
            type: "string",
          },
          relatedRecords: {
            type: "array",
            items: {
              type: "unknown",
            },
          },
          indexedAt: {
            type: "string",
            format: "datetime",
          },
          invitedBy: {
            type: "ref",
            ref: "lex:com.atproto.server.defs#inviteCode",
          },
          invites: {
            type: "array",
            items: {
              type: "ref",
              ref: "lex:com.atproto.server.defs#inviteCode",
            },
          },
          invitesDisabled: {
            type: "boolean",
          },
          emailConfirmedAt: {
            type: "string",
            format: "datetime",
          },
          inviteNote: {
            type: "string",
          },
          deactivatedAt: {
            type: "string",
            format: "datetime",
          },
          threatSignatures: {
            type: "array",
            items: {
              type: "ref",
              ref: "lex:com.atproto.admin.defs#threatSignature",
            },
          },
        },
      },
      repoRef: {
        type: "object",
        required: ["did"],
        properties: {
          did: {
            type: "string",
            format: "did",
          },
        },
      },
      repoBlobRef: {
        type: "object",
        required: ["did", "cid"],
        properties: {
          did: {
            type: "string",
            format: "did",
          },
          cid: {
            type: "string",
            format: "cid",
          },
          recordUri: {
            type: "string",
            format: "at-uri",
          },
        },
      },
      threatSignature: {
        type: "object",
        required: ["property", "value"],
        properties: {
          property: {
            type: "string",
          },
          value: {
            type: "string",
          },
        },
      },
    },
  },
  ComAtprotoAdminDeleteAccount: {
    lexicon: 1,
    id: "com.atproto.admin.deleteAccount",
    defs: {
      main: {
        type: "procedure",
        description: "Delete a user account as an administrator.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["did"],
            properties: {
              did: {
                type: "string",
                format: "did",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminDisableAccountInvites: {
    lexicon: 1,
    id: "com.atproto.admin.disableAccountInvites",
    defs: {
      main: {
        type: "procedure",
        description:
          "Disable an account from receiving new invite codes, but does not invalidate existing codes.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["account"],
            properties: {
              account: {
                type: "string",
                format: "did",
              },
              note: {
                type: "string",
                description: "Optional reason for disabled invites.",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminDisableInviteCodes: {
    lexicon: 1,
    id: "com.atproto.admin.disableInviteCodes",
    defs: {
      main: {
        type: "procedure",
        description:
          "Disable some set of codes and/or all codes associated with a set of users.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {
              codes: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              accounts: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminEnableAccountInvites: {
    lexicon: 1,
    id: "com.atproto.admin.enableAccountInvites",
    defs: {
      main: {
        type: "procedure",
        description: "Re-enable an account's ability to receive invite codes.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["account"],
            properties: {
              account: {
                type: "string",
                format: "did",
              },
              note: {
                type: "string",
                description: "Optional reason for enabled invites.",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminGetAccountInfo: {
    lexicon: 1,
    id: "com.atproto.admin.getAccountInfo",
    defs: {
      main: {
        type: "query",
        description: "Get details about an account.",
        parameters: {
          type: "params",
          required: ["did"],
          properties: {
            did: {
              type: "string",
              format: "did",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "ref",
            ref: "lex:com.atproto.admin.defs#accountView",
          },
        },
      },
    },
  },
  ComAtprotoAdminGetAccountInfos: {
    lexicon: 1,
    id: "com.atproto.admin.getAccountInfos",
    defs: {
      main: {
        type: "query",
        description: "Get details about some accounts.",
        parameters: {
          type: "params",
          required: ["dids"],
          properties: {
            dids: {
              type: "array",
              items: {
                type: "string",
                format: "did",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["infos"],
            properties: {
              infos: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.admin.defs#accountView",
                },
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminGetInviteCodes: {
    lexicon: 1,
    id: "com.atproto.admin.getInviteCodes",
    defs: {
      main: {
        type: "query",
        description: "Get an admin view of invite codes.",
        parameters: {
          type: "params",
          properties: {
            sort: {
              type: "string",
              knownValues: ["recent", "usage"],
              default: "recent",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 500,
              default: 100,
            },
            cursor: {
              type: "string",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["codes"],
            properties: {
              cursor: {
                type: "string",
              },
              codes: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.server.defs#inviteCode",
                },
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminGetSubjectStatus: {
    lexicon: 1,
    id: "com.atproto.admin.getSubjectStatus",
    defs: {
      main: {
        type: "query",
        description:
          "Get the service-specific admin status of a subject (account, record, or blob).",
        parameters: {
          type: "params",
          properties: {
            did: {
              type: "string",
              format: "did",
            },
            uri: {
              type: "string",
              format: "at-uri",
            },
            blob: {
              type: "string",
              format: "cid",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["subject"],
            properties: {
              subject: {
                type: "union",
                refs: [
                  "lex:com.atproto.admin.defs#repoRef",
                  "lex:com.atproto.repo.strongRef",
                  "lex:com.atproto.admin.defs#repoBlobRef",
                ],
              },
              takedown: {
                type: "ref",
                ref: "lex:com.atproto.admin.defs#statusAttr",
              },
              deactivated: {
                type: "ref",
                ref: "lex:com.atproto.admin.defs#statusAttr",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminSearchAccounts: {
    lexicon: 1,
    id: "com.atproto.admin.searchAccounts",
    defs: {
      main: {
        type: "query",
        description: "Get list of accounts that matches your search query.",
        parameters: {
          type: "params",
          properties: {
            email: {
              type: "string",
            },
            cursor: {
              type: "string",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 50,
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["accounts"],
            properties: {
              cursor: {
                type: "string",
              },
              accounts: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.admin.defs#accountView",
                },
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminSendEmail: {
    lexicon: 1,
    id: "com.atproto.admin.sendEmail",
    defs: {
      main: {
        type: "procedure",
        description: "Send email to a user's account email address.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["recipientDid", "content", "senderDid"],
            properties: {
              recipientDid: {
                type: "string",
                format: "did",
              },
              content: {
                type: "string",
              },
              subject: {
                type: "string",
              },
              senderDid: {
                type: "string",
                format: "did",
              },
              comment: {
                type: "string",
                description:
                  "Additional comment by the sender that won't be used in the email itself but helpful to provide more context for moderators/reviewers",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["sent"],
            properties: {
              sent: {
                type: "boolean",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminUpdateAccountEmail: {
    lexicon: 1,
    id: "com.atproto.admin.updateAccountEmail",
    defs: {
      main: {
        type: "procedure",
        description: "Administrative action to update an account's email.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["account", "email"],
            properties: {
              account: {
                type: "string",
                format: "at-identifier",
                description: "The handle or DID of the repo.",
              },
              email: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminUpdateAccountHandle: {
    lexicon: 1,
    id: "com.atproto.admin.updateAccountHandle",
    defs: {
      main: {
        type: "procedure",
        description: "Administrative action to update an account's handle.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["did", "handle"],
            properties: {
              did: {
                type: "string",
                format: "did",
              },
              handle: {
                type: "string",
                format: "handle",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminUpdateAccountPassword: {
    lexicon: 1,
    id: "com.atproto.admin.updateAccountPassword",
    defs: {
      main: {
        type: "procedure",
        description:
          "Update the password for a user account as an administrator.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["did", "password"],
            properties: {
              did: {
                type: "string",
                format: "did",
              },
              password: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoAdminUpdateSubjectStatus: {
    lexicon: 1,
    id: "com.atproto.admin.updateSubjectStatus",
    defs: {
      main: {
        type: "procedure",
        description:
          "Update the service-specific admin status of a subject (account, record, or blob).",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["subject"],
            properties: {
              subject: {
                type: "union",
                refs: [
                  "lex:com.atproto.admin.defs#repoRef",
                  "lex:com.atproto.repo.strongRef",
                  "lex:com.atproto.admin.defs#repoBlobRef",
                ],
              },
              takedown: {
                type: "ref",
                ref: "lex:com.atproto.admin.defs#statusAttr",
              },
              deactivated: {
                type: "ref",
                ref: "lex:com.atproto.admin.defs#statusAttr",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["subject"],
            properties: {
              subject: {
                type: "union",
                refs: [
                  "lex:com.atproto.admin.defs#repoRef",
                  "lex:com.atproto.repo.strongRef",
                  "lex:com.atproto.admin.defs#repoBlobRef",
                ],
              },
              takedown: {
                type: "ref",
                ref: "lex:com.atproto.admin.defs#statusAttr",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoIdentityGetRecommendedDidCredentials: {
    lexicon: 1,
    id: "com.atproto.identity.getRecommendedDidCredentials",
    defs: {
      main: {
        type: "query",
        description:
          "Describe the credentials that should be included in the DID doc of an account that is migrating to this service.",
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {
              rotationKeys: {
                description:
                  "Recommended rotation keys for PLC dids. Should be undefined (or ignored) for did:webs.",
                type: "array",
                items: {
                  type: "string",
                },
              },
              alsoKnownAs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              verificationMethods: {
                type: "unknown",
              },
              services: {
                type: "unknown",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoIdentityRequestPlcOperationSignature: {
    lexicon: 1,
    id: "com.atproto.identity.requestPlcOperationSignature",
    defs: {
      main: {
        type: "procedure",
        description:
          "Request an email with a code to in order to request a signed PLC operation. Requires Auth.",
      },
    },
  },
  ComAtprotoIdentityResolveHandle: {
    lexicon: 1,
    id: "com.atproto.identity.resolveHandle",
    defs: {
      main: {
        type: "query",
        description: "Resolves a handle (domain name) to a DID.",
        parameters: {
          type: "params",
          required: ["handle"],
          properties: {
            handle: {
              type: "string",
              format: "handle",
              description: "The handle to resolve.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["did"],
            properties: {
              did: {
                type: "string",
                format: "did",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoIdentitySignPlcOperation: {
    lexicon: 1,
    id: "com.atproto.identity.signPlcOperation",
    defs: {
      main: {
        type: "procedure",
        description:
          "Signs a PLC operation to update some value(s) in the requesting DID's document.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {
              token: {
                description:
                  "A token received through com.atproto.identity.requestPlcOperationSignature",
                type: "string",
              },
              rotationKeys: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              alsoKnownAs: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              verificationMethods: {
                type: "unknown",
              },
              services: {
                type: "unknown",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["operation"],
            properties: {
              operation: {
                type: "unknown",
                description: "A signed DID PLC operation.",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoIdentitySubmitPlcOperation: {
    lexicon: 1,
    id: "com.atproto.identity.submitPlcOperation",
    defs: {
      main: {
        type: "procedure",
        description:
          "Validates a PLC operation to ensure that it doesn't violate a service's constraints or get the identity into a bad state, then submits it to the PLC registry",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["operation"],
            properties: {
              operation: {
                type: "unknown",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoIdentityUpdateHandle: {
    lexicon: 1,
    id: "com.atproto.identity.updateHandle",
    defs: {
      main: {
        type: "procedure",
        description:
          "Updates the current account's handle. Verifies handle validity, and updates did:plc document if necessary. Implemented by PDS, and requires auth.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["handle"],
            properties: {
              handle: {
                type: "string",
                format: "handle",
                description: "The new handle.",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoLabelDefs: {
    lexicon: 1,
    id: "com.atproto.label.defs",
    defs: {
      label: {
        type: "object",
        description:
          "Metadata tag on an atproto resource (eg, repo or record).",
        required: ["src", "uri", "val", "cts"],
        properties: {
          ver: {
            type: "integer",
            description: "The AT Protocol version of the label object.",
          },
          src: {
            type: "string",
            format: "did",
            description: "DID of the actor who created this label.",
          },
          uri: {
            type: "string",
            format: "uri",
            description:
              "AT URI of the record, repository (account), or other resource that this label applies to.",
          },
          cid: {
            type: "string",
            format: "cid",
            description:
              "Optionally, CID specifying the specific version of 'uri' resource this label applies to.",
          },
          val: {
            type: "string",
            maxLength: 128,
            description:
              "The short string name of the value or type of this label.",
          },
          neg: {
            type: "boolean",
            description:
              "If true, this is a negation label, overwriting a previous label.",
          },
          cts: {
            type: "string",
            format: "datetime",
            description: "Timestamp when this label was created.",
          },
          exp: {
            type: "string",
            format: "datetime",
            description:
              "Timestamp at which this label expires (no longer applies).",
          },
          sig: {
            type: "bytes",
            description: "Signature of dag-cbor encoded label.",
          },
        },
      },
      selfLabels: {
        type: "object",
        description:
          "Metadata tags on an atproto record, published by the author within the record.",
        required: ["values"],
        properties: {
          values: {
            type: "array",
            items: {
              type: "ref",
              ref: "lex:com.atproto.label.defs#selfLabel",
            },
            maxLength: 10,
          },
        },
      },
      selfLabel: {
        type: "object",
        description:
          "Metadata tag on an atproto record, published by the author within the record. Note that schemas should use #selfLabels, not #selfLabel.",
        required: ["val"],
        properties: {
          val: {
            type: "string",
            maxLength: 128,
            description:
              "The short string name of the value or type of this label.",
          },
        },
      },
      labelValueDefinition: {
        type: "object",
        description:
          "Declares a label value and its expected interpretations and behaviors.",
        required: ["identifier", "severity", "blurs", "locales"],
        properties: {
          identifier: {
            type: "string",
            description:
              "The value of the label being defined. Must only include lowercase ascii and the '-' character ([a-z-]+).",
            maxLength: 100,
            maxGraphemes: 100,
          },
          severity: {
            type: "string",
            description:
              "How should a client visually convey this label? 'inform' means neutral and informational; 'alert' means negative and warning; 'none' means show nothing.",
            knownValues: ["inform", "alert", "none"],
          },
          blurs: {
            type: "string",
            description:
              "What should this label hide in the UI, if applied? 'content' hides all of the target; 'media' hides the images/video/audio; 'none' hides nothing.",
            knownValues: ["content", "media", "none"],
          },
          defaultSetting: {
            type: "string",
            description: "The default setting for this label.",
            knownValues: ["ignore", "warn", "hide"],
            default: "warn",
          },
          adultOnly: {
            type: "boolean",
            description:
              "Does the user need to have adult content enabled in order to configure this label?",
          },
          locales: {
            type: "array",
            items: {
              type: "ref",
              ref: "lex:com.atproto.label.defs#labelValueDefinitionStrings",
            },
          },
        },
      },
      labelValueDefinitionStrings: {
        type: "object",
        description:
          "Strings which describe the label in the UI, localized into a specific language.",
        required: ["lang", "name", "description"],
        properties: {
          lang: {
            type: "string",
            description:
              "The code of the language these strings are written in.",
            format: "language",
          },
          name: {
            type: "string",
            description: "A short human-readable name for the label.",
            maxGraphemes: 64,
            maxLength: 640,
          },
          description: {
            type: "string",
            description:
              "A longer description of what the label means and why it might be applied.",
            maxGraphemes: 10000,
            maxLength: 100000,
          },
        },
      },
      labelValue: {
        type: "string",
        knownValues: [
          "!hide",
          "!no-promote",
          "!warn",
          "!no-unauthenticated",
          "dmca-violation",
          "doxxing",
          "porn",
          "sexual",
          "nudity",
          "nsfl",
          "gore",
        ],
      },
    },
  },
  ComAtprotoLabelQueryLabels: {
    lexicon: 1,
    id: "com.atproto.label.queryLabels",
    defs: {
      main: {
        type: "query",
        description:
          "Find labels relevant to the provided AT-URI patterns. Public endpoint for moderation services, though may return different or additional results with auth.",
        parameters: {
          type: "params",
          required: ["uriPatterns"],
          properties: {
            uriPatterns: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "List of AT URI patterns to match (boolean 'OR'). Each may be a prefix (ending with '*'; will match inclusive of the string leading to '*'), or a full URI.",
            },
            sources: {
              type: "array",
              items: {
                type: "string",
                format: "did",
              },
              description:
                "Optional list of label sources (DIDs) to filter on.",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 250,
              default: 50,
            },
            cursor: {
              type: "string",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["labels"],
            properties: {
              cursor: {
                type: "string",
              },
              labels: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.label.defs#label",
                },
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoLabelSubscribeLabels: {
    lexicon: 1,
    id: "com.atproto.label.subscribeLabels",
    defs: {
      main: {
        type: "subscription",
        description:
          "Subscribe to stream of labels (and negations). Public endpoint implemented by mod services. Uses same sequencing scheme as repo event stream.",
        parameters: {
          type: "params",
          properties: {
            cursor: {
              type: "integer",
              description: "The last known event seq number to backfill from.",
            },
          },
        },
        message: {
          schema: {
            type: "union",
            refs: [
              "lex:com.atproto.label.subscribeLabels#labels",
              "lex:com.atproto.label.subscribeLabels#info",
            ],
          },
        },
        errors: [
          {
            name: "FutureCursor",
          },
        ],
      },
      labels: {
        type: "object",
        required: ["seq", "labels"],
        properties: {
          seq: {
            type: "integer",
          },
          labels: {
            type: "array",
            items: {
              type: "ref",
              ref: "lex:com.atproto.label.defs#label",
            },
          },
        },
      },
      info: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            knownValues: ["OutdatedCursor"],
          },
          message: {
            type: "string",
          },
        },
      },
    },
  },
  ComAtprotoModerationCreateReport: {
    lexicon: 1,
    id: "com.atproto.moderation.createReport",
    defs: {
      main: {
        type: "procedure",
        description:
          "Submit a moderation report regarding an atproto account or record. Implemented by moderation services (with PDS proxying), and requires auth.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["reasonType", "subject"],
            properties: {
              reasonType: {
                type: "ref",
                description:
                  "Indicates the broad category of violation the report is for.",
                ref: "lex:com.atproto.moderation.defs#reasonType",
              },
              reason: {
                type: "string",
                maxGraphemes: 2000,
                maxLength: 20000,
                description:
                  "Additional context about the content and violation.",
              },
              subject: {
                type: "union",
                refs: [
                  "lex:com.atproto.admin.defs#repoRef",
                  "lex:com.atproto.repo.strongRef",
                ],
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: [
              "id",
              "reasonType",
              "subject",
              "reportedBy",
              "createdAt",
            ],
            properties: {
              id: {
                type: "integer",
              },
              reasonType: {
                type: "ref",
                ref: "lex:com.atproto.moderation.defs#reasonType",
              },
              reason: {
                type: "string",
                maxGraphemes: 2000,
                maxLength: 20000,
              },
              subject: {
                type: "union",
                refs: [
                  "lex:com.atproto.admin.defs#repoRef",
                  "lex:com.atproto.repo.strongRef",
                ],
              },
              reportedBy: {
                type: "string",
                format: "did",
              },
              createdAt: {
                type: "string",
                format: "datetime",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoModerationDefs: {
    lexicon: 1,
    id: "com.atproto.moderation.defs",
    defs: {
      reasonType: {
        type: "string",
        knownValues: [
          "com.atproto.moderation.defs#reasonSpam",
          "com.atproto.moderation.defs#reasonViolation",
          "com.atproto.moderation.defs#reasonMisleading",
          "com.atproto.moderation.defs#reasonSexual",
          "com.atproto.moderation.defs#reasonRude",
          "com.atproto.moderation.defs#reasonOther",
          "com.atproto.moderation.defs#reasonAppeal",
        ],
      },
      reasonSpam: {
        type: "token",
        description: "Spam: frequent unwanted promotion, replies, mentions",
      },
      reasonViolation: {
        type: "token",
        description: "Direct violation of server rules, laws, terms of service",
      },
      reasonMisleading: {
        type: "token",
        description: "Misleading identity, affiliation, or content",
      },
      reasonSexual: {
        type: "token",
        description: "Unwanted or mislabeled sexual content",
      },
      reasonRude: {
        type: "token",
        description:
          "Rude, harassing, explicit, or otherwise unwelcoming behavior",
      },
      reasonOther: {
        type: "token",
        description: "Other: reports not falling under another report category",
      },
      reasonAppeal: {
        type: "token",
        description: "Appeal: appeal a previously taken moderation action",
      },
    },
  },
  ComAtprotoRepoApplyWrites: {
    lexicon: 1,
    id: "com.atproto.repo.applyWrites",
    defs: {
      main: {
        type: "procedure",
        description:
          "Apply a batch transaction of repository creates, updates, and deletes. Requires auth, implemented by PDS.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["repo", "writes"],
            properties: {
              repo: {
                type: "string",
                format: "at-identifier",
                description:
                  "The handle or DID of the repo (aka, current account).",
              },
              validate: {
                type: "boolean",
                description:
                  "Can be set to 'false' to skip Lexicon schema validation of record data across all operations, 'true' to require it, or leave unset to validate only for known Lexicons.",
              },
              writes: {
                type: "array",
                items: {
                  type: "union",
                  refs: [
                    "lex:com.atproto.repo.applyWrites#create",
                    "lex:com.atproto.repo.applyWrites#update",
                    "lex:com.atproto.repo.applyWrites#delete",
                  ],
                  closed: true,
                },
              },
              swapCommit: {
                type: "string",
                description:
                  "If provided, the entire operation will fail if the current repo commit CID does not match this value. Used to prevent conflicting repo mutations.",
                format: "cid",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: [],
            properties: {
              commit: {
                type: "ref",
                ref: "lex:com.atproto.repo.defs#commitMeta",
              },
              results: {
                type: "array",
                items: {
                  type: "union",
                  refs: [
                    "lex:com.atproto.repo.applyWrites#createResult",
                    "lex:com.atproto.repo.applyWrites#updateResult",
                    "lex:com.atproto.repo.applyWrites#deleteResult",
                  ],
                  closed: true,
                },
              },
            },
          },
        },
        errors: [
          {
            name: "InvalidSwap",
            description:
              "Indicates that the 'swapCommit' parameter did not match current commit.",
          },
        ],
      },
      create: {
        type: "object",
        description: "Operation which creates a new record.",
        required: ["collection", "value"],
        properties: {
          collection: {
            type: "string",
            format: "nsid",
          },
          rkey: {
            type: "string",
            maxLength: 512,
          },
          value: {
            type: "unknown",
          },
        },
      },
      update: {
        type: "object",
        description: "Operation which updates an existing record.",
        required: ["collection", "rkey", "value"],
        properties: {
          collection: {
            type: "string",
            format: "nsid",
          },
          rkey: {
            type: "string",
          },
          value: {
            type: "unknown",
          },
        },
      },
      delete: {
        type: "object",
        description: "Operation which deletes an existing record.",
        required: ["collection", "rkey"],
        properties: {
          collection: {
            type: "string",
            format: "nsid",
          },
          rkey: {
            type: "string",
          },
        },
      },
      createResult: {
        type: "object",
        required: ["uri", "cid"],
        properties: {
          uri: {
            type: "string",
            format: "at-uri",
          },
          cid: {
            type: "string",
            format: "cid",
          },
          validationStatus: {
            type: "string",
            knownValues: ["valid", "unknown"],
          },
        },
      },
      updateResult: {
        type: "object",
        required: ["uri", "cid"],
        properties: {
          uri: {
            type: "string",
            format: "at-uri",
          },
          cid: {
            type: "string",
            format: "cid",
          },
          validationStatus: {
            type: "string",
            knownValues: ["valid", "unknown"],
          },
        },
      },
      deleteResult: {
        type: "object",
        required: [],
        properties: {},
      },
    },
  },
  ComAtprotoRepoCreateRecord: {
    lexicon: 1,
    id: "com.atproto.repo.createRecord",
    defs: {
      main: {
        type: "procedure",
        description:
          "Create a single new repository record. Requires auth, implemented by PDS.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["repo", "collection", "record"],
            properties: {
              repo: {
                type: "string",
                format: "at-identifier",
                description:
                  "The handle or DID of the repo (aka, current account).",
              },
              collection: {
                type: "string",
                format: "nsid",
                description: "The NSID of the record collection.",
              },
              rkey: {
                type: "string",
                description: "The Record Key.",
                maxLength: 512,
              },
              validate: {
                type: "boolean",
                description:
                  "Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons.",
              },
              record: {
                type: "unknown",
                description: "The record itself. Must contain a $type field.",
              },
              swapCommit: {
                type: "string",
                format: "cid",
                description:
                  "Compare and swap with the previous commit by CID.",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["uri", "cid"],
            properties: {
              uri: {
                type: "string",
                format: "at-uri",
              },
              cid: {
                type: "string",
                format: "cid",
              },
              commit: {
                type: "ref",
                ref: "lex:com.atproto.repo.defs#commitMeta",
              },
              validationStatus: {
                type: "string",
                knownValues: ["valid", "unknown"],
              },
            },
          },
        },
        errors: [
          {
            name: "InvalidSwap",
            description:
              "Indicates that 'swapCommit' didn't match current repo commit.",
          },
        ],
      },
    },
  },
  ComAtprotoRepoDefs: {
    lexicon: 1,
    id: "com.atproto.repo.defs",
    defs: {
      commitMeta: {
        type: "object",
        required: ["cid", "rev"],
        properties: {
          cid: {
            type: "string",
            format: "cid",
          },
          rev: {
            type: "string",
          },
        },
      },
    },
  },
  ComAtprotoRepoDeleteRecord: {
    lexicon: 1,
    id: "com.atproto.repo.deleteRecord",
    defs: {
      main: {
        type: "procedure",
        description:
          "Delete a repository record, or ensure it doesn't exist. Requires auth, implemented by PDS.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["repo", "collection", "rkey"],
            properties: {
              repo: {
                type: "string",
                format: "at-identifier",
                description:
                  "The handle or DID of the repo (aka, current account).",
              },
              collection: {
                type: "string",
                format: "nsid",
                description: "The NSID of the record collection.",
              },
              rkey: {
                type: "string",
                description: "The Record Key.",
              },
              swapRecord: {
                type: "string",
                format: "cid",
                description:
                  "Compare and swap with the previous record by CID.",
              },
              swapCommit: {
                type: "string",
                format: "cid",
                description:
                  "Compare and swap with the previous commit by CID.",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {
              commit: {
                type: "ref",
                ref: "lex:com.atproto.repo.defs#commitMeta",
              },
            },
          },
        },
        errors: [
          {
            name: "InvalidSwap",
          },
        ],
      },
    },
  },
  ComAtprotoRepoDescribeRepo: {
    lexicon: 1,
    id: "com.atproto.repo.describeRepo",
    defs: {
      main: {
        type: "query",
        description:
          "Get information about an account and repository, including the list of collections. Does not require auth.",
        parameters: {
          type: "params",
          required: ["repo"],
          properties: {
            repo: {
              type: "string",
              format: "at-identifier",
              description: "The handle or DID of the repo.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: [
              "handle",
              "did",
              "didDoc",
              "collections",
              "handleIsCorrect",
            ],
            properties: {
              handle: {
                type: "string",
                format: "handle",
              },
              did: {
                type: "string",
                format: "did",
              },
              didDoc: {
                type: "unknown",
                description: "The complete DID document for this account.",
              },
              collections: {
                type: "array",
                description:
                  "List of all the collections (NSIDs) for which this repo contains at least one record.",
                items: {
                  type: "string",
                  format: "nsid",
                },
              },
              handleIsCorrect: {
                type: "boolean",
                description:
                  "Indicates if handle is currently valid (resolves bi-directionally)",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoRepoGetRecord: {
    lexicon: 1,
    id: "com.atproto.repo.getRecord",
    defs: {
      main: {
        type: "query",
        description:
          "Get a single record from a repository. Does not require auth.",
        parameters: {
          type: "params",
          required: ["repo", "collection", "rkey"],
          properties: {
            repo: {
              type: "string",
              format: "at-identifier",
              description: "The handle or DID of the repo.",
            },
            collection: {
              type: "string",
              format: "nsid",
              description: "The NSID of the record collection.",
            },
            rkey: {
              type: "string",
              description: "The Record Key.",
            },
            cid: {
              type: "string",
              format: "cid",
              description:
                "The CID of the version of the record. If not specified, then return the most recent version.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["uri", "value"],
            properties: {
              uri: {
                type: "string",
                format: "at-uri",
              },
              cid: {
                type: "string",
                format: "cid",
              },
              value: {
                type: "unknown",
              },
            },
          },
        },
        errors: [
          {
            name: "RecordNotFound",
          },
        ],
      },
    },
  },
  ComAtprotoRepoImportRepo: {
    lexicon: 1,
    id: "com.atproto.repo.importRepo",
    defs: {
      main: {
        type: "procedure",
        description:
          "Import a repo in the form of a CAR file. Requires Content-Length HTTP header to be set.",
        input: {
          encoding: "application/vnd.ipld.car",
        },
      },
    },
  },
  ComAtprotoRepoListMissingBlobs: {
    lexicon: 1,
    id: "com.atproto.repo.listMissingBlobs",
    defs: {
      main: {
        type: "query",
        description:
          "Returns a list of missing blobs for the requesting account. Intended to be used in the account migration flow.",
        parameters: {
          type: "params",
          properties: {
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 1000,
              default: 500,
            },
            cursor: {
              type: "string",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["blobs"],
            properties: {
              cursor: {
                type: "string",
              },
              blobs: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.repo.listMissingBlobs#recordBlob",
                },
              },
            },
          },
        },
      },
      recordBlob: {
        type: "object",
        required: ["cid", "recordUri"],
        properties: {
          cid: {
            type: "string",
            format: "cid",
          },
          recordUri: {
            type: "string",
            format: "at-uri",
          },
        },
      },
    },
  },
  ComAtprotoRepoListRecords: {
    lexicon: 1,
    id: "com.atproto.repo.listRecords",
    defs: {
      main: {
        type: "query",
        description:
          "List a range of records in a repository, matching a specific collection. Does not require auth.",
        parameters: {
          type: "params",
          required: ["repo", "collection"],
          properties: {
            repo: {
              type: "string",
              format: "at-identifier",
              description: "The handle or DID of the repo.",
            },
            collection: {
              type: "string",
              format: "nsid",
              description: "The NSID of the record type.",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 50,
              description: "The number of records to return.",
            },
            cursor: {
              type: "string",
            },
            rkeyStart: {
              type: "string",
              description:
                "DEPRECATED: The lowest sort-ordered rkey to start from (exclusive)",
            },
            rkeyEnd: {
              type: "string",
              description:
                "DEPRECATED: The highest sort-ordered rkey to stop at (exclusive)",
            },
            reverse: {
              type: "boolean",
              description: "Flag to reverse the order of the returned records.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["records"],
            properties: {
              cursor: {
                type: "string",
              },
              records: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.repo.listRecords#record",
                },
              },
            },
          },
        },
      },
      record: {
        type: "object",
        required: ["uri", "cid", "value"],
        properties: {
          uri: {
            type: "string",
            format: "at-uri",
          },
          cid: {
            type: "string",
            format: "cid",
          },
          value: {
            type: "unknown",
          },
        },
      },
    },
  },
  ComAtprotoRepoPutRecord: {
    lexicon: 1,
    id: "com.atproto.repo.putRecord",
    defs: {
      main: {
        type: "procedure",
        description:
          "Write a repository record, creating or updating it as needed. Requires auth, implemented by PDS.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["repo", "collection", "rkey", "record"],
            nullable: ["swapRecord"],
            properties: {
              repo: {
                type: "string",
                format: "at-identifier",
                description:
                  "The handle or DID of the repo (aka, current account).",
              },
              collection: {
                type: "string",
                format: "nsid",
                description: "The NSID of the record collection.",
              },
              rkey: {
                type: "string",
                description: "The Record Key.",
                maxLength: 512,
              },
              validate: {
                type: "boolean",
                description:
                  "Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons.",
              },
              record: {
                type: "unknown",
                description: "The record to write.",
              },
              swapRecord: {
                type: "string",
                format: "cid",
                description:
                  "Compare and swap with the previous record by CID. WARNING: nullable and optional field; may cause problems with golang implementation",
              },
              swapCommit: {
                type: "string",
                format: "cid",
                description:
                  "Compare and swap with the previous commit by CID.",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["uri", "cid"],
            properties: {
              uri: {
                type: "string",
                format: "at-uri",
              },
              cid: {
                type: "string",
                format: "cid",
              },
              commit: {
                type: "ref",
                ref: "lex:com.atproto.repo.defs#commitMeta",
              },
              validationStatus: {
                type: "string",
                knownValues: ["valid", "unknown"],
              },
            },
          },
        },
        errors: [
          {
            name: "InvalidSwap",
          },
        ],
      },
    },
  },
  ComAtprotoRepoStrongRef: {
    lexicon: 1,
    id: "com.atproto.repo.strongRef",
    description: "A URI with a content-hash fingerprint.",
    defs: {
      main: {
        type: "object",
        required: ["uri", "cid"],
        properties: {
          uri: {
            type: "string",
            format: "at-uri",
          },
          cid: {
            type: "string",
            format: "cid",
          },
        },
      },
    },
  },
  ComAtprotoRepoUploadBlob: {
    lexicon: 1,
    id: "com.atproto.repo.uploadBlob",
    defs: {
      main: {
        type: "procedure",
        description:
          "Upload a new blob, to be referenced from a repository record. The blob will be deleted if it is not referenced within a time window (eg, minutes). Blob restrictions (mimetype, size, etc) are enforced when the reference is created. Requires auth, implemented by PDS.",
        input: {
          encoding: "*/*",
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["blob"],
            properties: {
              blob: {
                type: "blob",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerActivateAccount: {
    lexicon: 1,
    id: "com.atproto.server.activateAccount",
    defs: {
      main: {
        type: "procedure",
        description:
          "Activates a currently deactivated account. Used to finalize account migration after the account's repo is imported and identity is setup.",
      },
    },
  },
  ComAtprotoServerCheckAccountStatus: {
    lexicon: 1,
    id: "com.atproto.server.checkAccountStatus",
    defs: {
      main: {
        type: "query",
        description:
          "Returns the status of an account, especially as pertaining to import or recovery. Can be called many times over the course of an account migration. Requires auth and can only be called pertaining to oneself.",
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: [
              "activated",
              "validDid",
              "repoCommit",
              "repoRev",
              "repoBlocks",
              "indexedRecords",
              "privateStateValues",
              "expectedBlobs",
              "importedBlobs",
            ],
            properties: {
              activated: {
                type: "boolean",
              },
              validDid: {
                type: "boolean",
              },
              repoCommit: {
                type: "string",
                format: "cid",
              },
              repoRev: {
                type: "string",
              },
              repoBlocks: {
                type: "integer",
              },
              indexedRecords: {
                type: "integer",
              },
              privateStateValues: {
                type: "integer",
              },
              expectedBlobs: {
                type: "integer",
              },
              importedBlobs: {
                type: "integer",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerConfirmEmail: {
    lexicon: 1,
    id: "com.atproto.server.confirmEmail",
    defs: {
      main: {
        type: "procedure",
        description:
          "Confirm an email using a token from com.atproto.server.requestEmailConfirmation.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["email", "token"],
            properties: {
              email: {
                type: "string",
              },
              token: {
                type: "string",
              },
            },
          },
        },
        errors: [
          {
            name: "AccountNotFound",
          },
          {
            name: "ExpiredToken",
          },
          {
            name: "InvalidToken",
          },
          {
            name: "InvalidEmail",
          },
        ],
      },
    },
  },
  ComAtprotoServerCreateAccount: {
    lexicon: 1,
    id: "com.atproto.server.createAccount",
    defs: {
      main: {
        type: "procedure",
        description: "Create an account. Implemented by PDS.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["handle"],
            properties: {
              email: {
                type: "string",
              },
              handle: {
                type: "string",
                format: "handle",
                description: "Requested handle for the account.",
              },
              did: {
                type: "string",
                format: "did",
                description:
                  "Pre-existing atproto DID, being imported to a new account.",
              },
              inviteCode: {
                type: "string",
              },
              verificationCode: {
                type: "string",
              },
              verificationPhone: {
                type: "string",
              },
              password: {
                type: "string",
                description:
                  "Initial account password. May need to meet instance-specific password strength requirements.",
              },
              recoveryKey: {
                type: "string",
                description:
                  "DID PLC rotation key (aka, recovery key) to be included in PLC creation operation.",
              },
              plcOp: {
                type: "unknown",
                description:
                  "A signed DID PLC operation to be submitted as part of importing an existing account to this instance. NOTE: this optional field may be updated when full account migration is implemented.",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            description:
              "Account login session returned on successful account creation.",
            required: ["accessJwt", "refreshJwt", "handle", "did"],
            properties: {
              accessJwt: {
                type: "string",
              },
              refreshJwt: {
                type: "string",
              },
              handle: {
                type: "string",
                format: "handle",
              },
              did: {
                type: "string",
                format: "did",
                description: "The DID of the new account.",
              },
              didDoc: {
                type: "unknown",
                description: "Complete DID document.",
              },
            },
          },
        },
        errors: [
          {
            name: "InvalidHandle",
          },
          {
            name: "InvalidPassword",
          },
          {
            name: "InvalidInviteCode",
          },
          {
            name: "HandleNotAvailable",
          },
          {
            name: "UnsupportedDomain",
          },
          {
            name: "UnresolvableDid",
          },
          {
            name: "IncompatibleDidDoc",
          },
        ],
      },
    },
  },
  ComAtprotoServerCreateAppPassword: {
    lexicon: 1,
    id: "com.atproto.server.createAppPassword",
    defs: {
      main: {
        type: "procedure",
        description: "Create an App Password.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["name"],
            properties: {
              name: {
                type: "string",
                description:
                  "A short name for the App Password, to help distinguish them.",
              },
              privileged: {
                type: "boolean",
                description:
                  "If an app password has 'privileged' access to possibly sensitive account state. Meant for use with trusted clients.",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "ref",
            ref: "lex:com.atproto.server.createAppPassword#appPassword",
          },
        },
        errors: [
          {
            name: "AccountTakedown",
          },
        ],
      },
      appPassword: {
        type: "object",
        required: ["name", "password", "createdAt"],
        properties: {
          name: {
            type: "string",
          },
          password: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "datetime",
          },
          privileged: {
            type: "boolean",
          },
        },
      },
    },
  },
  ComAtprotoServerCreateInviteCode: {
    lexicon: 1,
    id: "com.atproto.server.createInviteCode",
    defs: {
      main: {
        type: "procedure",
        description: "Create an invite code.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["useCount"],
            properties: {
              useCount: {
                type: "integer",
              },
              forAccount: {
                type: "string",
                format: "did",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["code"],
            properties: {
              code: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerCreateInviteCodes: {
    lexicon: 1,
    id: "com.atproto.server.createInviteCodes",
    defs: {
      main: {
        type: "procedure",
        description: "Create invite codes.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["codeCount", "useCount"],
            properties: {
              codeCount: {
                type: "integer",
                default: 1,
              },
              useCount: {
                type: "integer",
              },
              forAccounts: {
                type: "array",
                items: {
                  type: "string",
                  format: "did",
                },
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["codes"],
            properties: {
              codes: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.server.createInviteCodes#accountCodes",
                },
              },
            },
          },
        },
      },
      accountCodes: {
        type: "object",
        required: ["account", "codes"],
        properties: {
          account: {
            type: "string",
          },
          codes: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },
  },
  ComAtprotoServerCreateSession: {
    lexicon: 1,
    id: "com.atproto.server.createSession",
    defs: {
      main: {
        type: "procedure",
        description: "Create an authentication session.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["identifier", "password"],
            properties: {
              identifier: {
                type: "string",
                description:
                  "Handle or other identifier supported by the server for the authenticating user.",
              },
              password: {
                type: "string",
              },
              authFactorToken: {
                type: "string",
              },
              allowTakendown: {
                type: "boolean",
                description:
                  "When true, instead of throwing error for takendown accounts, a valid response with a narrow scoped token will be returned",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["accessJwt", "refreshJwt", "handle", "did"],
            properties: {
              accessJwt: {
                type: "string",
              },
              refreshJwt: {
                type: "string",
              },
              handle: {
                type: "string",
                format: "handle",
              },
              did: {
                type: "string",
                format: "did",
              },
              didDoc: {
                type: "unknown",
              },
              email: {
                type: "string",
              },
              emailConfirmed: {
                type: "boolean",
              },
              emailAuthFactor: {
                type: "boolean",
              },
              active: {
                type: "boolean",
              },
              status: {
                type: "string",
                description:
                  "If active=false, this optional field indicates a possible reason for why the account is not active. If active=false and no status is supplied, then the host makes no claim for why the repository is no longer being hosted.",
                knownValues: ["takendown", "suspended", "deactivated"],
              },
            },
          },
        },
        errors: [
          {
            name: "AccountTakedown",
          },
          {
            name: "AuthFactorTokenRequired",
          },
        ],
      },
    },
  },
  ComAtprotoServerDeactivateAccount: {
    lexicon: 1,
    id: "com.atproto.server.deactivateAccount",
    defs: {
      main: {
        type: "procedure",
        description:
          "Deactivates a currently active account. Stops serving of repo, and future writes to repo until reactivated. Used to finalize account migration with the old host after the account has been activated on the new host.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {
              deleteAfter: {
                type: "string",
                format: "datetime",
                description:
                  "A recommendation to server as to how long they should hold onto the deactivated account before deleting.",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerDefs: {
    lexicon: 1,
    id: "com.atproto.server.defs",
    defs: {
      inviteCode: {
        type: "object",
        required: [
          "code",
          "available",
          "disabled",
          "forAccount",
          "createdBy",
          "createdAt",
          "uses",
        ],
        properties: {
          code: {
            type: "string",
          },
          available: {
            type: "integer",
          },
          disabled: {
            type: "boolean",
          },
          forAccount: {
            type: "string",
          },
          createdBy: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "datetime",
          },
          uses: {
            type: "array",
            items: {
              type: "ref",
              ref: "lex:com.atproto.server.defs#inviteCodeUse",
            },
          },
        },
      },
      inviteCodeUse: {
        type: "object",
        required: ["usedBy", "usedAt"],
        properties: {
          usedBy: {
            type: "string",
            format: "did",
          },
          usedAt: {
            type: "string",
            format: "datetime",
          },
        },
      },
    },
  },
  ComAtprotoServerDeleteAccount: {
    lexicon: 1,
    id: "com.atproto.server.deleteAccount",
    defs: {
      main: {
        type: "procedure",
        description:
          "Delete an actor's account with a token and password. Can only be called after requesting a deletion token. Requires auth.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["did", "password", "token"],
            properties: {
              did: {
                type: "string",
                format: "did",
              },
              password: {
                type: "string",
              },
              token: {
                type: "string",
              },
            },
          },
        },
        errors: [
          {
            name: "ExpiredToken",
          },
          {
            name: "InvalidToken",
          },
        ],
      },
    },
  },
  ComAtprotoServerDeleteSession: {
    lexicon: 1,
    id: "com.atproto.server.deleteSession",
    defs: {
      main: {
        type: "procedure",
        description: "Delete the current session. Requires auth.",
      },
    },
  },
  ComAtprotoServerDescribeServer: {
    lexicon: 1,
    id: "com.atproto.server.describeServer",
    defs: {
      main: {
        type: "query",
        description:
          "Describes the server's account creation requirements and capabilities. Implemented by PDS.",
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["did", "availableUserDomains"],
            properties: {
              inviteCodeRequired: {
                type: "boolean",
                description:
                  "If true, an invite code must be supplied to create an account on this instance.",
              },
              phoneVerificationRequired: {
                type: "boolean",
                description:
                  "If true, a phone verification token must be supplied to create an account on this instance.",
              },
              availableUserDomains: {
                type: "array",
                description:
                  "List of domain suffixes that can be used in account handles.",
                items: {
                  type: "string",
                },
              },
              links: {
                type: "ref",
                description: "URLs of service policy documents.",
                ref: "lex:com.atproto.server.describeServer#links",
              },
              contact: {
                type: "ref",
                description: "Contact information",
                ref: "lex:com.atproto.server.describeServer#contact",
              },
              did: {
                type: "string",
                format: "did",
              },
            },
          },
        },
      },
      links: {
        type: "object",
        properties: {
          privacyPolicy: {
            type: "string",
            format: "uri",
          },
          termsOfService: {
            type: "string",
            format: "uri",
          },
        },
      },
      contact: {
        type: "object",
        properties: {
          email: {
            type: "string",
          },
        },
      },
    },
  },
  ComAtprotoServerGetAccountInviteCodes: {
    lexicon: 1,
    id: "com.atproto.server.getAccountInviteCodes",
    defs: {
      main: {
        type: "query",
        description:
          "Get all invite codes for the current account. Requires auth.",
        parameters: {
          type: "params",
          properties: {
            includeUsed: {
              type: "boolean",
              default: true,
            },
            createAvailable: {
              type: "boolean",
              default: true,
              description:
                "Controls whether any new 'earned' but not 'created' invites should be created.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["codes"],
            properties: {
              codes: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.server.defs#inviteCode",
                },
              },
            },
          },
        },
        errors: [
          {
            name: "DuplicateCreate",
          },
        ],
      },
    },
  },
  ComAtprotoServerGetServiceAuth: {
    lexicon: 1,
    id: "com.atproto.server.getServiceAuth",
    defs: {
      main: {
        type: "query",
        description:
          "Get a signed token on behalf of the requesting DID for the requested service.",
        parameters: {
          type: "params",
          required: ["aud"],
          properties: {
            aud: {
              type: "string",
              format: "did",
              description:
                "The DID of the service that the token will be used to authenticate with",
            },
            exp: {
              type: "integer",
              description:
                "The time in Unix Epoch seconds that the JWT expires. Defaults to 60 seconds in the future. The service may enforce certain time bounds on tokens depending on the requested scope.",
            },
            lxm: {
              type: "string",
              format: "nsid",
              description:
                "Lexicon (XRPC) method to bind the requested token to",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["token"],
            properties: {
              token: {
                type: "string",
              },
            },
          },
        },
        errors: [
          {
            name: "BadExpiration",
            description:
              "Indicates that the requested expiration date is not a valid. May be in the past or may be reliant on the requested scopes.",
          },
        ],
      },
    },
  },
  ComAtprotoServerGetSession: {
    lexicon: 1,
    id: "com.atproto.server.getSession",
    defs: {
      main: {
        type: "query",
        description:
          "Get information about the current auth session. Requires auth.",
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["handle", "did"],
            properties: {
              handle: {
                type: "string",
                format: "handle",
              },
              did: {
                type: "string",
                format: "did",
              },
              email: {
                type: "string",
              },
              emailConfirmed: {
                type: "boolean",
              },
              emailAuthFactor: {
                type: "boolean",
              },
              didDoc: {
                type: "unknown",
              },
              active: {
                type: "boolean",
              },
              status: {
                type: "string",
                description:
                  "If active=false, this optional field indicates a possible reason for why the account is not active. If active=false and no status is supplied, then the host makes no claim for why the repository is no longer being hosted.",
                knownValues: ["takendown", "suspended", "deactivated"],
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerListAppPasswords: {
    lexicon: 1,
    id: "com.atproto.server.listAppPasswords",
    defs: {
      main: {
        type: "query",
        description: "List all App Passwords.",
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["passwords"],
            properties: {
              passwords: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.server.listAppPasswords#appPassword",
                },
              },
            },
          },
        },
        errors: [
          {
            name: "AccountTakedown",
          },
        ],
      },
      appPassword: {
        type: "object",
        required: ["name", "createdAt"],
        properties: {
          name: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "datetime",
          },
          privileged: {
            type: "boolean",
          },
        },
      },
    },
  },
  ComAtprotoServerRefreshSession: {
    lexicon: 1,
    id: "com.atproto.server.refreshSession",
    defs: {
      main: {
        type: "procedure",
        description:
          "Refresh an authentication session. Requires auth using the 'refreshJwt' (not the 'accessJwt').",
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["accessJwt", "refreshJwt", "handle", "did"],
            properties: {
              accessJwt: {
                type: "string",
              },
              refreshJwt: {
                type: "string",
              },
              handle: {
                type: "string",
                format: "handle",
              },
              did: {
                type: "string",
                format: "did",
              },
              didDoc: {
                type: "unknown",
              },
              active: {
                type: "boolean",
              },
              status: {
                type: "string",
                description:
                  "Hosting status of the account. If not specified, then assume 'active'.",
                knownValues: ["takendown", "suspended", "deactivated"],
              },
            },
          },
        },
        errors: [
          {
            name: "AccountTakedown",
          },
        ],
      },
    },
  },
  ComAtprotoServerRequestAccountDelete: {
    lexicon: 1,
    id: "com.atproto.server.requestAccountDelete",
    defs: {
      main: {
        type: "procedure",
        description: "Initiate a user account deletion via email.",
      },
    },
  },
  ComAtprotoServerRequestEmailConfirmation: {
    lexicon: 1,
    id: "com.atproto.server.requestEmailConfirmation",
    defs: {
      main: {
        type: "procedure",
        description:
          "Request an email with a code to confirm ownership of email.",
      },
    },
  },
  ComAtprotoServerRequestEmailUpdate: {
    lexicon: 1,
    id: "com.atproto.server.requestEmailUpdate",
    defs: {
      main: {
        type: "procedure",
        description: "Request a token in order to update email.",
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["tokenRequired"],
            properties: {
              tokenRequired: {
                type: "boolean",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerRequestPasswordReset: {
    lexicon: 1,
    id: "com.atproto.server.requestPasswordReset",
    defs: {
      main: {
        type: "procedure",
        description: "Initiate a user account password reset via email.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["email"],
            properties: {
              email: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerReserveSigningKey: {
    lexicon: 1,
    id: "com.atproto.server.reserveSigningKey",
    defs: {
      main: {
        type: "procedure",
        description:
          "Reserve a repo signing key, for use with account creation. Necessary so that a DID PLC update operation can be constructed during an account migraiton. Public and does not require auth; implemented by PDS. NOTE: this endpoint may change when full account migration is implemented.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {
              did: {
                type: "string",
                format: "did",
                description: "The DID to reserve a key for.",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["signingKey"],
            properties: {
              signingKey: {
                type: "string",
                description:
                  "The public key for the reserved signing key, in did:key serialization.",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerResetPassword: {
    lexicon: 1,
    id: "com.atproto.server.resetPassword",
    defs: {
      main: {
        type: "procedure",
        description: "Reset a user account password using a token.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["token", "password"],
            properties: {
              token: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
          },
        },
        errors: [
          {
            name: "ExpiredToken",
          },
          {
            name: "InvalidToken",
          },
        ],
      },
    },
  },
  ComAtprotoServerRevokeAppPassword: {
    lexicon: 1,
    id: "com.atproto.server.revokeAppPassword",
    defs: {
      main: {
        type: "procedure",
        description: "Revoke an App Password by name.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["name"],
            properties: {
              name: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoServerUpdateEmail: {
    lexicon: 1,
    id: "com.atproto.server.updateEmail",
    defs: {
      main: {
        type: "procedure",
        description: "Update an account's email.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["email"],
            properties: {
              email: {
                type: "string",
              },
              emailAuthFactor: {
                type: "boolean",
              },
              token: {
                type: "string",
                description:
                  "Requires a token from com.atproto.sever.requestEmailUpdate if the account's email has been confirmed.",
              },
            },
          },
        },
        errors: [
          {
            name: "ExpiredToken",
          },
          {
            name: "InvalidToken",
          },
          {
            name: "TokenRequired",
          },
        ],
      },
    },
  },
  ComAtprotoSyncGetBlob: {
    lexicon: 1,
    id: "com.atproto.sync.getBlob",
    defs: {
      main: {
        type: "query",
        description:
          "Get a blob associated with a given account. Returns the full blob as originally uploaded. Does not require auth; implemented by PDS.",
        parameters: {
          type: "params",
          required: ["did", "cid"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the account.",
            },
            cid: {
              type: "string",
              format: "cid",
              description: "The CID of the blob to fetch",
            },
          },
        },
        output: {
          encoding: "*/*",
        },
        errors: [
          {
            name: "BlobNotFound",
          },
          {
            name: "RepoNotFound",
          },
          {
            name: "RepoTakendown",
          },
          {
            name: "RepoSuspended",
          },
          {
            name: "RepoDeactivated",
          },
        ],
      },
    },
  },
  ComAtprotoSyncGetBlocks: {
    lexicon: 1,
    id: "com.atproto.sync.getBlocks",
    defs: {
      main: {
        type: "query",
        description:
          "Get data blocks from a given repo, by CID. For example, intermediate MST nodes, or records. Does not require auth; implemented by PDS.",
        parameters: {
          type: "params",
          required: ["did", "cids"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the repo.",
            },
            cids: {
              type: "array",
              items: {
                type: "string",
                format: "cid",
              },
            },
          },
        },
        output: {
          encoding: "application/vnd.ipld.car",
        },
        errors: [
          {
            name: "BlockNotFound",
          },
          {
            name: "RepoNotFound",
          },
          {
            name: "RepoTakendown",
          },
          {
            name: "RepoSuspended",
          },
          {
            name: "RepoDeactivated",
          },
        ],
      },
    },
  },
  ComAtprotoSyncGetCheckout: {
    lexicon: 1,
    id: "com.atproto.sync.getCheckout",
    defs: {
      main: {
        type: "query",
        description: "DEPRECATED - please use com.atproto.sync.getRepo instead",
        parameters: {
          type: "params",
          required: ["did"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the repo.",
            },
          },
        },
        output: {
          encoding: "application/vnd.ipld.car",
        },
      },
    },
  },
  ComAtprotoSyncGetHead: {
    lexicon: 1,
    id: "com.atproto.sync.getHead",
    defs: {
      main: {
        type: "query",
        description:
          "DEPRECATED - please use com.atproto.sync.getLatestCommit instead",
        parameters: {
          type: "params",
          required: ["did"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the repo.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["root"],
            properties: {
              root: {
                type: "string",
                format: "cid",
              },
            },
          },
        },
        errors: [
          {
            name: "HeadNotFound",
          },
        ],
      },
    },
  },
  ComAtprotoSyncGetLatestCommit: {
    lexicon: 1,
    id: "com.atproto.sync.getLatestCommit",
    defs: {
      main: {
        type: "query",
        description:
          "Get the current commit CID & revision of the specified repo. Does not require auth.",
        parameters: {
          type: "params",
          required: ["did"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the repo.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["cid", "rev"],
            properties: {
              cid: {
                type: "string",
                format: "cid",
              },
              rev: {
                type: "string",
              },
            },
          },
        },
        errors: [
          {
            name: "RepoNotFound",
          },
          {
            name: "RepoTakendown",
          },
          {
            name: "RepoSuspended",
          },
          {
            name: "RepoDeactivated",
          },
        ],
      },
    },
  },
  ComAtprotoSyncGetRecord: {
    lexicon: 1,
    id: "com.atproto.sync.getRecord",
    defs: {
      main: {
        type: "query",
        description:
          "Get data blocks needed to prove the existence or non-existence of record in the current version of repo. Does not require auth.",
        parameters: {
          type: "params",
          required: ["did", "collection", "rkey"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the repo.",
            },
            collection: {
              type: "string",
              format: "nsid",
            },
            rkey: {
              type: "string",
              description: "Record Key",
            },
            commit: {
              type: "string",
              format: "cid",
              description:
                "DEPRECATED: referenced a repo commit by CID, and retrieved record as of that commit",
            },
          },
        },
        output: {
          encoding: "application/vnd.ipld.car",
        },
        errors: [
          {
            name: "RecordNotFound",
          },
          {
            name: "RepoNotFound",
          },
          {
            name: "RepoTakendown",
          },
          {
            name: "RepoSuspended",
          },
          {
            name: "RepoDeactivated",
          },
        ],
      },
    },
  },
  ComAtprotoSyncGetRepo: {
    lexicon: 1,
    id: "com.atproto.sync.getRepo",
    defs: {
      main: {
        type: "query",
        description:
          "Download a repository export as CAR file. Optionally only a 'diff' since a previous revision. Does not require auth; implemented by PDS.",
        parameters: {
          type: "params",
          required: ["did"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the repo.",
            },
            since: {
              type: "string",
              description:
                "The revision ('rev') of the repo to create a diff from.",
            },
          },
        },
        output: {
          encoding: "application/vnd.ipld.car",
        },
        errors: [
          {
            name: "RepoNotFound",
          },
          {
            name: "RepoTakendown",
          },
          {
            name: "RepoSuspended",
          },
          {
            name: "RepoDeactivated",
          },
        ],
      },
    },
  },
  ComAtprotoSyncGetRepoStatus: {
    lexicon: 1,
    id: "com.atproto.sync.getRepoStatus",
    defs: {
      main: {
        type: "query",
        description:
          "Get the hosting status for a repository, on this server. Expected to be implemented by PDS and Relay.",
        parameters: {
          type: "params",
          required: ["did"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the repo.",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["did", "active"],
            properties: {
              did: {
                type: "string",
                format: "did",
              },
              active: {
                type: "boolean",
              },
              status: {
                type: "string",
                description:
                  "If active=false, this optional field indicates a possible reason for why the account is not active. If active=false and no status is supplied, then the host makes no claim for why the repository is no longer being hosted.",
                knownValues: ["takendown", "suspended", "deactivated"],
              },
              rev: {
                type: "string",
                description:
                  "Optional field, the current rev of the repo, if active=true",
              },
            },
          },
        },
        errors: [
          {
            name: "RepoNotFound",
          },
        ],
      },
    },
  },
  ComAtprotoSyncListBlobs: {
    lexicon: 1,
    id: "com.atproto.sync.listBlobs",
    defs: {
      main: {
        type: "query",
        description:
          "List blob CIDs for an account, since some repo revision. Does not require auth; implemented by PDS.",
        parameters: {
          type: "params",
          required: ["did"],
          properties: {
            did: {
              type: "string",
              format: "did",
              description: "The DID of the repo.",
            },
            since: {
              type: "string",
              description: "Optional revision of the repo to list blobs since.",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 1000,
              default: 500,
            },
            cursor: {
              type: "string",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["cids"],
            properties: {
              cursor: {
                type: "string",
              },
              cids: {
                type: "array",
                items: {
                  type: "string",
                  format: "cid",
                },
              },
            },
          },
        },
        errors: [
          {
            name: "RepoNotFound",
          },
          {
            name: "RepoTakendown",
          },
          {
            name: "RepoSuspended",
          },
          {
            name: "RepoDeactivated",
          },
        ],
      },
    },
  },
  ComAtprotoSyncListRepos: {
    lexicon: 1,
    id: "com.atproto.sync.listRepos",
    defs: {
      main: {
        type: "query",
        description:
          "Enumerates all the DID, rev, and commit CID for all repos hosted by this service. Does not require auth; implemented by PDS and Relay.",
        parameters: {
          type: "params",
          properties: {
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 1000,
              default: 500,
            },
            cursor: {
              type: "string",
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["repos"],
            properties: {
              cursor: {
                type: "string",
              },
              repos: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.sync.listRepos#repo",
                },
              },
            },
          },
        },
      },
      repo: {
        type: "object",
        required: ["did", "head", "rev"],
        properties: {
          did: {
            type: "string",
            format: "did",
          },
          head: {
            type: "string",
            format: "cid",
            description: "Current repo commit CID",
          },
          rev: {
            type: "string",
          },
          active: {
            type: "boolean",
          },
          status: {
            type: "string",
            description:
              "If active=false, this optional field indicates a possible reason for why the account is not active. If active=false and no status is supplied, then the host makes no claim for why the repository is no longer being hosted.",
            knownValues: ["takendown", "suspended", "deactivated"],
          },
        },
      },
    },
  },
  ComAtprotoSyncNotifyOfUpdate: {
    lexicon: 1,
    id: "com.atproto.sync.notifyOfUpdate",
    defs: {
      main: {
        type: "procedure",
        description:
          "Notify a crawling service of a recent update, and that crawling should resume. Intended use is after a gap between repo stream events caused the crawling service to disconnect. Does not require auth; implemented by Relay.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["hostname"],
            properties: {
              hostname: {
                type: "string",
                description:
                  "Hostname of the current service (usually a PDS) that is notifying of update.",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoSyncRequestCrawl: {
    lexicon: 1,
    id: "com.atproto.sync.requestCrawl",
    defs: {
      main: {
        type: "procedure",
        description:
          "Request a service to persistently crawl hosted repos. Expected use is new PDS instances declaring their existence to Relays. Does not require auth.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["hostname"],
            properties: {
              hostname: {
                type: "string",
                description:
                  "Hostname of the current service (eg, PDS) that is requesting to be crawled.",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoSyncSubscribeRepos: {
    lexicon: 1,
    id: "com.atproto.sync.subscribeRepos",
    defs: {
      main: {
        type: "subscription",
        description:
          "Repository event stream, aka Firehose endpoint. Outputs repo commits with diff data, and identity update events, for all repositories on the current server. See the atproto specifications for details around stream sequencing, repo versioning, CAR diff format, and more. Public and does not require auth; implemented by PDS and Relay.",
        parameters: {
          type: "params",
          properties: {
            cursor: {
              type: "integer",
              description: "The last known event seq number to backfill from.",
            },
          },
        },
        message: {
          schema: {
            type: "union",
            refs: [
              "lex:com.atproto.sync.subscribeRepos#commit",
              "lex:com.atproto.sync.subscribeRepos#identity",
              "lex:com.atproto.sync.subscribeRepos#account",
              "lex:com.atproto.sync.subscribeRepos#handle",
              "lex:com.atproto.sync.subscribeRepos#migrate",
              "lex:com.atproto.sync.subscribeRepos#tombstone",
              "lex:com.atproto.sync.subscribeRepos#info",
            ],
          },
        },
        errors: [
          {
            name: "FutureCursor",
          },
          {
            name: "ConsumerTooSlow",
            description:
              "If the consumer of the stream can not keep up with events, and a backlog gets too large, the server will drop the connection.",
          },
        ],
      },
      commit: {
        type: "object",
        description:
          "Represents an update of repository state. Note that empty commits are allowed, which include no repo data changes, but an update to rev and signature.",
        required: [
          "seq",
          "rebase",
          "tooBig",
          "repo",
          "commit",
          "rev",
          "since",
          "blocks",
          "ops",
          "blobs",
          "time",
        ],
        nullable: ["prev", "since"],
        properties: {
          seq: {
            type: "integer",
            description: "The stream sequence number of this message.",
          },
          rebase: {
            type: "boolean",
            description: "DEPRECATED -- unused",
          },
          tooBig: {
            type: "boolean",
            description:
              "Indicates that this commit contained too many ops, or data size was too large. Consumers will need to make a separate request to get missing data.",
          },
          repo: {
            type: "string",
            format: "did",
            description: "The repo this event comes from.",
          },
          commit: {
            type: "cid-link",
            description: "Repo commit object CID.",
          },
          prev: {
            type: "cid-link",
            description:
              "DEPRECATED -- unused. WARNING -- nullable and optional; stick with optional to ensure golang interoperability.",
          },
          rev: {
            type: "string",
            description:
              "The rev of the emitted commit. Note that this information is also in the commit object included in blocks, unless this is a tooBig event.",
          },
          since: {
            type: "string",
            description:
              "The rev of the last emitted commit from this repo (if any).",
          },
          blocks: {
            type: "bytes",
            description:
              "CAR file containing relevant blocks, as a diff since the previous repo state.",
            maxLength: 1000000,
          },
          ops: {
            type: "array",
            items: {
              type: "ref",
              ref: "lex:com.atproto.sync.subscribeRepos#repoOp",
              description:
                "List of repo mutation operations in this commit (eg, records created, updated, or deleted).",
            },
            maxLength: 200,
          },
          blobs: {
            type: "array",
            items: {
              type: "cid-link",
              description:
                "List of new blobs (by CID) referenced by records in this commit.",
            },
          },
          time: {
            type: "string",
            format: "datetime",
            description:
              "Timestamp of when this message was originally broadcast.",
          },
        },
      },
      identity: {
        type: "object",
        description:
          "Represents a change to an account's identity. Could be an updated handle, signing key, or pds hosting endpoint. Serves as a prod to all downstream services to refresh their identity cache.",
        required: ["seq", "did", "time"],
        properties: {
          seq: {
            type: "integer",
          },
          did: {
            type: "string",
            format: "did",
          },
          time: {
            type: "string",
            format: "datetime",
          },
          handle: {
            type: "string",
            format: "handle",
            description:
              "The current handle for the account, or 'handle.invalid' if validation fails. This field is optional, might have been validated or passed-through from an upstream source. Semantics and behaviors for PDS vs Relay may evolve in the future; see atproto specs for more details.",
          },
        },
      },
      account: {
        type: "object",
        description:
          "Represents a change to an account's status on a host (eg, PDS or Relay). The semantics of this event are that the status is at the host which emitted the event, not necessarily that at the currently active PDS. Eg, a Relay takedown would emit a takedown with active=false, even if the PDS is still active.",
        required: ["seq", "did", "time", "active"],
        properties: {
          seq: {
            type: "integer",
          },
          did: {
            type: "string",
            format: "did",
          },
          time: {
            type: "string",
            format: "datetime",
          },
          active: {
            type: "boolean",
            description:
              "Indicates that the account has a repository which can be fetched from the host that emitted this event.",
          },
          status: {
            type: "string",
            description:
              "If active=false, this optional field indicates a reason for why the account is not active.",
            knownValues: ["takendown", "suspended", "deleted", "deactivated"],
          },
        },
      },
      handle: {
        type: "object",
        description: "DEPRECATED -- Use #identity event instead",
        required: ["seq", "did", "handle", "time"],
        properties: {
          seq: {
            type: "integer",
          },
          did: {
            type: "string",
            format: "did",
          },
          handle: {
            type: "string",
            format: "handle",
          },
          time: {
            type: "string",
            format: "datetime",
          },
        },
      },
      migrate: {
        type: "object",
        description: "DEPRECATED -- Use #account event instead",
        required: ["seq", "did", "migrateTo", "time"],
        nullable: ["migrateTo"],
        properties: {
          seq: {
            type: "integer",
          },
          did: {
            type: "string",
            format: "did",
          },
          migrateTo: {
            type: "string",
          },
          time: {
            type: "string",
            format: "datetime",
          },
        },
      },
      tombstone: {
        type: "object",
        description: "DEPRECATED -- Use #account event instead",
        required: ["seq", "did", "time"],
        properties: {
          seq: {
            type: "integer",
          },
          did: {
            type: "string",
            format: "did",
          },
          time: {
            type: "string",
            format: "datetime",
          },
        },
      },
      info: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            knownValues: ["OutdatedCursor"],
          },
          message: {
            type: "string",
          },
        },
      },
      repoOp: {
        type: "object",
        description: "A repo operation, ie a mutation of a single record.",
        required: ["action", "path", "cid"],
        nullable: ["cid"],
        properties: {
          action: {
            type: "string",
            knownValues: ["create", "update", "delete"],
          },
          path: {
            type: "string",
          },
          cid: {
            type: "cid-link",
            description:
              "For creates and updates, the new record CID. For deletions, null.",
          },
        },
      },
    },
  },
  ComAtprotoTempAddReservedHandle: {
    lexicon: 1,
    id: "com.atproto.temp.addReservedHandle",
    defs: {
      main: {
        type: "procedure",
        description: "Add a handle to the set of reserved handles.",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["handle"],
            properties: {
              handle: {
                type: "string",
              },
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            properties: {},
          },
        },
      },
    },
  },
  ComAtprotoTempCheckSignupQueue: {
    lexicon: 1,
    id: "com.atproto.temp.checkSignupQueue",
    defs: {
      main: {
        type: "query",
        description: "Check accounts location in signup queue.",
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["activated"],
            properties: {
              activated: {
                type: "boolean",
              },
              placeInQueue: {
                type: "integer",
              },
              estimatedTimeMs: {
                type: "integer",
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoTempFetchLabels: {
    lexicon: 1,
    id: "com.atproto.temp.fetchLabels",
    defs: {
      main: {
        type: "query",
        description:
          "DEPRECATED: use queryLabels or subscribeLabels instead -- Fetch all labels from a labeler created after a certain date.",
        parameters: {
          type: "params",
          properties: {
            since: {
              type: "integer",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 250,
              default: 50,
            },
          },
        },
        output: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["labels"],
            properties: {
              labels: {
                type: "array",
                items: {
                  type: "ref",
                  ref: "lex:com.atproto.label.defs#label",
                },
              },
            },
          },
        },
      },
    },
  },
  ComAtprotoTempRequestPhoneVerification: {
    lexicon: 1,
    id: "com.atproto.temp.requestPhoneVerification",
    defs: {
      main: {
        type: "procedure",
        description:
          "Request a verification code to be sent to the supplied phone number",
        input: {
          encoding: "application/json",
          schema: {
            type: "object",
            required: ["phoneNumber"],
            properties: {
              phoneNumber: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>;

export const schemas = Object.values(schemaDict);
export const lexicons: Lexicons = new Lexicons(schemas);
export const ids = {
  ChatTinychatActorProfile: "chat.tinychat.actor.profile",
  ChatTinychatCoreChannel: "chat.tinychat.core.channel",
  ChatTinychatCoreMembership: "chat.tinychat.core.membership",
  ChatTinychatCoreMessage: "chat.tinychat.core.message",
  ChatTinychatCoreServer: "chat.tinychat.core.server",
  ChatTinychatRichtextFacet: "chat.tinychat.richtext.facet",
  ChatTinychatServerDefs: "chat.tinychat.server.defs",
  ChatTinychatServerGetChannels: "chat.tinychat.server.getChannels",
  ChatTinychatServerGetMessages: "chat.tinychat.server.getMessages",
  ChatTinychatServerGetServers: "chat.tinychat.server.getServers",
  ChatTinychatServerJoinServer: "chat.tinychat.server.joinServer",
  ChatTinychatServerSendMessage: "chat.tinychat.server.sendMessage",
  ComAtprotoAdminDefs: "com.atproto.admin.defs",
  ComAtprotoAdminDeleteAccount: "com.atproto.admin.deleteAccount",
  ComAtprotoAdminDisableAccountInvites:
    "com.atproto.admin.disableAccountInvites",
  ComAtprotoAdminDisableInviteCodes: "com.atproto.admin.disableInviteCodes",
  ComAtprotoAdminEnableAccountInvites: "com.atproto.admin.enableAccountInvites",
  ComAtprotoAdminGetAccountInfo: "com.atproto.admin.getAccountInfo",
  ComAtprotoAdminGetAccountInfos: "com.atproto.admin.getAccountInfos",
  ComAtprotoAdminGetInviteCodes: "com.atproto.admin.getInviteCodes",
  ComAtprotoAdminGetSubjectStatus: "com.atproto.admin.getSubjectStatus",
  ComAtprotoAdminSearchAccounts: "com.atproto.admin.searchAccounts",
  ComAtprotoAdminSendEmail: "com.atproto.admin.sendEmail",
  ComAtprotoAdminUpdateAccountEmail: "com.atproto.admin.updateAccountEmail",
  ComAtprotoAdminUpdateAccountHandle: "com.atproto.admin.updateAccountHandle",
  ComAtprotoAdminUpdateAccountPassword:
    "com.atproto.admin.updateAccountPassword",
  ComAtprotoAdminUpdateSubjectStatus: "com.atproto.admin.updateSubjectStatus",
  ComAtprotoIdentityGetRecommendedDidCredentials:
    "com.atproto.identity.getRecommendedDidCredentials",
  ComAtprotoIdentityRequestPlcOperationSignature:
    "com.atproto.identity.requestPlcOperationSignature",
  ComAtprotoIdentityResolveHandle: "com.atproto.identity.resolveHandle",
  ComAtprotoIdentitySignPlcOperation: "com.atproto.identity.signPlcOperation",
  ComAtprotoIdentitySubmitPlcOperation:
    "com.atproto.identity.submitPlcOperation",
  ComAtprotoIdentityUpdateHandle: "com.atproto.identity.updateHandle",
  ComAtprotoLabelDefs: "com.atproto.label.defs",
  ComAtprotoLabelQueryLabels: "com.atproto.label.queryLabels",
  ComAtprotoLabelSubscribeLabels: "com.atproto.label.subscribeLabels",
  ComAtprotoModerationCreateReport: "com.atproto.moderation.createReport",
  ComAtprotoModerationDefs: "com.atproto.moderation.defs",
  ComAtprotoRepoApplyWrites: "com.atproto.repo.applyWrites",
  ComAtprotoRepoCreateRecord: "com.atproto.repo.createRecord",
  ComAtprotoRepoDefs: "com.atproto.repo.defs",
  ComAtprotoRepoDeleteRecord: "com.atproto.repo.deleteRecord",
  ComAtprotoRepoDescribeRepo: "com.atproto.repo.describeRepo",
  ComAtprotoRepoGetRecord: "com.atproto.repo.getRecord",
  ComAtprotoRepoImportRepo: "com.atproto.repo.importRepo",
  ComAtprotoRepoListMissingBlobs: "com.atproto.repo.listMissingBlobs",
  ComAtprotoRepoListRecords: "com.atproto.repo.listRecords",
  ComAtprotoRepoPutRecord: "com.atproto.repo.putRecord",
  ComAtprotoRepoStrongRef: "com.atproto.repo.strongRef",
  ComAtprotoRepoUploadBlob: "com.atproto.repo.uploadBlob",
  ComAtprotoServerActivateAccount: "com.atproto.server.activateAccount",
  ComAtprotoServerCheckAccountStatus: "com.atproto.server.checkAccountStatus",
  ComAtprotoServerConfirmEmail: "com.atproto.server.confirmEmail",
  ComAtprotoServerCreateAccount: "com.atproto.server.createAccount",
  ComAtprotoServerCreateAppPassword: "com.atproto.server.createAppPassword",
  ComAtprotoServerCreateInviteCode: "com.atproto.server.createInviteCode",
  ComAtprotoServerCreateInviteCodes: "com.atproto.server.createInviteCodes",
  ComAtprotoServerCreateSession: "com.atproto.server.createSession",
  ComAtprotoServerDeactivateAccount: "com.atproto.server.deactivateAccount",
  ComAtprotoServerDefs: "com.atproto.server.defs",
  ComAtprotoServerDeleteAccount: "com.atproto.server.deleteAccount",
  ComAtprotoServerDeleteSession: "com.atproto.server.deleteSession",
  ComAtprotoServerDescribeServer: "com.atproto.server.describeServer",
  ComAtprotoServerGetAccountInviteCodes:
    "com.atproto.server.getAccountInviteCodes",
  ComAtprotoServerGetServiceAuth: "com.atproto.server.getServiceAuth",
  ComAtprotoServerGetSession: "com.atproto.server.getSession",
  ComAtprotoServerListAppPasswords: "com.atproto.server.listAppPasswords",
  ComAtprotoServerRefreshSession: "com.atproto.server.refreshSession",
  ComAtprotoServerRequestAccountDelete:
    "com.atproto.server.requestAccountDelete",
  ComAtprotoServerRequestEmailConfirmation:
    "com.atproto.server.requestEmailConfirmation",
  ComAtprotoServerRequestEmailUpdate: "com.atproto.server.requestEmailUpdate",
  ComAtprotoServerRequestPasswordReset:
    "com.atproto.server.requestPasswordReset",
  ComAtprotoServerReserveSigningKey: "com.atproto.server.reserveSigningKey",
  ComAtprotoServerResetPassword: "com.atproto.server.resetPassword",
  ComAtprotoServerRevokeAppPassword: "com.atproto.server.revokeAppPassword",
  ComAtprotoServerUpdateEmail: "com.atproto.server.updateEmail",
  ComAtprotoSyncGetBlob: "com.atproto.sync.getBlob",
  ComAtprotoSyncGetBlocks: "com.atproto.sync.getBlocks",
  ComAtprotoSyncGetCheckout: "com.atproto.sync.getCheckout",
  ComAtprotoSyncGetHead: "com.atproto.sync.getHead",
  ComAtprotoSyncGetLatestCommit: "com.atproto.sync.getLatestCommit",
  ComAtprotoSyncGetRecord: "com.atproto.sync.getRecord",
  ComAtprotoSyncGetRepo: "com.atproto.sync.getRepo",
  ComAtprotoSyncGetRepoStatus: "com.atproto.sync.getRepoStatus",
  ComAtprotoSyncListBlobs: "com.atproto.sync.listBlobs",
  ComAtprotoSyncListRepos: "com.atproto.sync.listRepos",
  ComAtprotoSyncNotifyOfUpdate: "com.atproto.sync.notifyOfUpdate",
  ComAtprotoSyncRequestCrawl: "com.atproto.sync.requestCrawl",
  ComAtprotoSyncSubscribeRepos: "com.atproto.sync.subscribeRepos",
  ComAtprotoTempAddReservedHandle: "com.atproto.temp.addReservedHandle",
  ComAtprotoTempCheckSignupQueue: "com.atproto.temp.checkSignupQueue",
  ComAtprotoTempFetchLabels: "com.atproto.temp.fetchLabels",
  ComAtprotoTempRequestPhoneVerification:
    "com.atproto.temp.requestPhoneVerification",
};
