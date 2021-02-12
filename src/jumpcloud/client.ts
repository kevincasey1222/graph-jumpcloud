import fetch, { Response } from "node-fetch";
import { URL } from "url";
import { AttemptContext, retry } from "@lifeomic/attempt";
import {
  JumpCloudApplication,
  JumpCloudGroup,
  JumpCloudGroupMember,
  JumpCloudOrg,
  JumpCloudUser,
} from "./types";
import { IntegrationError, IntegrationLogger, IntegrationProviderAPIError } from "@jupiterone/integration-sdk-core";

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

interface CreateJumpCloudClientParams {
  logger: IntegrationLogger;
  apiKey: string;
  orgId?: string;
}

export class JumpCloudClient {
  private BASE_API_URL = `https://console.jumpcloud.com/api`;
  private logger: IntegrationLogger;
  private credentials: any;

  constructor({
    logger,
    apiKey,
    orgId
  }: CreateJumpCloudClientParams) {
    this.logger = logger;

    this.credentials = {
      "x-org-id": orgId || "",
      "x-api-key": apiKey,
    };
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

  async iterateUsers(
    callback: (user: JumpCloudUser) => Promise<void>
  ) {
    let numResultsLastPage = 0;

    const limit = 100;
    let totalUsersIterated = 0;

    do {
      const response = await this.listUsers({
        limit: limit.toString(),
        skip: totalUsersIterated.toString(),
      });

      for (const user of response.results || []) {
        await callback(user);
      }

      numResultsLastPage = response.results ? response.results.length : 0;
      totalUsersIterated += numResultsLastPage;
    } while (numResultsLastPage > 0);
  }

  async iterateGroups(
    callback: (user: JumpCloudGroup) => Promise<void>
  ) {
    let numResultsLastPage = 0;

    const limit = 100;
    let totalIterated = 0;

    do {
      const groups = await this.listUserGroups({
        limit: limit.toString(),
        skip: totalIterated.toString(),
      });

      for (const member of groups) {
        await callback(member);
      }

      totalIterated += groups.length;
      numResultsLastPage = groups.length;
    } while (numResultsLastPage > 0);
  }

  async iterateGroupMembers(
    groupId: string,
    callback: (user: JumpCloudGroupMember) => Promise<void>
  ) {
    let numResultsLastPage = 0;

    const limit = 100;
    let totalIterated = 0;

    do {
      const members = await this.listUserGroupMembers(groupId, {
        limit: limit.toString(),
        skip: totalIterated.toString(),
      });

      for (const member of members) {
        await callback(member);
      }

      totalIterated += members.length;
      numResultsLastPage = members.length;
    } while (numResultsLastPage > 0);
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
        let response: Response | undefined;
        try {
          response = await fetch(url, {
            headers: {
              ...this.credentials,
              contentType: "application/json",
            },
          });
        } catch (err) {
          throw new IntegrationError({
            message: 'Failed to execute JumpCloud API request',
            cause: err,
            code: err.code,
          });
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
          throw new IntegrationProviderAPIError({
            endpoint: url,
            statusText: response.statusText,
            status: response.status,
          });
        }
      },
      {
        delay: 5000,
        factor: 1.2,
        maxAttempts: 15,
        handleError(err: Error, context: AttemptContext) {
          const { status: statusCode } = (err as IntegrationProviderAPIError);

          if (statusCode !== 429 && statusCode !== 500) {
            context.abort();
          }
        },
      },
    );
  }
}
