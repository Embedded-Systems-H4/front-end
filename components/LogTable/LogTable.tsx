import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot, HStack, chakra } from "@chakra-ui/react"
import { IoPerson } from "react-icons/io5"
import { MdSensorDoor } from "react-icons/md"
import { FaClock } from "react-icons/fa6";
export const LogTable = () => {
    return (
        <TableContainer w={'100%'}>
            <Table size='lg'>
                <Thead>
                    <Tr>
                        <Th color={'gray.500'}>
                            <HStack>
                                <IoPerson />
                                <chakra.span>
                                    User
                                </chakra.span>
                            </HStack>
                        </Th>
                        <Th color={'gray.500'}>
                            <HStack justifyContent={'center'}>
                                <MdSensorDoor />
                                <chakra.span>
                                    Door
                                </chakra.span>
                            </HStack>
                        </Th>
                        <Th color={'gray.500'} isNumeric>
                            <HStack justifyContent={'end'}>
                                <FaClock />
                                <chakra.span>
                                    Time
                                </chakra.span>
                            </HStack>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Daniel</Td>
                        <Td>
                            <HStack justifyContent={'center'}>
                                <chakra.span>
                                    3
                                </chakra.span>
                            </HStack>
                        </Td>
                        <Td isNumeric>11:23</Td>
                    </Tr>
                    <Tr>
                        <Td>Vladyslav</Td>
                        <Td>
                            <HStack justifyContent={'center'}>
                                <chakra.span>
                                    3
                                </chakra.span>
                            </HStack>
                        </Td>
                        <Td isNumeric>19:23</Td>
                    </Tr>
                    <Tr>
                        <Td>Julain</Td>
                        <Td>
                            <HStack justifyContent={'center'}>
                                <chakra.span>
                                    3
                                </chakra.span>
                            </HStack>
                        </Td>
                        <Td isNumeric>21:23</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    )
}