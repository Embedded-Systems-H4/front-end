import React, { useRef, useEffect, createContext, useContext } from "react";
import { Box, UseDisclosureProps, useDisclosure } from "@chakra-ui/react";

// Create a context to manage the isOpen state

const OutsideClickContext = createContext<any | undefined>(undefined)

const OutsideClickWrapper = ({ children }: { children: any }) => {
    const { isOpen, onClose, onToggle } = useDisclosure();

    const ref = useRef<any>();

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    });

    const handleOutsideClick = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
            onClose();
        }
    };

    return (
        <OutsideClickContext.Provider value={
            {
                isOpen,
                onClose,
                onToggle
            }
        }>
            <Box ref={ref}>{children}</Box>
        </OutsideClickContext.Provider>
    );
};

// A hook to access the OutsideClickContext
const useOutsideClickContext = () => {
    return useContext(OutsideClickContext);
};

export { OutsideClickWrapper, useOutsideClickContext };
