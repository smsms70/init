import { useEffect, useRef, useState, type SetStateAction } from "react"
import { DeleteIcon, DotsIcon, EditPencilIcon } from "../../assets/icons"
import { fetchUpdateNodes } from "../../components/fetchData"
import { TextareaComp } from "../../components/textareaComp"

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
    <header className="p-3 flex justify-between border-b m-4 mt-0 ">
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