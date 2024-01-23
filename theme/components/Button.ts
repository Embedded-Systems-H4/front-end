// https://chakra-ui.com/docs/styled-system/theming/component-style#styling-single-part-components

import type { SystemStyleObject } from "@chakra-ui/theme-tools"

export const Button: SystemStyleObject = {
  // style object for base or default style
  baseStyle: {
    fontSize: "h4",
    borderRadius: "button",
    padding: ".5rem",
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {},
  // default values for 'size', 'variant' and 'colorScheme'
  defaultProps: {
    size: "",
    variant: "",
    colorScheme: "",
  },
}
