import {
  Badge,
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { Door } from "@models/Door";
import { deviceListState } from "@utils/deviceList";
import { roleListState } from "@utils/roleList";
import { useCallback } from "react";

export const RoleManagementModal = async ({
  isOpen,
  onClose,
  deviceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  deviceId?: string;
}) => {
  const device = await deviceListState.get({noproxy: true}) as Door[]
  const roles = roleListState.get({noproxy: true})

  const saveRole = useCallback(async () => {
    const res = await fetch(`/api/database/saveRole`, {
      body: JSON.stringify({
        id: "",
        name: "",
      }),
    });
    const data = await res.json();
    if (data?.role) {
      roleListState.merge([data.role])
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={"gray.600"}>
        <ModalHeader>Role management</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {deviceId &&
            device?.allowedRoles &&
            device?.allowedRoles?.length > 0 && (
              <>
                <chakra.span>Current roles</chakra.span>
                <HStack spacing={4}>
                  <Stack
                    direction="column"
                    bgColor={"gray.800"}
                    p={2}
                    borderRadius={"md"}
                  >
                    <chakra.span>Roles with access</chakra.span>
                    <Divider borderColor={"gray.500"} />
                    <HStack>
                      {device.allowedRoles?.map((role: any) => {
                        return (
                          <>
                            <Badge>{role.name}</Badge>
                          </>
                        );
                      })}
                    </HStack>
                  </Stack>
                </HStack>
              </>
            )}
          <chakra.span>Avalible roles</chakra.span>
          <HStack spacing={4}>
            {roles?.map((role) => (
              <Tag
                size={"md"}
                key={role.id}
                variant="subtle"
                colorScheme="cyan"
              >
                <TagLeftIcon boxSize="12px" />
                <TagLabel>Cyan</TagLabel>
              </Tag>
            ))}
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button bgColor={"red.500"} size={"sm"} mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button bgColor={"blue.400"} size={"sm"} onClick={saveRole}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
