import { useEffect, useState } from "react"
import { ArrowUpIcon, PersonIcon } from "../assets/icons"
import { Link, useParams } from "react-router"
import { fetchParentsNodes } from "./fetchData"

type ParentNodeType = {
  Id: number
  data: string
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
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="outline-none mb-2 group flex w-full cursor-pointer items-center justify-between font-medium text-gray-300 hover:text-white"
            >
              <span>Projects</span>
              <ArrowUpIcon className={`size-4 duration-200 group-hover:bg-white/20 rounded ${projectsOpen ? "rotate-180 " : "rotate-90"}`} />
            </button>
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
          </nav>
        </div>
      )}
    </aside>
  )
}
