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
import { Door } from "@models/Door";
import { Role } from "@models/Role";
import { getDeviceById, getDeviceList } from "@utils/deviceList";
import { setRoleList } from "@utils/roleList";
import { useCallback, useEffect, useState } from "react";
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

  // const deviceList = getDeviceList()
  // console.log(deviceList)
  const device = getDeviceById(deviceId as string)[0] as Door
  const [roles, setRoles] = useState<Role[]>([]);
  const [allowedRoles, setAllowedRoles] = useState<Role[]>([]);
  const rolesPresence = roles.length > 0
  const [input, setInput] = useState<string | null>(null);

  const getRoles = useCallback(async () => {
    const res = await fetch("/api/database/getRoles", {});
    const data = await res.json();
    if (data?.roles) {
      setRoles(data?.roles);
      setRoleList(data?.roles);
    }
  }, []);

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

  const getAllowedRoles = useCallback(async () => {
    const res = await fetch(`/api/database/getAllowedRoles`, {
      method: "GET",
      headers: {
        "device-id": deviceId as string,
      },
    });
    const { response } = await res.json();
    if (response?.allowedRoles) {
      setAllowedRoles(response?.allowedRoles);
    }
  }, []);

  const allowRole = useCallback(
    async ({
      name,
      color,
    }: {
      name: string;
      color: string;
    }) => {
      const res = await fetch(`/api/database/allowRole`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          color: color,
          "device-id": deviceId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      }
      const role = data?.role;
      if (role) {
        getAllowedRoles();
      }
    },
    [getAllowedRoles]
  );

  const deleteAllowedRole = useCallback(
    async ({ name }: { name: string; }) => {
      const res = await fetch(`/api/database/deleteAllowedRole`, {
        method: "POST",
        body: JSON.stringify({
          name: name.toUpperCase(),
          "device-id": deviceId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
      }
      const role = data?.role;
      if (role) {
        getAllowedRoles();
      }
    },
    [getAllowedRoles]
  );

  const roleHandler = useCallback(({ role, enabled }: { role: Role, enabled: boolean }) => {
    if (enabled) {
      allowRole({
        name: role.name,
        color: role.color
      })
    } else {
      deleteAllowedRole({
        name: role.name
      })
    }

  }, [getAllowedRoles])



  useDebounce(
    () => {
      setInput(input);
    },
    500,
    [input]
  );

  useEffect(() => {
    getAllowedRoles();
    getRoles();
  }, [getAllowedRoles, getRoles]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={"gray.600"}>
        <ModalHeader>Device role management</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                <chakra.span fontSize={"xs"} fontWeight={"bold"} color={'gray.400'}>
                  Allowed roles
                </chakra.span>
                <Divider />
                <VStack spacing={1} my={1} mb={3}>
                  {roles?.map((role: Role, index: number) => (
                    <Tag
                      key={index}
                      variant="subtle"
                      size={"sm"}
                      bgColor={`${role.color}.200`}
                      color={`${role.color}.700`}
                      userSelect={"none"}
                      w={'100%'}
                      my={0.5}
                      mx={0.5}
                    >
                      <FormControl
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement
                        roleHandler({
                          role: role,
                          enabled: target?.checked
                        })
                      }}>
                        <HStack h={"100%"} w={"100%"} justifyContent={'space-between'} p={1}>
                          <Tooltip label={role.name}>
                            <TagLabel>{role.name}</TagLabel>
                          </Tooltip>
                          <Switch id={role.name} defaultChecked={device?.allowedRoles?.some(allowedRole => allowedRole?.name === role?.name)} />
                        </HStack>
                      </FormControl>
                    </Tag>
                  ))}
                </VStack>
              </Box>
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
