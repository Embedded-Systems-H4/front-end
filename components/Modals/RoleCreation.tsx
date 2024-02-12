import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { RadioCardGroup } from "@components/RadioCardGroup/RadioCardGroup";
import { useState } from "react";
import { useDebounce } from "react-use";
export const RoleCreation = ({
  selectedOption,
  setSelectedOption,
  saveRole,
}: {
  selectedOption: string;
  setSelectedOption: (selectedOption: string) => void;
  saveRole: (value: { name: string; color: string }) => void;
}) => {
  const [input, setInput] = useState<string | null>(null);
  useDebounce(
    () => {
      setInput(input);
    },
    500,
    [input]
  );

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
            Create role
          </chakra.span>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} fontSize={"sm"}>
        <Box bgColor={"gray.700"} p={4} borderRadius={"md"} boxShadow={"md"}>
          <FormControl isRequired>
            <FormLabel fontSize={"sm"} fontWeight={"normal"}>
              Name
            </FormLabel>
            <HStack spacing={0}>
              <Input
                onChange={(e) => {
                  setInput(e?.target?.value);
                }}
                placeholder="Fx: Developer"
                bgColor={"gray.700"}
                borderColor={"gray.500"}
                borderRadius={"md"}
                size={"sm"}
              />
            </HStack>
            <FormLabel mt={4} fontSize={"sm"} fontWeight={"normal"}>
              Color
            </FormLabel>
            <HStack justifyContent={"space-between"}>
              <RadioCardGroup
                options={["red", "green", "blue", "yellow"]}
                setSelectedOption={setSelectedOption}
              />
              <Button
                bgColor={"blue.400"}
                borderRadius={"md"}
                size={"sm"}
                isDisabled={!input || !selectedOption}
                onClick={() => {
                  saveRole({
                    name: input?.toUpperCase() as string,
                    color: selectedOption as string,
                  });
                }}
              >
                Create
              </Button>
            </HStack>
          </FormControl>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
