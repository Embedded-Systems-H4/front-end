import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tag,
  TagLabel,
  Tooltip,
  chakra,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { DateElement } from "@components/Date/Date";
import { RoleManagementModal } from "@components/Modals/RoleManagementModal";
import { useHookstate } from "@hookstate/core";
import { Role } from "@models/Role";
import { doorsGlobalState } from "@utils/globalStates";
import { useMQTT } from "@utils/useMQTT";
import { useCallback, useEffect, useState } from "react";
import { FaLock, FaUserPlus } from "react-icons/fa6";
import { TbWifi, TbWifiOff } from "react-icons/tb";

export const DeviceList = ({ onCallback }: { onCallback: () => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const doors = useHookstate(doorsGlobalState);

  const [deviceId, setDeviceId] = useState("");

  const { publish } = useMQTT({ callback: () => {} });

  const getDevices = useCallback(async () => {
    const res = await fetch(`/api/database/getDevices`, {});
    const { response } = await res.json();
    if (response) {
      doors.set(response);
    }
  }, [doors]);

  const updateDevice = useCallback(
    async ({ args }: { args: any }) => {
      await fetch(`/api/database/updateDevice`, {
        headers: {
          ...args,
        },
      });
      getDevices();
    },
    [getDevices]
  );

  const [deviceStatus, setDeviceStatus] = useState<Record<string, string>>({});

  const updateDeviceStatus = useCallback((deviceId: string, status: string) => {
    setDeviceStatus((prevStatus) => ({
      ...prevStatus,
      [deviceId]: status,
    }));
  }, []);

  const topicHandler = useCallback(
    ({ topic, message }: { topic: string; message: string }) => {
      const onTopic = {
        "devices/register": () => {
          getDevices();
        },
        "devices/heartbeat": () => {
          const { id } = JSON.parse(message);
          updateDeviceStatus(id, "online");
        },
      }[topic];

      onTopic?.();
    },
    [getDevices, updateDeviceStatus]
  );

  useMQTT({
    topics: ["devices/heartbeat", "devices/register"] as string[],
    callback: (e) => {
      topicHandler({
        message: e.message,
        topic: e.topic,
      });
    },
  });

  useEffect(() => {
    const heartbeatTimeout = setTimeout(() => {
      for (const deviceId in deviceStatus) {
        updateDeviceStatus(deviceId, "offline");
      }
    }, 4000);

    return () => clearTimeout(heartbeatTimeout);
  }, [deviceStatus, updateDeviceStatus]);

  useEffect(() => {
    getDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCallback]);

  const isSmallScreen = useBreakpointValue({
    base: true,
    lg: false,
  });

  return (
    <>
      <RoleManagementModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          getDevices();
        }}
        deviceId={deviceId}
      />
      <Accordion w={"100%"} allowMultiple>
        {doors.get({ noproxy: true })?.map((device) => (
          <AccordionItem
            key={device.id}
            border={"1px"}
            borderRadius={"md"}
            borderColor={"gray.600"}
            mb={2}
          >
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {device.name}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} fontSize={"sm"}>
              <Stack
                p={2}
                bgColor={"gray.600"}
                borderRadius={"md"}
                flexDir={{
                  base: "column",
                  lg: "row",
                }}
              >
                <Stack
                  width={isSmallScreen ? "100%" : "auto"}
                  justifyContent={isSmallScreen ? "space-between" : "center"}
                  flexDir={{
                    base: "row",
                    lg: "column",
                  }}
                >
                  <Button
                    width={isSmallScreen ? "50%" : "auto"}
                    justifyContent={"center"}
                    fontSize={"xs"}
                    bgColor={"blue.400"}
                    size={"sm"}
                    borderRadius={"md"}
                    _hover={{
                      bgColor: "blue.500",
                    }}
                    leftIcon={
                      <FaUserPlus style={{ height: "12px", width: "12px" }} />
                    }
                    onClick={() => {
                      setDeviceId(device.id);
                      onOpen();
                    }}
                  >
                    Manage access
                  </Button>
                  <Button
                    onClick={() => {
                      publish(
                        "devices/lock",
                        `{"id": ${device.id}, "locked": ${device.locked}}`
                      );
                      updateDevice({
                        args: {
                          device_id: device.id,
                          locked: device.locked ? false : true,
                        },
                      });
                    }}
                    width={isSmallScreen ? "50%" : "auto"}
                    justifyContent={"center"}
                    fontSize={"xs"}
                    bgColor={"red.500"}
                    size={"sm"}
                    borderRadius={"md"}
                    _hover={{
                      bgColor: "red.600",
                    }}
                    leftIcon={
                      <FaLock style={{ height: "12px", width: "12px" }} />
                    }
                  >
                    {device.locked ? "Unlock" : "Lock"}
                  </Button>
                </Stack>
                {device.lastUpdatedAt && (
                  <Stack
                    direction="column"
                    bgColor={"gray.800"}
                    p={2}
                    borderRadius={"md"}
                  >
                    <chakra.span>Last activity</chakra.span>
                    <Divider borderColor={"gray.500"} />
                    <HStack justifyContent={"center"}>
                      <DateElement
                        localeIdentifier="da-DK"
                        timestamp={device.lastUpdatedAt}
                        type="relative"
                        withTooltip
                      />
                    </HStack>
                  </Stack>
                )}
                <Stack
                  direction="column"
                  bgColor={"gray.800"}
                  p={2}
                  borderRadius={"md"}
                >
                  <chakra.span>Status</chakra.span>
                  <Divider borderColor={"gray.500"} />
                  <HStack justifyContent={"center"}>
                    {deviceStatus[device.id] === "online" ? (
                      <HStack spacing={1}>
                        <chakra.span>Online</chakra.span>
                        <Box
                          css={{
                            animation: `blink 3s infinite`,
                            "@keyframes blink": {
                              "0%": { opacity: 1 },
                              "50%": { opacity: 0.3 },
                              "100%": { opacity: 1 },
                            },
                          }}
                        >
                          <TbWifi
                            style={{
                              color: "lime",
                              height: "20px",
                              width: "20px",
                            }}
                          />
                        </Box>
                      </HStack>
                    ) : (
                      <HStack>
                        <chakra.span>Offline</chakra.span>
                        <TbWifiOff
                          style={{
                            color: "red",
                            height: "20px",
                            width: "20px",
                          }}
                        />
                      </HStack>
                    )}
                  </HStack>
                </Stack>
                {device?.allowedRoles && device?.allowedRoles?.length > 0 && (
                  <Stack
                    direction="column"
                    bgColor={"gray.800"}
                    p={2}
                    borderRadius={"md"}
                  >
                    <chakra.span>Roles with access</chakra.span>
                    <Divider borderColor={"gray.500"} />
                    <HStack>
                      {device?.allowedRoles
                        ?.slice(0, 2)
                        .map((role: Role, index: number) => (
                          <Tag
                            key={index}
                            variant="subtle"
                            size={"sm"}
                            bgColor={`${role.color}.200`}
                            color={`${role.color}.700`}
                            userSelect={"none"}
                          >
                            <HStack h={"100%"} w={"100%"}>
                              <Tooltip label={role.name}>
                                <TagLabel>{role.name}</TagLabel>
                              </Tooltip>
                            </HStack>
                          </Tag>
                        ))}
                      {device?.allowedRoles?.length > 2 && (
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
                                +{device?.allowedRoles.length - 2} more
                              </chakra.span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            w={"100%"}
                            zIndex={"popover"}
                            bgColor={"gray.700"}
                            border={0}
                            fontSize={"sm"}
                          >
                            <PopoverBody>
                              <Flex flexWrap="wrap">
                                {device.allowedRoles
                                  ?.slice(2)
                                  .map((role, index) => (
                                    <Tag
                                      key={index}
                                      variant="subtle"
                                      size={"sm"}
                                      bgColor={`${role.color}.200`}
                                      color={`${role.color}.700`}
                                      userSelect={"none"}
                                    >
                                      <TagLabel>
                                        <HStack>
                                          <chakra.span>{role.name}</chakra.span>
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
                  </Stack>
                )}
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
