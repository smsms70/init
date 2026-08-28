import { useEffect, useRef, useState } from "react"
import { DeleteIcon, DotsIcon, EditPencilIcon } from "../../assets/icons"

export function EditButtonComp({ deleteEnabled, handleDeleteElement, setEdit, editBoxRef, editEnabled = true }: {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
  handleDeleteElement?: () => void
  deleteEnabled?: boolean
  editBoxRef: React.RefObject<HTMLTextAreaElement | null>
  editEnabled?: boolean
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
            className="absolute top-8 right-1 text-sm border border-gray-400 rounded bg-white py-1 px-1.5 z-100"
          >
            {editEnabled && (
              <div onClick={() => handleEditTrue()}
                className="flex gap-1.5 items-center hover:bg-gray-200 duration-100 rounded p-0.5"
              >
                <EditPencilIcon className="size-5" />
                <span>Edit</span>
              </div>
            )}
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