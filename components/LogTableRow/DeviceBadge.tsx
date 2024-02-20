import { Box, HStack, chakra } from "@chakra-ui/react";
import { Log } from "@models/Log";
import { FaDoorOpen } from "react-icons/fa6";
import { MdDeviceUnknown } from "react-icons/md";

export const DeviceBadge = ({ log }: { log: Log }) => {
  switch (log?.type) {
    case "device_online":
    case "device_offline":
    case "device_role_set":
    case "device_role_unset":
    case "device_access_update":
    case "device_register":
    case "card_link":
      return (
        <HStack>
          <Box color={"gray.400"}>
            {log?.device?.type === "door" ? (
              <FaDoorOpen
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            ) : (
              <MdDeviceUnknown
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            )}
          </Box>
          <chakra.span>{log?.device?.name}</chakra.span>
        </HStack>
      );
    default:
      return <></>;
  }
};
