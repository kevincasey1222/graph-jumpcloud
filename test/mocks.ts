import {
  JumpCloudApplication,
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

export function createMockApplication(): JumpCloudApplication {
  return {
    _id: '617c3664e6f8ae27f7e1201e',
    id: '617c3664e6f8ae27f7e1201e',
    active: true,
    name: 'aws-sso',
    displayName: 'AWS SSO',
    displayLabel: 'AWS SSO',
    beta: false,
    organization: '60259a2ad81e1a474d4e7c83',
    ssoUrl: 'https://sso.jumpcloud.com/saml2/aws-sso',
    learnMore:
      'https://support.jumpcloud.com/support/s/article/Single-Sign-On-SSO-With-AWS-SSO',
    description: '',
    created: '2021-10-29T17:59:00.448Z',
    sso: {
      jit: false,
      beta: false,
      type: 'saml',
      idpCertExpirationAt: '2026-10-29T17:58:59.000Z',
    },
  };
}
