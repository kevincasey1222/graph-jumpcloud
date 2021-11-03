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
      await client.iterateAppBoundUsers(appId, async (user) => {
        console.log(`User: ${JSON.stringify(user, null, 2)}`);
        const userId = user.id;
        if (!userId) {
          return;
        }
        const userEntity = await jobState.findEntity(userId);

        if (!userEntity) {
          // It's possible that this user was created in between the time that
          // we collected all users and now. Just ignore this one and carry on!
          return;
        }

        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.ASSIGNED,
            from: userEntity,
            to: appEntity,
          }),
        );
      });

      await client.iterateAppBoundGroups(appId, async (group) => {
        console.log(`Group: ${JSON.stringify(group, null, 2)}`);
        const groupId = group.id;
        if (!groupId) {
          return;
        }
        const groupEntity = await jobState.findEntity(groupId);

        if (!groupEntity) {
          // It's possible that this group was created in between the time that
          // we collected all groups and now. Just ignore this one and carry on!
          return;
        }
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.ASSIGNED,
            from: groupEntity,
            to: appEntity,
          }),
        );
      });
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
    dependsOn: ['fetch-applications', 'fetch-users', 'fetch-groups'],
    executionHandler: fetchApplicationMembers,
  },
];
