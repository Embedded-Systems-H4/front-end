import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Tag,
  TagLabel,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { useHookstate } from "@hookstate/core";
import { Role } from "@models/Role";
import { deviceRolesGlobalState, rolesGlobalState } from "@utils/globalStates";
import { useCallback, useEffect } from "react";

export const RoleManagementModal = ({
  isOpen,
  onClose,
  deviceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  deviceId?: string;
}) => {
  const deviceRoles = useHookstate(deviceRolesGlobalState);
  const roles = useHookstate(rolesGlobalState);

  const getRoles = useCallback(async () => {
    const res = await fetch("/api/database/getRoles", {
      headers: {
        device_id: deviceId as string,
        context: "device",
      },
    });
    const { response } = await res.json();
    if (response) {
      deviceRoles.set(response);
    }
  }, [deviceId, deviceRoles]);

  const saveRole = useCallback(
    async ({ name, color }: { name: string; color: string }) => {
      const res = await fetch(`/api/database/saveRole`, {
        method: "POST",
        headers: {
          name: name,
          context: "device",
          color: color,
          device_id: deviceId as string,
        },
      });
      const { error } = await res.json();
      if (!error) {
        deviceRoles.merge([{ name, color }]);
      }
    },
    [deviceId, deviceRoles]
  );

  const deleteRole = useCallback(
    async ({ name, color }: { name: string; color: string }) => {
      const res = await fetch(`/api/database/deleteRole`, {
        method: "POST",
        headers: {
          name: name,
          context: "device",
          color: color,
          device_id: deviceId as string,
        },
      });
      const { response, error } = await res.json();
      if (error) {
        console.log(error);
      }
      if (response) {
        deviceRoles.set((prev) =>
          prev.filter((role) => role.name !== response.name)
        );
      }
    },
    [deviceId, deviceRoles]
  );

  const deviceRoleHandler = useCallback(
    ({ role, enabled }: { role: Role; enabled: boolean }) => {
      if (enabled) {
        saveRole({
          name: role.name,
          color: role.color,
        });
      } else {
        deleteRole({
          name: role.name,
          color: role.color,
        });
      }
    },
    [deleteRole, saveRole]
  );

  useEffect(() => {
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={"gray.600"}>
        <ModalHeader>Device role management</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {roles?.length > 0 && (
            <>
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
                  Allowed roles
                </chakra.span>
                <Divider />
                <VStack spacing={1} my={1} mb={3}>
                  {roles
                    .get({ noproxy: true })
                    ?.map((role: Role, index: number) => (
                      <Tag
                        key={index}
                        variant="subtle"
                        size={"sm"}
                        bgColor={`${role.color}.200`}
                        color={`${role.color}.700`}
                        userSelect={"none"}
                        w={"100%"}
                        my={0.5}
                        mx={0.5}
                      >
                        <FormControl
                          onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            deviceRoleHandler({
                              role: role,
                              enabled: target?.checked,
                            });
                          }}
                        >
                          <HStack
                            h={"100%"}
                            w={"100%"}
                            justifyContent={"space-between"}
                            p={1}
                          >
                            <Tooltip label={role.name}>
                              <TagLabel>{role.name}</TagLabel>
                            </Tooltip>
                            <Switch
                              id={role.name}
                              isChecked={deviceRoles
                                .get({ noproxy: true })
                                ?.some(
                                  (allowedRole) =>
                                    allowedRole?.name === role?.name
                                )}
                            />
                          </HStack>
                        </FormControl>
                      </Tag>
                    ))}
                </VStack>
              </Box>
            </>
          )}

          {roles?.length <= 0 && (
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
        </ModalBody>

        <ModalFooter>
          <Button
            bgColor={"red.500"}
            size={"sm"}
            mr={3}
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
