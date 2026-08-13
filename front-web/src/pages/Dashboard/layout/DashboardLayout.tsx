import { useState, type ReactNode } from "react"
import { ArrowUpIcon, MenuIcon } from "../../../assets/icons"
import { Link } from "react-router"
import { Sidebar } from "./Sidebar"
import { ProjectHeader } from "./ProjectHeader"

export function DashboardLayout({ title, setTitle, project_id, deleteButton, backTo, children }: {
  title: string
  setTitle?: React.Dispatch<React.SetStateAction<string>>
  project_id?: string
  deleteButton?: boolean
  backTo?: string
  children: ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768)

  return (
    <section className="flex min-h-screen overflow-x-clip">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <section className={`flex-1 min-w-0 flex flex-col min-h-screen ml-0 p-4 md:p-6 
        ${sidebarOpen ? "md:ml-64" : "md:ml-16"} ${backTo ? "" : ""}
        transition-[margin-left] duration-150 ease-out`}>
        <div className="mb-0 min-h-7 flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="cursor-pointer rounded p-2 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            <MenuIcon className="size-6" />
          </button>
          {backTo && (
            <Link to={backTo} aria-label="Go back">
              <div className="flex h-10 w-10 rounded -rotate-90 items-center justify-center hover:bg-gray-100 duration-150">
                <ArrowUpIcon className="size-10" />
              </div>
            </Link>
          )}
        </div>
        <ProjectHeader
          name={title}
          setName={setTitle}
          project_id={project_id}
          deleteButton={deleteButton}
        />
        {children}
      </section>
    </section>
  )
}
