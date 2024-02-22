import { Badge } from "@chakra-ui/react";
import { Log } from "@models/Log";

export const ActionBadge = ({ log }: { log: Log }) => {
  switch (log?.type) {
    case "role_creation":
    case "role_deletion":
      return (
        <Badge
          color={`${log?.role?.color}.700`}
          bgColor={`${log?.role?.color}.200`}
        >
          ROLE {log?.role?.name}
          {log?.type === "role_deletion" ? " DELETED" : " CREATED"}
        </Badge>
      );
    case "user_role_set":
    case "user_role_unset":
      return (
        <Badge
          color={`${log?.role?.color}.700`}
          bgColor={`${log?.role?.color}.200`}
        >
          ROLE {log?.role?.name}
          {log?.type === "user_role_unset" ? " UNSET" : " SET"}
        </Badge>
      );
    case "device_role_set":
    case "device_role_unset":
      return (
        <Badge
          color={`${log?.role?.color}.700`}
          bgColor={`${log?.role?.color}.200`}
        >
          ROLE {log?.role?.name}
          {log?.type === "device_role_unset" ? " NOT ALLOWED" : " ALLOWED"}
        </Badge>
      );
    case "device_access_update":
      return (
        <Badge
          color={`${log?.access === "denied" ? "red" : "green"}.700`}
          bgColor={`${log?.access === "denied" ? "red" : "green"}.200`}
        >
          ACCESS {log?.access}
        </Badge>
      );
    case "device_register":
      return (
        <Badge color={`blue.700`} bgColor={`blue.200`}>
          DEVICE CONNECTED
        </Badge>
      );
    case "card_link":
      return (
        <Badge color={`blue.700`} bgColor={`blue.200`}>
          CARD LINKED
        </Badge>
      );
    default:
      return (
        <Badge color="gray.700" bgColor="gray.200">
          Unsupported Log Type
        </Badge>
      );
  }
};
