import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { GroupEntities } from '../groups/constants';
import { UserEntities } from '../users/constants';
import { OrgEntities } from '../orgs/constants';

export const ApplicationEntities: Record<'APPLICATION', StepEntityMetadata> = {
  APPLICATION: {
    _type: 'jumpcloud_application',
    _class: ['Application'],
    resourceName: 'Application',
  },
};

export const ApplicationRelationships: Record<
  | 'USER_ASSIGNED_APPLICATION'
  | 'GROUP_ASSIGNED_APPLICATION'
  | 'ORG_HAS_APPLICATION',
  StepRelationshipMetadata
> = {
  USER_ASSIGNED_APPLICATION: {
    _type: 'jumpcloud_user_assigned_application',
    _class: RelationshipClass.ASSIGNED,
    sourceType: UserEntities.USER._type,
    targetType: ApplicationEntities.APPLICATION._type,
  },
  GROUP_ASSIGNED_APPLICATION: {
    _type: 'jumpcloud_group_assigned_application',
    _class: RelationshipClass.ASSIGNED,
    sourceType: GroupEntities.GROUP._type,
    targetType: ApplicationEntities.APPLICATION._type,
  },
  ORG_HAS_APPLICATION: {
    _type: 'jumpcloud_account_has_application',
    _class: RelationshipClass.HAS,
    sourceType: OrgEntities.ORG._type,
    targetType: ApplicationEntities.APPLICATION._type,
  },
};
