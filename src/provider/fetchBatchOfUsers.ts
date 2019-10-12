import {
  IntegrationStepExecutionResult,
  IntegrationStepIterationState,
} from "@jupiterone/jupiter-managed-integration-sdk";

import { JumpCloudExecutionContext } from "../types";
import { appendFetchSuccess } from "../util/fetchSuccess";
import { createUserCache, JumpCloudUserCacheEntry } from "./cache";
import JumpCloudClient from "./JumpCloudClient";

/**
 * The number of pages to process per iteration.
 */
const BATCH_PAGES = process.env.JC_USERS_BATCH_PAGES
  ? Number(process.env.JC_USERS_BATCH_PAGES)
  : 10;

/**
 * An iterating execution handler that loads JumpCloud users in `BATCH_PAGES`
 * batches of 100, storing the raw response data in the `IntegrationCache` for
 * later processing in another step.
 */
export default async function fetchBatchOfUsers(
  executionContext: JumpCloudExecutionContext,
  iterationState: IntegrationStepIterationState,
): Promise<IntegrationStepExecutionResult> {
  const limit = 100;
  const cache = executionContext.clients.getCache();
  const userCache = createUserCache(cache);

  const {
    instance: { config },
    logger,
  } = executionContext;

  const client = new JumpCloudClient(config, logger);

  const cachedIds =
    iterationState.iteration > 0 ? (await userCache.getIds())! : [];

  const cacheEntries: JumpCloudUserCacheEntry[] = [];

  let resultsCount = 0;
  let pagesProcessed = 0;
  iterationState.state.count = 0;
  do {
    const response = await client.listUsers({
      limit: limit.toString(),
      skip: iterationState.state.count.toString(),
    });

    for (const user of response.results || []) {
      const userId = user.id || user._id;
      if (userId) {
        cachedIds.push(userId);
        cacheEntries.push({
          key: userId,
          data: user,
        });
      }
    }

    resultsCount = response.results ? response.results.length : 0;
    iterationState.state.count += resultsCount;
    pagesProcessed++;
  } while (resultsCount > 0 && pagesProcessed < BATCH_PAGES);

  await Promise.all([
    userCache.putIds(cachedIds),
    userCache.putEntries(cacheEntries),
  ]);

  const finished = resultsCount === 0;

  if (finished) {
    appendFetchSuccess(cache, `users`);
  }

  return {
    iterationState: {
      ...iterationState,
      finished,
      state: {
        limit,
        count: cachedIds.length,
      },
    },
  };
}
