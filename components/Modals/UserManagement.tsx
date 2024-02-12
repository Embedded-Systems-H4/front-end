import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { Profile } from "@models/Profile";
import { motion } from "framer-motion";
import { Searchbar } from "./Searchbar";
export const UserManagement = ({ profiles }: { profiles: Profile[] }) => {
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
      <AccordionPanel pb={4} fontSize={"sm"}>
        <VStack
          width={"100%"}
          alignItems={"left"}
          bgColor={"gray.700"}
          p={2}
          borderRadius={"md"}
          boxShadow={"md"}
        >
          <Searchbar />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: profiles.length > 0 ? "100%" : "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {" "}
            <VStack height={profiles.length > 0 ? "100%" : "auto"}>
              {profiles.map((profile) => {
                return (
                  <>
                    <Flex
                      w={"100%"}
                      bgColor={"gray.600"}
                      p={2}
                      borderRadius={"md"}
                      boxShadow={"md"}
                    >
                      <Avatar
                        boxShadow={"md"}
                        src="https://cdn2.iconfinder.com/data/icons/audio-16/96/user_avatar_profile_login_button_account_member-1024.png"
                        name={profile.name}
                        bgColor={"blue.400"}
                      />
                      <VStack w={"100%"} alignItems={"left"} ml={3} spacing={1}>
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
                      </VStack>
                    </Flex>
                  </>
                );
              })}
            </VStack>
          </motion.div>
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};
