/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { FetchHandler, FetchHandlerOptions, XrpcClient } from "@atproto/xrpc";
import { schemas } from "./lexicons.ts";
import { CID } from "multiformats/cid";
import * as ChatTinychatActorProfile from "./types/chat/tinychat/actor/profile.ts";
import * as ChatTinychatCoreChannel from "./types/chat/tinychat/core/channel.ts";
import * as ChatTinychatCoreMembership from "./types/chat/tinychat/core/membership.ts";
import * as ChatTinychatCoreMessage from "./types/chat/tinychat/core/message.ts";
import * as ChatTinychatCoreServer from "./types/chat/tinychat/core/server.ts";
import * as ChatTinychatRichtextFacet from "./types/chat/tinychat/richtext/facet.ts";
import * as ChatTinychatServerDefs from "./types/chat/tinychat/server/defs.ts";
import * as ChatTinychatServerGetServers from "./types/chat/tinychat/server/getServers.ts";
import * as ComAtprotoAdminDefs from "./types/com/atproto/admin/defs.ts";
import * as ComAtprotoAdminDeleteAccount from "./types/com/atproto/admin/deleteAccount.ts";
import * as ComAtprotoAdminDisableAccountInvites from "./types/com/atproto/admin/disableAccountInvites.ts";
import * as ComAtprotoAdminDisableInviteCodes from "./types/com/atproto/admin/disableInviteCodes.ts";
import * as ComAtprotoAdminEnableAccountInvites from "./types/com/atproto/admin/enableAccountInvites.ts";
import * as ComAtprotoAdminGetAccountInfo from "./types/com/atproto/admin/getAccountInfo.ts";
import * as ComAtprotoAdminGetAccountInfos from "./types/com/atproto/admin/getAccountInfos.ts";
import * as ComAtprotoAdminGetInviteCodes from "./types/com/atproto/admin/getInviteCodes.ts";
import * as ComAtprotoAdminGetSubjectStatus from "./types/com/atproto/admin/getSubjectStatus.ts";
import * as ComAtprotoAdminSearchAccounts from "./types/com/atproto/admin/searchAccounts.ts";
import * as ComAtprotoAdminSendEmail from "./types/com/atproto/admin/sendEmail.ts";
import * as ComAtprotoAdminUpdateAccountEmail from "./types/com/atproto/admin/updateAccountEmail.ts";
import * as ComAtprotoAdminUpdateAccountHandle from "./types/com/atproto/admin/updateAccountHandle.ts";
import * as ComAtprotoAdminUpdateAccountPassword from "./types/com/atproto/admin/updateAccountPassword.ts";
import * as ComAtprotoAdminUpdateSubjectStatus from "./types/com/atproto/admin/updateSubjectStatus.ts";
import * as ComAtprotoIdentityGetRecommendedDidCredentials from "./types/com/atproto/identity/getRecommendedDidCredentials.ts";
import * as ComAtprotoIdentityRequestPlcOperationSignature from "./types/com/atproto/identity/requestPlcOperationSignature.ts";
import * as ComAtprotoIdentityResolveHandle from "./types/com/atproto/identity/resolveHandle.ts";
import * as ComAtprotoIdentitySignPlcOperation from "./types/com/atproto/identity/signPlcOperation.ts";
import * as ComAtprotoIdentitySubmitPlcOperation from "./types/com/atproto/identity/submitPlcOperation.ts";
import * as ComAtprotoIdentityUpdateHandle from "./types/com/atproto/identity/updateHandle.ts";
import * as ComAtprotoLabelDefs from "./types/com/atproto/label/defs.ts";
import * as ComAtprotoLabelQueryLabels from "./types/com/atproto/label/queryLabels.ts";
import * as ComAtprotoLabelSubscribeLabels from "./types/com/atproto/label/subscribeLabels.ts";
import * as ComAtprotoModerationCreateReport from "./types/com/atproto/moderation/createReport.ts";
import * as ComAtprotoModerationDefs from "./types/com/atproto/moderation/defs.ts";
import * as ComAtprotoRepoApplyWrites from "./types/com/atproto/repo/applyWrites.ts";
import * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.ts";
import * as ComAtprotoRepoDefs from "./types/com/atproto/repo/defs.ts";
import * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.ts";
import * as ComAtprotoRepoDescribeRepo from "./types/com/atproto/repo/describeRepo.ts";
import * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.ts";
import * as ComAtprotoRepoImportRepo from "./types/com/atproto/repo/importRepo.ts";
import * as ComAtprotoRepoListMissingBlobs from "./types/com/atproto/repo/listMissingBlobs.ts";
import * as ComAtprotoRepoListRecords from "./types/com/atproto/repo/listRecords.ts";
import * as ComAtprotoRepoPutRecord from "./types/com/atproto/repo/putRecord.ts";
import * as ComAtprotoRepoStrongRef from "./types/com/atproto/repo/strongRef.ts";
import * as ComAtprotoRepoUploadBlob from "./types/com/atproto/repo/uploadBlob.ts";
import * as ComAtprotoServerActivateAccount from "./types/com/atproto/server/activateAccount.ts";
import * as ComAtprotoServerCheckAccountStatus from "./types/com/atproto/server/checkAccountStatus.ts";
import * as ComAtprotoServerConfirmEmail from "./types/com/atproto/server/confirmEmail.ts";
import * as ComAtprotoServerCreateAccount from "./types/com/atproto/server/createAccount.ts";
import * as ComAtprotoServerCreateAppPassword from "./types/com/atproto/server/createAppPassword.ts";
import * as ComAtprotoServerCreateInviteCode from "./types/com/atproto/server/createInviteCode.ts";
import * as ComAtprotoServerCreateInviteCodes from "./types/com/atproto/server/createInviteCodes.ts";
import * as ComAtprotoServerCreateSession from "./types/com/atproto/server/createSession.ts";
import * as ComAtprotoServerDeactivateAccount from "./types/com/atproto/server/deactivateAccount.ts";
import * as ComAtprotoServerDefs from "./types/com/atproto/server/defs.ts";
import * as ComAtprotoServerDeleteAccount from "./types/com/atproto/server/deleteAccount.ts";
import * as ComAtprotoServerDeleteSession from "./types/com/atproto/server/deleteSession.ts";
import * as ComAtprotoServerDescribeServer from "./types/com/atproto/server/describeServer.ts";
import * as ComAtprotoServerGetAccountInviteCodes from "./types/com/atproto/server/getAccountInviteCodes.ts";
import * as ComAtprotoServerGetServiceAuth from "./types/com/atproto/server/getServiceAuth.ts";
import * as ComAtprotoServerGetSession from "./types/com/atproto/server/getSession.ts";
import * as ComAtprotoServerListAppPasswords from "./types/com/atproto/server/listAppPasswords.ts";
import * as ComAtprotoServerRefreshSession from "./types/com/atproto/server/refreshSession.ts";
import * as ComAtprotoServerRequestAccountDelete from "./types/com/atproto/server/requestAccountDelete.ts";
import * as ComAtprotoServerRequestEmailConfirmation from "./types/com/atproto/server/requestEmailConfirmation.ts";
import * as ComAtprotoServerRequestEmailUpdate from "./types/com/atproto/server/requestEmailUpdate.ts";
import * as ComAtprotoServerRequestPasswordReset from "./types/com/atproto/server/requestPasswordReset.ts";
import * as ComAtprotoServerReserveSigningKey from "./types/com/atproto/server/reserveSigningKey.ts";
import * as ComAtprotoServerResetPassword from "./types/com/atproto/server/resetPassword.ts";
import * as ComAtprotoServerRevokeAppPassword from "./types/com/atproto/server/revokeAppPassword.ts";
import * as ComAtprotoServerUpdateEmail from "./types/com/atproto/server/updateEmail.ts";
import * as ComAtprotoSyncGetBlob from "./types/com/atproto/sync/getBlob.ts";
import * as ComAtprotoSyncGetBlocks from "./types/com/atproto/sync/getBlocks.ts";
import * as ComAtprotoSyncGetCheckout from "./types/com/atproto/sync/getCheckout.ts";
import * as ComAtprotoSyncGetHead from "./types/com/atproto/sync/getHead.ts";
import * as ComAtprotoSyncGetLatestCommit from "./types/com/atproto/sync/getLatestCommit.ts";
import * as ComAtprotoSyncGetRecord from "./types/com/atproto/sync/getRecord.ts";
import * as ComAtprotoSyncGetRepo from "./types/com/atproto/sync/getRepo.ts";
import * as ComAtprotoSyncGetRepoStatus from "./types/com/atproto/sync/getRepoStatus.ts";
import * as ComAtprotoSyncListBlobs from "./types/com/atproto/sync/listBlobs.ts";
import * as ComAtprotoSyncListRepos from "./types/com/atproto/sync/listRepos.ts";
import * as ComAtprotoSyncNotifyOfUpdate from "./types/com/atproto/sync/notifyOfUpdate.ts";
import * as ComAtprotoSyncRequestCrawl from "./types/com/atproto/sync/requestCrawl.ts";
import * as ComAtprotoSyncSubscribeRepos from "./types/com/atproto/sync/subscribeRepos.ts";
import * as ComAtprotoTempAddReservedHandle from "./types/com/atproto/temp/addReservedHandle.ts";
import * as ComAtprotoTempCheckSignupQueue from "./types/com/atproto/temp/checkSignupQueue.ts";
import * as ComAtprotoTempFetchLabels from "./types/com/atproto/temp/fetchLabels.ts";
import * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.ts";

