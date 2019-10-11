import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";

import { JumpCloudExecutionContext } from "./types";

export default async function initializeContext(
  context: IntegrationExecutionContext,
): Promise<JumpCloudExecutionContext> {
  return {
    ...context,
    ...context.clients.getClients(),
    cache: context.clients.getCache(),
  };
}
