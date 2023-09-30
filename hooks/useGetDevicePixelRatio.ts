import { useEffect } from "preact/hooks"
import { signal } from "@preact/signals"

function isomorphicGetPixelRatio() {
  if (typeof window === "undefined") {
    return 1
  }
  return window.devicePixelRatio
}

const devicePixelRatio = signal(isomorphicGetPixelRatio())
export function useDevicePixelRatio() {

  useEffect(() => {
    devicePixelRatio.value = isomorphicGetPixelRatio()
  }, [])

  return devicePixelRatio
}
