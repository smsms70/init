import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useNodeContext } from "./nodeContext"
import { fetchGetNodeName } from "../../../components/fetchData"
import { LinkIcon, NestedParentIcon } from "../../../assets/icons"
import { TextareaComp } from "../../../components/textareaComp"
import { EditButtonComp } from "../../../components/ui/EditButtonComp"
import { DeleteConfirmationModal } from "../../../components/ui/DeleteConfirmationModal"

export function NodeNestedParent() {
  const { node, onUpdate, onDelete } = useNodeContext()
  const navigate = useNavigate()
  const editRef = useRef<HTMLTextAreaElement>(null)
  const editBoxRef = useRef<HTMLTextAreaElement>(null)
  const prevName = useRef(node.data)

  const [edit, setEdit] = useState(() => node.state.edit || !node.data)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const isEditing = edit || !node.data

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus()
      editRef.current?.setSelectionRange(
        editRef.current.value.length,
        editRef.current.value.length
      )
    }
  }, [isEditing])

  const handleSave = () => {
    if (node.data) {
      prevName.current = node.data
      onUpdate(
        { ...node, state: { ...node.state, edit: false } },
        { Data: node.data }
      )
      setEdit(false)
    }
  }

  const handleDelete = () => {
    onDelete(node)
    setShowDeleteModal(false)
  }

  if (isEditing) {
    return (
      <div className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-50 border border-indigo-200">
        <NestedParentIcon className="size-4 shrink-0 text-indigo-500" />
        <TextareaComp
          value={node.data}
          ref={editRef}
          name="input"
          placeholder="name this page"
          className="min-h-6 wrap-break-word"
          onChange={(data) => onUpdate({ ...node, data })}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleSave()
            }
          }}
        />
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex items-center gap-2 group">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
          onClick={() => navigate(`/dashboard/${node.id}`)}
        >
          <NestedParentIcon className="size-4 shrink-0 text-indigo-500" />
          <span className="truncate text-sm">{node.data}</span>
        </div>
        <EditButtonComp
          setEdit={setEdit}
          deleteEnabled={true}
          editBoxRef={editBoxRef}
          handleDeleteElement={() => setShowDeleteModal(true)}
        />
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        incomingCount={0}
        itemName={node.data}
      />
    </>
  )
}

export function NodeParentLink() {
  const { node } = useNodeContext()
  const navigate = useNavigate()
  const [targetName, setTargetName] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const isBroken = !node.ref_id

  useEffect(() => {
    if (!node.ref_id) {
      setLoading(false)
      return
    }
    const loadTarget = async () => {
      try {
        const name = await fetchGetNodeName(String(node.ref_id))
        setTargetName(name)
      } catch {
        setTargetName("")
      } finally {
        setLoading(false)
      }
    }
    loadTarget()
  }, [node.ref_id])

  const handleClick = () => {
    if (!isBroken && node.ref_id) {
      navigate(`/dashboard/${node.ref_id}`)
    }
  }

  const displayName = loading
    ? "loading..."
    : isBroken
      ? "deleted page"
      : targetName || "unknown page"

  return (
    <div
      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
        isBroken
          ? "bg-gray-100 border border-dashed border-gray-300 text-gray-400"
          : "bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
      }`}
      onClick={handleClick}
    >
      <LinkIcon className={`size-4 shrink-0 ${isBroken ? "text-gray-300" : "text-indigo-500"}`} />
      <span className="truncate text-sm">{displayName}</span>
    </div>
  )
}
