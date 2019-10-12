import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface AccountEntity extends EntityFromIntegration {
  accessURL?: string;
  mfaEnabled?: string;
  name?: string;
}

export interface JumpCloudAccountEntity extends AccountEntity {
  logoUrl?: string;
}

export interface UserEntity extends EntityFromIntegration {
  id: string | undefined;
  name: string;
  displayName: string;
  email: string;
  username: string | undefined;
  login: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  createdOn: number | undefined;
  userType?: string;
  active: boolean | undefined;
  mfaEnabled: boolean | undefined;
  externallyManaged: boolean | undefined;
  ldapBindingUser: boolean | undefined;
  sambaServiceUser: boolean | undefined;
  sudo: boolean | undefined;
}

export interface JumpCloudUserEntity extends UserEntity {
  employeeType: string | undefined;
  employeeId: string | undefined;
  company: string | undefined;
  department: string | undefined;
  jobTitle: string | undefined;
  suspended: boolean | undefined;
  mfaExclusion: boolean | undefined;
  mfaExclusionUntil: number | undefined;
  mfaConfigured: boolean | undefined;
}
