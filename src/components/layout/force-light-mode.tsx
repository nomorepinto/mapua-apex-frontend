import { useLayoutEffect, useRef, type ReactNode } from "react"

import { useTheme } from "@/components/theme-provider"

/** Keep coss tokens on the light palette while this tree is mounted. */
export function ForceLightMode({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()
  const previousTheme = useRef(theme)

  useLayoutEffect(() => {
    previousTheme.current = theme
    if (theme !== "light") {
      setTheme("light")
    }

    return () => {
      setTheme(previousTheme.current)
    }
    // Intentionally mount/unmount only so we restore the prior preference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return children
}
