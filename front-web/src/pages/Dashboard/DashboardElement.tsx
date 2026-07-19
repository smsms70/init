import { ProjectHeader } from "./DashboardMain"
import { AddIcon, ArrowIcon, ChecklistIcon, CodeListIcon, DotListIcon, DotsMoveIcon, NumberListIcon } from "../../assets/icons"
import { Link, useParams } from "react-router"
import React, { useEffect, useState, useContext, type Dispatch, type JSX, type SetStateAction, createContext, useRef } from "react";
import type { contextType, DataFetchedType, DBNode, NumberListNode, ProjectNode } from "./dashboardElement_types";
import Editor from 'react-simple-code-editor/src/index';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css'
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { fetchAddNode, fetchDeleteNode, fetchNodes, fetchNormalizeOrden, fetchUpdateNodes, fetchGetNodeName, type OrdenT } from "../../components/fetchData";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
// import './highlight.css';

export default function DashboardProjectElement() {
  const [allData, setAllData] = useState<ProjectNode[]>(null);
  const nextId = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const { project_id } = useParams()
  const [name, setName] = useState("")

  function mapFetchedDataToNode(data: DataFetchedType[]): ProjectNode[] {
    const parent_id = Number(project_id);
    if (!data) return [{
      id: 1,
      parent_id: parent_id,
      data: "",
      type: "string",
      state: { orden: 1, edit: false }
    }]

    const newDataArr: ProjectNode[] = data.map(
      (item: DataFetchedType) => ({
        id: item.Id,
        parent_id: parent_id,
        data: item.data || "",
        state: {
          orden: item.Orden ? Number(item.Orden.String) : 0,
          edit: false
        },
        type: item.type || "string",
        number:
          (item.type == "number-list" && item.Number) ?
            item.Number.Int16 : 0,
        language:
          (item.type == "code" && item.Lang) ?
            item.Lang.String : "",
      })
    )
    return newDataArr
  }

  useEffect(() => {
    const getParentNode = async () => {
      if (project_id) {
        const parent_name = await fetchGetNodeName(project_id)
        console.log(parent_name)
        setName(parent_name)
      }
    }
    getParentNode()
    const updateData = async () => {
      if (!project_id) return
      try {
        const Data = await fetchNodes(project_id)

        const data = mapFetchedDataToNode(Data)

        const orderData = data.sort((a, b) => a.state.orden - b.state.orden)
        setAllData(orderData)

        const maxId = Math.max(...orderData.map(item => item.id))
        nextId.current = maxId
      } catch (err) {
        console.error("error is: ", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    updateData();
  }, [project_id])


  return (
    <section className="">
      <Link to={"./.."}>
        <div className="w-10 h-10 absolute top-0 rotate-180 flex items-center justify-center bg-primary">
          <ArrowIcon />
        </div>
      </Link>

      <ProjectHeader
        name={name}
        setName={setName}
        project_id={project_id}
      />
      <section className=" border p-2 flex" >

        <DragDropProvider
          onDragEnd={event => {
            if (event.canceled) return
            const { source } = event.operation
            if (!isSortable(source)) return

            if (source.initialIndex == source.index) return

            const prevItem = source.index > 0 ? allData[source.index - 1] : undefined;
            const currentItem = allData.find(item => item.id == source.id)
            const nextItem = allData[source.index + 1];
            const targetItem = allData[source.index];

            const newOrden = (nextItem && prevItem && currentItem) ? (
              currentItem.state.orden < targetItem.state.orden
                ?
                (targetItem.state.orden + nextItem.state.orden) / 2
                :
                (targetItem.state.orden + prevItem.state.orden) / 2
            ) : (
              (prevItem) ?
                targetItem.state.orden + 1 :
                targetItem.state.orden - 1
            )

            fetchUpdateNodes(Number(source.id), { Orden: (newOrden).toString() })

            const newData = allData.map(item =>
              item.id == source.id ?
                { ...item, state: { ...item.state, orden: newOrden } } :
                item
            )
            const newArr = move(newData, event)
            setAllData(newArr)
          }}

        >
          <div className="border p-5 ">
            {
              allData && allData.map((e, idx) => (
                <ProjectNode
                  key={e.id}
                  node={e}
                  allItems={allData}
                  setNewItem={setAllData}
                  generateId={() => ++nextId.current}
                  sortIndex={idx}
                />
              ))
            }
          </div>
        </DragDropProvider>
      </section>
    </section>
  )
}

const DataContext = createContext<contextType | null>(null)

declare global {
  interface Number {
    countDecimals(): number;
  }
}
Number.prototype.countDecimals = function() {
  if (Math.floor(this.valueOf()) === this.valueOf()) return 0
  return this.toString().split(".")[1].length || 0
}
function ProjectNode({ node, setNewItem, allItems, generateId, sortIndex }: {
  node: ProjectNode,
  allItems: ProjectNode[],
  setNewItem: Dispatch<SetStateAction<ProjectNode[]>>
  generateId: () => number
  sortIndex: number
}) {
  const addButtonsRef = useRef<HTMLDivElement>(null)
  const { ref, handleRef } = useSortable({ id: node.id, index: sortIndex })
  const dataPrevState = useRef(node.data);

  const isAnyEditing = () => {
    const isEditing = allItems.some(item => item.state.edit === true)
    return isEditing
  }

  const sortAllItems = (items: ProjectNode[]) => {
    const sorted = [...items];
    sorted.sort((a, b) => a.state.orden - b.state.orden)
    return sorted;
  }

  const addElement = async (strict: boolean = true, type?: ProjectNode["type"]) => {
    if (strict && (node.state.edit || isAnyEditing())) return
    if (node.type == "code") type = "string";

    const nextOrden = allItems.find(item => item.state.orden > node.state.orden)
    const newOrden = nextOrden ?
      (node.state.orden + nextOrden.state.orden) / 2 :
      node.state.orden + 1;
    const newType = type ? type : node.type;

    const addedNode = await fetchAddNode(
      node.parent_id,
      { Type: newType, Orden: (newOrden).toString(), Data: "" }
    )

    console.log(newOrden, addedNode)

    const newItem: ProjectNode = {
      class: "basic-blocks",
      parent_id: node.parent_id,
      id: generateId(),
      state: { orden: newOrden, edit: true },
      type: newType,
      data: "",
    }
    setNewItem(prev => sortAllItems([...prev, newItem]))
  }
  useEffect(() => {
    const updateDataState = async () => {
      if (!node.state.edit && node.data != dataPrevState.current) {
        console.log('updated using edit effect')
        const fetched = await fetchUpdateNodes(node.id, { Data: node.data })
        if (fetched.message != 'updated') return
        dataPrevState.current = node.data
      }
    }
    updateDataState()

  }, [node.state.edit])


  const NormalizeOrder = () => {
    const newArr = [...allItems];
    for (let i = 0; i < allItems.length - 1; i++) {
      newArr[i].state.orden = i + 1;
    }
    setNewItem(newArr)
  }
  useEffect(() => {
    if (node.state.orden.countDecimals() > 9) {
      const arrIds: OrdenT["ArrIds"] = []
      allItems.forEach(item => {
        arrIds.push({ Id: JSON.stringify(item.id) })
      })
      const data: OrdenT = { ArrIds: arrIds }
      console.log(data)
      fetchNormalizeOrden(data)
      NormalizeOrder()
    }
  }, [node.state.orden])

  const deleteElement = async (item: ProjectNode) => {
    if (allItems.length < 2) return
    const data = await fetchDeleteNode(item.id);
    //if data incorrect
    setNewItem(prev =>
      prev.filter(prevItem => prevItem.id != item.id)
    )
  }

  const updateElement = async (newItem: ProjectNode, toFetch?: Partial<DBNode>) => {
    if (toFetch) { await fetchUpdateNodes(newItem.id, toFetch); console.log('here') }

    setNewItem(prev =>
      prev.map(item => item.id === newItem.id ? newItem : item)
    )
  }

  const focusPrevElement = () => {
    if (allItems.length < 2) return
    const lessOrdenItem = allItems.filter(
      item => (item.state.orden < node.state.orden)
    )

    const found = lessOrdenItem[lessOrdenItem.length - 1]
    if (!found) return
    updateElement({
      ...found,
      state: { ...found.state, edit: true },
    })
  }



  return (
    <div className="relative flex items-center group pl-15 " ref={ref} >
      <div className="items-center absolute left-0 flex gap-1 group-hover:flex text-gray-600" ref={addButtonsRef}>

        <button className="hover:bg-gray-200  hover:shadow-gray-300 hover:shadow-xs rounded cursor-pointer duration-200"
          onMouseDown={() => addElement()}>
          <AddIcon />
        </button>

        <button className="hover:bg-gray-200 hover:shadow-gray-300 hover:shadow-2xs rounded cursor-grab duration-200 " ref={handleRef}>
          <DotsMoveIcon className="size-6" />
        </button>
      </div>

      <DataContext value={{
        node: node,
        onUpdate: updateElement,
        addFunc: addElement,
        onDelete: deleteElement,
        buttonsRef: addButtonsRef,
        focusElement: focusPrevElement,
        remaining: allItems.length
      }}>
        {node.type == "todo" &&
          <NodeTodo node={node} />
        }
        {node.type == "string" &&
          <NodeString node={node} />
        }
        {node.type == "list" &&
          <NodeList node={node} />
        }
        {node.type == "code" &&
          <NodeCode node={node}
            onUpdate={updateElement}

          />
        }
        {node.type == "number-list" &&
          <NodeNumberList
            node={node}
            allItems={allItems}
            updateElement={updateElement}
            position={sortIndex}
          />
        }
      </DataContext>
    </div>
  )
}
function NodeString({ node }: { node: ProjectNode }) {
  return (
    <>
      <SimpleEditText
        codeToFetch={() => { }}
      />
    </>
  )
}

const LanguageMap: Record<string, any> = {
  html: languages.html,
  css: languages.css,
  js: languages.js,
  jsx: languages.jsx,
  go: languages.go,
  python: languages.python
}

function NodeCode({ node, onUpdate }: {
  node: ProjectNode,
  onUpdate: (newItem: ProjectNode, toFetch?: Partial<DBNode>) => void
}) {
  const containerEditorRef = useRef<HTMLDivElement>(null)

  if (node.type !== "code") {
    throw new Error("incorrect type")
  }
  const lang = LanguageMap[node.language || "js"]
  const updateType = (type: ProjectNode["type"]) => {
    onUpdate({
      ...node,
      type: type,
      state: { ...node.state, edit: true },
    }, { Type: type })
  }
  const removeType = (e: React.KeyboardEvent) => {
    if ((e.key == "Delete" || e.key == "Backspace") && !node.data) {
      updateType("string")
    }
  }
  const handleFocusTextarea = () => {
    const textarea = containerEditorRef.current?.querySelector('textarea');
    if (textarea) {
      textarea.focus()
    }
  }
  return (
    <>
      <div className="min-w-52  flex flex-col relative overflow-hidden rounded bg-black/90" ref={containerEditorRef} onClick={e => {
        e.preventDefault();
        handleFocusTextarea()
      }
      }>
        <div className=" self-end text-sm text-white/60">
          <select name="languages" defaultValue={node.language} onChange={e => {
            onUpdate({ ...node, language: e.target.value });
          }}
            className="bg-black/90 cursor-pointer">
            <option value="html">html</option>
            <option value="css">css</option>
            <option value="js">js</option>
            <option value="python">python</option>
            <option value="jsx">jsx</option>
            <option value="go">go</option>
          </select>
        </div>

        <Editor
          placeholder="Type some code…"
          value={node.data}
          onValueChange={(code) => onUpdate({ ...node, data: code })}
          onFocus={() => onUpdate({ ...node, state: { ...node.state, edit: true } })}
          onBlur={() => onUpdate({ ...node, state: { ...node.state, edit: false } })}
          onKeyDown={e => removeType(e)}
          highlight={(code) => highlight(code, lang, node.language || "js")}
          padding={20}
          className="w-full text-gray-200"
        />
      </div>
    </>
  )
}

function NodeTodo({ node }: { node: ProjectNode }) {
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
function NodeList({ node }: { node: ProjectNode }) {
  return (
    <>
      <SimpleEditText
      >
        <div className="w-2 h-2 bg-black rounded-full"></div>
      </SimpleEditText>
    </>
  )
}

function NodeNumberList({ node, allItems, position, updateElement }: {
  node: NumberListNode,
  allItems: ProjectNode[],
  position: number,
  updateElement: (item: ProjectNode) => void
}) {
  const prevNumber = useRef(0);


  useEffect(() => {
    const checkPrevNumber = () => {
      if (position < 1) return 1
      const prev = allItems[position - 1];
      if (prev.type != "number-list") return 1
      if (!prev.number) return 1
      // return prev.number + 1

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
      <div className="">{node.number}</div>
    </SimpleEditText>
  )
}
function SimpleEditText({ children, codeToFetch, textClass, parentClass }: {
  children?: JSX.Element,
  codeToFetch?: () => void
  textClass?: string
  parentClass?: string
}) {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('UserContext must be used within a Provider');
  }

  const { node, onUpdate, addFunc, onDelete, buttonsRef, remaining, focusElement } = context

  const dropdownRef = useRef<HTMLDivElement>(null)
  const editRef = useRef<HTMLInputElement>(null)

  const updateEditState = (bool: boolean) => {
    console.log(node)
    onUpdate({
      ...node,
      state: { ...node.state, edit: bool },
    })
  }

  const updateType = (type: ProjectNode["type"]) => {
    onUpdate({
      ...node,
      type: type,
      state: { ...node.state },
    }, { Type: type })
  }

  const addWithEnter = (e: React.KeyboardEvent) => {
    if (e.key == "Enter" && node.type !== "code") {
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

  return (
    <div className=" w-full flex py-1 flex-col gap-3 relative text-gray-900">

      <div className={`flex gap-3 items-center min-h-6 w-full h-full cursor-text ${parentClass}`}>
        {children}
        {
          node.state.edit ? (
            <>
              <input type="text" value={node.data} ref={editRef} autoFocus name="input"
                className={` field-sizing-content min-h-6 focus:outline-none w-full  ${textClass}}`}
                placeholder="enter text "
                onChange={e => onUpdate({ ...node, data: e.target.value })}
                onBlur={() => updateEditState(false)}
                onKeyDown={e => {
                  addWithEnter(e)
                  removeType(e)
                  removeNode(e)
                }}
              >
              </input>
              <p>{node.state.orden}</p>
            </>
          ) : (
            <div className={`w-full h-full min-h-6 ${textClass}`}
              aria-placeholder="add new element"
              onClick={() => updateEditState(true)}>
              {node.data}
              ..
              order: {node.state.orden}
            </div>
          )
        }
      </div>
      {
        node.state.edit && node.type === "string" && !node.data && (
          <DropdownAddComponent
            dropdownRef={dropdownRef}
            updateType={updateType}
          />
        )
      }
    </div>
  )
}

function DropdownAddComponent({ updateType, dropdownRef }: {
  updateType: (item: ProjectNode["type"]) => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
}) {

  return (
    <section className="border border-gray-400 absolute top-10 bg-white w-60 min-h-10 z-50 
    rounded-xl shadow-sm shadow-gray-400 flex font-normal flex-col text-gray-800 text-sm overflow-hidden" ref={dropdownRef} >
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
  // const childClass = "py-1 flex gap-3 items-center hover:bg-gray-200 hover:text-gray-800 duration-200 pl-1 cursor-pointer  ";

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
