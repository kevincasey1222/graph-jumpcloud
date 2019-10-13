import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export interface Entity extends EntityFromIntegration {
  id: string | undefined;
  name: string | undefined;
  displayName: string;
  createdOn: number | undefined;
}

export interface AccountEntity extends Entity {
  accessURL?: string;
  mfaEnabled?: string;
}

export interface UserEntity extends Entity {
  email: string;
  username: string | undefined;
  login: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  userType?: string;
  active: boolean | undefined;
  mfaEnabled: boolean | undefined;
  externallyManaged: boolean | undefined;
  ldapBindingUser: boolean | undefined;
  sambaServiceUser: boolean | undefined;
  sudo: boolean | undefined;
}

export interface UserGroupEntity extends Entity {
  email?: string;
}

export interface JumpCloudAccountEntity extends AccountEntity {
  logoUrl?: string;
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

export interface JumpCloudGroupEntity extends UserGroupEntity {
  attributes?: string | null;
}
