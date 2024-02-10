import { Button, HStack, VStack, useDisclosure } from "@chakra-ui/react";
import { DeviceList } from "@components/DeviceList";
import { RoleCreationModal } from "@components/Modals/RoleCreationModal";
import type { NextPage } from "next";
import { useCallback } from "react";
import { FaUserGear, FaUsersGear } from "react-icons/fa6";

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateCallback = useCallback((callback: () => void) => {
    callback && callback();
  }, []);
  return (
    <>
      <RoleCreationModal
        isOpen={isOpen}
        onClose={onClose}
        updateCallback={() => {
          updateCallback(() => {});
        }}
        context="create"
      />
      <VStack ml={{ base: 0, md: 60 }} p="4">
        <HStack w={"100%"} h={"100%"}>
          <VStack w={"100%"}>
            <HStack p={2} bgColor={"gray.700"} w={"100%"} borderRadius={"md"}>
              <Button
                size={"sm"}
                borderRadius={"md"}
                bgColor={"blue.400"}
                leftIcon={<FaUsersGear />}
                _hover={{
                  bgColor: "blue.500",
                }}
                onClick={() => {
                  onOpen();
                }}
              >
                Role management
              </Button>
              <Button
                size={"sm"}
                borderRadius={"md"}
                bgColor={"blue.400"}
                leftIcon={<FaUserGear />}
                _hover={{
                  bgColor: "blue.500",
                }}
                onClick={() => {
                  onOpen();
                }}
              >
                User management
              </Button>
            </HStack>
            <DeviceList onCallback={() => {}} />
          </VStack>
        </HStack>
      </VStack>
    </>
  );
};

export default Home;
