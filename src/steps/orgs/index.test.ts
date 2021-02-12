import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchOrgs } from '.';
import { withRecording } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { IntegrationConfig } from '../../config';
import { OrgEntities } from './constants';

describe('#fetchOrgs', () => {
  test('should collect data', async () => {
    await withRecording('fetchOrgs', __dirname, async () => {
      const context = createMockStepExecutionContext<IntegrationConfig>({
        instanceConfig: integrationConfig
      });

      await fetchOrgs(context);

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships: context.jobState.collectedRelationships.length,
        collectedEntities: context.jobState.collectedEntities,
        collectedRelationships: context.jobState.collectedRelationships,
        encounteredTypes: context.jobState.encounteredTypes,
      }).toMatchSnapshot();

      expect(
        context.jobState.collectedEntities.filter(
          (e) => e._type === OrgEntities.ORG._type,
        ),
      ).toMatchGraphObjectSchema({
        _class: ['Account', 'Organization'],
        schema: {
          additionalProperties: false,
          properties: {
            _type: { const: 'jumpcloud_account' },
            _rawData: {
              type: 'array',
              items: { type: 'object' },
            },
            logoUrl: { type: 'string' },
          },
        },
      });
    });
  });
});
