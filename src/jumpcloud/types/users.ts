import { JumpCloudObject } from '.';

export interface JumpCloudUser extends JumpCloudObject {
  email?: string | null;
  username?: string | null;
  allow_public_key?: boolean | null;
  public_key?: string | null;
  sudo?: boolean | null;
  enable_managed_uid?: boolean | null;
  unix_uid?: number | null;
  unix_guid?: number | null;
  activated?: boolean | null;
  suspended?: boolean | null;
  tags?: string[] | null;
  password_expired?: boolean | null;
  account_locked?: boolean | null;
  passwordless_sudo?: boolean | null;
  externally_managed?: boolean | null;
  external_dn?: string | null;
  external_source_type?: string | null;
  ldap_binding_user?: boolean | null;
  enable_user_portal_multifactor?: boolean | null;
  totp_enabled?: boolean | null;
  attributes?: object[] | null;
  organization?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  middlename?: string | null;
  displayname?: string | null;
  description?: string | null;
  location?: string | null;
  costCenter?: string | null;
  employeeType?: string | null;
  employeeIdentifier?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  relationships?: object[] | null;
  badLoginAttempts?: number | null;
  password_never_expires?: boolean | null;
  password_expireation_date?: string | null;
  samba_service_user?: boolean | null;
  ssh_keys?: JumpCloudUserSshKey[] | null;
  addresses?: JumpCloudUserAddress[] | null;
  phoneNumbers?: JumpCloudUserPhoneNumber[] | null;
  mfa?: JumpCloudUserMFA | null;
  account_locked_date: string | null;
  disableDeviceMaxLoginAttempts: boolean;
  systemUsername: string;
}

export interface JumpCloudUserSshKey {
  _id?: string | null;
  create_date?: string | null;
  name?: string | null;
  public_key?: string | null;
}

export interface JumpCloudUserAddress {
  id?: string | null;
  type?: string | null;
  poBox?: string | null;
  extendedAddress?: string | null;
  streetAddress?: string | null;
  locality?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface JumpCloudUserPhoneNumber {
  id?: string | null;
  type?: string | null;
  number?: string | null;
}

export interface JumpCloudUserMFA {
  exclusion?: boolean | null;
  exclusionUntil?: string | null;
  configured?: boolean | null;
}
