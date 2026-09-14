const theme = {
  fonts: {
    body: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    heading: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  },
  styles: {
    root: {
      a: {
        transition: `color 0.2s ease-in-out`,
      },
    },
    p: {
      letterSpacing: `normal`,
      lineHeight: 1.75,
    },
    h1: {
      textShadow: `none`,
      letterSpacing: `normal`,
      lineHeight: 1.15,
    },
    h2: {
      letterSpacing: `normal`,
      lineHeight: 1.2,
      mb: 3,
    },
    h3: {
      letterSpacing: `normal`,
      lineHeight: 1.3,
    },
  },
  texts: {
    bigger: {
      p: {
        fontSize: [2, 3],
      },
    },
  },
}

export default theme
