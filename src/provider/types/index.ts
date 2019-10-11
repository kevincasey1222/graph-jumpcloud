export * from "./users";

export interface JumpCloudObject {
  _id?: string | null;
  id?: string | null;
  created?: string | null;
}

export interface JumpCloudOrg extends JumpCloudObject {
  displayName?: string | null;
  logoUrl?: string | null;
}
