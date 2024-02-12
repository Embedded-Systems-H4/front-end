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
  Select,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { useDebounce } from "react-use";
export const UserCreation = ({
  name,
  email,
  birthday,
  setName,
  setGender,
  setBirthday,
  setEmail,
  profileCreationHandler,
  onClose,
}: {
  name: string;
  email: string;
  birthday: Date;
  setName: (value: string | null) => void;
  setGender: (value: "m" | "f" | null) => void;
  setBirthday: (value: Date | null) => void;
  setEmail: (value: string | null) => void;
  profileCreationHandler: () => void;
  onClose: () => void;
}) => {
  useDebounce(
    () => {
      setName(name);
      setEmail(email);
    },
    500,
    [name, email]
  );

  return (
    <AccordionItem
      borderRadius={"md"}
      border={"1px"}
      borderColor={"gray.500"}
      boxShadow={"md"}
    >
      <AccordionButton>
        <Box as="span" flex="1" textAlign="left">
          <chakra.span fontSize={"md"} fontWeight={"bold"} color={"gray.400"}>
            Create profile
          </chakra.span>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} fontSize={"sm"}>
        <Box bgColor={"gray.700"} p={4} borderRadius={"md"} boxShadow={"md"}>
          <FormControl isRequired>
            <FormLabel fontSize={"sm"} fontWeight={"normal"}>
              Full name
            </FormLabel>
            <HStack spacing={0}>
              <Input
                onChange={(e) => {
                  setName(e?.target?.value);
                }}
                placeholder="Fx: Bo Jensen"
                bgColor={"gray.700"}
                borderColor={"gray.500"}
                borderRadius={"md"}
                size={"sm"}
              />
            </HStack>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel fontSize={"sm"} fontWeight={"normal"}>
              Gender
            </FormLabel>
            <HStack spacing={0}>
              <Select
                onChange={(e) => {
                  setGender(e.currentTarget.value === "Male" ? "m" : "f");
                }}
                placeholder="Rather not say"
                bgColor={"gray.700"}
                borderColor={"gray.500"}
                borderRadius={"md"}
                size={"sm"}
                sx={{
                  "> option": {
                    background: "gray.700",
                    color: "white",
                  },
                }}
              >
                <option>Male</option>
                <option>Female</option>
              </Select>
            </HStack>
          </FormControl>
          <FormControl
            isRequired
            mt={4}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setBirthday(target.valueAsDate as Date);
            }}
          >
            <FormLabel fontSize={"sm"} fontWeight={"normal"}>
              Birthday
            </FormLabel>
            <HStack spacing={0}>
              <Input
                autoComplete="off"
                placeholder="dd-mm-yyyy"
                bgColor={"gray.700"}
                borderColor={"gray.500"}
                borderRadius={"md"}
                size={"sm"}
                type="date"
              />
            </HStack>
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel fontSize={"sm"} fontWeight={"normal"}>
              Email
            </FormLabel>
            <HStack spacing={0}>
              <Input
                onChange={(e) => {
                  setEmail(e?.target?.value);
                }}
                placeholder="Fx: bo@aarhustech.dk"
                bgColor={"gray.700"}
                borderColor={"gray.500"}
                borderRadius={"md"}
                size={"sm"}
              />
            </HStack>
          </FormControl>
          <HStack justifyContent={"right"} mt={4}>
            <Button
              isDisabled={!name || !birthday || !email}
              w={"100%"}
              bgColor={"blue.400"}
              size={"sm"}
              onClick={() => {
                profileCreationHandler();
                onClose();
                setName(null);
                setGender(null);
                setBirthday(null);
                setEmail(null);
              }}
            >
              Create
            </Button>
          </HStack>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};
