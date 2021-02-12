import { IntegrationInstanceConfig, IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  apiKey: {
    type: 'string',
    mask: true
  },
  orgId: {
    type: 'string',
    mask: false
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  apiKey: string;
  orgId?: string;
}
