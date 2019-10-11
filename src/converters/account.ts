import { IntegrationRelationship } from "@jupiterone/jupiter-managed-integration-sdk";

import { JumpCloudOrg } from "../provider/types";
import { JumpCloudAccountEntity, JumpCloudUserEntity } from "../types";
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
    displayName: data.displayName as string,
    name: data.displayName as string,
    logoUrl: data.logoUrl as string,
    webLink: consoleBaseUrl,
  };
}

export function createAccountUserRelationship(
  account: JumpCloudAccountEntity,
  user: JumpCloudUserEntity,
): IntegrationRelationship {
  return createHasRelationship(account, user, ACCOUNT_USER_RELATIONSHIP_TYPE);
}
