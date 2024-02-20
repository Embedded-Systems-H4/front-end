import { Box, HStack, chakra } from "@chakra-ui/react";
import { Log } from "@models/Log";
import { FaAddressCard } from "react-icons/fa6";

export const CardCell = ({ log }: { log: Log }) => {
  switch (log?.type) {
    case "device_access_update":
    case "card_link":
      return (
        <>
          {log?.cardId && (
            <HStack w={"100%"} justifyContent={"right"}>
              <chakra.span>{log?.cardId}</chakra.span>
              <Box color={"gray.400"}>
                <FaAddressCard
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                />
              </Box>
            </HStack>
          )}
        </>
      );
    default:
      return <></>;
  }
};
