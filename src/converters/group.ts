import { IntegrationRelationship } from "@jupiterone/jupiter-managed-integration-sdk";

import { JumpCloudGroup } from "../provider/types";
import { JumpCloudGroupEntity } from "../types";
import getTime from "../util/getTime";
import { consoleBaseUrl, createHasRelationship } from "./";

export const SYSTEM_GROUP_ENTITY_TYPE = "jumpcloud_system_group";
export const USER_GROUP_ENTITY_TYPE = "jumpcloud_user_group";

export const GROUP_SYSTEM_RELATIONSHIP_TYPE = "jumpcloud_group_has_system";
export const GROUP_USER_RELATIONSHIP_TYPE = "jumpcloud_group_has_user";

export function createUserGroupEntity(
  data: JumpCloudGroup,
): JumpCloudGroupEntity {
  const entity: JumpCloudGroupEntity = {
    _key: data.id as string,
    _type: USER_GROUP_ENTITY_TYPE,
    _class: "UserGroup",
    _rawData: [{ name: "default", rawData: data }],
    id: data.id as string,
    name: data.name as string,
    displayName: data.name as string,
    createdOn: getTime(data.created),
    attributes: data.attributes && JSON.stringify(data.attributes),
    webLink: `${consoleBaseUrl}/#/groups/user/${data.id}/details`,
  };
  return entity;
}

export function createSystemGroupEntity(
  data: JumpCloudGroup,
): JumpCloudGroupEntity {
  const entity: JumpCloudGroupEntity = {
    _key: data.id as string,
    _type: SYSTEM_GROUP_ENTITY_TYPE,
    _class: "Group",
    _rawData: [{ name: "default", rawData: data }],
    id: data.id as string,
    name: data.name as string,
    displayName: data.name as string,
    createdOn: getTime(data.created),
    attributes: data.attributes && JSON.stringify(data.attributes),
    webLink: `${consoleBaseUrl}/#/groups/user/${data.id}/details`,
  };
  return entity;
}

export function createGroupUserRelationship(
  groupId: string,
  userId: string,
): IntegrationRelationship {
  return createHasRelationship(groupId, userId, GROUP_USER_RELATIONSHIP_TYPE);
}
