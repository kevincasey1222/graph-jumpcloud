import { JumpCloudUser } from "../provider/types";
import { JumpCloudUserEntity } from "../types";
import getTime from "../util/getTime";
import { consoleBaseUrl } from "./";

export const USER_ENTITY_TYPE = "jumpcloud_user";

export function createUserEntity(data: JumpCloudUser): JumpCloudUserEntity {
  const userId = data.id || data._id;
  const entity: JumpCloudUserEntity = {
    _key: userId as string,
    _type: USER_ENTITY_TYPE,
    _class: "User",
    _rawData: [{ name: "default", rawData: data }],
    id: data.id || (data._id as string),
    displayName: data.username as string,
    name: `${data.firstname} ${data.lastname}`,
    username: data.username as string,
    active: !!data.activated,
    suspended: !!data.suspended,
    createdOn: getTime(data.created)!,
    firstName: data.firstname as string,
    lastName: data.lastname as string,
    login: data.username as string,
    email: data.email as string,
    employeeType: data.employeeType as string,
    employeeId: data.employeeIdentifier as string,
    company: data.company as string,
    department: data.department as string,
    jobTitle: data.jobTitle as string,
    mfaEnabled: !!data.totp_enabled,
    mfaExclusion: !!data.mfa!.exclusion,
    mfaExclusionUntil: getTime(data.mfa!.exclusionUntil),
    mfaConfigured: !!data.mfa!.configured,
    externallyManaged: !!data.externally_managed,
    ldapBindingUser: !!data.ldap_binding_user,
    sambaServiceUser: !!data.samba_service_user,
    sudo: !!data.sudo,
    webLink: `${consoleBaseUrl}/#/users/${userId}/details`,
  };

  return entity;
}
