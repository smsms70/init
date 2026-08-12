import { useEffect, useRef, useState, type SetStateAction } from "react"
import { AddIcon, DeleteIcon, DotsIcon, EditPencilIcon } from "../../assets/icons"
import { Link } from "react-router"
import { fetchAddParentNode, fetchDeleteNode, fetchParentsNodes, fetchUpdateNodes } from "../../components/fetchData"
import type { DBNode } from "./dashboardElement_types"
import { TextareaComp } from "../../components/textareaComp"
import { Sidebar } from "../../components/Sidebar"
import { AddElement } from "../../components/AddElement"

export type ProjectType = {
  id?: number
  name: string
  childrenNames: string[]
}
type ProjectNodeType = {
  Id: number
  data: string
  type?: "parent_node"
}

export default function DashboardPage() {
  const [data, setData] = useState<ProjectNodeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardName, setDashboardName] = useState("dashboardName");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const updateData = async () => {
    try {
      const Data = await fetchParentsNodes()
      setData(Data)
    } catch (err) {
      setError("error")
      console.error("error is: ", err)
      // if (err.name && err.name == "AuthErr") window.location.href = "/auth/login"
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const update = async () => updateData()
    update()
  }, [])

  const addElement = async (item: Pick<DBNode, "Data">) => {
    await fetchAddParentNode(item)
    await updateData()
  }

  const handleDeleteElement = async (item: ProjectNodeType["Id"]) => {
    const response = await fetchDeleteNode(item)
    console.log(response)
    console.log(data, item)
    setData(prev => prev.filter(prevItem => prevItem.Id !== item))
  }

  return (
    <section className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <section className={`flex-1 flex flex-col ${sidebarOpen ? "ml-64" : "ml-16"} min-h-screen p-8 transition-[margin-left] duration-150 ease-out`}>
        <ProjectHeader
          name={dashboardName}
          setName={setDashboardName}
        />
        <section className="grid mb-30 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] px-7 gap-6 ">
          {
            !loading ? (
              error ? (
                <div className="border text-red-800/80 font-bold">
                  Error: {JSON.stringify(error)}
                </div>
              ) : (
                <>
                  {
                    data && data.map((proj) => (
                      <ProjectComp
                        key={proj.Id}
                        project={proj}
                        handleDeleteElement={() => handleDeleteElement(proj.Id)}
                      />
                    ))
                  }
                  {
                    <AddElement
                      onAdd={name => addElement({ Data: name })}
                      triggerClassName="w-full h-full min-h-20 flex justify-center rounded items-center group duration-100 border border-gray-300 shadow-sm hover:bg-primary cursor-pointer"
                      formClassName="flex flex-col group group-has-focus:border-gray-400 border-gray-200 gap-3 p-3 align-center justify-center bg-white h-fit py-2"
                      inputClassName="text-lg p-1 focus:border-b-gray-800 focus:outline-none border border-gray-200"
                      addButtonClassName="border rounded w-fit px-2 py-1 self-center cursor-pointer bg-white"
                      showCancel={false}
                    >
                      <AddIcon className="size-20 duration-100 text-primary group-hover:text-white" />
                    </AddElement>
                  }
                </>
              )
            ) : (
              <div>
                Loading...
              </div>
            )
          }
          {
          }
        </section>
      </section>
    </section>
  )
}

export function ProjectHeader({ name, setName, project_id, deleteButton }: {
  name: string
  setName?: React.Dispatch<SetStateAction<string>>
  project_id?: string
  deleteButton?: boolean
}) {
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const editBoxRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    const updateHandler = async () => {
      if (!name && !project_id) return
      try {
        setLoading(true)
        await fetchUpdateNodes(Number(project_id), { Data: name })
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    if (!edit && project_id && name) {
      updateHandler()
    }
  }, [edit])

  return (
    <header className="p-3 pt-10 flex justify-between border-b m-4 ">
      <div className="flex items-end w-11/12 ">
        {
          edit ? (
            <TextareaComp
              value={name}
              ref={editBoxRef}
              onChange={setName}
              onBlur={() => setEdit(false)}
              onKeyDown={e => { if (e.key == "Enter") setEdit(false) }}
              className="border-none outline-none overflow-hidden active:appearance-none text-4xl"
            />
          ) : (
            <h2 className="w-full wrap-break-word text-4xl" onClick={() => setEdit(true)}>
              {name}
            </h2>
          )
        }
        {
          loading && (
            <p className={`ml-10  font-semibold ${error ? "text-red-700" : "text-gray-700/60"}`}>
              {error ? "Error" : "loading..."}
            </p>
          )
        }
      </div>
      <EditButtonComp
        setEdit={setEdit}
        deleteEnabled={deleteButton}
        editBoxRef={editBoxRef}
      />
    </header>
  )
}

