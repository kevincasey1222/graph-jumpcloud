import { createIntegrationEntity, parseTimePropertyValue } from "@jupiterone/integration-sdk-core";
import { JumpCloudUser } from "../../jumpcloud/types";
import { getConsoleUrl } from "../../jumpcloud/url";
import { UserEntities } from "./constants";

export function createUserEntity(
  data: JumpCloudUser
) {
  const userId = data.id || (data._id as string);

  return createIntegrationEntity({
    entityData: {
      source: {
        ...data,
        tags: [],
        userTags: data.tags,
      },
      assign: {
        _key: userId,
        _type: UserEntities.USER._type,
        _class: UserEntities.USER._class,
        id: userId,
        displayName: data.username as string,
        name: `${data.firstname} ${data.lastname}`,
        username: data.username,
        active: !!data.activated,
        suspended: !!data.suspended,
        createdOn: parseTimePropertyValue(data.created)!,
        firstName: data.firstname,
        lastName: data.lastname,
        login: data.username,
        email: data.email,
        employeeType: data.employeeType,
        employeeId: data.employeeIdentifier || undefined,
        company: data.company,
        department: data.department,
        jobTitle: data.jobTitle,
        mfaEnabled: !!data.totp_enabled,
        mfaExclusion: !!data.mfa!.exclusion,
        mfaExclusionUntil: parseTimePropertyValue(data.mfa!.exclusionUntil),
        mfaConfigured: !!data.mfa!.configured,
        externallyManaged: !!data.externally_managed,
        ldapBindingUser: !!data.ldap_binding_user,
        sambaServiceUser: !!data.samba_service_user,
        sudo: !!data.sudo,
        webLink: getConsoleUrl(`/#/users/${userId}/details`)
      }
    }
  });
}
