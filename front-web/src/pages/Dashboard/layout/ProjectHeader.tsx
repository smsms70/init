import { useEffect, useRef, useState, type SetStateAction } from "react"
import { fetchUpdateNodes } from "../../../components/fetchData"
import { TextareaComp } from "../../../components/textareaComp"
import { EditButtonComp } from "../../../components/ui/EditButtonComp"

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
