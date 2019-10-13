import { IntegrationRelationship } from "@jupiterone/jupiter-managed-integration-sdk";

import { JumpCloudOrg } from "../provider/types";
import { JumpCloudAccountEntity, JumpCloudUserEntity } from "../types";
import getTime from "../util/getTime";
import { consoleBaseUrl, createHasRelationship } from "./";

export const ACCOUNT_ENTITY_TYPE = "jumpcloud_account";
export const ACCOUNT_ENTITY_CLASS = ["Account", "Organization"];

export const ACCOUNT_USER_RELATIONSHIP_TYPE = "jumpcloud_account_has_user";

export function createAccountEntity(
  data: JumpCloudOrg,
): JumpCloudAccountEntity {
  return {
    _key: data.id || (data._id as string),
    _type: ACCOUNT_ENTITY_TYPE,
    _class: ACCOUNT_ENTITY_CLASS,
    id: data.id || (data._id as string),
    displayName: data.displayName as string,
    name: data.displayName as string,
    logoUrl: data.logoUrl as string,
    createdOn: getTime(data.created),
    webLink: consoleBaseUrl,
  };
}

export function createAccountUserRelationship(
  account: JumpCloudAccountEntity,
  user: JumpCloudUserEntity,
): IntegrationRelationship {
  return createHasRelationship(
    account._key,
    user._key,
    ACCOUNT_USER_RELATIONSHIP_TYPE,
  );
}
