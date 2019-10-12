import {
  GraphClient,
  IntegrationCache,
  IntegrationExecutionContext,
  PersisterClient,
} from "@jupiterone/jupiter-managed-integration-sdk";

export * from "./entities";

export interface JumpCloudIntegrationConfig {
  orgId?: string;
  apiKey: string;
}

export interface JumpCloudExecutionContext extends IntegrationExecutionContext {
  graph: GraphClient;
  persister: PersisterClient;
  cache: IntegrationCache;
}
