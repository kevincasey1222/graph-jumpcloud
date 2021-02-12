import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { JumpCloudOrg } from '../../jumpcloud/types';
import { consoleBaseUrl } from '../../jumpcloud/url';
import { OrgEntities } from './constants';

export function createOrgEntity(data: JumpCloudOrg) {
  const orgId = data.id || (data._id as string);

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: orgId,
        _type: OrgEntities.ORG._type,
        _class: OrgEntities.ORG._class,
        id: orgId,
        displayName: data.displayName || undefined,
        name: data.displayName || orgId,
        logoUrl: data.logoUrl || undefined,
        createdOn: parseTimePropertyValue(data.created),
        webLink: consoleBaseUrl,
      },
    },
  });
}
