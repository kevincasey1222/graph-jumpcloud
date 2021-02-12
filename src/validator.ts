import {
  IntegrationError,
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { JumpCloudClient } from './jumpcloud/client';
import { BaseIntegrationConfig } from './config';

export async function validateInvocation(
  context: IntegrationExecutionContext<BaseIntegrationConfig>,
) {
  const { instance, logger } = context;
  const { config } = instance;

  if (!config.apiKey) {
    throw new IntegrationValidationError(
      'Config requires all of {apiKey}',
    );
  }

  const client = new JumpCloudClient({
    logger,
    apiKey: config.apiKey,
    orgId: config.orgId
  });

  try {
    const response = await client.listOrgs();

    if (!response.results || !response.results.length) {
      throw new IntegrationError({
        message: 'Failed to list JumpCloud organizations',
        code: 'ORG_LIST_FAILED',
        fatal: true,
      });
    }
  } catch (err) {
    if (!(err instanceof IntegrationError)) {
      throw new IntegrationValidationError(err.message);
    } else {
      throw err;
    }
  }
}
