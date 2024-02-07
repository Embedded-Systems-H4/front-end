import { Box, HStack, useRadio, useRadioGroup } from "@chakra-ui/react";

export const RadioCard = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();
  return (
    <Box as="label" fontSize={"sm"}>
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bgColor: `${props.color}.200`,
          color: `${props.color}.600`,
          borderColor: `${props.color}.600`,
        }}
        px={2}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export const RadioCardGroup = ({
  options,
  setSelectedOption,
}: {
  options: string[];
  setSelectedOption: (value: any) => void;
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "color",
    onChange: setSelectedOption,
  });

  const group = getRootProps();
  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} color={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
};
