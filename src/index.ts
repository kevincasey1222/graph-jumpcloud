import {
  IntegrationError,
  IntegrationInvocationConfig,
  IntegrationStepExecutionContext,
} from "@jupiterone/jupiter-managed-integration-sdk";

import initializeContext from "./initializeContext";
import invocationValidator from "./invocationValidator";
import fetchBatchOfUsers from "./provider/fetchBatchOfUsers";
import synchronizeUsers from "./synchronizers/synchronizeUsers";

const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields: {
    orgId: {
      type: "string",
      mask: false,
    },
    apiKey: {
      type: "string",
      mask: true,
    },
  },

  invocationValidator,

  integrationStepPhases: [
    {
      steps: [
        {
          name: "Fetch Users",
          iterates: true,
          executionHandler: async (
            executionContext: IntegrationStepExecutionContext,
          ) => {
            const iterationState = executionContext.event.iterationState;
            if (!iterationState) {
              throw new IntegrationError(
                "Expected iterationState not found in event!",
              );
            }
            return fetchBatchOfUsers(
              await initializeContext(executionContext),
              iterationState,
            );
          },
        },
      ],
    },
    {
      steps: [
        {
          name: "Users",
          executionHandler: async (
            executionContext: IntegrationStepExecutionContext,
          ) => {
            return synchronizeUsers(await initializeContext(executionContext));
          },
        },
      ],
    },
  ],
};

export default invocationConfig;
