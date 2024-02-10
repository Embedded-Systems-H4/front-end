import {
  Box,
  Button,
  Divider,
  Flex,
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
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  TagLabel,
  Tooltip,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { RadioCardGroup } from "@components/RadioCardGroup/RadioCardGroup";
import { useHookstate } from "@hookstate/core";
import { Role } from "@models/Role";
import { deviceRolesGlobalState, rolesGlobalState } from "@utils/globalStates";
import { useCallback, useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import { useDebounce } from "react-use";
export const RoleCreationModal = ({
  isOpen,
  onClose,
  updateCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  updateCallback: () => void;
  context: "manage" | "create";
  deviceId?: string;
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const roles = useHookstate(rolesGlobalState);
  const deviceRoles = useHookstate(deviceRolesGlobalState);

  const [input, setInput] = useState<string | null>(null);

  const getRoles = useCallback(async () => {
    const res = await fetch("/api/database/getRoles", {});
    const { response } = await res.json();
    if (response) {
      roles.set(response);
    }
  }, [roles]);

  const saveRole = useCallback(
    async ({ name, color }: { name: string; color: string }) => {
      const res = await fetch(`/api/database/saveRole`, {
        method: "POST",
        headers: {
          name: name,
          color: color,
        },
      });
      const { error } = await res.json();
      if (!error) {
        const newRole = { name, color };

        roles.set((previousRoles) => {
          if (previousRoles.some((role) => role.name === name)) {
            updateCallback();
            return previousRoles.map((role) =>
              role.name === name ? { ...role, ...newRole } : role
            );
          } else {
            updateCallback();
            return [...previousRoles, newRole];
          }
        });
      }
    },
    [roles, updateCallback]
  );

  const deleteRole = useCallback(
    async ({ name, color }: { name: string; color: string }) => {
      const res = await fetch(`/api/database/deleteRole`, {
        method: "POST",
        headers: {
          name: name,
          color: color,
        },
      });
      const { response, error } = await res.json();
      if (error) {
        console.log(error);
      }
      if (response) {
        roles.set((prev) => prev.filter((role) => role.name !== response.name));
        deviceRoles.set((prev) =>
          prev.filter((role) => role.name !== response.name)
        );
        updateCallback();
      }
    },
    [deviceRoles, roles, updateCallback]
  );

  useDebounce(
    () => {
      setInput(input);
    },
    500,
    [input]
  );

  useEffect(() => {
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={"gray.600"}>
        <ModalHeader>Role creation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {roles?.length > 0 && (
            <Box
              borderRadius={"md"}
              border={"1px"}
              fontSize={"sm"}
              borderColor={"gray.500"}
              pt={3}
              px={3}
            >
              <chakra.span
                fontSize={"md"}
                fontWeight={"bold"}
                color={"gray.400"}
              >
                Manage roles
              </chakra.span>
              <Divider />
              <HStack spacing={1} my={1} mb={8}>
                {roles
                  .get({ noproxy: true })
                  .slice(0, 2)
                  .map((role: Role, index: number) => (
                    <Tag
                      key={index}
                      variant="subtle"
                      size={"sm"}
                      bgColor={`${role.color}.200`}
                      color={`${role.color}.700`}
                      userSelect={"none"}
                      my={0.5}
                      mx={0.5}
                    >
                      <HStack h={"100%"} w={"100%"}>
                        <Tooltip label={role.name}>
                          <TagLabel>{role.name}</TagLabel>
                        </Tooltip>
                        <FaX
                          style={{
                            minWidth: "10px",
                            minHeight: "10px",
                          }}
                          cursor={"pointer"}
                          onClick={() =>
                            deleteRole({ name: role.name, color: role.color })
                          }
                        />
                      </HStack>
                    </Tag>
                  ))}
                {roles.length > 2 && (
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="subtle"
                        h={"22px"}
                        w={"80px"}
                        fontSize={"xs"}
                        borderRadius={"md"}
                        cursor={"pointer"}
                        userSelect={"none"}
                        bgColor={"gray.700"}
                      >
                        <chakra.span color={"white"} px={2}>
                          +{roles.length - 2} more
                        </chakra.span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      zIndex={"popover"}
                      bgColor={"gray.700"}
                      border={0}
                      fontSize={"sm"}
                      w={"400px"}
                    >
                      <PopoverBody>
                        <Flex flexWrap="wrap">
                          {roles
                            .get({ noproxy: true })
                            .slice(2)
                            .map((role, index) => (
                              <Tag
                                key={index}
                                variant="subtle"
                                size={"sm"}
                                bgColor={`${role.color}.200`}
                                color={`${role.color}.700`}
                                userSelect={"none"}
                                my={0.5}
                                mx={0.5}
                              >
                                <TagLabel>
                                  <HStack>
                                    <chakra.span>{role.name}</chakra.span>
                                    <FaX
                                      style={{
                                        width: "10px",
                                        height: "10px",
                                      }}
                                      cursor={"pointer"}
                                      onClick={() => {
                                        deleteRole({
                                          name: role.name,
                                          color: role.color,
                                        });
                                      }}
                                    />
                                  </HStack>
                                </TagLabel>
                              </Tag>
                            ))}
                        </Flex>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}
              </HStack>
            </Box>
          )}

          <Box
            borderRadius={"md"}
            border={"1px"}
            borderColor={"gray.500"}
            my={3}
            py={3}
            px={3}
          >
            <chakra.span fontSize={"md"} fontWeight={"bold"} color={"gray.400"}>
              Create roles
            </chakra.span>
            <Divider />
            <FormControl isRequired mt={4}>
              <FormLabel fontSize={"sm"} fontWeight={"normal"}>
                Name
              </FormLabel>
              <HStack spacing={0}>
                <Input
                  onChange={(e) => {
                    setInput(e?.target?.value);
                  }}
                  placeholder="Fx: Developer"
                  bgColor={"gray.700"}
                  borderColor={"gray.500"}
                  borderRadius={"md"}
                  size={"sm"}
                />
              </HStack>
              <FormLabel mt={4} fontSize={"sm"} fontWeight={"normal"}>
                Color
              </FormLabel>
              <HStack justifyContent={"space-between"}>
                <RadioCardGroup
                  options={["red", "green", "blue", "yellow"]}
                  setSelectedOption={setSelectedOption}
                />
                <Button
                  bgColor={"blue.400"}
                  borderRadius={"md"}
                  size={"sm"}
                  isDisabled={!input || !selectedOption}
                  onClick={() => {
                    saveRole({
                      name: input?.toUpperCase() as string,
                      color: selectedOption as string,
                    });
                  }}
                >
                  Create
                </Button>
              </HStack>
            </FormControl>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            bgColor={"red.500"}
            size={"sm"}
            mr={3}
            onClick={() => {
              onClose();
              setInput(null);
              setSelectedOption(null);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
