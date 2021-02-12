import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchUsers } from '.';
import { withRecording } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import { UserEntities, UserRelationships } from './constants';
import { fetchOrgs } from '../orgs';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

describe('#fetchUsers', () => {
  test('should collect data', async () => {
    await withRecording('fetchUsers', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig
      });

      await fetchOrgs(context);
      await fetchUsers(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships: context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      expect(
        context.jobState.collectedEntities.filter(
          (e) => e._type === UserEntities.USER._type,
        ),
      ).toMatchGraphObjectSchema({
        _class: ['User'],
        schema: {
          additionalProperties: false,
          properties: {
            _type: { const: 'jumpcloud_user' },
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            active: { type: 'boolean' },
            suspended: { type: 'boolean' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            login: { type: 'string' },
            employeeType: { type: 'string' },
            employeeId: { type: 'string' },
            company: { type: 'string' },
            department: { type: 'string' },
            jobTitle: { type: 'string' },
            mfaEnabled: { type: 'boolean' },
            mfaExclusion: { type: 'boolean' },
            mfaExclusionUntil: { type: 'number' },
            mfaConfigured: { type: 'boolean' },
            externallyManaged: { type: 'boolean' },
            ldapBindingUser: { type: 'boolean' },
            sambaServiceUser: { type: 'boolean' },
            sudo: { type: 'boolean' },
          },
        },
      });

      expect(
        context.jobState.collectedRelationships.filter(
          (r) => r._type === UserRelationships.ORG_HAS_USER._type
        )
      ).toMatchDirectRelationshipSchema({
        schema: {
          properties: {
            _class: { const: RelationshipClass.HAS },
            _type: { const: 'jumpcloud_account_has_user' },
          },
        },
      });
    });
  });
});
