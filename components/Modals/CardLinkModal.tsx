import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { useHookstate } from "@hookstate/core";
import { Profile } from "@models/Profile";
import { Role } from "@models/Role";
import { profilesGlobalState } from "@utils/globalStates";
import { useMQTTPublish } from "@utils/useMQTTPublish";
import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { Searchbar } from "./Searchbar";

export const CardLinkModal = ({
  isOpen,
  onClose,
  deviceId,
  startCountdown,
}: {
  isOpen: boolean;
  onClose: () => void;
  startCountdown: () => void;
  deviceId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const profiles = useHookstate(profilesGlobalState);
  const { publish } = useMQTTPublish();
  const onClickHandler = useCallback(
    ({ profile }: { profile: Profile }) => {
      publish({
        topic: "devices/link",
        message: `${deviceId},${profile.id},${profile.name}`,
      });
      onClose();
      startCountdown();
      profiles.set([]);
    },
    [deviceId, onClose, profiles, publish, startCountdown]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={"gray.600"}>
        <ModalHeader>Card linking</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Searchbar setLoading={setLoading} />
          <Box
            bgColor={"gray.700"}
            borderRadius={"md"}
            my={1}
            p={profiles.length > 0 ? 2 : 0}
          >
            <Skeleton
              isLoaded={!loading}
              startColor="gray.400"
              endColor="blackAlpha.900"
              borderRadius={"md"}
              w={"100%"}
              as={HStack}
            >
              <VStack w={"100%"}>
                <AnimatePresence>
                  {profiles.length > 0 &&
                    profiles.get({ noproxy: true })?.map((profile, index) => {
                      return (
                        <HStack
                          p={1}
                          border={0}
                          w={"100%"}
                          fontSize={"sm"}
                          bgColor={"gray.600"}
                          borderRadius={"md"}
                          key={profile.email}
                        >
                          <Avatar
                            boxShadow={"md"}
                            src="https://cdn2.iconfinder.com/data/icons/audio-16/96/user_avatar_profile_login_button_account_member-1024.png"
                            name={profile.name}
                            bgColor={"blue.400"}
                          />
                          <VStack ml={2} w={"60%"}>
                            <HStack w={"100%"}>
                              <chakra.span fontWeight="bold">
                                {profile.name}
                              </chakra.span>
                              {profile?.roles &&
                                profile?.roles?.map((role: Role) => {
                                  return (
                                    <Badge
                                      fontSize={"x-small"}
                                      key={role.name}
                                      ml="1"
                                      bgColor={"blackAlpha.600"}
                                      color={"white"}
                                    >
                                      {role?.name}
                                    </Badge>
                                  );
                                })}
                            </HStack>
                            <HStack w={"100%"}>
                              <chakra.span color={"gray.400"}>
                                {profile.email}
                              </chakra.span>
                            </HStack>
                          </VStack>
                          <Button
                            onClick={() => {
                              onClickHandler({ profile: profile as Profile });
                            }}
                            fontSize={"xs"}
                            cursor={"pointer"}
                            _hover={{
                              bgColor: "gray.900",
                            }}
                            w={"30%"}
                            justifyContent={"center"}
                            h={"100%"}
                            bgColor={"gray.800"}
                            borderRadius={"md"}
                            py={"18px"}
                          >
                            <chakra.span color={"white"}>Link</chakra.span>
                          </Button>
                        </HStack>
                      );
                    })}
                </AnimatePresence>
              </VStack>
            </Skeleton>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
