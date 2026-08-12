import { useEffect, useState } from "react"
import { AddIcon, ArrowUpIcon, PersonIcon } from "../assets/icons"
import { Link, useNavigate, useParams } from "react-router"
import { fetchAddParentNode, fetchParentsNodes } from "./fetchData"

type ParentNodeType = {
  Id: number
  data: string
}

function AddProject({ onAdd }: {
  onAdd: (data: string) => Promise<void>
}) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState("")

  const handleAdd = async (data: string) => {
    if (!data.trim()) return
    try {
      await onAdd(data)
      setNewName("")
      setAdding(false)
    } catch (err) {
      console.error("error adding parent: ", err)
    }
  }

  return (
    <>
      <button
        onClick={() => setAdding(true)}
        className="mt-2 flex cursor-pointer items-center gap-1.5 rounded p-1.5 text-gray-300 hover:bg-white/10 hover:text-white"
      >
        <AddIcon className="size-4" />
        <span>New</span>
      </button>
      {adding && (
        <div className="mb-2 flex w-full flex-col gap-2 rounded border border-white/20 p-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleAdd(newName)
              if (e.key === "Escape") { setAdding(false); setNewName("") }
            }}
            autoFocus
            type="text"
            placeholder="Project name"
            className="w-full rounded bg-gray-700/50 p-1 outline-none placeholder:text-gray-400"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleAdd(newName)}
              className="cursor-pointer rounded bg-white/10 px-2 py-0.5 hover:bg-white/20"
            >
              Add
            </button>
            <button
              onClick={() => { setAdding(false); setNewName("") }}
              className="cursor-pointer rounded px-2 py-0.5 hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export function Sidebar({ isOpen, setIsOpen }: {
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [open, setOpen] = useState(true)
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [parents, setParents] = useState<ParentNodeType[]>([])
  const [loading, setLoading] = useState(true)
  const { project_id } = useParams()
  const navigate = useNavigate()

  const sidebarOpen = isOpen ?? open
  const toggleOpen = setIsOpen ?? setOpen

  useEffect(() => {
    const update = async () => {
      try {
        const data = await fetchParentsNodes()
        setParents(data)
      } catch (err) {
        console.error("error fetching parents: ", err)
      } finally {
        setLoading(false)
      }
    }
    update()
  }, [])

  const handleAdd = async (data: string) => {
    const { id } = await fetchAddParentNode({ Data: data })
    const updated = await fetchParentsNodes()
    setParents(updated)
    navigate(`/dashboard/${id}`)
  }

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 ${sidebarOpen ? "w-64" : "w-16"} bg-gray-800 text-white transition-[width] duration-200 ease-out`}
    >
      <div className={`
        flex h-16 items-center justify-between px-4
        ${!sidebarOpen && "mt-5 flex-col justify-center gap-3"}
        `}>
        <PersonIcon className="size-8" />
        <button
          onClick={() => toggleOpen(!sidebarOpen)}
          className="cursor-pointer rounded hover:bg-white/20"
        >
          <ArrowUpIcon className={` ${sidebarOpen ? "-rotate-90 size-8" : "rotate-90 size-6"}`} />
        </button>
      </div>
      {sidebarOpen && (
        <div className="p-4 text-sm">
          <nav>
            <div className="mb-2 flex w-full items-center justify-between">
              <button
                onClick={() => setProjectsOpen(!projectsOpen)}
                className="outline-none group flex w-full cursor-pointer items-center justify-between font-medium text-gray-300 hover:text-white"
              >
                <span>Projects</span>
                <ArrowUpIcon className={`size-4 duration-200 group-hover:bg-white/20 rounded ${projectsOpen ? "rotate-180 " : "rotate-90"}`} />
              </button>
            </div>
            {projectsOpen && (
              loading ? (
                <p>Loading...</p>
              ) : parents.length ? (
                <ul className="flex flex-col gap-1">
                  {parents.map(parent => (
                    <li key={parent.Id}>
                      <Link
                        to={`/dashboard/${parent.Id}`}
                        className={`block rounded p-1.5 wrap-break-word duration-150 hover:bg-white/20 ${String(parent.Id) === project_id ? "bg-white/10 font-bold" : ""}`}
                      >
                        {parent.data}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No projects</p>
              )
            )}
            <AddProject onAdd={handleAdd} />
          </nav>
        </div>
      )}
    </aside>
  )
}
