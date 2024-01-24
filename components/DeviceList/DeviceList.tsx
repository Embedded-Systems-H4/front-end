import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box, chakra } from "@chakra-ui/react"

export const DeviceList = () => {
    return (
        <Accordion allowToggle w={'100%'} >
            <AccordionItem border={0}>
                <chakra.span>
                    <AccordionButton _expanded={{ bg: 'gray.600', color: 'white' }} borderRadius={'md'}>
                        <Box as="span" flex='1' textAlign='left'>
                            Door nr 1
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </chakra.span>
                <AccordionPanel>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0}>
                <chakra.span>
                    <AccordionButton _expanded={{ bg: 'gray.600', color: 'white' }} borderRadius={'md'}>
                        <Box as="span" flex='1' textAlign='left'>
                            Door nr 2
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </chakra.span>
                <AccordionPanel>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0}>
                <chakra.span>
                    <AccordionButton _expanded={{ bg: 'gray.600', color: 'white' }} borderRadius={'md'}>
                        <Box as="span" flex='1' textAlign='left'>
                            Door nr 3
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </chakra.span>
                <AccordionPanel>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}