export * as ChatTinychatActorProfile from "./types/chat/tinychat/actor/profile.ts";
export * as ChatTinychatCoreChannel from "./types/chat/tinychat/core/channel.ts";
export * as ChatTinychatCoreMembership from "./types/chat/tinychat/core/membership.ts";
export * as ChatTinychatCoreMessage from "./types/chat/tinychat/core/message.ts";
export * as ChatTinychatCoreServer from "./types/chat/tinychat/core/server.ts";
export * as ChatTinychatRichtextFacet from "./types/chat/tinychat/richtext/facet.ts";
export * as ChatTinychatServerDefs from "./types/chat/tinychat/server/defs.ts";
export * as ChatTinychatServerGetServers from "./types/chat/tinychat/server/getServers.ts";
export * as ComAtprotoAdminDefs from "./types/com/atproto/admin/defs.ts";
export * as ComAtprotoAdminDeleteAccount from "./types/com/atproto/admin/deleteAccount.ts";
export * as ComAtprotoAdminDisableAccountInvites from "./types/com/atproto/admin/disableAccountInvites.ts";
export * as ComAtprotoAdminDisableInviteCodes from "./types/com/atproto/admin/disableInviteCodes.ts";
export * as ComAtprotoAdminEnableAccountInvites from "./types/com/atproto/admin/enableAccountInvites.ts";
export * as ComAtprotoAdminGetAccountInfo from "./types/com/atproto/admin/getAccountInfo.ts";
export * as ComAtprotoAdminGetAccountInfos from "./types/com/atproto/admin/getAccountInfos.ts";
export * as ComAtprotoAdminGetInviteCodes from "./types/com/atproto/admin/getInviteCodes.ts";
export * as ComAtprotoAdminGetSubjectStatus from "./types/com/atproto/admin/getSubjectStatus.ts";
export * as ComAtprotoAdminSearchAccounts from "./types/com/atproto/admin/searchAccounts.ts";
export * as ComAtprotoAdminSendEmail from "./types/com/atproto/admin/sendEmail.ts";
export * as ComAtprotoAdminUpdateAccountEmail from "./types/com/atproto/admin/updateAccountEmail.ts";
export * as ComAtprotoAdminUpdateAccountHandle from "./types/com/atproto/admin/updateAccountHandle.ts";
export * as ComAtprotoAdminUpdateAccountPassword from "./types/com/atproto/admin/updateAccountPassword.ts";
export * as ComAtprotoAdminUpdateSubjectStatus from "./types/com/atproto/admin/updateSubjectStatus.ts";
export * as ComAtprotoIdentityGetRecommendedDidCredentials from "./types/com/atproto/identity/getRecommendedDidCredentials.ts";
export * as ComAtprotoIdentityRequestPlcOperationSignature from "./types/com/atproto/identity/requestPlcOperationSignature.ts";
export * as ComAtprotoIdentityResolveHandle from "./types/com/atproto/identity/resolveHandle.ts";
export * as ComAtprotoIdentitySignPlcOperation from "./types/com/atproto/identity/signPlcOperation.ts";
export * as ComAtprotoIdentitySubmitPlcOperation from "./types/com/atproto/identity/submitPlcOperation.ts";
export * as ComAtprotoIdentityUpdateHandle from "./types/com/atproto/identity/updateHandle.ts";
export * as ComAtprotoLabelDefs from "./types/com/atproto/label/defs.ts";
export * as ComAtprotoLabelQueryLabels from "./types/com/atproto/label/queryLabels.ts";
export * as ComAtprotoLabelSubscribeLabels from "./types/com/atproto/label/subscribeLabels.ts";
export * as ComAtprotoModerationCreateReport from "./types/com/atproto/moderation/createReport.ts";
export * as ComAtprotoModerationDefs from "./types/com/atproto/moderation/defs.ts";
export * as ComAtprotoRepoApplyWrites from "./types/com/atproto/repo/applyWrites.ts";
export * as ComAtprotoRepoCreateRecord from "./types/com/atproto/repo/createRecord.ts";
export * as ComAtprotoRepoDefs from "./types/com/atproto/repo/defs.ts";
export * as ComAtprotoRepoDeleteRecord from "./types/com/atproto/repo/deleteRecord.ts";
export * as ComAtprotoRepoDescribeRepo from "./types/com/atproto/repo/describeRepo.ts";
export * as ComAtprotoRepoGetRecord from "./types/com/atproto/repo/getRecord.ts";
export * as ComAtprotoRepoImportRepo from "./types/com/atproto/repo/importRepo.ts";
export * as ComAtprotoRepoListMissingBlobs from "./types/com/atproto/repo/listMissingBlobs.ts";
export * as ComAtprotoRepoListRecords from "./types/com/atproto/repo/listRecords.ts";
export * as ComAtprotoRepoPutRecord from "./types/com/atproto/repo/putRecord.ts";
export * as ComAtprotoRepoStrongRef from "./types/com/atproto/repo/strongRef.ts";
export * as ComAtprotoRepoUploadBlob from "./types/com/atproto/repo/uploadBlob.ts";
export * as ComAtprotoServerActivateAccount from "./types/com/atproto/server/activateAccount.ts";
export * as ComAtprotoServerCheckAccountStatus from "./types/com/atproto/server/checkAccountStatus.ts";
export * as ComAtprotoServerConfirmEmail from "./types/com/atproto/server/confirmEmail.ts";
export * as ComAtprotoServerCreateAccount from "./types/com/atproto/server/createAccount.ts";
export * as ComAtprotoServerCreateAppPassword from "./types/com/atproto/server/createAppPassword.ts";
export * as ComAtprotoServerCreateInviteCode from "./types/com/atproto/server/createInviteCode.ts";
export * as ComAtprotoServerCreateInviteCodes from "./types/com/atproto/server/createInviteCodes.ts";
export * as ComAtprotoServerCreateSession from "./types/com/atproto/server/createSession.ts";
export * as ComAtprotoServerDeactivateAccount from "./types/com/atproto/server/deactivateAccount.ts";
export * as ComAtprotoServerDefs from "./types/com/atproto/server/defs.ts";
export * as ComAtprotoServerDeleteAccount from "./types/com/atproto/server/deleteAccount.ts";
export * as ComAtprotoServerDeleteSession from "./types/com/atproto/server/deleteSession.ts";
export * as ComAtprotoServerDescribeServer from "./types/com/atproto/server/describeServer.ts";
export * as ComAtprotoServerGetAccountInviteCodes from "./types/com/atproto/server/getAccountInviteCodes.ts";
export * as ComAtprotoServerGetServiceAuth from "./types/com/atproto/server/getServiceAuth.ts";
export * as ComAtprotoServerGetSession from "./types/com/atproto/server/getSession.ts";
export * as ComAtprotoServerListAppPasswords from "./types/com/atproto/server/listAppPasswords.ts";
export * as ComAtprotoServerRefreshSession from "./types/com/atproto/server/refreshSession.ts";
export * as ComAtprotoServerRequestAccountDelete from "./types/com/atproto/server/requestAccountDelete.ts";
export * as ComAtprotoServerRequestEmailConfirmation from "./types/com/atproto/server/requestEmailConfirmation.ts";
export * as ComAtprotoServerRequestEmailUpdate from "./types/com/atproto/server/requestEmailUpdate.ts";
export * as ComAtprotoServerRequestPasswordReset from "./types/com/atproto/server/requestPasswordReset.ts";
export * as ComAtprotoServerReserveSigningKey from "./types/com/atproto/server/reserveSigningKey.ts";
export * as ComAtprotoServerResetPassword from "./types/com/atproto/server/resetPassword.ts";
export * as ComAtprotoServerRevokeAppPassword from "./types/com/atproto/server/revokeAppPassword.ts";
export * as ComAtprotoServerUpdateEmail from "./types/com/atproto/server/updateEmail.ts";
export * as ComAtprotoSyncGetBlob from "./types/com/atproto/sync/getBlob.ts";
export * as ComAtprotoSyncGetBlocks from "./types/com/atproto/sync/getBlocks.ts";
export * as ComAtprotoSyncGetCheckout from "./types/com/atproto/sync/getCheckout.ts";
export * as ComAtprotoSyncGetHead from "./types/com/atproto/sync/getHead.ts";
export * as ComAtprotoSyncGetLatestCommit from "./types/com/atproto/sync/getLatestCommit.ts";
export * as ComAtprotoSyncGetRecord from "./types/com/atproto/sync/getRecord.ts";
export * as ComAtprotoSyncGetRepo from "./types/com/atproto/sync/getRepo.ts";
export * as ComAtprotoSyncGetRepoStatus from "./types/com/atproto/sync/getRepoStatus.ts";
export * as ComAtprotoSyncListBlobs from "./types/com/atproto/sync/listBlobs.ts";
export * as ComAtprotoSyncListRepos from "./types/com/atproto/sync/listRepos.ts";
export * as ComAtprotoSyncNotifyOfUpdate from "./types/com/atproto/sync/notifyOfUpdate.ts";
export * as ComAtprotoSyncRequestCrawl from "./types/com/atproto/sync/requestCrawl.ts";
export * as ComAtprotoSyncSubscribeRepos from "./types/com/atproto/sync/subscribeRepos.ts";
export * as ComAtprotoTempAddReservedHandle from "./types/com/atproto/temp/addReservedHandle.ts";
export * as ComAtprotoTempCheckSignupQueue from "./types/com/atproto/temp/checkSignupQueue.ts";
export * as ComAtprotoTempFetchLabels from "./types/com/atproto/temp/fetchLabels.ts";
export * as ComAtprotoTempRequestPhoneVerification from "./types/com/atproto/temp/requestPhoneVerification.ts";

