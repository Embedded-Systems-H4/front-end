import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react";
import { LogTableRow } from "@components/LogTableRow/LogTableRow";
import { Log } from "@models/Log";
import { NextPage } from "next";
import { useRouter as useNavRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { BsArrowDownCircleFill } from "react-icons/bs";
const Logs: NextPage = () => {
  const [logs, setLogs] = useState<Log[]>();

  const  {query} = useRouter();
  const  router = useNavRouter();
  const limit = query?.limit || 10
  
  const getLogs = useCallback(async () => {
    const res = await fetch(`/api/database/getLogs?limit=${limit}`, {
      method: "POST",
      body: JSON.stringify({
        aggregated: true,
      }),
    });
    const { response } = await res.json();
    if (response) {
      setLogs(response);
    }
  }, [limit]);

  useEffect(() => {
    if(!limit) {
      return;
    }
    getLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

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
      <Button justifyContent={'center'} my={10}
        onClick={()=> router.push(`?limit=${parseInt(limit as string) + 10}`)}
      >
      <BsArrowDownCircleFill
          style={
        {

          width: "30px",
          height: "30px"
        }
      }/>
      </Button>
    </VStack>
  );
};

export default Logs;
