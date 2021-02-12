export * from './users';
export * from './groups';
export * from './applications';

export interface JumpCloudObject {
  _id?: string | null;
  id?: string | null;
  created?: string | null;
}

export interface JumpCloudOrg extends JumpCloudObject {
  displayName?: string | null;
  logoUrl?: string | null;
}
