import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { JumpCloudApplication } from '../../jumpcloud/types';
import { getConsoleUrl } from '../../jumpcloud/url';
import { ApplicationEntities } from './constants';

export function createApplicationEntity(data: JumpCloudApplication) {
  const appId = data.id || (data._id as string);

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: appId,
        _type: ApplicationEntities.APPLICATION._type,
        _class: ApplicationEntities.APPLICATION._class,
        id: data.id as string,
        name: data.name as string,
        displayName: data.displayName as string,
        description: data.description,
        createdOn: parseTimePropertyValue(data.created),
        ssoUrl: data.ssoUrl,
        webLink: getConsoleUrl(`/#/sso/${data.id}/details`),
      },
    },
  });
}
