import { Styles } from "@chakra-ui/theme-tools"
import { textSpecs, typography } from "./foundations/typography"

const styles: Styles = {
  global: {
    html: {
      fontSize: textSpecs.base.fontSize,
      scrollBehavior: "smooth"
    },
    body: {
      color: typography.fontColors.base,
      bg: "transparent",
    },
    p: textSpecs.base,
    h1: textSpecs.h1,
    h2: textSpecs.h2,
    h3: textSpecs.h3,
    h4: textSpecs.h4,
    h5: textSpecs.h5,
    "b, strong": { fontWeight: typography.fontWeights.black },
  },
}

export {
  styles,
}
