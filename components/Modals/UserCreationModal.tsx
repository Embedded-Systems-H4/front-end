import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { useHookstate } from "@hookstate/core";
import { Profile } from "@models/Profile";
import { profilesGlobalState } from "@utils/globalStates";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "react-use";
export const UserCreationModal = ({
  isOpen,
  onClose,
  updateCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  updateCallback: () => void;
  deviceId?: string;
}) => {
  const profiles = useHookstate(profilesGlobalState);

  const [name, setName] = useState<string | null>(null);
  const [gender, setGender] = useState<"m" | "f" | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const getProfiles = useCallback(async () => {
    const res = await fetch("/api/database/getProfiles", {});
    const { response } = await res.json();
    if (response) {
      profiles.set(response);
    }
  }, [profiles]);

  const saveProfile = useCallback(
    async ({ profile }: { profile: Profile }) => {
      const res = await fetch(`/api/database/saveProfile`, {
        method: "POST",
        body: JSON.stringify({
          profile: profile,
        }),
      });
      const { error } = await res.json();
      if (!error) {
        profiles.set((previousProfiles) => {
          if (previousProfiles.some((e) => e.name === profile.name)) {
            updateCallback();
            return previousProfiles.map((e) =>
              e.name === name ? { ...e, ...profile } : e
            );
          } else {
            updateCallback();
            return [...previousProfiles, profile];
          }
        });
      }
    },
    [name, profiles, updateCallback]
  );

  const profileCreationHandler = useCallback(() => {
    const contextProfile: Profile = {
      name: name as string,
      birthday: birthday as Date,
      gender: gender as "m" | "f",
      email: email as string,
      status: "enabled",
    };
    saveProfile({ profile: contextProfile });
  }, [birthday, email, gender, name, saveProfile]);

  useDebounce(
    () => {
      setName(name);
      setEmail(email);
    },
    500,
    [name, email]
  );

  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={"gray.600"}>
        <ModalHeader>User management</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Accordion allowToggle>
            <AccordionItem
              borderRadius={"md"}
              border={"1px"}
              borderColor={"gray.500"}
            >
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <chakra.span
                    fontSize={"md"}
                    fontWeight={"bold"}
                    color={"gray.400"}
                  >
                    Create profile
                  </chakra.span>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} fontSize={"sm"}>
                <Box>
                  <FormControl isRequired mt={4}>
                    <FormLabel fontSize={"sm"} fontWeight={"normal"}>
                      Full name
                    </FormLabel>
                    <HStack spacing={0}>
                      <Input
                        onChange={(e) => {
                          setName(e?.target?.value);
                        }}
                        placeholder="Fx: Bo Jensen"
                        bgColor={"gray.700"}
                        borderColor={"gray.500"}
                        borderRadius={"md"}
                        size={"sm"}
                      />
                    </HStack>
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel fontSize={"sm"} fontWeight={"normal"}>
                      Gender
                    </FormLabel>
                    <HStack spacing={0}>
                      <Select
                        onChange={(e) => {
                          setGender(
                            e.currentTarget.value === "Male" ? "m" : "f"
                          );
                        }}
                        placeholder="Rather not say"
                        bgColor={"gray.700"}
                        borderColor={"gray.500"}
                        borderRadius={"md"}
                        size={"sm"}
                        sx={{
                          "> option": {
                            background: "gray.700",
                            color: "white",
                          },
                        }}
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </Select>
                    </HStack>
                  </FormControl>
                  <FormControl
                    isRequired
                    mt={4}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      setBirthday(target.valueAsDate as Date);
                    }}
                  >
                    <FormLabel fontSize={"sm"} fontWeight={"normal"}>
                      Birthday
                    </FormLabel>
                    <HStack spacing={0}>
                      <Input
                        autoComplete="off"
                        placeholder="dd-mm-yyyy"
                        bgColor={"gray.700"}
                        borderColor={"gray.500"}
                        borderRadius={"md"}
                        size={"sm"}
                        type="date"
                      />
                    </HStack>
                  </FormControl>
                  <FormControl isRequired mt={4}>
                    <FormLabel fontSize={"sm"} fontWeight={"normal"}>
                      Email
                    </FormLabel>
                    <HStack spacing={0}>
                      <Input
                        onChange={(e) => {
                          setEmail(e?.target?.value);
                        }}
                        placeholder="Fx: bo@aarhustech.dk"
                        bgColor={"gray.700"}
                        borderColor={"gray.500"}
                        borderRadius={"md"}
                        size={"sm"}
                      />
                    </HStack>
                  </FormControl>
                  <HStack justifyContent={"right"} mt={4}>
                    <Button
                      isDisabled={!name || !birthday || !email}
                      w={"100%"}
                      bgColor={"blue.400"}
                      size={"sm"}
                      onClick={() => {
                        profileCreationHandler();
                        onClose();
                        setName(null);
                        setGender(null);
                        setBirthday(null);
                        setEmail(null);
                      }}
                    >
                      Create
                    </Button>
                  </HStack>
                </Box>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem
              mt={3}
              borderRadius={"md"}
              border={"1px"}
              borderColor={"gray.500"}
            >
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <chakra.span
                    fontSize={"md"}
                    fontWeight={"bold"}
                    color={"gray.400"}
                  >
                    Manage profiles
                  </chakra.span>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} fontSize={"sm"}>
                <Box>
                  {profiles.get({ noproxy: true }).map((profile) => {
                    return (
                      <chakra.span key={profile.email}>
                        {profile.name}
                      </chakra.span>
                    );
                  })}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </ModalBody>

        <ModalFooter>
          <Button
            bgColor={"red.500"}
            size={"sm"}
            mr={3}
            onClick={() => {
              onClose();
              setName(null);
              setGender(null);
              setBirthday(null);
              setEmail(null);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
