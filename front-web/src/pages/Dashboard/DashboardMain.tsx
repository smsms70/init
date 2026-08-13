import { useEffect, useRef, useState } from "react"
import { AddIcon } from "../../assets/icons"
import { Link } from "react-router"
import { fetchAddParentNode, fetchDeleteNode, fetchParentsNodes, fetchUpdateNodes } from "../../components/fetchData"
import type { DBNode } from "./nodes/types"
import { TextareaComp } from "../../components/textareaComp"
import { AddElement } from "../../components/AddElement"
import { DashboardLayout } from "./layout/DashboardLayout"
import { EditButtonComp } from "./layout/ProjectHeader"

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
    <DashboardLayout title={dashboardName} setTitle={setDashboardName}>
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
    </DashboardLayout>
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
