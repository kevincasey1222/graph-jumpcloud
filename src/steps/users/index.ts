import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  IntegrationError,
} from '@jupiterone/integration-sdk-core';
import { JumpCloudClient } from '../../jumpcloud/client';
import { IntegrationConfig } from '../../config';
import { createUserEntity } from './converters';
import { UserEntities, UserRelationships } from './constants';
import { PRIORITY_ORG_CACHE_KEY } from '../orgs/constants';

export async function fetchUsers({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new JumpCloudClient({
    logger,
    apiKey: instance.config.apiKey,
  });

  const orgEntity = await jobState.getData<Entity>(PRIORITY_ORG_CACHE_KEY);
  if (!orgEntity) {
    throw new IntegrationError({
      message: 'Expected fetch-orgs to have set the Org Entity in the jobstate',
      code: 'ORG_LIST_FAILED',
      fatal: true,
    });
  }

  await client.iterateUsers(async (user) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: orgEntity,
        to: userEntity,
      }),
    );
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [UserEntities.USER],
    relationships: [UserRelationships.ORG_HAS_USER],
    dependsOn: ['fetch-orgs'],
    executionHandler: fetchUsers,
  },
];
