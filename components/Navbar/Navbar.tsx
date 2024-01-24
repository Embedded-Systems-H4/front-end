'use client'

import {
    Avatar,
    Box,
    BoxProps,
    CloseButton,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    HStack,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    VStack,
    chakra,
    useDisclosure,
} from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { IconType } from 'react-icons'
import { IoSettings, IoFitness, IoDocumentText } from 'react-icons/io5'
import {
    FiChevronDown,
    FiChevronUp,
    FiMenu
} from 'react-icons/fi'
import { useCallback, useEffect, useRef } from 'react'
import { OutsideClickWrapper, useOutsideClickContext } from '@components/OutsideClickWrapper/OutsideClickWrapper'

interface LinkItemProps {
    name: string
    icon: IconType
}

interface NavItemProps extends FlexProps {
    icon: IconType
    children: React.ReactNode,
    isActive?: boolean
}

interface MobileProps extends FlexProps {
    onOpen: () => void
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Settings', icon: IoSettings },
    { name: 'Status', icon: IoFitness },
    { name: 'Logs', icon: IoDocumentText }
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const router = useRouter()
    return (
        <Box
            transition="3s ease"
            bg={"gray.900"}
            borderRight="1px"
            borderRightColor={"gray.600"}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontWeight="bold">
                    Dashboard
                </Text>
                <CloseButton
                    display={{ base: 'flex', md: 'none' }}
                    _hover={{ bgColor: 'gray.600' }}
                    onClick={onClose}
                    p={2}
                />
            </Flex>
            {LinkItems.map((link) => {
                const { pathname } = router

                const isActive = {
                    "Settings": pathname === "/",
                    "Status": pathname === "/status",
                    "Logs": pathname === "/logs"
                }[link.name]
                return (
                    <NavItem key={link.name} icon={link.icon} isActive={isActive}>
                        {link.name}
                    </NavItem>
                )
            })}
        </Box>
    )
}

const NavItem = ({ icon, children, isActive, ...rest }: NavItemProps) => {
    const router = useRouter()

    const href = {
        "Settings": "/",
        "Status": "/status",
        "Logs": "/logs"
    }[children as string]

    return (
        <Box
            as="a"
            onClick={() => { router.push(`/${href}`) }}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mt={1}
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bgColor={isActive ? 'gray.600' : 'transparent'}
                _hover={{
                    bg: 'gray.600',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        w={'20px'}
                        h={"20px"}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Box>
    )
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { data: session } = useSession();

    const {
        isOpen,
        onToggle
    } = useOutsideClickContext();

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={"gray.900"}
            borderBottom={'1px'}
            borderColor={'gray.600'}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="unstyled"
                p={2}
                _hover={{ bgColor: 'gray.600' }}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Dashboard
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }} onClick={onToggle}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    name={session?.user?.name || "?"}
                                    src={session?.user?.image || ""}
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="2px"
                                    ml="2"
                                >
                                    <Text fontSize="sm" fontWeight={'bold'} >
                                        {
                                            session?.user?.name || "-"
                                        }
                                    </Text>
                                    <Text fontSize="xs" color={"gray.400"} mr={2}>
                                        {session?.user?.email || ""}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    {
                                        isOpen ? <FiChevronUp /> : <FiChevronDown />
                                    }
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={"gray.900"}
                            borderColor={"gray.600"}
                            p={1}
                        >
                            <MenuItem
                                bg={"gray.900"}
                                p={0}
                                onClick={() => signOut()}
                            >
                                <chakra.span
                                    p={2}
                                    w={'100%'}
                                    borderRadius={'md'}
                                    _hover={{ bgColor: 'gray.600' }}
                                >
                                    Log out
                                </chakra.span>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack >
        </Flex >
    )
}

export const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data: session, status } = useSession();

    return (
        <Box>
            {
                session && status === 'authenticated' &&
                (
                    <>
                        <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
                        <Drawer
                            isOpen={isOpen}
                            placement="left"
                            onClose={onClose}
                            returnFocusOnClose={false}
                            onOverlayClick={onClose}
                            size="full">
                            <DrawerContent>
                                <SidebarContent onClose={onClose} />
                            </DrawerContent>
                        </Drawer>
                        <OutsideClickWrapper>
                            <MobileNav onOpen={onOpen} />
                        </OutsideClickWrapper>
                    </>
                )
            }
        </Box>
    )
}