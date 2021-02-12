import { StepEntityMetadata } from "@jupiterone/integration-sdk-core";

export const OrgEntities: Record<
  'ORG',
  StepEntityMetadata
> = {
  ORG: {
    _type: 'jumpcloud_account',
    _class: ['Account', 'Organization'],
    resourceName: 'Organizations',
  },
};

export const PRIORITY_ORG_CACHE_KEY = 'priority_org';
