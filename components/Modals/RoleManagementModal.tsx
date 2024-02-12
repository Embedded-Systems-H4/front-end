import {
  Accordion,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useHookstate } from "@hookstate/core";
import { Role } from "@models/Role";
import { deviceRolesGlobalState, rolesGlobalState } from "@utils/globalStates";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { RoleCreation } from "./RoleCreation";
import { RoleManagement } from "./RoleManagement";
export const RoleManagementModal = ({
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
          <Accordion allowMultiple defaultIndex={[0]}>
            {roles?.length > 0 && (
              <RoleManagement
                deleteRole={deleteRole}
                roles={roles.get({ noproxy: true }) as Role[]}
              />
            )}
            <RoleCreation
              saveRole={saveRole}
              selectedOption={selectedOption as string}
              setSelectedOption={setSelectedOption}
            />
          </Accordion>
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
