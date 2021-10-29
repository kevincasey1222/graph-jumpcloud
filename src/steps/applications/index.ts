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
import { ApplicationEntities, ApplicationRelationships } from './constants';
import { createApplicationEntity } from './converters';
import { PRIORITY_ORG_CACHE_KEY } from '../orgs/constants';

export async function fetchApplications({
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

  await client.iterateApps(async (application) => {
    const appEntity = await jobState.addEntity(
      createApplicationEntity(application),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: orgEntity,
        to: appEntity,
      }),
    );
  });
}

export async function fetchApplicationMembers({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new JumpCloudClient({
    logger,
    apiKey: instance.config.apiKey,
  });

  await jobState.iterateEntities(
    {
      _type: ApplicationEntities.APPLICATION._type,
    },
    async (appEntity) => {
      const appId = appEntity.id as string;

      /*
      await client.iterateGroupMembers(groupId, async (member) => {
        const memberUserId = member.to?.id;

        if (!memberUserId) {
          return;
        }

        const userEntity = await jobState.findEntity(memberUserId);

        if (!userEntity) {
          // It's possible that this user was created in between the time that
          // we collected all users and now. We should just ignore this one and
          // carry on!
          return;
        }

        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: appEntity,
            to: userEntity,
          }),
        );
      }); */
    },
  );
}

export const appSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-applications',
    name: 'Fetch Applications',
    entities: [ApplicationEntities.APPLICATION],
    relationships: [ApplicationRelationships.ORG_HAS_APPLICATION],
    dependsOn: ['fetch-orgs'],
    executionHandler: fetchApplications,
  },
  {
    id: 'fetch-application-members',
    name: 'Fetch Application Members',
    entities: [],
    relationships: [
      ApplicationRelationships.USER_ASSIGNED_APPLICATION,
      ApplicationRelationships.GROUP_ASSIGNED_APPLICATION,
    ],
    dependsOn: ['fetch-applications'],
    executionHandler: fetchApplicationMembers,
  },
];
