import uuid from "uuid/v4";

import { createTestIntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";

import invocationValidator from "./invocationValidator";
import { JumpCloudIntegrationConfig } from "./types";

test("valid config", async () => {
  const accountId = uuid();
  const config: JumpCloudIntegrationConfig = {
    orgId: uuid(),
    apiKey: uuid(),
  };

  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      accountId,
      config,
    } as any,
  });

  await expect(invocationValidator(executionContext)).resolves.toBeUndefined();
});

test("should throw if jumpcloud configuration is not found", async () => {
  const accountId = uuid();
  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      accountId,
    } as any,
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    `JumpCloud configuration not found (accountId=${accountId})`,
  );
});

test("should throw if apiKey missing", async () => {
  const accountId = uuid();
  const config: Partial<JumpCloudIntegrationConfig> = {};

  const executionContext = createTestIntegrationExecutionContext({
    instance: {
      accountId,
      config,
    } as any,
  });

  await expect(invocationValidator(executionContext)).rejects.toThrow(
    `Missing apiKey in configuration (accountId=${accountId})`,
  );
});