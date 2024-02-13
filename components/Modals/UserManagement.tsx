import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  FormControl,
  HStack,
  Select,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { useHookstate } from "@hookstate/core";
import { Profile } from "@models/Profile";
import { Role } from "@models/Role";
import { rolesGlobalState } from "@utils/globalStates";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Searchbar } from "./Searchbar";

export const UserManagement = ({
  profiles,
  updateProfile,
}: {
  profiles: Profile[];
  updateProfile: ({ profile }: { profile: Profile }) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const roles = useHookstate(rolesGlobalState);
  return (
    <AccordionItem
      my={3}
      borderRadius={"md"}
      border={"1px"}
      borderColor={"gray.500"}
      boxShadow={"md"}
    >
      <AccordionButton>
        <Box as="span" flex="1" textAlign="left">
          <chakra.span fontSize={"md"} fontWeight={"bold"} color={"gray.400"}>
            Manage profiles
          </chakra.span>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel p={4} fontSize={"sm"}>
        <Searchbar setLoading={setLoading} />
        <Box
          bgColor={"gray.700"}
          borderRadius={"md"}
          mt={1}
          p={profiles.length > 0 ? 2 : 0}
        >
          <Skeleton
            isLoaded={!loading}
            startColor="gray.400"
            endColor="blackAlpha.900"
            borderRadius={"md"}
            w={"100%"}
          >
            <Accordion
              w={"100%"}
              allowToggle
              overflowY={profiles.length > 0 ? "auto" : "hidden"}
              maxH={loading ? "70px" : "162px"}
              top={!loading && profiles.length > 0 ? "162px" : "20"}
              transition={"all .3s ease"}
              borderColor={"transparent"}
            >
              <AnimatePresence>
                {profiles.length > 0 &&
                  profiles.map((profile, index) => {
                    return (
                      <AccordionItem
                        key={index}
                        role="group"
                        border={0}
                        bgColor={"gray.600"}
                        borderRadius={"md"}
                        w={"100%"}
                        mt={index > 0 ? 1 : 0}
                      >
                        <AccordionButton>
                          <HStack w={"100%"} fontSize={"sm"}>
                            <Avatar
                              boxShadow={"md"}
                              src="https://cdn2.iconfinder.com/data/icons/audio-16/96/user_avatar_profile_login_button_account_member-1024.png"
                              name={profile.name}
                              bgColor={"blue.400"}
                            />
                            <VStack ml={2} w={"100%"}>
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
                            <AccordionIcon />
                          </HStack>
                        </AccordionButton>
                        <AccordionPanel>
                          <VStack spacing={1}>
                            <FormControl>
                              <Select
                                onChange={(e) => {
                                  const target =
                                    e.currentTarget as HTMLSelectElement;
                                  updateProfile({
                                    profile: {
                                      ...profile,
                                      roles: target.value
                                        ? [
                                            {
                                              name: target.value as string,
                                              color: "",
                                            },
                                          ]
                                        : [],
                                    },
                                  });
                                }}
                                placeholder={"Select a role"}
                                defaultValue={profile?.roles?.[0]?.name}
                                bgColor={"gray.700"}
                                borderColor={"gray.500"}
                                borderRadius={"md"}
                                size={"xs"}
                                sx={{
                                  "> option": {
                                    background: "gray.700",
                                    color: "white",
                                  },
                                }}
                              >
                                {roles.get({ noproxy: true })?.map((role) => {
                                  return (
                                    <option key={role.name + "_" + role.color}>
                                      {role.name}
                                    </option>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  })}
              </AnimatePresence>
            </Accordion>
          </Skeleton>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
