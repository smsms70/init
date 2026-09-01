import { useEffect, useState } from "react"
import { AddIcon, ArrowUpIcon, MenuIcon, PersonIcon } from "../../../assets/icons"
import { Link, useNavigate, useParams } from "react-router"
import { fetchAddParentNode, fetchParentTree, type ParentTreeNode } from "../../../components/fetchData"
import { AddElement } from "../../../components/AddElement"

export function Sidebar({ isOpen, setIsOpen }: {
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [open, setOpen] = useState(true)
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [tree, setTree] = useState<ParentTreeNode[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const { project_id } = useParams()
  const navigate = useNavigate()

  const sidebarOpen = isOpen ?? open
  const toggleOpen = setIsOpen ?? setOpen

  const loadTree = async () => {
    try {
      const data = await fetchParentTree()
      setTree(data || [])
    } catch (err) {
      console.error("error fetching tree: ", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTree()
  }, [project_id])

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleAdd = async (data: string) => {
    const { id } = await fetchAddParentNode({ Data: data })
    await loadTree()
    if (window.innerWidth < 768) toggleOpen(false)
    navigate(`/dashboard/${id}`)
  }

  const asideClasses = `fixed left-0 top-0 bottom-0 z-40 w-64 bg-gray-800 text-white transition-all duration-200 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
    }`

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => toggleOpen(false)}
        />
      )}
      <aside className={asideClasses}>
        <div className={`
          flex h-16 items-center justify-between px-4
          ${!sidebarOpen && "mt-5 flex-col justify-center gap-3"}
          `}>
          <PersonIcon className="size-8" />
          <button
            onClick={() => toggleOpen(!sidebarOpen)}
            className="cursor-pointer rounded p-1 hover:bg-white/20"
            aria-label="Toggle menu"
          >
            <MenuIcon className="size-6" />
          </button>
        </div>
        {sidebarOpen && (
          <div className="px-2 py-4 text-sm">
            <nav>
              {(() => {
                const rootNode = tree.find(node => node.Type === "root")
                const projects = tree.filter(node => node.Type !== "root")
                return (
                  <>
                    {rootNode ? (
                      <div className="mb-2 flex w-full items-center justify-between">
                        <button
                          onClick={() => {
                            setProjectsOpen(!projectsOpen)
                            navigate("/dashboard")
                            if (window.innerWidth < 768) toggleOpen(false)
                          }}
                          className={`outline-none group flex w-full cursor-pointer items-center justify-between font-medium text-gray-300 hover:text-white ${!project_id ? "font-bold" : ""}`}
                        >
                          <span className="wrap-break-word">{rootNode.Data}</span>
                          <ArrowUpIcon className={`size-4 duration-200 group-hover:bg-white/20 rounded ${projectsOpen ? "rotate-180 " : "rotate-90"}`} />
                        </button>
                      </div>
                    ) : (
                      <div className="mb-2 flex w-full items-center justify-between">
                        <button
                          onClick={() => setProjectsOpen(!projectsOpen)}
                          className="outline-none group flex w-full cursor-pointer items-center justify-between font-medium text-gray-300 hover:text-white"
                        >
                          <span>Projects</span>
                          <ArrowUpIcon className={`size-4 duration-200 group-hover:bg-white/20 rounded ${projectsOpen ? "rotate-180 " : "rotate-90"}`} />
                        </button>
                      </div>
                    )}
                    {projectsOpen && (
                      loading ? (
                        <p>Loading...</p>
                      ) : projects.length ? (
                        <ul className="flex flex-col gap-1">
                          {projects.map(node => (
                            <SidebarItem
                              key={node.Id}
                              node={node}
                              project_id={project_id}
                              expandedIds={expandedIds}
                              toggleExpand={toggleExpand}
                              onNavigate={() => { if (window.innerWidth < 768) toggleOpen(false) }}
                              depth={0}
                            />
                          ))}
                        </ul>
                      ) : (
                        <p>No projects</p>
                      )
                    )}
                  </>
                )
              })()}
              <AddElement
                onAdd={handleAdd}
                placeholder="Project name"
                triggerClassName="mt-2 flex cursor-pointer items-center gap-1.5 rounded p-1.5 text-gray-300 hover:bg-white/10 hover:text-white"
                formClassName="mb-2 flex w-full flex-col gap-2 rounded border border-white/20 p-2"
                inputClassName="w-full rounded bg-gray-700/50 p-1 outline-none placeholder:text-gray-400"
                addButtonClassName="cursor-pointer rounded bg-white/10 px-2 py-0.5 hover:bg-white/20"
                cancelButtonClassName="cursor-pointer rounded px-2 py-0.5 hover:bg-white/20"
              >
                <>
                  <AddIcon className="size-4" />
                  <span>New</span>
                </>
              </AddElement>
            </nav>
          </div>
        )}
      </aside>
    </>
  )
}

function SidebarItem({ node, project_id, expandedIds, toggleExpand, onNavigate, depth }: {
  node: ParentTreeNode
  project_id?: string
  expandedIds: Set<number>
  toggleExpand: (id: number) => void
  onNavigate: () => void
  depth: number
}) {
  const hasChildren = node.Children && node.Children.length > 0
  const isExpanded = expandedIds.has(node.Id)
  const isActive = String(node.Id) === project_id

  return (
    <li>
      <div className="flex items-center gap-2">
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(node.Id)}
            className="cursor-pointer rounded p-0.5 hover:bg-white/20 shrink-0"
          >
            <ArrowUpIcon className={`size-5 duration-200 ${isExpanded ? "rotate-180" : "rotate-90"}`} />
          </button>
        ) : (
          <span className="w-[18px] shrink-0" />
        )}
        <Link
          to={node.Type === "root" ? "/dashboard" : `/dashboard/${node.Id}`}
          onClick={onNavigate}
          className={`block flex-1 rounded p-1.5 wrap-break-word duration-150 hover:bg-white/20 ${isActive ? "bg-white/10 font-bold" : ""}`}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
        >
          {node.Data}
        </Link>
      </div>
      {hasChildren && isExpanded && (
        <ul className="flex flex-col gap-1">
          {node.Children!.map(child => (
            <SidebarItem
              key={child.Id}
              node={child}
              project_id={project_id}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
