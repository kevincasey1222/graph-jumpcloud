import {
  IntegrationExecutionResult,
  IntegrationRelationship,
} from "@jupiterone/jupiter-managed-integration-sdk";

import {
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_USER_RELATIONSHIP_TYPE,
  createAccountEntity,
  createAccountUserRelationship,
  createUserEntity,
  USER_ENTITY_TYPE,
} from "../converters";
import { createUserCache } from "../provider/cache";
import JumpCloudClient from "../provider/JumpCloudClient";
import { JumpCloudExecutionContext, JumpCloudUserEntity } from "../types";
import { fetchSucceeded } from "../util/fetchSuccess";

/**
 * Synchronizes JumpCloud account and users
 */
export default async function synchronizeUsers(
  executionContext: JumpCloudExecutionContext,
): Promise<IntegrationExecutionResult> {
  const {
    instance: { config },
    graph,
    persister,
    logger,
  } = executionContext;
  const cache = executionContext.clients.getCache();
  const usersCache = createUserCache(cache);

  const client = new JumpCloudClient(config, logger);
  const response = await client.listOrgs();

  if (!response.results || response.results.length === 0) {
    const err = new Error("Could not fetch JumpCloud account/org data");
    executionContext.logger.error({ err }, "User synchronization aborted");
    return {
      error: err,
    };
  }

  if (!(await fetchSucceeded(cache, ["users"]))) {
    const err = new Error("User fetching did not complete");
    executionContext.logger.error({ err }, "User synchronization aborted");
    return {
      error: err,
    };
  }

  const userIds = await usersCache.getIds();
  if (userIds) {
    // TODO: add support for multi-tenant orgs
    const accountEntity = createAccountEntity(response.results![0]);
    const newAccounts = [accountEntity];

    const newUsers: JumpCloudUserEntity[] = [];
    const newAccountUserRelationships: IntegrationRelationship[] = [];

    const usersCacheEntries = await usersCache.getEntries(userIds);
    for (const entry of usersCacheEntries) {
      const userEntity = createUserEntity(entry.data!);
      newUsers.push(userEntity);
      newAccountUserRelationships.push(
        createAccountUserRelationship(accountEntity, userEntity),
      );
    }

    const [
      oldAccounts,
      oldUsers,
      oldAccountUserRelationships,
    ] = await Promise.all([
      graph.findEntitiesByType(ACCOUNT_ENTITY_TYPE),
      graph.findEntitiesByType(USER_ENTITY_TYPE),
      graph.findRelationshipsByType(ACCOUNT_USER_RELATIONSHIP_TYPE),
    ]);

    return {
      operations: await persister.publishPersisterOperations([
        [
          ...persister.processEntities({
            oldEntities: oldAccounts,
            newEntities: newAccounts,
          }),
          ...persister.processEntities({
            oldEntities: oldUsers,
            newEntities: newUsers,
          }),
        ],
        persister.processRelationships({
          oldRelationships: oldAccountUserRelationships,
          newRelationships: newAccountUserRelationships,
        }),
      ]),
    };
  } else {
    logger.info("No userIds found in cache, nothing to synchronize");
    return {
      operations: {
        created: 0,
        updated: 0,
        deleted: 0,
      },
    };
  }
}
