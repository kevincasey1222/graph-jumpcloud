import {
  IntegrationError,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { JumpCloudClient } from '../../jumpcloud/client';
import { IntegrationConfig } from '../../config';
import { createOrgEntity } from './converters';
import { OrgEntities } from './constants';
import { PRIORITY_ORG_CACHE_KEY } from './constants';

export async function fetchOrgs({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new JumpCloudClient({
    logger,
    apiKey: instance.config.apiKey,
  });

  const response = await client.listOrgs();

  if (!response.results || !response.results.length) {
    throw new IntegrationError({
      message: 'Failed to list JumpCloud organizations',
      code: 'ORG_LIST_FAILED',
      fatal: true,
    });
  }

  for (let i = 0; i < response.results.length; i++) {
    const org = response.results[i];
    const orgEntity = await jobState.addEntity(createOrgEntity(org));

    if (i === 0) {
      await jobState.setData(PRIORITY_ORG_CACHE_KEY, orgEntity);
    }
  }
}

export const orgSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-orgs',
    name: 'Fetch Organizations',
    entities: [OrgEntities.ORG],
    relationships: [],
    executionHandler: fetchOrgs,
  },
];
