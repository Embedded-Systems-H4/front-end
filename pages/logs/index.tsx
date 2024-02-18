import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  HStack,
  Tag,
  VStack,
  chakra,
} from "@chakra-ui/react";
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
      <HStack w={"100%"} h={"100%"}>
        <VStack justifyContent={"flex-start"} w={"100%"}>
          <Accordion w={"100%"} allowToggle defaultIndex={[0]} fontSize={"sm"}>
            {logs?.map((log, index) => {
              return (
                <AccordionItem
                  key={index}
                  borderRadius={"md"}
                  border={"1px"}
                  borderColor={"gray.600"}
                  my={2}
                >
                  <AccordionButton>
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
                      <DateElement
                        localeIdentifier="en-UK"
                        timestamp={log.timestamp}
                        type="relative"
                        withTooltip
                      />
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <HStack bgColor={"gray.600"} p={2} borderRadius={"md"}>
                      <VStack
                        bgColor={"gray.800"}
                        p={2}
                        borderRadius={"md"}
                        border={"1px"}
                        borderColor={"gray.500"}
                        color={"gray.400"}
                      >
                        <chakra.span fontWeight={"bold"} color={"white"}>
                          Author
                        </chakra.span>
                        <Divider />
                        <chakra.span>{log.author?.name}</chakra.span>
                        <chakra.span>{log.author?.email}</chakra.span>
                      </VStack>
                    </HStack>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Logs;
