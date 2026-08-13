import { createContext, useContext } from "react"
import type { contextType } from "./types"

export const NodeContext = createContext<contextType | null>(null)

export function useNodeContext() {
  const context = useContext(NodeContext)
  if (!context) {
    throw new Error("useNodeContext must be used inside a node")
  }
  return context
}
