import { RelationshipClass, StepEntityMetadata, StepRelationshipMetadata } from "@jupiterone/integration-sdk-core";
import { OrgEntities } from "../orgs/constants";

export const UserEntities: Record<
  'USER',
  StepEntityMetadata
> = {
  USER: {
    _type: 'jumpcloud_user',
    _class: ['User'],
    resourceName: 'User',
  },
};

export const UserRelationships: Record<
  'ORG_HAS_USER',
  StepRelationshipMetadata
> = {
  ORG_HAS_USER: {
    _type: 'jumpcloud_account_has_user',
    _class: RelationshipClass.HAS,
    sourceType: OrgEntities.ORG._type,
    targetType: UserEntities.USER._type,
  },
};
