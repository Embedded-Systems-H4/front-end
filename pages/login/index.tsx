import { Button, HStack, Skeleton, Spinner, VStack, chakra, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";
const Login: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    const { error } = router.query;
    const [loading, setLoading] = useState(false);
    const errorDescription = {
        "noSession": "You must log in to access this page.",
        "permissionDenied": "Your account does not have permission to access this page.",
        "default": undefined
    }[error as string]


    const showToast = useCallback(() => {
        toast({
            title: "Permission denied",
            description: errorDescription,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }, [errorDescription, toast])

    useEffect(() => {
        if (error) {
            showToast()
        }
    }, [error, showToast]);

    return (
        <HStack
            h={'100vh'}
            w={"100%"}
            justifyContent={'center'}
            bgSize={'cover'}
            bgPosition={'center'}
            bgRepeat={'no-repeat'}
        >
            {
                loading &&
                <HStack position={'absolute'} zIndex={1}>
                    <chakra.span>
                        Loading...
                    </chakra.span>
                    <Spinner size='sm' />
                </HStack>
            }
            <Skeleton isLoaded={!loading} startColor='blackAlpha.600' endColor='blackAlpha.600' borderRadius={'xl'}>
                <VStack bgColor={'gray.900'} p={10} borderRadius={'xl'} boxShadow={"xl"} border={'1px'} borderColor={'gray.600'}>
                    <chakra.span
                        fontWeight={'bold'}
                        fontSize={'2xl'}
                        color={'white'}
                        w={'300px'}
                        textAlign={'center'}
                    >
                        Log in
                    </chakra.span>
                    <HStack w={'100%'} justifyContent={'space-between'} mt={2}>
                        <Button
                            variant={'solid'}
                            border={'1px solid'}
                            borderColor={'gray.600'}
                            bgColor={"gray.900"}
                            gap={2}
                            w={'100%'}
                            transition={'all .3s ease-in-out'}
                            onClick={() => {
                                setLoading(true);
                                signIn('github', { callbackUrl: router.query.callbackUrl as string || "/" });
                            }}
                            _hover={
                                {
                                    bgColor: 'white',
                                    color: 'var(--chakra-ui-colors-gray-800)',
                                    transform: 'scale(1.02)'
                                }
                            }
                        >
                            <BsGithub size={'24'} />
                        </Button>
                    </HStack>
                </VStack>
            </Skeleton>
        </HStack>
    )
};

export default Login;