export const COM_ATPROTO_MODERATION = {
  DefsReasonSpam: "com.atproto.moderation.defs#reasonSpam",
  DefsReasonViolation: "com.atproto.moderation.defs#reasonViolation",
  DefsReasonMisleading: "com.atproto.moderation.defs#reasonMisleading",
  DefsReasonSexual: "com.atproto.moderation.defs#reasonSexual",
  DefsReasonRude: "com.atproto.moderation.defs#reasonRude",
  DefsReasonOther: "com.atproto.moderation.defs#reasonOther",
  DefsReasonAppeal: "com.atproto.moderation.defs#reasonAppeal",
};

export class AtpBaseClient extends XrpcClient {
  chat: ChatNS;
  com: ComNS;

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas);
    this.chat = new ChatNS(this);
    this.com = new ComNS(this);
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this;
  }
}

export class ChatNS {
  _client: XrpcClient;
  tinychat: ChatTinychatNS;

  constructor(client: XrpcClient) {
    this._client = client;
    this.tinychat = new ChatTinychatNS(client);
  }
}

export class ChatTinychatNS {
  _client: XrpcClient;
  actor: ChatTinychatActorNS;
  core: ChatTinychatCoreNS;
  richtext: ChatTinychatRichtextNS;
  server: ChatTinychatServerNS;

  constructor(client: XrpcClient) {
    this._client = client;
    this.actor = new ChatTinychatActorNS(client);
    this.core = new ChatTinychatCoreNS(client);
    this.richtext = new ChatTinychatRichtextNS(client);
    this.server = new ChatTinychatServerNS(client);
  }
}

export class ChatTinychatActorNS {
  _client: XrpcClient;
  profile: ProfileRecord;

