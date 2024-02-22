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
              return <LogTableRow key={index} log={log} />;
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default Logs;
