
export type ProjectNode = StringNode | TodoNode | ListNode | CodeNode | NumberListNode | NestedParentNode | ParentLinkNode;

type BaseNode = {
  id: number
  parent_id: number
  data: string
  ref_id?: number
  state: {
    orden: number,
    edit?: boolean
  }
}
type BasicClass = { class?: "basic-blocks" }
type StringNode = BaseNode & BasicClass & {
  type: "string"
}
type TodoNode = BaseNode & BasicClass & {
  type: "todo"
  done?: boolean
}
type ListNode = BaseNode & BasicClass & {
  type: "list"
}
type CodeNode = BaseNode & BasicClass & {
  type: "code"
  language?: "js" | "html" | "css" | string
}
export type NumberListNode = BaseNode & BasicClass & {
  type: "number-list"
  number?: number
}
type NestedParentNode = BaseNode & BasicClass & {
  type: "parent_node"
}
type ParentLinkNode = BaseNode & BasicClass & {
  type: "parent_link"
}

export type User = {
  username?: string
  password: string
}

export type contextType = {
  node: ProjectNode
  allItems: ProjectNode[]
  sortIndex: number
  remaining: number
  onUpdate: (item: ProjectNode, DBNode?: Partial<DBNode>) => Promise<void> | void
  addFunc: (strict: boolean, type?: ProjectNode["type"]) => void
  onDelete: (item: ProjectNode) => void
  buttonsRef: React.RefObject<HTMLDivElement | null>
  focusElement: () => void
}

export type DataFetchedType = {
  Id: number
  data?: string
  type?: "" | ProjectNode["type"]
  Done?: { Bool: boolean, Valid: boolean }
  Number?: { Int16: number, Valid: boolean }
  Lang?: { String: string, Valid: boolean }
  Orden?: { String: string, Valid: true }
  Ref_id?: { Int16: number, Valid: boolean }
}

export type DBNode = {
  Id: number
  Parent_id?: number
  Data?: string
  Type?: "" | ProjectNode["type"]
  Done?: boolean
  Number?: number
  Lang?: string
  Orden?: string
  Ref_id?: number
}
