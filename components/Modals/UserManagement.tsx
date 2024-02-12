import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  List,
  ListItem,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { Profile } from "@models/Profile";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaPen } from "react-icons/fa6";
import { Searchbar } from "./Searchbar";
export const UserManagement = ({ profiles }: { profiles: Profile[] }) => {
  const [loading, setLoading] = useState(true);

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
        <VStack bgColor={"gray.700"} p={2} borderRadius={"md"} boxShadow={"md"}>
          <Searchbar setLoading={setLoading} />
          <List
            overflowY={profiles.length > 0 ? "auto" : "hidden"}
            w={"100%"}
            maxH={loading ? "70px" : "162px"}
            top={!loading && profiles.length > 0 ? "162px" : "20"}
            transition={"all .3s ease"}
          >
            <AnimatePresence>
              {profiles.length > 0 &&
                profiles.map((profile) => {
                  return (
                    <ListItem
                      key={profile.name}
                      mr={profiles.length > 2 ? 2 : 0}
                      role="group"
                    >
                      <Skeleton
                        isLoaded={!loading}
                        startColor="blue.900"
                        endColor="blackAlpha.900"
                        borderRadius={"md"}
                        w={"100%"}
                        bgColor={"gray.600"}
                        p={2}
                        mt={1}
                        boxShadow={"md"}
                        as={HStack}
                      >
                        <Avatar
                          boxShadow={"md"}
                          src="https://cdn2.iconfinder.com/data/icons/audio-16/96/user_avatar_profile_login_button_account_member-1024.png"
                          name={profile.name}
                          bgColor={"blue.400"}
                        />
                        <VStack
                          w={"100%"}
                          alignItems={"left"}
                          ml={3}
                          spacing={1}
                        >
                          <HStack>
                            <chakra.span fontWeight="bold">
                              {profile.name}
                            </chakra.span>
                            {/* {profile?.roles?.map((role: Role) => {
                        return (
                          <Badge
                            key={role.name}
                            ml="1"
                            colorScheme={role.color}
                          >
                            {role.name}
                          </Badge>
                        );
                      })} */}
                            <Badge
                              fontSize={"x-small"}
                              key={"test"}
                              ml="1"
                              bgColor={"red.200"}
                              color={"red.700"}
                            >
                              Developer
                            </Badge>
                          </HStack>
                          <chakra.span color={"gray.400"}>
                            {profile.email}
                          </chakra.span>
                          {/* <Collapse in={true}></Collapse> */}
                        </VStack>

                        <Button
                          cursor={"default"}
                          size={"md"}
                          opacity={0}
                          _groupHover={{
                            opacity: 1,
                            cursor: "pointer",
                          }}
                        >
                          <FaPen
                            style={{
                              width: "22px",
                              height: "22px",
                            }}
                          />
                        </Button>
                      </Skeleton>
                    </ListItem>
                  );
                })}
            </AnimatePresence>
          </List>
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};
