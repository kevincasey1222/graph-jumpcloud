import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { instanceConfigFields, IntegrationConfig } from './config';
import { groupSteps } from './steps/groups';
import { orgSteps } from './steps/orgs';
import { userSteps } from './steps/users';
import { appSteps } from './steps/applications';
import { validateInvocation } from './validator';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [...orgSteps, ...userSteps, ...groupSteps, ...appSteps],
};
