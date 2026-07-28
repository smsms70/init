import { ProjectHeader } from "./DashboardMain"
import { AddIcon, ArrowIcon, ChecklistIcon, CodeListIcon, DotListIcon, DotsMoveIcon, NumberListIcon, CopyIcon } from "../../assets/icons"
import { Link, useParams } from "react-router"
import React, { useEffect, useState, useContext, type Dispatch, type JSX, type SetStateAction, createContext, useRef } from "react";
import type { contextType, DataFetchedType, DBNode, NumberListNode, ProjectNode } from "./dashboardElement_types";
import Editor from 'react-simple-code-editor/src/index';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
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

export default function DashboardProjectElement() {
  const [allData, setAllData] = useState<ProjectNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const { project_id } = useParams()
  const [name, setName] = useState("")

  const addElement = async () => {
    const type = "string";
    const newOrden = allData.length ? allData[allData.length - 1].state.orden + 1 : 1

    const data = await fetchAddNode(
      Number(project_id),
      { Type: type, Orden: (newOrden).toString(), Data: "" }
    )

    console.log("id is: ", data.id)

    const newItem: ProjectNode = {
      class: "basic-blocks",
      parent_id: Number(project_id),
      id: data.id,
      state: { orden: newOrden, edit: true },
      type: type,
      data: "",
    }
    setAllData(prev => [...prev, newItem])
  }
  function mapFetchedDataToNode(data: DataFetchedType[]): ProjectNode[] {
    const parent_id = Number(project_id);

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

        console.log(Data)
        if (Data) {
          const data = mapFetchedDataToNode(Data)
          const orderData = data.sort((a, b) => a.state.orden - b.state.orden)
          setAllData(orderData)
        }
      } catch (err) {
        console.error("error is: ", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    updateData();
  }, [project_id])

  useEffect(() => {
    console.log("it here: ", allData)
  }, [allData])

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
      <section className="p-0 md:p-2 lg:p-4 flex  " >

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
          <div className="shadow  border border-gray-200 mb-10 min-h-15  w-full py-2 pl-8 pr-2 md:pl-5 md:pr-5  ">
            {
              loading ? (
                <div>loading...</div>
              ) : (
                error ? (
                  <div>error</div>
                ) : (
                  <>
                    {
                      allData && allData.map((e, idx) => (
                        <ProjectNode
                          key={e.id}
                          node={e}
                          allItems={allData}
                          setNewItem={setAllData}
                          sortIndex={idx}
                        />
                      ))
                    }
                    {
                      !allData.length &&
                      <button onClick={() => addElement()}
                        className="w-40 rounded flex justify-center cursor-pointer hover:scale-105 duration-75 border border-gray-300 ">
                        <AddIcon className="group size-6 stroke-gray-400" />
                      </button>
                    }

                  </>
                )
              )
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

function ProjectNode({ node, setNewItem, allItems, sortIndex }: {
  node: ProjectNode,
  allItems: ProjectNode[],
  setNewItem: Dispatch<SetStateAction<ProjectNode[]>>
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

    const id = addedNode.id
    console.log('the new id is:', addedNode, 'last one is: ', id)

    const newItem: ProjectNode = {
      class: "basic-blocks",
      parent_id: node.parent_id,
      id: id,
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
    console.log(node.id)
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
    await fetchDeleteNode(item.id);
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
    <div className={` relative flex items-center pl-0.5 group w-full md:bg-transparent md:pl-15 ${""}`} ref={ref} >
      <div className={` 
        py-1 lg:px-1 rounded-lg shadow
        flex gap-1 items-center flex-col md:flex-row
        text-gray-500 bg-gray-100 border border-gray-300 
        absolute bottom-0 -left-7 md:-left-2 z-100
        md:opacity-0
        group-hover:opacity-100 duration-150 
        ${node.state.edit ? "opacity-100 md:opacity-0" : "opacity-0"}`}
        ref={addButtonsRef}
      >

        <button className="hover:bg-gray-200  hover:shadow-gray-300 stroke-gray-600 hover:shadow-xs rounded cursor-pointer duration-200"
          onPointerDown={() => addElement(false)}>
          <AddIcon className="size-6 opacity-60 stroke-2" />
        </button>

        <button className="hover:bg-gray-200 hover:shadow-gray-300 hover:shadow-2xs rounded cursor-grab duration-200 " ref={handleRef}>
          <DotsMoveIcon className="size-6 opacity-60 stroke-0" />
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
          <NodeString />
        }
        {node.type == "list" &&
          <NodeList />
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

function NodeString() {
  return (
    <>
      <SimpleEditText />
    </>
  )
}
const LanguageMap: Record<string, Prism.Grammar> = {
  html: languages.html,
  css: languages.css,
  js: languages.js,
  jsx: languages.jsx,
  tsx: languages.tsx,
  go: languages.go,
  python: languages.python,
  ts: languages.ts
}
function NodeCode({ node, onUpdate }: {
  node: ProjectNode,
  onUpdate: (newItem: ProjectNode, toFetch?: Partial<DBNode>) => void
}) {
  const containerEditorRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLElement>(null)
  const [copy, setCopy] = useState(false);

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
  const handleCopyTextare = async () => {
    const textAreaText = containerEditorRef.current?.querySelector('textarea');
    try {
      if (!textAreaText) return
      await navigator.clipboard.writeText(textAreaText.value)
      setCopy(true)
      setTimeout(() => setCopy(false), 1000)
    } catch (err) {
      setCopy(false)
      console.error('error in copy:', err)
    }
  }
  return (
    <>
      <div className="group min-w-52 flex flex-col relative overflow-hidden rounded-xl bg-black/90"
        ref={containerEditorRef} onClick={e => {
          e.preventDefault();
          handleFocusTextarea()
        }
        }>
        <section className="z-10 h-3 relative mt-2 mr-2  text-sm text-white/60 ">
          <div className={`group/select right-0 flex absolute border rounded border-gray-500 gap-1 group-hover:opacity-100 duration-200 
            ${node.state.edit ? "opacity-100" : "opacity-0"}`}>
            <select name="languages" defaultValue={node.language} onChange={e => {
              onUpdate({ ...node, language: e.target.value });
            }} className="bg-black font-semibold cursor-pointer border border-transparent rounded hover:border-gray-500 hover:text-gray-300">
              <option value="html">html</option>
              <option value="css">css</option>
              <option value="js">js</option>
              <option value="ts">ts</option>
              <option value="python">python</option>
              <option value="jsx">jsx</option>
              <option value="tsx">tsx</option>
              <option value="go">go</option>

            </select>
            <button onClick={() => handleCopyTextare()}
              className="group/copy p-1 border bg-black rounded border-black cursor-pointer hover:border-gray-500">
              <CopyIcon className={` size-5 duration-150 ${copy ? "text-green-400" : "group-hover/copy:text-gray-300"}`} />
            </button>
          </div>
        </section>

        <Editor
          placeholder="Type some code…"
          value={node.data}
          onValueChange={(code) => onUpdate({ ...node, data: code })}
          onFocus={() => onUpdate({ ...node, state: { ...node.state, edit: true } })}
          onBlur={() => onUpdate({ ...node, state: { ...node.state, edit: false } })}
          onKeyDown={e => removeType(e)}
          highlight={(code) => highlight(code, lang, node.language || "js")}
          padding={20}
          style={{ fontFamily: 'monospace' }}
          className="w-full text-gray-200 "
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
function NodeList() {
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
      <div className="">{node.number}.</div>
    </SimpleEditText>
  )
}

function SimpleEditText({ children, textClass, parentClass }: {
  children?: JSX.Element,
  textClass?: string
  parentClass?: string
}) {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('UserContext must be used within a Provider');
  }

  const { node, onUpdate, addFunc, onDelete, remaining, focusElement } = context

  const dropdownRef = useRef<HTMLDivElement>(null)
  const editRef = useRef<HTMLTextAreaElement>(null)

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
    editRef.current?.setSelectionRange(length, length)
  }
  return (
    <div className=" w-full flex py-1 flex-col gap-3 relative text-gray-900">

      <div className={`flex gap-3 items-center min-h-6 w-full h-full cursor-text ${parentClass}`}>
        {children}
        {
          node.state.edit ? (
            <>
              <textarea value={node.data} ref={editRef} autoFocus name="input"
                className={`resize-none field-sizing-content min-h-6 focus:outline-none w-full  ${textClass}} wrap-break-word`}
                placeholder="Enter text "
                onChange={e => onUpdate({ ...node, data: e.target.value })}
                onBlur={() => updateEditState(false)}
                onFocus={e => e.currentTarget.setSelectionRange(e.target.value.length, e.target.value.length)}
                onKeyDown={e => {
                  addWithEnter(e)
                  removeType(e)
                  removeNode(e)
                }}
              >
              </textarea>
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
