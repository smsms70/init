import { useEffect, useState } from "react"
import { LinkIcon } from "../../assets/icons"
import { fetchLinkTargets } from "../fetchData"
import { Modal } from "./Modal"

type LinkTarget = { Id: number, data: string }

export function LinkTargetPickerModal({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (target: { id: number, name: string }) => void
}) {
  const [targets, setTargets] = useState<LinkTarget[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let active = true
    queueMicrotask(() => { if (active) setLoading(true) })
    fetchLinkTargets()
      .then(res => { if (active) setTargets(res || []) })
      .catch(err => console.error("failed to load link targets:", err))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p className="text-sm font-medium text-gray-800 mb-3">reference a page</p>
      {loading ? (
        <p className="text-xs text-gray-400">loading...</p>
      ) : targets.length === 0 ? (
        <p className="text-xs text-gray-400">no pages found</p>
      ) : (
        <div className="flex flex-col max-h-60 overflow-y-auto -mx-1">
          {targets.map(target => (
            <button
              key={target.Id}
              type="button"
              className="flex gap-3 items-center hover:bg-gray-200 hover:text-gray-800 duration-200 px-3 py-1 text-left text-sm text-gray-800 cursor-pointer rounded"
              onClick={() => onSelect({ id: target.Id, name: target.data })}
            >
              <LinkIcon className="size-4 text-indigo-500 shrink-0" />
              <span className="truncate">{target.data}</span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}
