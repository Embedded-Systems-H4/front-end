import { HStack, Tag, VStack, chakra } from "@chakra-ui/react";
import { DateElement } from "@components/Date/Date";
import { Log } from "@models/Log";
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
const Logs: NextPage = () => {
  const [logs, setLogs] = useState<Log[]>();

  const getLogs = useCallback(async () => {
    const res = await fetch("/api/database/getLogs", {
      method: "POST",
      body: JSON.stringify({
        aggregated: true,
      }),
    });
    const { response } = await res.json();
    if (response) {
      setLogs(response);
    }
  }, []);

  useEffect(() => {
    getLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack ml={{ base: 0, md: 60 }} p="4">
      <VStack
        overflow={"auto"}
        justifyContent={"flex-start"}
        w={"100%"}
        fontSize={"sm"}
        h={"85vh"}
        overflowY={"scroll"}
        overflowX={"auto"}
        paddingX="2px"
        style={{
          overflowY: "auto",
          scrollbarGutter: "stable both-edges",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--chakra-ui-colors-gray-300) transparent",
        }}
      >
        {logs?.map((log, index) => {
          console.log(log);
          return (
            <HStack
              key={index}
              w={"100%"}
              borderRadius={"md"}
              border={"1px"}
              borderColor={"gray.600"}
              p={2}
            >
              <HStack w={"100%"} fontSize={"sm"}>
                {log.type === "role_creation" && (
                  <>
                    <chakra.span>Role</chakra.span>
                    <Tag
                      size={"sm"}
                      color={`${log.role?.color}.700`}
                      bgColor={`${log.role?.color}.200`}
                    >
                      {log?.role?.name}
                    </Tag>
                    <chakra.span>created</chakra.span>
                  </>
                )}
                {log.type === "role_deletion" && (
                  <>
                    <chakra.span>Role</chakra.span>
                    <Tag
                      size={"sm"}
                      color={`${log.role?.color}.700`}
                      bgColor={`${log.role?.color}.200`}
                    >
                      {log?.role?.name}
                    </Tag>
                    <chakra.span>deleted</chakra.span>
                  </>
                )}
                {log.type === "device_register" && (
                  <>
                    <chakra.span>Device</chakra.span>
                    <chakra.span>{log?.device?.name}</chakra.span>
                    <chakra.span>connected</chakra.span>
                  </>
                )}
                {log.type === "device_access_update" && (
                  <>
                    <chakra.span>Access</chakra.span>
                    <chakra.span>{log?.profile?.name}</chakra.span>
                    <chakra.span>{log?.access}</chakra.span>
                  </>
                )}
                <DateElement
                  localeIdentifier="en-UK"
                  timestamp={log.timestamp}
                  type="relative"
                  withTooltip
                />
              </HStack>
              {/* <AccordionPanel>
                    <HStack bgColor={"gray.600"} p={2} borderRadius={"md"}>
                      <VStack
                        bgColor={"gray.800"}
                        p={2}
                        borderRadius={"md"}
                        color={"gray.400"}
                      >
                        <chakra.span fontWeight={"bold"} color={"white"}>
                          Author
                        </chakra.span>
                        <Divider />
                        <chakra.span>{log?.profile?.name}</chakra.span>
                        <chakra.span>{log?.profile?.email}</chakra.span>
                      </VStack>
                    </HStack>
                  </AccordionPanel> */}
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
};

export default Logs;
