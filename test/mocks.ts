import {
  JumpCloudGroup,
  JumpCloudOrg,
  JumpCloudUser,
} from '../src/jumpcloud/types';

export function createMockUser(): JumpCloudUser {
  return {
    account_locked: false,
    account_locked_date: null,
    activated: false,
    addresses: [],
    allow_public_key: true,
    attributes: [],
    company: '',
    costCenter: '',
    department: '',
    description: 'Testing desc',
    disableDeviceMaxLoginAttempts: false,
    displayname: 'Austin K',
    email: 'austin.kelleher+testjc@jupiterone.com',
    employeeIdentifier: null,
    employeeType: '',
    enable_managed_uid: false,
    enable_user_portal_multifactor: false,
    external_dn: '',
    external_source_type: '',
    externally_managed: false,
    firstname: 'Austin',
    jobTitle: '',
    lastname: 'Kelleher',
    ldap_binding_user: false,
    location: '',
    mfa: {
      exclusion: false,
      configured: false,
    },
    middlename: '',
    password_never_expires: false,
    passwordless_sudo: false,
    phoneNumbers: [],
    samba_service_user: false,
    ssh_keys: [],
    sudo: false,
    suspended: false,
    systemUsername: '',
    unix_guid: 5001,
    unix_uid: 5001,
    username: 'austinkellehertest',
    created: '2021-02-12T17:45:42.369Z',
    password_expired: false,
    totp_enabled: false,
    _id: '6026bec6b8207255280d5981',
    id: '6026bec6b8207255280d5981',
  };
}

export function createMockGroup(): JumpCloudGroup {
  return {
    attributes: null,
    id: '60259a3cb544065d1eaf2760',
    name: 'All Users',
    type: 'user_group',
    email: '',
    description: '',
  };
}

export function createMockOrg(): JumpCloudOrg {
  return {
    _id: '60259a2ad81e1a474d4e7c83',
    id: '60259a2ad81e1a474d4e7c83',
    displayName: null,
    logoUrl: null,
    created: '2021-02-11T20:57:14.837Z',
  };
}
