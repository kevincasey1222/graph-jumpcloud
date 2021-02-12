import { createIntegrationEntity, parseTimePropertyValue } from "@jupiterone/integration-sdk-core";
import { JumpCloudGroup } from "../../jumpcloud/types";
import { getConsoleUrl } from "../../jumpcloud/url";
import { GroupEntities } from "./constants";

export function createGroupEntity(
  data: JumpCloudGroup
) {
  const userId = data.id || (data._id as string);

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _key: userId,
        _type: GroupEntities.GROUP._type,
        _class: GroupEntities.GROUP._class,
        id: data.id as string,
        name: data.name as string,
        displayName: data.name as string,
        createdOn: parseTimePropertyValue(data.created),
        attributes: (data.attributes && JSON.stringify(data.attributes)) || undefined,
        webLink: getConsoleUrl(`/#/groups/user/${data.id}/details`)
      }
    }
  });
}
