import { useEffect, useRef, useState } from "react"
import { SimpleEditText } from "./DashboardElement"
import type { NumberListNode, ProjectNode } from "./dashboardElement_types"

export function NodeString() {
  return (
    <>
      <SimpleEditText />
    </>
  )
}
export function NodeTodo({ node }: { node: ProjectNode }) {
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
export function NodeNumberList({ node, allItems, position, updateElement }: {
  node: NumberListNode,
  allItems: ProjectNode[],
  position: number,
  updateElement: (item: ProjectNode) => void
}) {
  const prevNumber = useRef(0);


  //count numbers - don't store the order in db, it renders in front.
  useEffect(() => {
    const checkPrevNumber = () => {
      if (position < 1) return 1
      const prev = allItems[position - 1];
      if (prev.type != "number-list") return 1
      if (!prev.number) return 1

      const data = [...allItems].slice(0, position + 1)
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
      updateElement({ ...node, number: number, state: { ...node.state } })
    }
  }, [allItems, node, updateElement, position])

  return (
    <SimpleEditText >
      <div className="">{node.number}.</div>
    </SimpleEditText>
  )
}
