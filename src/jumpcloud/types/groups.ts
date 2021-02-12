import { JumpCloudObject } from '.';

export interface JumpCloudGroup extends JumpCloudObject {
  name?: string | null;
  type?: string | null;
  attributes?: object | null;
  email?: string;
  description?: string;
}

export interface JumpCloudGroupMember {
  attributes?: object | null;
  from?: {
    attributes?: object | null;
    id?: string | null;
    type?: string | null;
  };
  to?: {
    attributes?: object | null;
    id?: string | null;
    type?: string | null;
  };
}
