import { RelationshipClass, StepEntityMetadata, StepRelationshipMetadata } from "@jupiterone/integration-sdk-core";
import { OrgEntities } from "../orgs/constants";
import { UserEntities } from "../users/constants";

export const GroupEntities: Record<
  'GROUP',
  StepEntityMetadata
> = {
  GROUP: {
    _type: 'jumpcloud_group',
    _class: ['Group'],
    resourceName: 'Group',
  },
};

export const GroupRelationships: Record<
  'ORG_HAS_GROUP' |
  'GROUP_HAS_USER',
  StepRelationshipMetadata
> = {
  ORG_HAS_GROUP: {
    _type: 'jumpcloud_account_has_group',
    _class: RelationshipClass.HAS,
    sourceType: OrgEntities.ORG._type,
    targetType: GroupEntities.GROUP._type,
  },
  GROUP_HAS_USER: {
    _type: 'jumpcloud_group_has_user',
    _class: RelationshipClass.HAS,
    sourceType: GroupEntities.GROUP._type,
    targetType: UserEntities.USER._type,
  },
};
