import { useEffect, useRef, useState, type JSX } from "react"
import type { ProjectNode } from "./types"
import { useNodeContext } from "./nodeContext"
import { TextareaComp } from "../../../components/textareaComp"
import { DropdownAddComponent } from "../../../components/ui/DropdownAddComponent"
import { LinkTargetPickerModal } from "../../../components/ui/LinkTargetPickerModal"

export function NodeString() {
  return (
    <>
      <SimpleEditText />
    </>
  )
}
export function NodeTodo() {
  const { node } = useNodeContext()
  const [completed, setCompleted] = useState(false)

  return (
    <>
      <SimpleEditText
        textClass={completed ? "line-through" : ""}
      >
        <div className="w-4 h-4 flex relative" onClick={() => setCompleted(prev => !prev)}>
          {
            node.type == "todo" && (
              <input type="checkbox" ></input>
            )
          }
        </div>
      </SimpleEditText>
    </>
  )
}
export function NodeList() {
  return (
    <>
      <SimpleEditText>
        <div className="w-2 h-2 bg-black rounded-full"></div>
      </SimpleEditText>
    </>
  )
}
export function NodeNumberList() {
  const { node, allItems, sortIndex, onUpdate } = useNodeContext()
  const prevNumber = useRef(0);

  //count numbers - don't store the order in db, it renders in front.
  useEffect(() => {
    const checkPrevNumber = () => {
      if (sortIndex < 1) return 1
      const prev = allItems[sortIndex - 1];
      if (prev.type != "number-list") return 1
      if (!prev.number) return 1

      const data = [...allItems].slice(0, sortIndex + 1)
      const newArr = [];
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].type != "number-list") break
        newArr.push(data[i])
      }
      return newArr.length
    }

    const number = checkPrevNumber();

    if (number != prevNumber.current) {
      prevNumber.current = number
      onUpdate({ ...node, number: number, state: { ...node.state } })
    }
  }, [allItems, node, onUpdate, sortIndex])

  return (
    <SimpleEditText >
      <div className="">{node.number}.</div>
    </SimpleEditText>
  )
}

function SimpleEditText({ children, textClass, parentClass }: {
  children?: JSX.Element,
  textClass?: string
  parentClass?: string
}) {
  const { node, onUpdate, addFunc, onDelete, remaining, focusElement } = useNodeContext()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const editRef = useRef<HTMLTextAreaElement>(null)
  const selectingRef = useRef(false)
  const [showLinkPicker, setShowLinkPicker] = useState(false)

  const updateEditState = (bool: boolean) => {
    console.log(node)
    onUpdate({
      ...node,
      state: { ...node.state, edit: bool },
    })
  }

  const updateType = (type: ProjectNode["type"], refId?: number) => {
    selectingRef.current = true
    onUpdate({
      ...node,
      type: type,
      ref_id: refId,
      state: { ...node.state, edit: true },
    }, { Type: type, Ref_id: refId })
    setTimeout(() => { selectingRef.current = false }, 0)
  }

  const addWithEnter = (e: React.KeyboardEvent) => {
    if (e.key == "Enter" && node.type !== "code") {
      e.preventDefault()
      addFunc(false)
    }
  }

  const removeType = (e: React.KeyboardEvent) => {
    if ((e.key == "Delete" || e.key == "Backspace") &&
      !node.data && node.type !== "string") {
      updateType("string")
    }
  }
  const removeNode = (e: React.KeyboardEvent) => {
    if ((e.key == "Delete" || e.key == "Backspace")
      && !node.data && node.type == "string" && remaining > 1) {
      focusElement()
      onDelete(node)
    }
  }

  const focusTextArea = () => {
    editRef.current?.focus()
    editRef.current?.setSelectionRange(editRef.current.value.length, editRef.current.value.length)
  }
  return (
    <div className=" w-full flex py-1 flex-col gap-3 relative text-gray-900">

      <div className={`flex gap-3 items-center min-h-6 w-full h-full cursor-text ${parentClass}`}>
        {children}
        {
          node.state.edit ? (
            <>
              <TextareaComp
                value={node.data}
                ref={editRef}
                name="input"
                placeholder="Enter text "
                className={`min-h-6 ${textClass} wrap-break-word`}
                onChange={data => onUpdate({ ...node, data })}
                onBlur={() => { if (!selectingRef.current) updateEditState(false) }}
                onKeyDown={e => {
                  addWithEnter(e)
                  removeType(e)
                  removeNode(e)
                }}
              />
            </>
          ) : (
            <p className={`wrap-break-word w-full h-full min-h-6 ${textClass}`}
              onClick={() => {
                updateEditState(true);
                focusTextArea()
              }}>
              {node.data}
            </p>
          )
        }
      </div>
      {
        node.state.edit && node.type === "string" && !node.data && (
          <DropdownAddComponent
            dropdownRef={dropdownRef}
            updateType={updateType}
            onLinkPick={() => setShowLinkPicker(true)}
          />
        )
      }
      <LinkTargetPickerModal
        isOpen={showLinkPicker}
        onClose={() => setShowLinkPicker(false)}
        onSelect={(target) => {
          updateType("parent_link", target.id)
          setShowLinkPicker(false)
        }}
      />
    </div>
  )
}
