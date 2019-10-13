import fetch, { Response } from "node-fetch";
import PQueue from "p-queue";
import { URL } from "url";

import {
  IntegrationError,
  IntegrationLogger,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { AttemptContext, retry } from "@lifeomic/attempt";

import { JumpCloudIntegrationConfig } from "../types";
import {
  JumpCloudApplication,
  JumpCloudGroup,
  JumpCloudGroupMember,
  JumpCloudOrg,
  JumpCloudUser,
} from "./types";

interface QueryParams {
  limit?: string;
  skip?: string;
  sort?: string;
  fields?: string;
  search?: string;
  filter?: string;
}

interface ApiResponse {
  totalCount?: number;
}

interface ListAppsResponse extends ApiResponse {
  results?: JumpCloudApplication[];
}

interface ListOrgsResponse extends ApiResponse {
  results?: JumpCloudOrg[];
}

interface ListUsersResponse extends ApiResponse {
  results?: JumpCloudUser[];
}

export default class JumpCloudClient {
  private BASE_API_URL = `https://console.jumpcloud.com/api`;
  private logger: IntegrationLogger;
  private requestQueue: PQueue;
  private credentials: any;

  constructor(config: JumpCloudIntegrationConfig, logger: IntegrationLogger) {
    this.logger = logger;

    this.credentials = {
      "x-org-id": config.orgId || "",
      "x-api-key": config.apiKey,
    };

    // p-queue is helpful when all requests are running in a single process, or
    // there are subsequent processes that are considerate of how many requests
    // the previous process used, but in the case where API calls are made from
    // concurrent processes, we're going to need something a bit more
    // sophisticated.
    this.requestQueue = new PQueue({
      interval: 5000,
      intervalCap: 10,
    });
  }

  public async listApps(params?: QueryParams): Promise<ListAppsResponse> {
    return this.makeRequest<ListOrgsResponse>(
      `${this.BASE_API_URL}/applications`,
      { totalCount: 0, results: [] },
      params,
    );
  }

  public async listOrgs(params?: QueryParams): Promise<ListOrgsResponse> {
    return this.makeRequest<ListOrgsResponse>(
      `${this.BASE_API_URL}/organizations`,
      { totalCount: 0, results: [] },
      params,
    );
  }

  public async listUsers(params?: QueryParams): Promise<ListUsersResponse> {
    return this.makeRequest<ListUsersResponse>(
      `${this.BASE_API_URL}/systemusers`,
      { totalCount: 0, results: [] },
      params,
    );
  }

  public async listUserGroups(params?: QueryParams): Promise<JumpCloudGroup[]> {
    return this.makeRequest<JumpCloudGroup[]>(
      `${this.BASE_API_URL}/v2/usergroups`,
      [],
      params,
    );
  }

  public async listUserGroupMembers(
    groupId: string,
    params?: QueryParams,
  ): Promise<JumpCloudGroupMember[]> {
    return this.makeRequest<JumpCloudGroupMember[]>(
      `${this.BASE_API_URL}/v2/usergroups/${groupId}/members`,
      [],
      params,
    );
  }

  public async listSystemGroups(
    params?: QueryParams,
  ): Promise<JumpCloudGroup[]> {
    return this.makeRequest<JumpCloudGroup[]>(
      `${this.BASE_API_URL}/v2/systemgroups`,
      [],
      params,
    );
  }

  private async makeRequest<T>(
    resourceUrl: string,
    emptyResponse: T,
    params?: QueryParams,
  ): Promise<T> {
    const paginatedUrl = new URL(resourceUrl);
    if (params) {
      for (const [key, value] of Object.entries(params) || []) {
        paginatedUrl.searchParams.append(key, value);
      }
    }

    const url = paginatedUrl.toString();
    return retry(
      async () => {
        return this.requestQueue.add(async () => {
          let response: Response | undefined;
          try {
            response = await fetch(url, {
              headers: {
                ...this.credentials,
                contentType: "application/json",
              },
            });
          } catch (err) {
            throw new IntegrationError(err);
          }
          if (response.status === 200) {
            const json = await response.json();
            this.logger.trace({ url }, "Fetch completed");
            return (json as unknown) as T;
          } else if (response.status === 404) {
            this.logger.info(
              { url },
              "Received 404, answering an empty collection",
            );
            return emptyResponse;
          } else {
            throw new IntegrationError({
              message: response.statusText,
              statusCode: response.status,
            });
          }
        });
      },
      {
        delay: 5000,
        factor: 1.2,
        maxAttempts: 15,
        handleError(err: Error, context: AttemptContext) {
          const error = err as IntegrationError;
          const code = error.statusCode;
          if (code !== 429 && code !== 500) {
            context.abort();
          }
        },
      },
    );
  }
}