  constructor(client: XrpcClient) {
    this._client = client;
    this.profile = new ProfileRecord(client);
  }
}

export class ProfileRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: Omit<ComAtprotoRepoListRecords.QueryParams, "collection">,
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: ChatTinychatActorProfile.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "chat.tinychat.actor.profile",
      ...params,
    });
    return res.data;
  }

  async get(
    params: Omit<ComAtprotoRepoGetRecord.QueryParams, "collection">,
  ): Promise<{
    uri: string;
    cid: string;
    value: ChatTinychatActorProfile.Record;
  }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "chat.tinychat.actor.profile",
      ...params,
    });
    return res.data;
  }

  async create(
    params: Omit<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: ChatTinychatActorProfile.Record,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    record.$type = "chat.tinychat.actor.profile";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      {
        collection: "chat.tinychat.actor.profile",
        rkey: "self",
        ...params,
        record,
      },
      { encoding: "application/json", headers },
    );
    return res.data;
  }

  async delete(
    params: Omit<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "chat.tinychat.actor.profile", ...params },
      { headers },
    );
  }
}

export class ChatTinychatCoreNS {
  _client: XrpcClient;
  channel: ChannelRecord;
  membership: MembershipRecord;
  message: MessageRecord;
  server: ServerRecord;

  constructor(client: XrpcClient) {
    this._client = client;
    this.channel = new ChannelRecord(client);
    this.membership = new MembershipRecord(client);
    this.message = new MessageRecord(client);
    this.server = new ServerRecord(client);
  }
}

export class ChannelRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: Omit<ComAtprotoRepoListRecords.QueryParams, "collection">,
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: ChatTinychatCoreChannel.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "chat.tinychat.core.channel",
      ...params,
    });
    return res.data;
  }

  async get(
    params: Omit<ComAtprotoRepoGetRecord.QueryParams, "collection">,
  ): Promise<{
    uri: string;
    cid: string;
    value: ChatTinychatCoreChannel.Record;
  }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "chat.tinychat.core.channel",
      ...params,
    });
    return res.data;
  }

  async create(
    params: Omit<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: ChatTinychatCoreChannel.Record,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    record.$type = "chat.tinychat.core.channel";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      { collection: "chat.tinychat.core.channel", ...params, record },
      { encoding: "application/json", headers },
    );
    return res.data;
  }

  async delete(
    params: Omit<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "chat.tinychat.core.channel", ...params },
      { headers },
    );
  }
}

export class MembershipRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: Omit<ComAtprotoRepoListRecords.QueryParams, "collection">,
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: ChatTinychatCoreMembership.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "chat.tinychat.core.membership",
      ...params,
    });
    return res.data;
  }

  async get(
    params: Omit<ComAtprotoRepoGetRecord.QueryParams, "collection">,
  ): Promise<{
    uri: string;
    cid: string;
    value: ChatTinychatCoreMembership.Record;
  }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "chat.tinychat.core.membership",
      ...params,
    });
    return res.data;
  }

  async create(
    params: Omit<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: ChatTinychatCoreMembership.Record,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    record.$type = "chat.tinychat.core.membership";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      { collection: "chat.tinychat.core.membership", ...params, record },
      { encoding: "application/json", headers },
    );
    return res.data;
  }

  async delete(
    params: Omit<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "chat.tinychat.core.membership", ...params },
      { headers },
    );
  }
}

export class MessageRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: Omit<ComAtprotoRepoListRecords.QueryParams, "collection">,
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: ChatTinychatCoreMessage.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "chat.tinychat.core.message",
      ...params,
    });
    return res.data;
  }

  async get(
    params: Omit<ComAtprotoRepoGetRecord.QueryParams, "collection">,
  ): Promise<{
    uri: string;
    cid: string;
    value: ChatTinychatCoreMessage.Record;
  }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "chat.tinychat.core.message",
      ...params,
    });
    return res.data;
  }

  async create(
    params: Omit<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: ChatTinychatCoreMessage.Record,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    record.$type = "chat.tinychat.core.message";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      { collection: "chat.tinychat.core.message", ...params, record },
      { encoding: "application/json", headers },
    );
    return res.data;
  }

  async delete(
    params: Omit<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "chat.tinychat.core.message", ...params },
      { headers },
    );
  }
}

export class ServerRecord {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  async list(
    params: Omit<ComAtprotoRepoListRecords.QueryParams, "collection">,
  ): Promise<{
    cursor?: string;
    records: { uri: string; value: ChatTinychatCoreServer.Record }[];
  }> {
    const res = await this._client.call("com.atproto.repo.listRecords", {
      collection: "chat.tinychat.core.server",
      ...params,
    });
    return res.data;
  }

  async get(
    params: Omit<ComAtprotoRepoGetRecord.QueryParams, "collection">,
  ): Promise<{
    uri: string;
    cid: string;
    value: ChatTinychatCoreServer.Record;
  }> {
    const res = await this._client.call("com.atproto.repo.getRecord", {
      collection: "chat.tinychat.core.server",
      ...params,
    });
    return res.data;
  }

  async create(
    params: Omit<
      ComAtprotoRepoCreateRecord.InputSchema,
      "collection" | "record"
    >,
    record: ChatTinychatCoreServer.Record,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    record.$type = "chat.tinychat.core.server";
    const res = await this._client.call(
      "com.atproto.repo.createRecord",
      undefined,
      { collection: "chat.tinychat.core.server", ...params, record },
      { encoding: "application/json", headers },
    );
    return res.data;
  }

  async delete(
    params: Omit<ComAtprotoRepoDeleteRecord.InputSchema, "collection">,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      "com.atproto.repo.deleteRecord",
      undefined,
      { collection: "chat.tinychat.core.server", ...params },
      { headers },
    );
  }
}

export class ChatTinychatRichtextNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }
}

export class ChatTinychatServerNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  getServers(
    params?: ChatTinychatServerGetServers.QueryParams,
    opts?: ChatTinychatServerGetServers.CallOptions,
  ): Promise<ChatTinychatServerGetServers.Response> {
    return this._client.call(
      "chat.tinychat.server.getServers",
      params,
      undefined,
      opts,
    );
  }
}

export class ComNS {
  _client: XrpcClient;
  atproto: ComAtprotoNS;

  constructor(client: XrpcClient) {
    this._client = client;
    this.atproto = new ComAtprotoNS(client);
  }
}

export class ComAtprotoNS {
  _client: XrpcClient;
  admin: ComAtprotoAdminNS;
  identity: ComAtprotoIdentityNS;
  label: ComAtprotoLabelNS;
  moderation: ComAtprotoModerationNS;
  repo: ComAtprotoRepoNS;
  server: ComAtprotoServerNS;
  sync: ComAtprotoSyncNS;
  temp: ComAtprotoTempNS;

