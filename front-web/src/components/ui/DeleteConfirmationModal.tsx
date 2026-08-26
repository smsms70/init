type DeleteConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  incomingCount: number
  itemName?: string
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  incomingCount,
  itemName
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-5 w-80">
        <p className="text-sm text-gray-800 mb-1">
          {incomingCount} link(s) reference this page and will become broken.
        </p>
        {itemName && <p className="text-xs text-gray-500 mb-4">Delete "{itemName}" anyway?</p>}
        {!itemName && <p className="text-xs text-gray-500 mb-4">Delete anyway?</p>}
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
            onClick={onClose}
          >
            cancel
          </button>
          <button
            className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
            onClick={onConfirm}
          >
            delete
          </button>
        </div>
      </div>
    </div>
  )
}