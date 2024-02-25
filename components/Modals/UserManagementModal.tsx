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
import { Log } from "@models/Log";
import { Profile } from "@models/Profile";
import { profilesGlobalState } from "@utils/globalStates";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { UserCreation } from "./UserCreation";
import { UserManagement } from "./UserManagement";

export const UserManagementModal = ({
  isOpen,
  onClose,
  updateCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  updateCallback: () => void;
  deviceId?: number;
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

        const log: Log = {
          timestamp: new Date(),
          type: "user_creation",
        };
        await fetch(`/api/database/saveLog`, {
          method: "POST",
          body: JSON.stringify({
            log: log,
          }),
        });
      }
    },
    [name, profiles, updateCallback]
  );

  const updateProfile = useCallback(
    async ({ profile }: { profile: Profile }) => {
      const res = await fetch(`/api/database/updateProfile`, {
        method: "POST",
        body: JSON.stringify({
          profile: profile,
        }),
      });

      const { error } = await res.json();
      if (!error) {
        profiles.set((previousProfiles) => {
          if (previousProfiles.some((e) => e.name === profile.name)) {
            return previousProfiles.map((e) =>
              e.name === profile.name ? { ...e, ...profile } : e
            );
          } else {
            updateCallback();
            return [...previousProfiles, profile];
          }
        });
      }
    },
    [profiles, updateCallback]
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
          <Accordion allowToggle defaultIndex={[0]}>
            <UserManagement
              updateProfile={updateProfile}
              profiles={profiles.get({ noproxy: true }) as Profile[]}
            />
            <UserCreation
              name={name!}
              email={email!}
              birthday={birthday!}
              setName={setName}
              setEmail={setEmail}
              setGender={setGender}
              setBirthday={setBirthday}
              onClose={onClose}
              profileCreationHandler={profileCreationHandler}
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
              setName(null);
              setGender(null);
              setBirthday(null);
              setEmail(null);
              profiles.set([]);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
