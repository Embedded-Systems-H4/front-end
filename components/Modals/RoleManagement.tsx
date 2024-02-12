import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  TagLabel,
  Tooltip,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { Role } from "@models/Role";
import { FaX } from "react-icons/fa6";
export const RoleManagement = ({
  roles,
  deleteRole,
}: {
  roles: Role[];
  deleteRole: (value: { name: string; color: string }) => void;
}) => {
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
            Manage roles
          </chakra.span>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} fontSize={"sm"}>
        <HStack
          spacing={1}
          bgColor={"gray.700"}
          p={4}
          borderRadius={"md"}
          boxShadow={"md"}
        >
          {roles.slice(0, 2).map((role: Role, index: number) => (
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
                    deleteRole({
                      name: role.name,
                      color: role.color,
                    })
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
                  bgColor={"gray.800"}
                >
                  <chakra.span color={"white"} px={2}>
                    +{roles.length - 2} more
                  </chakra.span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                zIndex={"popover"}
                bgColor={"gray.800"}
                border={0}
                fontSize={"sm"}
                w={"400px"}
              >
                <PopoverBody>
                  <Flex flexWrap="wrap">
                    {roles.slice(2).map((role, index) => (
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
      </AccordionPanel>
    </AccordionItem>
  );
};