function ProjectComp({ project, handleDeleteElement }: {
  project: ProjectNodeType
  handleDeleteElement: () => void
}) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(project.data);
  const prevName = useRef(project.data);
  const editBoxRef = useRef<HTMLTextAreaElement>(null);


  const addFunc = async () => {
    const data = await fetchUpdateNodes(project.Id, { Data: name })
    prevName.current = name;
    console.log(data)
    setEdit(false)
  }

  const handleOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      addFunc()
    }
  }

  useEffect(() => {
    if (!edit && prevName.current !== name) {
      addFunc()
    }
  }, [edit])

  return (
    <section className="min-h-20 w-full border border-gray-300 rounded-lg shadow">
      <header className="flex rounded-t items-center group/parent 
      has-[.algo:hover]:bg-primary bg-primary/85">

        {edit ? (
          <TextareaComp
            value={name}
            ref={editBoxRef}
            onChange={setName}
            onKeyDown={handleOnKeyDown}
            className="text-lg p-1 focus:border-b-gray-800"
          />
        ) : (
          <Link to={`./${project.Id}`} className="min-w-0 flex-1 algo p-1.5 group/button ">
            <div className="w-full wrap-break-word ">
              {name}
            </div>
          </Link>
        )}

        <div className={`hover:bg-primary ${edit && "hidden"}`}>
          < EditButtonComp
            setEdit={setEdit}
            handleDeleteElement={handleDeleteElement}
            deleteEnabled={true}
            editBoxRef={editBoxRef}
          />
        </div>
        {
          edit && (
            <button className="p-1"
              onClick={() => addFunc()}
            >
              <AddIcon className="size-7 rounded shadow-sm bg-white" />
            </button>
          )
        }
      </header>
    </section>
  )
}

export function EditButtonComp({ deleteEnabled, handleDeleteElement, setEdit, editBoxRef }: {
  setEdit: React.Dispatch<SetStateAction<boolean>>
  handleDeleteElement?: () => void
  deleteEnabled?: boolean
  editBoxRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  const [dropdown, setDropdown] = useState(false);
  const dropButtonRef = useRef<HTMLDivElement>(null);
  const dropBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInButton = dropButtonRef.current?.contains(target)
      const isClickInBox = dropBoxRef.current?.contains(target)
      const isClickInTextArea = editBoxRef.current?.contains(target)

      if (!isClickInButton && !isClickInBox && !isClickInTextArea) {
        setDropdown(false)
        setEdit(false)
      }
    }
    document.body.addEventListener("mousedown", clickOutside)
    return () => {
      document.body.removeEventListener("mousedown", clickOutside)
    }
  }, [])

  const handleEditTrue = () => {
    setEdit(true);
  }
  return (
    <div ref={dropButtonRef} onClick={() => setDropdown(prev => !prev)}
      className={`cursor-pointer flex relative items-center justify-center p-1 text-gray-800`}
    >
      <DotsIcon className={`border border-gray-300 bg-gray-200 rounded hover:shadow-sm size-6 hover:bg-gray-300 duration-200 ${dropdown && "bg-gray-300"}`} />
      {
        dropdown && (
          <section ref={dropBoxRef}
            className="absolute top-8 right-1 text-sm border border-gray-400 rounded bg-white py-1 px-1.5"
          >
            <div onClick={() => handleEditTrue()}
              className="flex gap-1.5 items-center hover:bg-gray-200 duration-100 rounded p-0.5"
            >

              <EditPencilIcon className="size-5" />
              <span>Edit</span>
            </div>
            {
              deleteEnabled &&
              <div
                onClick={() => handleDeleteElement && handleDeleteElement()} className="flex gap-1.5 items-center hover:bg-gray-200 duration-100 rounded p-0.5"
              >
                <DeleteIcon className="size-5" />
                <span> Delete </span>
              </div>
            }
          </section>
        )
      }

    </div>
  )
}
