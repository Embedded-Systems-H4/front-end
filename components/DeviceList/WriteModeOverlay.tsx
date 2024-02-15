import { HStack, Spinner, chakra } from "@chakra-ui/react";
import { Door } from "@models/Door";
import { useEffect, useState } from "react";

export const WriteModeOverlay = ({
  device,
  isOpen,
  onOpen,
  onClose,
}: {
  device: Door;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
  }, [countdown, isOpen, onOpen]);

  return (
    <>
      <HStack
        zIndex={"popover"}
        w={"100%"}
        h={"100%"}
        pos={"absolute"}
        bgColor={"blackAlpha.900"}
        top={0}
        left={0}
        borderRadius={"md"}
        flexDir={{
          base: "column",
          lg: "row",
        }}
        justifyContent={"center"}
      >
        <chakra.span fontSize={"lg"}>Awaiting card</chakra.span>
        <HStack pos={"relative"} justifyContent={"center"}>
          <chakra.span fontSize={"sm"} color={"gray.500"} pos={"absolute"}>
            {countdown}
          </chakra.span>
          <Spinner color="blue.500" thickness="5px" size="lg" speed="1s" />
        </HStack>
      </HStack>
    </>
  );
};