  constructor(client: XrpcClient) {
    this._client = client;
    this.admin = new ComAtprotoAdminNS(client);
    this.identity = new ComAtprotoIdentityNS(client);
    this.label = new ComAtprotoLabelNS(client);
    this.moderation = new ComAtprotoModerationNS(client);
    this.repo = new ComAtprotoRepoNS(client);
    this.server = new ComAtprotoServerNS(client);
    this.sync = new ComAtprotoSyncNS(client);
    this.temp = new ComAtprotoTempNS(client);
  }
}

export class ComAtprotoAdminNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  deleteAccount(
    data?: ComAtprotoAdminDeleteAccount.InputSchema,
    opts?: ComAtprotoAdminDeleteAccount.CallOptions,
  ): Promise<ComAtprotoAdminDeleteAccount.Response> {
    return this._client.call(
      "com.atproto.admin.deleteAccount",
      opts?.qp,
      data,
      opts,
    );
  }

  disableAccountInvites(
    data?: ComAtprotoAdminDisableAccountInvites.InputSchema,
    opts?: ComAtprotoAdminDisableAccountInvites.CallOptions,
  ): Promise<ComAtprotoAdminDisableAccountInvites.Response> {
    return this._client.call(
      "com.atproto.admin.disableAccountInvites",
      opts?.qp,
      data,
      opts,
    );
  }

  disableInviteCodes(
    data?: ComAtprotoAdminDisableInviteCodes.InputSchema,
    opts?: ComAtprotoAdminDisableInviteCodes.CallOptions,
  ): Promise<ComAtprotoAdminDisableInviteCodes.Response> {
    return this._client.call(
      "com.atproto.admin.disableInviteCodes",
      opts?.qp,
      data,
      opts,
    );
  }

  enableAccountInvites(
    data?: ComAtprotoAdminEnableAccountInvites.InputSchema,
    opts?: ComAtprotoAdminEnableAccountInvites.CallOptions,
  ): Promise<ComAtprotoAdminEnableAccountInvites.Response> {
    return this._client.call(
      "com.atproto.admin.enableAccountInvites",
      opts?.qp,
      data,
      opts,
    );
  }

  getAccountInfo(
    params?: ComAtprotoAdminGetAccountInfo.QueryParams,
    opts?: ComAtprotoAdminGetAccountInfo.CallOptions,
  ): Promise<ComAtprotoAdminGetAccountInfo.Response> {
    return this._client.call(
      "com.atproto.admin.getAccountInfo",
      params,
      undefined,
      opts,
    );
  }

  getAccountInfos(
    params?: ComAtprotoAdminGetAccountInfos.QueryParams,
    opts?: ComAtprotoAdminGetAccountInfos.CallOptions,
  ): Promise<ComAtprotoAdminGetAccountInfos.Response> {
    return this._client.call(
      "com.atproto.admin.getAccountInfos",
      params,
      undefined,
      opts,
    );
  }

  getInviteCodes(
    params?: ComAtprotoAdminGetInviteCodes.QueryParams,
    opts?: ComAtprotoAdminGetInviteCodes.CallOptions,
  ): Promise<ComAtprotoAdminGetInviteCodes.Response> {
    return this._client.call(
      "com.atproto.admin.getInviteCodes",
      params,
      undefined,
      opts,
    );
  }

  getSubjectStatus(
    params?: ComAtprotoAdminGetSubjectStatus.QueryParams,
    opts?: ComAtprotoAdminGetSubjectStatus.CallOptions,
  ): Promise<ComAtprotoAdminGetSubjectStatus.Response> {
    return this._client.call(
      "com.atproto.admin.getSubjectStatus",
      params,
      undefined,
      opts,
    );
  }

  searchAccounts(
    params?: ComAtprotoAdminSearchAccounts.QueryParams,
    opts?: ComAtprotoAdminSearchAccounts.CallOptions,
  ): Promise<ComAtprotoAdminSearchAccounts.Response> {
    return this._client.call(
      "com.atproto.admin.searchAccounts",
      params,
      undefined,
      opts,
    );
  }

  sendEmail(
    data?: ComAtprotoAdminSendEmail.InputSchema,
    opts?: ComAtprotoAdminSendEmail.CallOptions,
  ): Promise<ComAtprotoAdminSendEmail.Response> {
    return this._client.call(
      "com.atproto.admin.sendEmail",
      opts?.qp,
      data,
      opts,
    );
  }

  updateAccountEmail(
    data?: ComAtprotoAdminUpdateAccountEmail.InputSchema,
    opts?: ComAtprotoAdminUpdateAccountEmail.CallOptions,
  ): Promise<ComAtprotoAdminUpdateAccountEmail.Response> {
    return this._client.call(
      "com.atproto.admin.updateAccountEmail",
      opts?.qp,
      data,
      opts,
    );
  }

  updateAccountHandle(
    data?: ComAtprotoAdminUpdateAccountHandle.InputSchema,
    opts?: ComAtprotoAdminUpdateAccountHandle.CallOptions,
  ): Promise<ComAtprotoAdminUpdateAccountHandle.Response> {
    return this._client.call(
      "com.atproto.admin.updateAccountHandle",
      opts?.qp,
      data,
      opts,
    );
  }

  updateAccountPassword(
    data?: ComAtprotoAdminUpdateAccountPassword.InputSchema,
    opts?: ComAtprotoAdminUpdateAccountPassword.CallOptions,
  ): Promise<ComAtprotoAdminUpdateAccountPassword.Response> {
    return this._client.call(
      "com.atproto.admin.updateAccountPassword",
      opts?.qp,
      data,
      opts,
    );
  }

  updateSubjectStatus(
    data?: ComAtprotoAdminUpdateSubjectStatus.InputSchema,
    opts?: ComAtprotoAdminUpdateSubjectStatus.CallOptions,
  ): Promise<ComAtprotoAdminUpdateSubjectStatus.Response> {
    return this._client.call(
      "com.atproto.admin.updateSubjectStatus",
      opts?.qp,
      data,
      opts,
    );
  }
}

