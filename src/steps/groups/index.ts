import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { JumpCloudClient } from '../../jumpcloud/client';
import { IntegrationConfig } from '../../config';
import { GroupEntities, GroupRelationships} from './constants';
import { createGroupEntity } from './converters';
import { PRIORITY_ORG_CACHE_KEY } from '../orgs/constants';

export async function fetchGroups({
  instance,
  jobState,
  logger
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new JumpCloudClient({
    logger,
    apiKey: instance.config.apiKey,
    orgId: instance.config.orgId
  });

  const orgEntity = await jobState.getData<Entity>(PRIORITY_ORG_CACHE_KEY);

  await client.iterateGroups(async (group) => {
    const groupEntity = await jobState.addEntity(
      createGroupEntity(group)
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: orgEntity,
        to: groupEntity,
      }),
    );
  });
}

export async function fetchGroupMembers({
  instance,
  jobState,
  logger
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new JumpCloudClient({
    logger,
    apiKey: instance.config.apiKey,
    orgId: instance.config.orgId
  });

  await jobState.iterateEntities({
    _type: GroupEntities.GROUP._type
  }, async (groupEntity) => {
    const groupId = groupEntity.id as string;

    await client.iterateGroupMembers(
      groupId,
      async (member) => {
        const memberUserId = member.to?.id;

        if (!memberUserId) {
          return;
        }

        const userEntity = await jobState.findEntity(memberUserId);

        if (!userEntity) {
          // It's possible that this user was created in between the time that
          // we collected all users and now. We should just ignore this one and
          // carry on!
          return
        }

        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: groupEntity,
            to: userEntity,
          }),
        );
      }
    );
  });
}

export const groupSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-groups',
    name: 'Fetch Groups',
    entities: [GroupEntities.GROUP],
    relationships: [
      GroupRelationships.ORG_HAS_GROUP,
    ],
    dependsOn: ['fetch-orgs'],
    executionHandler: fetchGroups,
  },
  {
    id: 'fetch-group-members',
    name: 'Fetch Group Members',
    entities: [],
    relationships: [
      GroupRelationships.GROUP_HAS_USER,
    ],
    dependsOn: ['fetch-groups'],
    executionHandler: fetchGroupMembers,
  },
];
