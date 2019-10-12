import { IntegrationCache } from "@jupiterone/jupiter-managed-integration-sdk";

import { JumpCloudUser } from "./types";

export interface JumpCloudUserCacheEntry {
  key: string;
  data?: JumpCloudUser;
}

export interface DataCache<E, D> {
  putIds: (ids: string[]) => Promise<void>;
  getIds: () => Promise<string[]>;
  getData: (key: string) => Promise<D>;
  getEntries: (keys: string[]) => Promise<E[]>;
  putEntries: (entries: E[]) => Promise<void>;
}

export function createUserCache(
  cache: IntegrationCache,
): DataCache<JumpCloudUserCacheEntry, JumpCloudUser> {
  const idsKey = "systemusers";

  return {
    putIds: async (ids: string[]) => {
      await cache.putEntry({
        key: idsKey,
        data: ids,
      });
    },

    getIds: async (): Promise<string[]> => {
      const entry = await cache.getEntry(idsKey);
      return entry.data || [];
    },

    getData: async (key: string) => {
      const entry = await cache.getEntry(key);
      if (entry.data) {
        return entry.data;
      } else {
        throw new Error(
          `Data not found in cache for '${key}', something is wrong`,
        );
      }
    },

    getEntries: async (keys: string[]) => {
      return cache.getEntries(keys);
    },

    putEntries: async (entries: JumpCloudUserCacheEntry[]) => {
      await cache.putEntries(entries);
    },
  };
}