export class ComAtprotoIdentityNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  getRecommendedDidCredentials(
    params?: ComAtprotoIdentityGetRecommendedDidCredentials.QueryParams,
    opts?: ComAtprotoIdentityGetRecommendedDidCredentials.CallOptions,
  ): Promise<ComAtprotoIdentityGetRecommendedDidCredentials.Response> {
    return this._client.call(
      "com.atproto.identity.getRecommendedDidCredentials",
      params,
      undefined,
      opts,
    );
  }

  requestPlcOperationSignature(
    data?: ComAtprotoIdentityRequestPlcOperationSignature.InputSchema,
    opts?: ComAtprotoIdentityRequestPlcOperationSignature.CallOptions,
  ): Promise<ComAtprotoIdentityRequestPlcOperationSignature.Response> {
    return this._client.call(
      "com.atproto.identity.requestPlcOperationSignature",
      opts?.qp,
      data,
      opts,
    );
  }

  resolveHandle(
    params?: ComAtprotoIdentityResolveHandle.QueryParams,
    opts?: ComAtprotoIdentityResolveHandle.CallOptions,
  ): Promise<ComAtprotoIdentityResolveHandle.Response> {
    return this._client.call(
      "com.atproto.identity.resolveHandle",
      params,
      undefined,
      opts,
    );
  }

  signPlcOperation(
    data?: ComAtprotoIdentitySignPlcOperation.InputSchema,
    opts?: ComAtprotoIdentitySignPlcOperation.CallOptions,
  ): Promise<ComAtprotoIdentitySignPlcOperation.Response> {
    return this._client.call(
      "com.atproto.identity.signPlcOperation",
      opts?.qp,
      data,
      opts,
    );
  }

  submitPlcOperation(
    data?: ComAtprotoIdentitySubmitPlcOperation.InputSchema,
    opts?: ComAtprotoIdentitySubmitPlcOperation.CallOptions,
  ): Promise<ComAtprotoIdentitySubmitPlcOperation.Response> {
    return this._client.call(
      "com.atproto.identity.submitPlcOperation",
      opts?.qp,
      data,
      opts,
    );
  }

  updateHandle(
    data?: ComAtprotoIdentityUpdateHandle.InputSchema,
    opts?: ComAtprotoIdentityUpdateHandle.CallOptions,
  ): Promise<ComAtprotoIdentityUpdateHandle.Response> {
    return this._client.call(
      "com.atproto.identity.updateHandle",
      opts?.qp,
      data,
      opts,
    );
  }
}

export class ComAtprotoLabelNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  queryLabels(
    params?: ComAtprotoLabelQueryLabels.QueryParams,
    opts?: ComAtprotoLabelQueryLabels.CallOptions,
  ): Promise<ComAtprotoLabelQueryLabels.Response> {
    return this._client.call(
      "com.atproto.label.queryLabels",
      params,
      undefined,
      opts,
    );
  }
}

export class ComAtprotoModerationNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  createReport(
    data?: ComAtprotoModerationCreateReport.InputSchema,
    opts?: ComAtprotoModerationCreateReport.CallOptions,
  ): Promise<ComAtprotoModerationCreateReport.Response> {
    return this._client.call(
      "com.atproto.moderation.createReport",
      opts?.qp,
      data,
      opts,
    );
  }
}

export class ComAtprotoRepoNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  applyWrites(
    data?: ComAtprotoRepoApplyWrites.InputSchema,
    opts?: ComAtprotoRepoApplyWrites.CallOptions,
  ): Promise<ComAtprotoRepoApplyWrites.Response> {
    return this._client
      .call("com.atproto.repo.applyWrites", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoApplyWrites.toKnownErr(e);
      });
  }

  createRecord(
    data?: ComAtprotoRepoCreateRecord.InputSchema,
    opts?: ComAtprotoRepoCreateRecord.CallOptions,
  ): Promise<ComAtprotoRepoCreateRecord.Response> {
    return this._client
      .call("com.atproto.repo.createRecord", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoCreateRecord.toKnownErr(e);
      });
  }

  deleteRecord(
    data?: ComAtprotoRepoDeleteRecord.InputSchema,
    opts?: ComAtprotoRepoDeleteRecord.CallOptions,
  ): Promise<ComAtprotoRepoDeleteRecord.Response> {
    return this._client
      .call("com.atproto.repo.deleteRecord", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoDeleteRecord.toKnownErr(e);
      });
  }

  describeRepo(
    params?: ComAtprotoRepoDescribeRepo.QueryParams,
    opts?: ComAtprotoRepoDescribeRepo.CallOptions,
  ): Promise<ComAtprotoRepoDescribeRepo.Response> {
    return this._client.call(
      "com.atproto.repo.describeRepo",
      params,
      undefined,
      opts,
    );
  }

  getRecord(
    params?: ComAtprotoRepoGetRecord.QueryParams,
    opts?: ComAtprotoRepoGetRecord.CallOptions,
  ): Promise<ComAtprotoRepoGetRecord.Response> {
    return this._client
      .call("com.atproto.repo.getRecord", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoRepoGetRecord.toKnownErr(e);
      });
  }

  importRepo(
    data?: ComAtprotoRepoImportRepo.InputSchema,
    opts?: ComAtprotoRepoImportRepo.CallOptions,
  ): Promise<ComAtprotoRepoImportRepo.Response> {
    return this._client.call(
      "com.atproto.repo.importRepo",
      opts?.qp,
      data,
      opts,
    );
  }

  listMissingBlobs(
    params?: ComAtprotoRepoListMissingBlobs.QueryParams,
    opts?: ComAtprotoRepoListMissingBlobs.CallOptions,
  ): Promise<ComAtprotoRepoListMissingBlobs.Response> {
    return this._client.call(
      "com.atproto.repo.listMissingBlobs",
      params,
      undefined,
      opts,
    );
  }

  listRecords(
    params?: ComAtprotoRepoListRecords.QueryParams,
    opts?: ComAtprotoRepoListRecords.CallOptions,
  ): Promise<ComAtprotoRepoListRecords.Response> {
    return this._client.call(
      "com.atproto.repo.listRecords",
      params,
      undefined,
      opts,
    );
  }

  putRecord(
    data?: ComAtprotoRepoPutRecord.InputSchema,
    opts?: ComAtprotoRepoPutRecord.CallOptions,
  ): Promise<ComAtprotoRepoPutRecord.Response> {
    return this._client
      .call("com.atproto.repo.putRecord", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoPutRecord.toKnownErr(e);
      });
  }

  uploadBlob(
    data?: ComAtprotoRepoUploadBlob.InputSchema,
    opts?: ComAtprotoRepoUploadBlob.CallOptions,
  ): Promise<ComAtprotoRepoUploadBlob.Response> {
    return this._client.call(
      "com.atproto.repo.uploadBlob",
      opts?.qp,
      data,
      opts,
    );
  }
}

