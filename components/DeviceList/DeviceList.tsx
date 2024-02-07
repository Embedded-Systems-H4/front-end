import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Stack,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { DateElement } from "@components/Date/Date";
// import { RoleManagementModal } from "@components/Modals/RoleManagementModal";
import { Door } from "@models/Door";
import { useMQTT } from "@utils/useMQTT";
import { useCallback, useEffect, useState } from "react";
import { FaLock, FaUserPlus } from "react-icons/fa6";
import { TbWifiOff } from "react-icons/tb";
export const DeviceList = () => {
  const [deviceList, setDeviceList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contextId, setContextId] = useState<string | null>(null);

  const getDevices = useCallback(async () => {
    const res = await fetch(`/api/database/getDevices`);
    const data = await res.json();
    if (data?.devices) {
      setDeviceList(data.devices);
    }
  }, []);

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  const mqtt = useMQTT("devices/register");

  useEffect(() => {
    if (mqtt) {
      mqtt.on("mqttMessage", getDevices);
      return () => {
        mqtt.off("mqttMessage", getDevices);
      };
    }
  }, [mqtt, getDevices]);

  return (
    <>

      <Accordion w={"100%"} allowToggle>
        {deviceList.map((device: Door) => (
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
                {/* <IconButton
                aria-label="edit-device-name"
                icon={
                  <FaPen
                    style={{ width: "16px", height: "16px", margin: "0 16px" }}
                  />
                }
              /> */}
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
                      {device.allowedRoles?.map((role) => {
                        return (
                          <>
                            <Badge>{role.name}</Badge>
                          </>
                        );
                      })}
                    </HStack>
                  </Stack>
                )}
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
                      timestamp={new Date()}
                      type="relative"
                      withTooltip
                    />
                  </HStack>
                </Stack>
                <Stack
                  direction="column"
                  bgColor={"gray.800"}
                  p={2}
                  borderRadius={"md"}
                >
                  <chakra.span>Status</chakra.span>
                  <Divider borderColor={"gray.500"} />
                  <HStack justifyContent={"center"}>
                    {device.status === "online" ? (
                      <HStack>
                        <chakra.span>Online</chakra.span>
                        <TbWifiOff
                          style={{
                            color: "lime",
                            height: "20px",
                            width: "20px",
                          }}
                        />
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
                <Stack
                  flexDir={{
                    base: "row",
                    lg: "column",
                  }}
                >
                  <Button
                    justifyContent={"center"}
                    fontSize={"xs"}
                    bgColor={"blue.400"}
                    size={"sm"}
                    _hover={{
                      bgColor: "blue.500",
                    }}
                    leftIcon={
                      <FaUserPlus style={{ height: "12px", width: "12px" }} />
                    }
                    onClick={() => {
                      setContextId(device.id);
                      onOpen();
                    }}
                  >
                    Manage roles
                  </Button>
                  <Button
                    justifyContent={"center"}
                    fontSize={"xs"}
                    bgColor={"red.500"}
                    size={"sm"}
                    _hover={{
                      bgColor: "red.600",
                    }}
                    leftIcon={
                      <FaLock style={{ height: "12px", width: "12px" }} />
                    }
                  >
                    Lock permanently
                  </Button>
                </Stack>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
