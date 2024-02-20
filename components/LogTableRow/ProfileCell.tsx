import { Avatar, HStack, chakra } from "@chakra-ui/react";
import { Log } from "@models/Log";
import { FaUserXmark } from "react-icons/fa6";

export const ProfileCell = ({ log }: { log: Log }) => {
  switch (log?.type) {
    case "device_access_update":
    case "card_link":
      return (
        <>
          {log?.profile ? (
            <HStack>
              <Avatar
                name={log?.profile?.name}
                size={"xs"}
                h={"24px"}
                w={"24px"}
              />
              <chakra.span>{log?.profile?.name}</chakra.span>
            </HStack>
          ) : (
            <HStack>
              <HStack
                borderRadius={"full"}
                bgColor={"gray.300"}
                h={"24px"}
                w={"24px"}
                color={"black"}
                justifyContent={"center"}
              >
                <FaUserXmark />
              </HStack>
              <chakra.span>NOT LINKED</chakra.span>
            </HStack>
          )}
        </>
      );
    default:
      return <></>;
  }
};