export class ComAtprotoServerNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  activateAccount(
    data?: ComAtprotoServerActivateAccount.InputSchema,
    opts?: ComAtprotoServerActivateAccount.CallOptions,
  ): Promise<ComAtprotoServerActivateAccount.Response> {
    return this._client.call(
      "com.atproto.server.activateAccount",
      opts?.qp,
      data,
      opts,
    );
  }

  checkAccountStatus(
    params?: ComAtprotoServerCheckAccountStatus.QueryParams,
    opts?: ComAtprotoServerCheckAccountStatus.CallOptions,
  ): Promise<ComAtprotoServerCheckAccountStatus.Response> {
    return this._client.call(
      "com.atproto.server.checkAccountStatus",
      params,
      undefined,
      opts,
    );
  }

  confirmEmail(
    data?: ComAtprotoServerConfirmEmail.InputSchema,
    opts?: ComAtprotoServerConfirmEmail.CallOptions,
  ): Promise<ComAtprotoServerConfirmEmail.Response> {
    return this._client
      .call("com.atproto.server.confirmEmail", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerConfirmEmail.toKnownErr(e);
      });
  }

  createAccount(
    data?: ComAtprotoServerCreateAccount.InputSchema,
    opts?: ComAtprotoServerCreateAccount.CallOptions,
  ): Promise<ComAtprotoServerCreateAccount.Response> {
    return this._client
      .call("com.atproto.server.createAccount", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerCreateAccount.toKnownErr(e);
      });
  }

  createAppPassword(
    data?: ComAtprotoServerCreateAppPassword.InputSchema,
    opts?: ComAtprotoServerCreateAppPassword.CallOptions,
  ): Promise<ComAtprotoServerCreateAppPassword.Response> {
    return this._client
      .call("com.atproto.server.createAppPassword", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerCreateAppPassword.toKnownErr(e);
      });
  }

  createInviteCode(
    data?: ComAtprotoServerCreateInviteCode.InputSchema,
    opts?: ComAtprotoServerCreateInviteCode.CallOptions,
  ): Promise<ComAtprotoServerCreateInviteCode.Response> {
    return this._client.call(
      "com.atproto.server.createInviteCode",
      opts?.qp,
      data,
      opts,
    );
  }

  createInviteCodes(
    data?: ComAtprotoServerCreateInviteCodes.InputSchema,
    opts?: ComAtprotoServerCreateInviteCodes.CallOptions,
  ): Promise<ComAtprotoServerCreateInviteCodes.Response> {
    return this._client.call(
      "com.atproto.server.createInviteCodes",
      opts?.qp,
      data,
      opts,
    );
  }

  createSession(
    data?: ComAtprotoServerCreateSession.InputSchema,
    opts?: ComAtprotoServerCreateSession.CallOptions,
  ): Promise<ComAtprotoServerCreateSession.Response> {
    return this._client
      .call("com.atproto.server.createSession", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerCreateSession.toKnownErr(e);
      });
  }

  deactivateAccount(
    data?: ComAtprotoServerDeactivateAccount.InputSchema,
    opts?: ComAtprotoServerDeactivateAccount.CallOptions,
  ): Promise<ComAtprotoServerDeactivateAccount.Response> {
    return this._client.call(
      "com.atproto.server.deactivateAccount",
      opts?.qp,
      data,
      opts,
    );
  }

  deleteAccount(
    data?: ComAtprotoServerDeleteAccount.InputSchema,
    opts?: ComAtprotoServerDeleteAccount.CallOptions,
  ): Promise<ComAtprotoServerDeleteAccount.Response> {
    return this._client
      .call("com.atproto.server.deleteAccount", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerDeleteAccount.toKnownErr(e);
      });
  }

  deleteSession(
    data?: ComAtprotoServerDeleteSession.InputSchema,
    opts?: ComAtprotoServerDeleteSession.CallOptions,
  ): Promise<ComAtprotoServerDeleteSession.Response> {
    return this._client.call(
      "com.atproto.server.deleteSession",
      opts?.qp,
      data,
      opts,
    );
  }

  describeServer(
    params?: ComAtprotoServerDescribeServer.QueryParams,
    opts?: ComAtprotoServerDescribeServer.CallOptions,
  ): Promise<ComAtprotoServerDescribeServer.Response> {
    return this._client.call(
      "com.atproto.server.describeServer",
      params,
      undefined,
      opts,
    );
  }

  getAccountInviteCodes(
    params?: ComAtprotoServerGetAccountInviteCodes.QueryParams,
    opts?: ComAtprotoServerGetAccountInviteCodes.CallOptions,
  ): Promise<ComAtprotoServerGetAccountInviteCodes.Response> {
    return this._client
      .call("com.atproto.server.getAccountInviteCodes", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoServerGetAccountInviteCodes.toKnownErr(e);
      });
  }

  getServiceAuth(
    params?: ComAtprotoServerGetServiceAuth.QueryParams,
    opts?: ComAtprotoServerGetServiceAuth.CallOptions,
  ): Promise<ComAtprotoServerGetServiceAuth.Response> {
    return this._client
      .call("com.atproto.server.getServiceAuth", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoServerGetServiceAuth.toKnownErr(e);
      });
  }

  getSession(
    params?: ComAtprotoServerGetSession.QueryParams,
    opts?: ComAtprotoServerGetSession.CallOptions,
  ): Promise<ComAtprotoServerGetSession.Response> {
    return this._client.call(
      "com.atproto.server.getSession",
      params,
      undefined,
      opts,
    );
  }

  listAppPasswords(
    params?: ComAtprotoServerListAppPasswords.QueryParams,
    opts?: ComAtprotoServerListAppPasswords.CallOptions,
  ): Promise<ComAtprotoServerListAppPasswords.Response> {
    return this._client
      .call("com.atproto.server.listAppPasswords", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoServerListAppPasswords.toKnownErr(e);
      });
  }

  refreshSession(
    data?: ComAtprotoServerRefreshSession.InputSchema,
    opts?: ComAtprotoServerRefreshSession.CallOptions,
  ): Promise<ComAtprotoServerRefreshSession.Response> {
    return this._client
      .call("com.atproto.server.refreshSession", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerRefreshSession.toKnownErr(e);
      });
  }

  requestAccountDelete(
    data?: ComAtprotoServerRequestAccountDelete.InputSchema,
    opts?: ComAtprotoServerRequestAccountDelete.CallOptions,
  ): Promise<ComAtprotoServerRequestAccountDelete.Response> {
    return this._client.call(
      "com.atproto.server.requestAccountDelete",
      opts?.qp,
      data,
      opts,
    );
  }

  requestEmailConfirmation(
    data?: ComAtprotoServerRequestEmailConfirmation.InputSchema,
    opts?: ComAtprotoServerRequestEmailConfirmation.CallOptions,
  ): Promise<ComAtprotoServerRequestEmailConfirmation.Response> {
    return this._client.call(
      "com.atproto.server.requestEmailConfirmation",
      opts?.qp,
      data,
      opts,
    );
  }

  requestEmailUpdate(
    data?: ComAtprotoServerRequestEmailUpdate.InputSchema,
    opts?: ComAtprotoServerRequestEmailUpdate.CallOptions,
  ): Promise<ComAtprotoServerRequestEmailUpdate.Response> {
    return this._client.call(
      "com.atproto.server.requestEmailUpdate",
      opts?.qp,
      data,
      opts,
    );
  }

  requestPasswordReset(
    data?: ComAtprotoServerRequestPasswordReset.InputSchema,
    opts?: ComAtprotoServerRequestPasswordReset.CallOptions,
  ): Promise<ComAtprotoServerRequestPasswordReset.Response> {
    return this._client.call(
      "com.atproto.server.requestPasswordReset",
      opts?.qp,
      data,
      opts,
    );
  }

  reserveSigningKey(
    data?: ComAtprotoServerReserveSigningKey.InputSchema,
    opts?: ComAtprotoServerReserveSigningKey.CallOptions,
  ): Promise<ComAtprotoServerReserveSigningKey.Response> {
    return this._client.call(
      "com.atproto.server.reserveSigningKey",
      opts?.qp,
      data,
      opts,
    );
  }

  resetPassword(
    data?: ComAtprotoServerResetPassword.InputSchema,
    opts?: ComAtprotoServerResetPassword.CallOptions,
  ): Promise<ComAtprotoServerResetPassword.Response> {
    return this._client
      .call("com.atproto.server.resetPassword", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerResetPassword.toKnownErr(e);
      });
  }

  revokeAppPassword(
    data?: ComAtprotoServerRevokeAppPassword.InputSchema,
    opts?: ComAtprotoServerRevokeAppPassword.CallOptions,
  ): Promise<ComAtprotoServerRevokeAppPassword.Response> {
    return this._client.call(
      "com.atproto.server.revokeAppPassword",
      opts?.qp,
      data,
      opts,
    );
  }

  updateEmail(
    data?: ComAtprotoServerUpdateEmail.InputSchema,
    opts?: ComAtprotoServerUpdateEmail.CallOptions,
  ): Promise<ComAtprotoServerUpdateEmail.Response> {
    return this._client
      .call("com.atproto.server.updateEmail", opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoServerUpdateEmail.toKnownErr(e);
      });
  }
}

