import {
  IntegrationError,
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { JumpCloudClient } from './jumpcloud/client';
import { IntegrationConfig } from './config';

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { instance, logger } = context;
  const { config } = instance;

  if (!config.apiKey) {
    throw new IntegrationValidationError('Config requires all of {apiKey}');
  }

  const client = new JumpCloudClient({
    logger,
    apiKey: config.apiKey,
  });

  try {
    const response = await client.listOrgs();

    if (!response.results || !response.results.length) {
      throw new IntegrationValidationError(
        'Failed to list JumpCloud organizations',
      );
    }
  } catch (err) {
    if (!(err instanceof IntegrationError)) {
      throw new IntegrationValidationError(err.message);
    } else {
      throw err;
    }
  }
}
