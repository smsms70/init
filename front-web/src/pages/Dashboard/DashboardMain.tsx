import { useEffect, useRef, useState } from "react"
import { AddIcon } from "../../assets/icons"
import { Link } from "react-router"
import { fetchAddParentNode, fetchDeleteNode, fetchParentsNodes, fetchUpdateNodes, fetchIncomingLinks, fetchGetRootNode } from "../../components/fetchData"
import type { DBNode } from "./nodes/types"
import { TextareaComp } from "../../components/textareaComp"
import { AddElement } from "../../components/AddElement"
import { DashboardLayout } from "./layout/DashboardLayout"
import { EditButtonComp } from "../../components/ui/EditButtonComp"
import { DeleteConfirmationModal } from "../../components/ui/DeleteConfirmationModal"
import { useDisclosure } from "../../hooks/useDisclosure"

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
  const [dashboardName, setDashboardName] = useState("");
  const [rootId, setRootId] = useState<number>();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number, incomingCount: number, name?: string } | null>(null);
  const { isOpen: deleteOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure();

  const updateData = async () => {
    try {
      const Data = await fetchParentsNodes()
      setData(Data)
    } catch (err) {
      setError("error")
      console.error("error is: ", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const update = async () => updateData()
    update()
  }, [])

  const loadRoot = async () => {
    try {
      const root = await fetchGetRootNode()
      setRootId(root.id)
      setDashboardName(root.data)
    } catch (err) {
      console.error("error loading root node: ", err)
    }
  }

  useEffect(() => {
    loadRoot()
  }, [])

  const addElement = async (item: Pick<DBNode, "Data">) => {
    await fetchAddParentNode(item)
    await updateData()
  }

  const handleDeleteElement = async (item: ProjectNodeType["Id"]) => {
    try {
      const result = await fetchIncomingLinks(item)
      if (result.count > 0) {
        const target = data.find(p => p.Id === item)
        setDeleteTarget({ id: item, incomingCount: result.count, name: target?.data })
        openDeleteModal()
        return
      }
    } catch (err) {
      console.error("error checking incoming links:", err)
    }
    await performDelete(item)
  }

  const performDelete = async (id: number) => {
    const response = await fetchDeleteNode(id)
    console.log(response)
    setData(prev => prev.filter(prevItem => prevItem.Id !== id))
    setDeleteTarget(null)
    closeDeleteModal()
  }

  const confirmDelete = () => {
    if (deleteTarget) performDelete(deleteTarget.id)
  }

  const cancelDelete = () => {
    setDeleteTarget(null)
    closeDeleteModal()
  }

  return (
    <DashboardLayout title={dashboardName} setTitle={setDashboardName} project_id={rootId?.toString()}>
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
                    triggerClassName="w-full h-full min-h-15 flex justify-center rounded items-center group duration-100 border border-gray-300 shadow-sm hover:bg-gray-400/70 cursor-pointer"
                    formClassName="flex flex-col group group-has-focus:border-gray-400 border-gray-200 gap-3 p-3 align-center justify-center bg-white h-fit py-2"
                    inputClassName="text-lg p-1 focus:border-b-gray-800 focus:outline-none border border-gray-200"
                    addButtonClassName="border rounded w-fit px-2 py-1 self-center cursor-pointer bg-white"
                    showCancel={false}
                  >
                    <AddIcon className="size-12 duration-100 text-gray-500 group-hover:text-white" />
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
      </section>
      <DeleteConfirmationModal
        isOpen={deleteOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        incomingCount={deleteTarget?.incomingCount ?? 0}
        itemName={deleteTarget?.name}
      />
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
    <header className="min-h-15 flex items-start h-full rounded-lg group/parent 
      has-[.algo:hover]:bg-gray-400/70 bg-gray-300 group duration-100">

      {edit ? (
        <TextareaComp
          value={name}
          ref={editBoxRef}
          onChange={setName}
          onKeyDown={handleOnKeyDown}
          className="text-lg p-1 focus:border-b-gray-800"
        />
      ) : (
        <Link to={`./${project.Id}`} className="min-w-0 flex-1 h-full algo p-1.5 group/button ">
          <div className="w-full wrap-break-word">
            {name}
          </div>
        </Link>
      )}

      <div id="configBox" className={`hover:bg-gray-400/70 group-hover:opacity-100 hover:opacity-100 configBox rounded-r-lg h-full opacity-0 ${edit && "hidden"}`}>
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
            <AddIcon className="size-6 rounded shadow-sm bg-gray-200" />
          </button>
        )
      }
    </header>
  )
}
