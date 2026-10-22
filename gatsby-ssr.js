import * as React from "react"

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link key="preconnect-gf" rel="preconnect" href="https://fonts.googleapis.com" />,
    <link key="preconnect-gs" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />,
    <link
      key="fonts"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
    />,
    <noscript key="no-js">
      <style>{`.reveal,.word{opacity:1!important;transform:none!important}`}</style>
    </noscript>,
  ])
}
