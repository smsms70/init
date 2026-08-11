import type { JSX } from "react/jsx-runtime"
import { ChecklistIcon, DotListIcon, CodeListIcon, NumberListIcon } from "../assets/icons"
import type { ProjectNode } from "../pages/Dashboard/dashboardElement_types"

export function DropdownAddComponent({ updateType, dropdownRef }: {
  updateType: (item: ProjectNode["type"]) => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
}) {

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
