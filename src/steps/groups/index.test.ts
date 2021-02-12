import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchGroups } from '.';
import { withRecording } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import { GroupEntities, GroupRelationships } from './constants';
import { fetchOrgs } from '../orgs';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import { fetchUsers } from '../users';

describe('#fetchGroups', () => {
  test('should collect data', async () => {
    await withRecording('fetchGroups', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig
      });

      await fetchOrgs(context);
      await fetchGroups(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships: context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      expect(
        context.jobState.collectedEntities.filter(
          (e) => e._type === GroupEntities.GROUP._type,
        ),
      ).toMatchGraphObjectSchema({
        _class: ['Group'],
        schema: {
          additionalProperties: false,
          properties: {
            _type: { const: 'jumpcloud_group' },
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            attributes: { type: 'string' },
          },
        },
      });

      expect(
        context.jobState.collectedRelationships.filter(
          (r) => r._type === GroupRelationships.ORG_HAS_GROUP._type
        )
      ).toMatchDirectRelationshipSchema({
        schema: {
          properties: {
            _class: { const: RelationshipClass.HAS },
            _type: { const: 'jumpcloud_account_has_group' },
          },
        },
      });
    });
  });
});

describe('#fetchGroupMembers', () => {
  test('should collect data', async () => {
    await withRecording('fetchGroups', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig
      });

      await fetchOrgs(context);
      await fetchUsers(context);
      await fetchGroups(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships: context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      expect(
        context.jobState.collectedRelationships.filter(
          (r) => r._type === GroupRelationships.GROUP_HAS_USER._type
        )
      ).toMatchDirectRelationshipSchema({
        schema: {
          properties: {
            _class: { const: RelationshipClass.HAS },
            _type: { const: 'jumpcloud_group_has_user' },
          },
        },
      });
    });
  });
});
