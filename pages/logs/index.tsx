import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { LogTableRow } from "@components/LogTableRow/LogTableRow";
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
      <TableContainer w={"100%"} borderRadius={"md"}>
        <Table bgColor={"gray.600"}>
          <Thead>
            <Tr>
              <Th color={"gray.300"}>Date</Th>
              <Th color={"gray.300"}>Type</Th>
              <Th color={"gray.300"}>Device</Th>
              <Th color={"gray.300"}>User</Th>
              <Th color={"gray.300"} isNumeric>
                Card
              </Th>
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
            {logs?.map((log: Log, index: number) => {
              return (
                <LogTableRow key={index} log={log} />
                // <>

                //   {/* {log?.type === "device_register" && (
                //     <>
                //       <Tr>
                //         <Td>
                //           <DateElement
                //             localeIdentifier="dk-DK"
                //             timestamp={log?.timestamp}
                //             type="long"
                //           />
                //         </Td>
                //         <Td>
                //           <Badge color={"blue.700"} bgColor={`blue.200`}>
                //             DEVICE CONNECTED
                //           </Badge>
                //         </Td>
                //         <Td>
                //           <HStack>
                //             <Box color={"gray.400"}>
                //               {log?.device?.type === "door" ? (
                //                 <FaDoorOpen
                //                   style={{
                //                     width: "24px",
                //                     height: "24px",
                //                   }}
                //                 />
                //               ) : (
                //                 <MdDeviceUnknown
                //                   style={{
                //                     width: "24px",
                //                     height: "24px",
                //                   }}
                //                 />
                //               )}
                //             </Box>
                //             <chakra.span>{log?.device?.name}</chakra.span>
                //           </HStack>
                //         </Td>
                //         <Td></Td>
                //         <Td isNumeric>
                //           {log?.card && (
                //             <HStack w={"100%"} justifyContent={"right"}>
                //               <chakra.span>{log?.cardId}</chakra.span>
                //               <Box color={"gray.400"}>
                //                 <FaAddressCard
                //                   style={{
                //                     width: "24px",
                //                     height: "24px",
                //                   }}
                //                 />
                //               </Box>
                //             </HStack>
                //           )}
                //         </Td>
                //       </Tr>
                //     </>
                //   )}
                //   {log?.type === "device_access_update" && (
                //     <>
                //       <Tr>
                //         <Td>
                //           <DateElement
                //             localeIdentifier="dk-DK"
                //             timestamp={log?.timestamp}
                //             type="long"
                //           />
                //         </Td>
                //         <Td>
                //           <Badge
                //             color={`${
                //               log?.access === "denied" ? "red" : "lime"
                //             }.700`}
                //             bgColor={`${
                //               log?.access === "denied" ? "red" : "lime"
                //             }.200`}
                //           >
                //             ACCESS {log?.access}
                //           </Badge>
                //         </Td>
                //         <Td>
                //           <HStack>
                //             <Box color={"gray.400"}>
                //               {log?.device?.type === "door" ? (
                //                 <FaDoorOpen
                //                   style={{
                //                     width: "24px",
                //                     height: "24px",
                //                   }}
                //                 />
                //               ) : (
                //                 <MdDeviceUnknown
                //                   style={{
                //                     width: "24px",
                //                     height: "24px",
                //                   }}
                //                 />
                //               )}
                //             </Box>
                //             <chakra.span>{log?.device?.name}</chakra.span>
                //           </HStack>
                //         </Td>
                //         <Td>
                //           <HStack>
                //             {log?.profile ? (
                //               <>
                //                 <Avatar name={log?.profile?.name} size={"xs"} />
                //                 <chakra.span>{log?.profile?.name}</chakra.span>
                //               </>
                //             ) : (
                //               <HStack>
                //                 <HStack
                //                   color={"gray.800"}
                //                   bgColor={"gray.400"}
                //                   borderRadius={"full"}
                //                   h={"24px"}
                //                   w={"24px"}
                //                   justifyContent={"center"}
                //                 >
                //                   <FaUserXmark
                //                     style={{
                //                       width: "16px",
                //                       height: "16px",
                //                     }}
                //                   />
                //                 </HStack>
                //                 <chakra.span>NO LINKED USER</chakra.span>
                //               </HStack>
                //             )}
                //           </HStack>
                //         </Td>

                //         <Td isNumeric>
                //           <HStack w={"100%"} justifyContent={"right"}>
                //             <chakra.span>{log?.cardId}</chakra.span>
                //             <Box color={"gray.400"}>
                //               <FaAddressCard
                //                 style={{
                //                   width: "24px",
                //                   height: "24px",
                //                 }}
                //               />
                //             </Box>
                //           </HStack>
                //         </Td>
                //       </Tr>
                //     </>
                //   )} */}
                // </>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default Logs;
