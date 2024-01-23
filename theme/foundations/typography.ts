export const textSpecs = {
  /**
   * Text Sizes are built using the 4pt system (aka a multiplaction of 4)
   */
  html: { fontSize: "1rem", marginBottom: ".5rem" },  // ~ 16px
  base: { fontSize: "1rem", marginBottom: ".5rem" },  // ~ 16px
  h1: { fontSize: "5rem", marginBottom: ".5rem" }, // ~ 80px
  h2: { fontSize: "2.375rem", marginBottom: ".5rem" }, // ~ 38px
  h3: { fontSize: "1.5rem", marginBottom: ".5rem" }, // ~ 24px
  h4: { fontSize: "1.25rem", marginBottom: ".5rem" }, // ~ 20px
  h5: { fontSize: "0.75rem", marginBottom: ".5rem" }, // ~ 12px
}

export const typography = {
  fontSizes: {
    base: textSpecs.base.fontSize,
    h1: textSpecs.h1.fontSize,
    h2: textSpecs.h2.fontSize,
    h3: textSpecs.h3.fontSize,
    h4: textSpecs.h4.fontSize,
    h5: textSpecs.h5.fontSize,
  },
  fontColors: {
    base: "#ffffff",
    h1: "#ffffff",
    h2: "#ffffff",
    h3: "#ffffff",
    h4: "#ffffff",
    h5: "#ffffff",
  },
  lineHeight: {},
  fontWeights: {
    normal: 400,
    bold: 700,
    black: 900,
  },
}
