"use client";

import React from "react";
import {
  ChakraProvider,
  extendTheme,
  useColorMode as useChakraColorMode,
  useColorModeValue as useChakraColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";

/* ------------------ Chakra Theme Setup ------------------ */
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

/* ------------------ Provider ------------------ */
export function ColorModeProvider({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

/* ------------------ Hooks ------------------ */
export function useColorMode() {
  const { colorMode, toggleColorMode, setColorMode } = useChakraColorMode();
  return { colorMode, toggleColorMode, setColorMode };
}

export function useColorModeValue(light, dark) {
  return useChakraColorModeValue(light, dark);
}

/* ------------------ Toggle Button ------------------ */
export const ColorModeButton = React.forwardRef(function ColorModeButton(
  props,
  ref
) {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      ref={ref}
      {...props}
      icon={colorMode === "dark" ? <LuMoon /> : <LuSun />}
    />
  );
});
