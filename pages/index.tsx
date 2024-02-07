import { Button, HStack, VStack, useDisclosure } from "@chakra-ui/react";
import { DeviceList } from "@components/DeviceList";
import { RoleManagementModal } from "@components/Modals/RoleManagementModal";
import type { NextPage } from "next";
import { MdAddToPhotos } from "react-icons/md";

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <RoleManagementModal isOpen={isOpen} onClose={onClose} context="create" />
      <VStack ml={{ base: 0, md: 60 }} p="4">
        <HStack w={"100%"} h={"100%"}>
          <VStack w={"100%"}>
            <HStack p={2} bgColor={"gray.700"} w={"100%"} borderRadius={"md"}>
              <Button
                size={"sm"}
                borderRadius={"md"}
                bgColor={"blue.400"}
                leftIcon={<MdAddToPhotos />}
                _hover={{
                  bgColor: "blue.500",
                }}
                onClick={() => {
                  onOpen();
                }}
              >
                Create new role
              </Button>
            </HStack>
            <DeviceList />
          </VStack>
        </HStack>
      </VStack>
    </>
  );
};

export default Home;
