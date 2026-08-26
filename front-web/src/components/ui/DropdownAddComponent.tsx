import { useState } from "react"
import type { JSX } from "react/jsx-runtime"
import { ChecklistIcon, DotListIcon, CodeListIcon, NumberListIcon, LinkIcon, NestedParentIcon } from "../../assets/icons"
import type { ProjectNode } from "../../pages/Dashboard/nodes/types"
import { fetchLinkTargets } from "../fetchData"

type LinkTarget = { Id: number, data: string }

export function DropdownAddComponent({ updateType, dropdownRef }: {
  updateType: (item: ProjectNode["type"], refId?: number) => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
}) {
  const [showLinkPicker, setShowLinkPicker] = useState(false)
  const [linkTargets, setLinkTargets] = useState<LinkTarget[]>([])
  const [loadingTargets, setLoadingTargets] = useState(false)

  const handleLinkClick = async () => {
    setLoadingTargets(true)
    try {
      const targets = await fetchLinkTargets()
      setLinkTargets(targets || [])
      setShowLinkPicker(true)
    } catch (err) {
      console.error("failed to load link targets:", err)
    } finally {
      setLoadingTargets(false)
    }
  }

  const handleSelectTarget = (targetId: number) => {
    updateType("parent_link", targetId)
    setShowLinkPicker(false)
  }

  if (showLinkPicker) {
    return (
      <section className="absolute top-10 bg-white w-60 min-h-10 z-50 rounded-xl shadow shadow-gray-400 flex font-normal flex-col text-gray-800 text-sm overflow-hidden" ref={dropdownRef}>
        <div className="pl-3 py-1 font-medium text-[0.8rem] flex items-center justify-between">
          <span>reference a page</span>
          <button className="text-gray-400 hover:text-gray-600 pr-2 text-xs" onMouseDown={() => setShowLinkPicker(false)}>back</button>
        </div>
        {loadingTargets ? (
          <div className="pl-3 py-2 text-gray-400 text-xs">loading...</div>
        ) : linkTargets.length === 0 ? (
          <div className="pl-3 py-2 text-gray-400 text-xs">no pages found</div>
        ) : (
          linkTargets.map(target => (
            <div
              key={target.Id}
              className="py-1 flex gap-3 items-center hover:bg-gray-200 hover:text-gray-800 duration-200 pl-3 cursor-pointer"
              onMouseDown={() => handleSelectTarget(target.Id)}
            >
              <LinkIcon className="size-4 text-indigo-500" />
              <span className="truncate">{target.data}</span>
            </div>
          ))
        )}
      </section>
    )
  }

  return (
    <section className="absolute top-10 bg-white w-60 min-h-10 z-50 rounded-xl shadow shadow-gray-400 flex font-normal flex-col text-gray-800 text-sm overflow-hidden" ref={dropdownRef} >
      <div className="pl-3 py-1 font-medium text-[0.8rem]">something</div>
      <DropdownAddComponentChild
        text="checklist"
        smText="text with checkboxes"
        func={() => updateType("todo")}
      >
        <ChecklistIcon className="size-5" />
      </DropdownAddComponentChild>
      <DropdownAddComponentChild
        text="dot list"
        smText="unordenated list"
        func={() => updateType("list")}
      >
        <DotListIcon className="size-5" />
      </DropdownAddComponentChild>
      <DropdownAddComponentChild
        text="code"
        smText="code snippet"
        func={() => updateType("code")}
      >
        <CodeListIcon className="size-5" />
      </DropdownAddComponentChild>
      <DropdownAddComponentChild
        text="Number list"
        smText="ordenated list"
        func={() => updateType("number-list")}
      >
        <NumberListIcon className="size-5" />
      </DropdownAddComponentChild>
      <div className="border-t border-gray-200 my-1" />
      <DropdownAddComponentChild
        text="nested parent"
        smText="sub-page inside this page"
        func={() => updateType("parent_node")}
      >
        <NestedParentIcon className="size-5" />
      </DropdownAddComponentChild>
      <DropdownAddComponentChild
        text="link"
        smText="reference another page"
        func={handleLinkClick}
      >
        <LinkIcon className="size-5" />
      </DropdownAddComponentChild>
    </section>
  )
}
function DropdownAddComponentChild({ children, func, text, smText }: {
  children: JSX.Element,
  text: string,
  smText: string,
  func: () => void
}) {

  return (
    <div className="py-1 flex gap-3 items-center hover:bg-gray-200 hover:text-gray-800 duration-200 pl-1 cursor-pointer  "
      onMouseDown={() => func()}>
      <div className=" p-2 rounded bg-gray-300">
        {
          children
        }
      </div>
      <div>
        <p>{text}</p>
        <p className="text-[0.7rem] font-light">{smText}</p>
      </div>
    </div>
  )
}