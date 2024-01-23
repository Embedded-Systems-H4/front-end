import { LogoIcon } from "@assets/Logo";
import { Box, chakra } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const Home: NextPage = () => {
  const router = useRouter()
  const id = router.query.id
  const [count, setCount] = useState(10)
  useEffect(() => {
    if (count < 1) {
      setCount(10)
    }
    setTimeout(() => {
      setCount(count - 1)
    }, 1000)
  }, [count])

  return (
    <Box px={10}>
      <LogoIcon />
      <chakra.span>
        {count}{id}
      </chakra.span>
    </Box>
  );
};

export default Home;