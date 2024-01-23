import { LogoIcon } from "@assets/Logo";
import { Box, chakra } from "@chakra-ui/react";
import type { NextPage } from "next";
import { LoginButton } from "@components/login-btn"
const Login: NextPage = () => {

    return (
        <Box px={10}>
            <LogoIcon />
            <chakra.span>
                <LoginButton />
            </chakra.span>
        </Box>
    );
};

export default Login;