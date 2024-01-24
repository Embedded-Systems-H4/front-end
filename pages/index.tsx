import { HStack, VStack } from "@chakra-ui/react";
import { DeviceList } from "@components/DeviceList";
import type { NextPage } from "next";
const Home: NextPage = () => {

  return (
    <VStack ml={{ base: 0, md: 60 }} p="4">
      <HStack w={'100%'} h={'100%'}>
        <DeviceList />
      </HStack>
    </VStack>
  );
};

export default Home;