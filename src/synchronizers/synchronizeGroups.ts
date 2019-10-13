import {
  IntegrationExecutionResult,
  IntegrationRelationship,
} from "@jupiterone/jupiter-managed-integration-sdk";

import {
  createGroupUserRelationship,
  createUserGroupEntity,
  GROUP_USER_RELATIONSHIP_TYPE,
  USER_GROUP_ENTITY_TYPE,
} from "../converters";
import JumpCloudClient from "../provider/JumpCloudClient";
import { JumpCloudExecutionContext, JumpCloudGroupEntity } from "../types";

/**
 * Synchronizes JumpCloud groups
 */
export default async function synchronizeGroups(
  executionContext: JumpCloudExecutionContext,
): Promise<IntegrationExecutionResult> {
  const {
    instance: { config },
    graph,
    persister,
    logger,
  } = executionContext;

  const client = new JumpCloudClient(config, logger);
  const groups = await client.listUserGroups();

  if (!groups) {
    const err = new Error("Could not fetch JumpCloud group data");
    executionContext.logger.error({ err }, "Group synchronization aborted");
    return {
      error: err,
    };
  } else if (groups.length === 0) {
    logger.info("No user group found, nothing to synchronize");
    return {
      operations: {
        created: 0,
        updated: 0,
        deleted: 0,
      },
    };
  } else {
    const newUserGroups: JumpCloudGroupEntity[] = [];
    const newGroupUserRelationships: IntegrationRelationship[] = [];
    const [oldUserGroups, oldGroupUserRelationships] = await Promise.all([
      graph.findEntitiesByType(USER_GROUP_ENTITY_TYPE),
      graph.findRelationshipsByType(GROUP_USER_RELATIONSHIP_TYPE),
    ]);

    for (const group of groups) {
      if (group.id) {
        newUserGroups.push(createUserGroupEntity(group));
        const groupUsers = await client.listUserGroupMembers(group.id);
        for (const user of groupUsers) {
          if (user.to && user.to.id) {
            newGroupUserRelationships.push(
              createGroupUserRelationship(group.id, user.to.id),
            );
          }
        }
      }
    }

    return {
      operations: await persister.publishPersisterOperations([
        [...persister.processEntities(oldUserGroups, newUserGroups)],
        persister.processRelationships(
          oldGroupUserRelationships,
          newGroupUserRelationships,
        ),
      ]),
    };
  }
}
