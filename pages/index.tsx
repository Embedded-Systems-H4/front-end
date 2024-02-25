import {
  Button,
  HStack,
  VStack,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { DeviceList } from "@components/DeviceList";
import Loading from "@components/Loading/Loading";
import { RoleManagementModal } from "@components/Modals/RoleManagementModal";
import { UserManagementModal } from "@components/Modals/UserManagementModal";
import { useMQTTPublish } from "@utils/useMQTTPublish";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { FaUserGear, FaUsersGear } from "react-icons/fa6";
import { GiRaiseZombie } from "react-icons/gi";
const Home: NextPage = () => {
  const {
    isOpen: isRoleModalOpen,
    onOpen: onRoleModalOpen,
    onClose: onRoleModalClose,
  } = useDisclosure();
  const {
    isOpen: isUserModalOpen,
    onOpen: onUserModalOpen,
    onClose: onUserModalClose,
  } = useDisclosure();

  const [isHydrated, setIsHydrated] = useState(false);

  const updateCallback = useCallback((callback: () => void) => {
    callback && callback();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsHydrated(true);
    }, 500);
  }, []);

  const { publish } = useMQTTPublish();

  const [zombieMode, setZombieMode] = useState(false);
  const onZombieLockdown = useCallback(async () => {
    setZombieMode(!zombieMode);
    publish({
      topic: "devices/lock",
      message: `"all", false`,
    });
    await fetch("/api/database/lockAll", {
      method: "POST",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publish]);

  if (!isHydrated) {
    return <Loading />;
  }

  return (
    <>
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={onUserModalClose}
        updateCallback={() => {
          updateCallback(() => {});
        }}
      />
      <RoleManagementModal
        isOpen={isRoleModalOpen}
        onClose={onRoleModalClose}
        updateCallback={() => {
          updateCallback(() => {});
        }}
        context="create"
      />
      <VStack ml={{ base: 0, md: 60 }} p="4">
        <HStack w={"100%"} h={"100%"}>
          <VStack w={"100%"}>
            <HStack
              p={2}
              bgColor={"gray.700"}
              w={"100%"}
              borderRadius={"md"}
              justifyContent={"left"}
            >
              <HStack w={"50%"} justifyContent={"left"}>
                <Button
                  size={"sm"}
                  borderRadius={"md"}
                  bgColor={"green.400"}
                  leftIcon={<GiRaiseZombie />}
                  _hover={{
                    bgColor: "green.500",
                  }}
                  onClick={() => {
                    onZombieLockdown();
                    setZombieMode(!zombieMode);
                  }}
                >
                  <HStack>
                    <chakra.span>Zombie lockdown</chakra.span>
                    <chakra.span opacity={0}>{zombieMode}</chakra.span>
                  </HStack>
                </Button>
              </HStack>
              <HStack w={"50%"} justifyContent={"right"}>
                <Button
                  size={"sm"}
                  borderRadius={"md"}
                  bgColor={"gray.600"}
                  leftIcon={<FaUsersGear />}
                  _hover={{
                    bgColor: "blue.400",
                  }}
                  onClick={() => {
                    onRoleModalOpen();
                  }}
                >
                  Role management
                </Button>
                <Button
                  size={"sm"}
                  borderRadius={"md"}
                  bgColor={"gray.600"}
                  leftIcon={<FaUserGear />}
                  _hover={{
                    bgColor: "blue.400",
                  }}
                  onClick={() => {
                    onUserModalOpen();
                  }}
                >
                  User management
                </Button>
              </HStack>
            </HStack>
            <DeviceList onCallback={() => {}} />
          </VStack>
        </HStack>
      </VStack>
    </>
  );
};

export default Home;
