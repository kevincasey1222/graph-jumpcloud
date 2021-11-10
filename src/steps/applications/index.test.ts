import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchApplicationMembers, fetchApplications } from '.';
import { withRecording } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import { ApplicationEntities, ApplicationRelationships } from './constants';
import { fetchOrgs } from '../orgs';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import { fetchUsers } from '../users';
import { fetchGroups } from '../groups';

describe('#fetchApplications', () => {
  test('should collect data', async () => {
    await withRecording('fetchApplications', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig,
      });

      await fetchOrgs(context);
      await fetchApplications(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships:
          context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      expect(
        context.jobState.collectedEntities.filter(
          (e) => e._type === ApplicationEntities.APPLICATION._type,
        ),
      ).toMatchGraphObjectSchema({
        _class: ['Application'],
        schema: {
          additionalProperties: true,
          properties: {
            _type: { const: 'jumpcloud_application' },
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
          (r) => r._type === ApplicationRelationships.ORG_HAS_APPLICATION._type,
        ),
      ).toMatchDirectRelationshipSchema({
        schema: {
          properties: {
            _class: { const: RelationshipClass.HAS },
            _type: { const: 'jumpcloud_account_has_application' },
          },
        },
      });
    });
  });
});

describe('#fetchAppBoundUsersAndGroups', () => {
  test('should collect data', async () => {
    await withRecording('fetchApplications', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig,
      });

      await fetchOrgs(context);
      await fetchUsers(context);
      await fetchGroups(context);
      await fetchApplications(context);
      await fetchApplicationMembers(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships:
          context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      expect(
        context.jobState.collectedRelationships.filter(
          (r) =>
            r._type ===
            ApplicationRelationships.USER_ASSIGNED_APPLICATION._type,
        ),
      ).toMatchDirectRelationshipSchema({
        schema: {
          properties: {
            _class: { const: RelationshipClass.ASSIGNED },
            _type: { const: 'jumpcloud_user_assigned_application' },
          },
        },
      });

      expect(
        context.jobState.collectedRelationships.filter(
          (r) =>
            r._type ===
            ApplicationRelationships.GROUP_ASSIGNED_APPLICATION._type,
        ),
      ).toMatchDirectRelationshipSchema({
        schema: {
          properties: {
            _class: { const: RelationshipClass.ASSIGNED },
            _type: { const: 'jumpcloud_group_assigned_application' },
          },
        },
      });
    });
  });
});
