import {
  Avatar,
  Badge,
  Box,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { DateElement } from "@components/Date/Date";
import { Log } from "@models/Log";
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { FaAddressCard, FaDoorOpen, FaUserXmark } from "react-icons/fa6";
import { MdDeviceUnknown } from "react-icons/md";
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
      <TableContainer w={"100%"} borderRadius={"md"}>
        <Table bgColor={"gray.600"}>
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Device</Th>
              <Th>User</Th>
              <Th isNumeric>Card</Th>
            </Tr>
          </Thead>
          <Tbody
            overflow={"auto"}
            justifyContent={"flex-start"}
            w={"100%"}
            fontSize={"sm"}
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
            {logs?.map((log) => {
              return (
                <>
                  {log?.type === "device_register" && (
                    <>
                      <Tr>
                        <Td>
                          <DateElement
                            localeIdentifier="dk-DK"
                            timestamp={log?.timestamp}
                            type="long"
                          />
                        </Td>
                        <Td>
                          <Badge color={"blue.700"} bgColor={`blue.200`}>
                            DEVICE CONNECTED
                          </Badge>
                        </Td>
                        <Td>
                          <HStack>
                            <Box color={"gray.400"}>
                              {log?.device?.type === "door" ? (
                                <FaDoorOpen
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                  }}
                                />
                              ) : (
                                <MdDeviceUnknown
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                  }}
                                />
                              )}
                            </Box>
                            <chakra.span>{log?.device?.name}</chakra.span>
                          </HStack>
                        </Td>
                        <Td></Td>
                        <Td isNumeric>
                          {log?.card && (
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
                        </Td>
                      </Tr>
                    </>
                  )}
                  {log?.type === "device_access_update" && (
                    <>
                      <Tr>
                        <Td>
                          <DateElement
                            localeIdentifier="dk-DK"
                            timestamp={log?.timestamp}
                            type="long"
                          />
                        </Td>
                        <Td>
                          <Badge
                            color={`${
                              log?.access === "denied" ? "red" : "lime"
                            }.700`}
                            bgColor={`${
                              log?.access === "denied" ? "red" : "lime"
                            }.200`}
                          >
                            ACCESS {log?.access}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack>
                            <Box color={"gray.400"}>
                              {log?.device?.type === "door" ? (
                                <FaDoorOpen
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                  }}
                                />
                              ) : (
                                <MdDeviceUnknown
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                  }}
                                />
                              )}
                            </Box>
                            <chakra.span>{log?.device?.name}</chakra.span>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack>
                            {log?.profile ? (
                              <>
                                <Avatar name={log?.profile?.name} size={"xs"} />
                                <chakra.span>{log?.profile?.name}</chakra.span>
                              </>
                            ) : (
                              <HStack>
                                <HStack
                                  color={"gray.800"}
                                  bgColor={"gray.400"}
                                  borderRadius={"full"}
                                  h={"24px"}
                                  w={"24px"}
                                  justifyContent={"center"}
                                >
                                  <FaUserXmark
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                    }}
                                  />
                                </HStack>
                                <chakra.span>NO LINKED USER</chakra.span>
                              </HStack>
                            )}
                          </HStack>
                        </Td>

                        <Td isNumeric>
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
                        </Td>
                      </Tr>
                    </>
                  )}
                </>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default Logs;

// <HStack
//   key={index}
//   w={"100%"}
//   borderRadius={"md"}
//   border={"1px"}
//   borderColor={"gray.600"}
//   p={2}
// >
//   <HStack w={"100%"} fontSize={"sm"}>
//     {log.type === "role_creation" && (
//       <>
//         <chakra.span>Role</chakra.span>
//         <Tag
//           size={"sm"}
//           color={`${log.role?.color}.700`}
//           bgColor={`${log.role?.color}.200`}
//         >
//           {log?.role?.name}
//         </Tag>
//         <chakra.span>created</chakra.span>
//       </>
//     )}
//     {log.type === "role_deletion" && (
//       <>
//         <chakra.span>Role</chakra.span>
//         <Tag
//           size={"sm"}
//           color={`${log.role?.color}.700`}
//           bgColor={`${log.role?.color}.200`}
//         >
//           {log?.role?.name}
//         </Tag>
//         <chakra.span>deleted</chakra.span>
//       </>
//     )}
//     {log.type === "device_register" && (
//       <>
//         <chakra.span>Device</chakra.span>
//         <chakra.span>{log?.device?.name}</chakra.span>
//         <chakra.span>connected</chakra.span>
//       </>
//     )}
//     {log.type === "device_access_update" && (
//       <>{log?.profile?.name ? <></> : <></>}</>
//     )}
//   </HStack>
// </HStack>
