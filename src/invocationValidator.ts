import {
  IntegrationInstanceConfigError,
  IntegrationValidationContext,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { JumpCloudIntegrationConfig } from "./types";

// import createOktaClient from "./okta/createOktaClient";

/**
 * Performs validation of the execution before the execution handler function is
 * invoked.
 *
 * At a minimum, integrations should ensure that the
 * `context.instance.config` is valid. Integrations that require
 * additional information in `context.invocationArgs` should also
 * validate those properties. It is also helpful to perform authentication with
 * the provider to ensure that credentials are valid.
 *
 * The function will be awaited to support connecting to the provider for this
 * purpose.
 *
 * @param context
 */
export default async function invocationValidator(
  context: IntegrationValidationContext,
) {
  const { accountId, config } = context.instance;
  const jumpcloudInstanceConfig = config as JumpCloudIntegrationConfig;

  if (!jumpcloudInstanceConfig) {
    throw new IntegrationInstanceConfigError(
      `JumpCloud configuration not found (accountId=${accountId})`,
    );
  }

  const { apiKey } = jumpcloudInstanceConfig;

  if (!apiKey) {
    throw new IntegrationInstanceConfigError(
      `Missing apiKey in configuration (accountId=${accountId})`,
    );
  }
}