export class ComAtprotoSyncNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  getBlob(
    params?: ComAtprotoSyncGetBlob.QueryParams,
    opts?: ComAtprotoSyncGetBlob.CallOptions,
  ): Promise<ComAtprotoSyncGetBlob.Response> {
    return this._client
      .call("com.atproto.sync.getBlob", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetBlob.toKnownErr(e);
      });
  }

  getBlocks(
    params?: ComAtprotoSyncGetBlocks.QueryParams,
    opts?: ComAtprotoSyncGetBlocks.CallOptions,
  ): Promise<ComAtprotoSyncGetBlocks.Response> {
    return this._client
      .call("com.atproto.sync.getBlocks", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetBlocks.toKnownErr(e);
      });
  }

  getCheckout(
    params?: ComAtprotoSyncGetCheckout.QueryParams,
    opts?: ComAtprotoSyncGetCheckout.CallOptions,
  ): Promise<ComAtprotoSyncGetCheckout.Response> {
    return this._client.call(
      "com.atproto.sync.getCheckout",
      params,
      undefined,
      opts,
    );
  }

  getHead(
    params?: ComAtprotoSyncGetHead.QueryParams,
    opts?: ComAtprotoSyncGetHead.CallOptions,
  ): Promise<ComAtprotoSyncGetHead.Response> {
    return this._client
      .call("com.atproto.sync.getHead", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetHead.toKnownErr(e);
      });
  }

  getLatestCommit(
    params?: ComAtprotoSyncGetLatestCommit.QueryParams,
    opts?: ComAtprotoSyncGetLatestCommit.CallOptions,
  ): Promise<ComAtprotoSyncGetLatestCommit.Response> {
    return this._client
      .call("com.atproto.sync.getLatestCommit", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetLatestCommit.toKnownErr(e);
      });
  }

  getRecord(
    params?: ComAtprotoSyncGetRecord.QueryParams,
    opts?: ComAtprotoSyncGetRecord.CallOptions,
  ): Promise<ComAtprotoSyncGetRecord.Response> {
    return this._client
      .call("com.atproto.sync.getRecord", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetRecord.toKnownErr(e);
      });
  }

  getRepo(
    params?: ComAtprotoSyncGetRepo.QueryParams,
    opts?: ComAtprotoSyncGetRepo.CallOptions,
  ): Promise<ComAtprotoSyncGetRepo.Response> {
    return this._client
      .call("com.atproto.sync.getRepo", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetRepo.toKnownErr(e);
      });
  }

  getRepoStatus(
    params?: ComAtprotoSyncGetRepoStatus.QueryParams,
    opts?: ComAtprotoSyncGetRepoStatus.CallOptions,
  ): Promise<ComAtprotoSyncGetRepoStatus.Response> {
    return this._client
      .call("com.atproto.sync.getRepoStatus", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncGetRepoStatus.toKnownErr(e);
      });
  }

  listBlobs(
    params?: ComAtprotoSyncListBlobs.QueryParams,
    opts?: ComAtprotoSyncListBlobs.CallOptions,
  ): Promise<ComAtprotoSyncListBlobs.Response> {
    return this._client
      .call("com.atproto.sync.listBlobs", params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoSyncListBlobs.toKnownErr(e);
      });
  }

  listRepos(
    params?: ComAtprotoSyncListRepos.QueryParams,
    opts?: ComAtprotoSyncListRepos.CallOptions,
  ): Promise<ComAtprotoSyncListRepos.Response> {
    return this._client.call(
      "com.atproto.sync.listRepos",
      params,
      undefined,
      opts,
    );
  }

  notifyOfUpdate(
    data?: ComAtprotoSyncNotifyOfUpdate.InputSchema,
    opts?: ComAtprotoSyncNotifyOfUpdate.CallOptions,
  ): Promise<ComAtprotoSyncNotifyOfUpdate.Response> {
    return this._client.call(
      "com.atproto.sync.notifyOfUpdate",
      opts?.qp,
      data,
      opts,
    );
  }

  requestCrawl(
    data?: ComAtprotoSyncRequestCrawl.InputSchema,
    opts?: ComAtprotoSyncRequestCrawl.CallOptions,
  ): Promise<ComAtprotoSyncRequestCrawl.Response> {
    return this._client.call(
      "com.atproto.sync.requestCrawl",
      opts?.qp,
      data,
      opts,
    );
  }
}

export class ComAtprotoTempNS {
  _client: XrpcClient;

  constructor(client: XrpcClient) {
    this._client = client;
  }

  addReservedHandle(
    data?: ComAtprotoTempAddReservedHandle.InputSchema,
    opts?: ComAtprotoTempAddReservedHandle.CallOptions,
  ): Promise<ComAtprotoTempAddReservedHandle.Response> {
    return this._client.call(
      "com.atproto.temp.addReservedHandle",
      opts?.qp,
      data,
      opts,
    );
  }

  checkSignupQueue(
    params?: ComAtprotoTempCheckSignupQueue.QueryParams,
    opts?: ComAtprotoTempCheckSignupQueue.CallOptions,
  ): Promise<ComAtprotoTempCheckSignupQueue.Response> {
    return this._client.call(
      "com.atproto.temp.checkSignupQueue",
      params,
      undefined,
      opts,
    );
  }

  fetchLabels(
    params?: ComAtprotoTempFetchLabels.QueryParams,
    opts?: ComAtprotoTempFetchLabels.CallOptions,
  ): Promise<ComAtprotoTempFetchLabels.Response> {
    return this._client.call(
      "com.atproto.temp.fetchLabels",
      params,
      undefined,
      opts,
    );
  }

  requestPhoneVerification(
    data?: ComAtprotoTempRequestPhoneVerification.InputSchema,
    opts?: ComAtprotoTempRequestPhoneVerification.CallOptions,
  ): Promise<ComAtprotoTempRequestPhoneVerification.Response> {
    return this._client.call(
      "com.atproto.temp.requestPhoneVerification",
      opts?.qp,
      data,
      opts,
    );
  }
}
