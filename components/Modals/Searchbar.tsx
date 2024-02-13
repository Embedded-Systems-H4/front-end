import {
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useHookstate } from "@hookstate/core";
import { profilesGlobalState } from "@utils/globalStates";
import { useCallback, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDebounce } from "react-use";

export const Searchbar = ({
  setLoading,
}: {
  setLoading: (bool: boolean) => void;
}) => {
  const profiles = useHookstate(profilesGlobalState);
  const [input, setInput] = useState<string | null>(null);

  const searchHandler = useCallback(async () => {
    const res = await fetch("/api/database/getProfiles", {
      method: "GET",
      headers: {
        search: "true",
        search_input: input as string,
      },
    });
    const { response } = await res.json();
    if (response.length > 0) {
      profiles.set(response);
    } else {
      profiles.set([]);
    }
    setLoading(false);
  }, [input, profiles, setLoading]);

  useDebounce(
    () => {
      setInput(input);
      if (!input || input === "" || input.length < 3) {
        profiles.set([]);
        setLoading(false);
        return;
      }
      searchHandler();
    },
    500,
    [input]
  );

  return (
    <>
      <FormControl
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setLoading(true);
          setInput(target.value);
        }}
        bgColor={"gray.700"}
        borderRadius={"md"}
        boxShadow={"md"}
        p={2}
      >
        <InputGroup
          borderRadius={"md"}
          bgColor={"gray.600"}
          borderColor={"gray.600"}
          boxShadow={"md"}
        >
          <InputLeftAddon bgColor={"gray.800"} borderColor={"gray.800"}>
            <IoSearch
              style={{
                width: "26px",
                height: "20px",
              }}
            />
          </InputLeftAddon>
          <Input fontSize={"sm"} placeholder="Search user" />
        </InputGroup>
      </FormControl>
    </>
  );
};
