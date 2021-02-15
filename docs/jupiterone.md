# Integration with JupiterOne

JupiterOne provides a managed integration with JumpCloud. The integration
connects directly to JumpCloud APIs to obtain account metadata and analyze
resource relationships. Customers authorize access by creating an API token in
your target JumpCloud account and providing that credential to JupiterOne.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### Install

Instructions on creating an API token within your JumpCloud account can be found
[here][1].

# How to Uninstall

TODO: List specific actions that must be taken to uninstall the integration.
Many of the following steps will be reusable; take care to be sure they remain
accurate.

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **{{JumpCloud}}** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/master/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources     | Entity `_type`      | Entity `_class`           |
| ------------- | ------------------- | ------------------------- |
| Group         | `jumpcloud_group`   | `Group`                   |
| Organizations | `jumpcloud_account` | `Account`, `Organization` |
| User          | `jumpcloud_user`    | `User`                    |

### Relationships

The following relationships are created/mapped:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `jumpcloud_account`   | **HAS**               | `jumpcloud_group`     |
| `jumpcloud_account`   | **HAS**               | `jumpcloud_user`      |
| `jumpcloud_group`     | **HAS**               | `jumpcloud_user`      |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->

[1]:
  https://docs.jumpcloud.com/2.0/authentication-and-authorization/authentication-and-authorization-overview
