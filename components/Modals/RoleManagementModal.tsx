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
  useDisclosure,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { RadioCardGroup } from "@components/RadioCardGroup/RadioCardGroup";
import { Role } from "@models/Role";
import { getDeviceById } from "@utils/deviceList";
import { mergeRole, setRoleList } from "@utils/roleList";
import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaX } from "react-icons/fa6";
import { useDebounce } from "react-use";
export const RoleManagementModal = ({
  isOpen,
  onClose,
  deviceId,
  context,
}: {
  isOpen: boolean;
  onClose: () => void;
  context: "manage" | "create";
  deviceId?: string;
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const device = getDeviceById(deviceId as string);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allowedRoles, setAllowedRoles] = useState<Role[]>([]);
  const rolesPresence = roles.length > 0;
  const [input, setInput] = useState<string | null>(null);
  const rolesSlice = roles.slice(4);
  const { isOpen: isTagTooltipOpen, onToggle: tagTooltipToggle } =
    useDisclosure();

  const getRoles = useCallback(async () => {
    const res = await fetch("/api/database/getRoles", {});
    const data = await res.json();
    if (data?.roles) {
      setRoles(data?.roles);
      setRoleList(data?.roles);
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const checkRoles = useCallback(async () => {
    const res = await fetch(`/api/database/getRoles`, {
      method: "GET",
      headers: {
        name: input?.toUpperCase() as string,
      },
    });
    const data = await res.json();
    const roles = data.roles;

    setRoles(roles || []);
  }, [input]);

  const checkAllowedRoles = useCallback(async () => {
    const res = await fetch(`/api/database/getAllowedRoles`, {
      method: "GET",
      headers: {
        deviceId: deviceId as string,
      },
    });
    const data = await res.json();

    setAllowedRoles(data.roles || []);
  }, [deviceId]);

  useEffect(() => {
    checkRoles();
    checkAllowedRoles();
  }, [checkAllowedRoles, checkRoles]);

  useDebounce(
    () => {
      setInput(input);
    },
    500,
    [input]
  );

  const saveRole = useCallback(
    async ({ name, color }: { name: string; color: string }) => {
      const res = await fetch(`/api/database/saveRole`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          color: color,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      }
      const role = data?.role;
      if (role) {
        mergeRole(role);
        checkRoles();
      }
    },
    [checkRoles]
  );

  const allowRole = useCallback(
    async ({
      name,
      color,
      deviceId,
    }: {
      name: string;
      color: string;
      deviceId: string;
    }) => {
      const res = await fetch(`/api/database/allowRole`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          color: color,
          deviceId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      }
      const role = data?.role;
      if (role) {
        mergeRole(role);
        checkRoles();
      }
    },
    [checkRoles]
  );

  const deleteRole = useCallback(
    async ({ name }: { name: string }) => {
      const res = await fetch(`/api/database/deleteRole`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      }
      checkRoles();
    },
    [checkRoles]
  );

  const deleteAllowedRole = useCallback(
    async ({ name, deviceId }: { name: string; deviceId: string }) => {
      const res = await fetch(`/api/database/deleteAllowedRole`, {
        method: "POST",
        body: JSON.stringify({
          name: name.toUpperCase(),
          deviceId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      }
      const role = data?.role;
      if (role) {
        checkAllowedRoles();
      }
    },
    [checkAllowedRoles]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={"gray.600"}>
        <ModalHeader>Role management</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {roles?.length > 0 && context === "create" && (
            <Box
              borderRadius={"md"}
              border={"1px"}
              fontSize={"sm"}
              borderColor={"gray.500"}
              pt={3}
              px={3}
            >
              <chakra.span fontSize={"sm"} fontWeight={"bold"}>
                Manage roles
              </chakra.span>
              <Divider />
              <HStack spacing={1} my={1} mb={8}>
                {roles.slice(0, 4).map((role: Role, index: number) => (
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
                          width: "10px",
                          height: "10px",
                        }}
                        cursor={"pointer"}
                        onClick={() => deleteRole({ name: role.name })}
                      />
                    </HStack>
                  </Tag>
                ))}
                {roles.length > 4 && (
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
                          +{roles.length - 4} more
                        </chakra.span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      zIndex={"popiver"}
                      bgColor={"gray.700"}
                      border={0}
                      fontSize={"sm"}
                    >
                      <PopoverBody>
                        <Flex flexWrap="wrap">
                          {rolesSlice.map((role, index) => (
                            <Tag
                              key={index}
                              variant="subtle"
                              size={"sm"}
                              colorScheme={`${role.color}.200`}
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
                                    onClick={() =>
                                      deleteRole({ name: role.name })
                                    }
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

          {roles?.length > 0 && context === "manage" && (
            <>
              <Box
                borderRadius={"md"}
                border={"1px"}
                fontSize={"sm"}
                borderColor={"gray.500"}
                pt={3}
                px={3}
              >
                <chakra.span fontSize={"sm"} fontWeight={"bold"}>
                  Avalible roles
                </chakra.span>
                <Divider />
                <HStack spacing={1} my={1} mb={8}>
                  {roles?.slice(0, 4).map((role: Role, index: number) => (
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
                        <FaPlus
                          style={{
                            width: "10px",
                            height: "10px",
                          }}
                          cursor={"pointer"}
                          onClick={() =>
                            allowRole({
                              name: role.name,
                              color: role.color,
                              deviceId: deviceId as string,
                            })
                          }
                        />
                      </HStack>
                    </Tag>
                  ))}
                  {roles.length > 4 && (
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
                            +{roles.length - 4} more
                          </chakra.span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        zIndex={"popiver"}
                        bgColor={"gray.700"}
                        border={0}
                        fontSize={"sm"}
                      >
                        <PopoverBody>
                          <Flex flexWrap="wrap">
                            {rolesSlice.map((role, index) => (
                              <Tag
                                key={index}
                                variant="subtle"
                                size={"sm"}
                                colorScheme={`${role.color}.200`}
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
                                      onClick={() =>
                                        deleteRole({ name: role.name })
                                      }
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
              {device?.allowedRoles && device?.allowedRoles?.length > 0 && (
                <>
                  <Box
                    borderRadius={"md"}
                    border={"1px"}
                    fontSize={"sm"}
                    borderColor={"gray.500"}
                    pt={3}
                    mt={3}
                    px={3}
                  >
                    <chakra.span fontSize={"sm"} fontWeight={"bold"}>
                      Current roles
                    </chakra.span>
                    <Divider />
                    <HStack spacing={1} my={1} mb={8}>
                      {device?.allowedRoles
                        ?.slice(0, 4)
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
                                  width: "10px",
                                  height: "10px",
                                }}
                                cursor={"pointer"}
                                onClick={() =>
                                  deleteAllowedRole({
                                    name: role.name,
                                    deviceId: deviceId as string,
                                  })
                                }
                              />
                            </HStack>
                          </Tag>
                        ))}
                      {roles.length > 4 && (
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
                                +{roles.length - 4} more
                              </chakra.span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            zIndex={"popiver"}
                            bgColor={"gray.700"}
                            border={0}
                            fontSize={"sm"}
                          >
                            <PopoverBody>
                              <Flex flexWrap="wrap">
                                {rolesSlice.map((role, index) => (
                                  <Tag
                                    key={index}
                                    variant="subtle"
                                    size={"sm"}
                                    colorScheme={`${role.color}.200`}
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
                                          onClick={() =>
                                            deleteRole({ name: role.name })
                                          }
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
                </>
              )}
            </>
          )}

          {!rolesPresence && context === "manage" && (
            <HStack
              spacing={4}
              fontSize={"sm"}
              bgColor={"gray.700"}
              p={2}
              my={1}
              mb={4}
              borderRadius={"md"}
            >
              <chakra.span>
                No roles avalible, please create a role.
              </chakra.span>
            </HStack>
          )}

          {context === "create" && (
            <Box
              borderRadius={"md"}
              border={"1px"}
              borderColor={"gray.500"}
              my={3}
              py={3}
              px={3}
            >
              <chakra.span fontSize={"sm"} fontWeight={"bold"}>
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
          )}
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
