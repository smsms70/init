import { useEffect, useRef, useState } from "react"
import type { JSX } from "react/jsx-runtime"

export function AddElement({ onAdd, placeholder = "Name", children, triggerClassName, formClassName, inputClassName, addButtonClassName, cancelButtonClassName, showCancel = true }: {
  onAdd: (name: string) => Promise<void> | void
  placeholder?: string
  children: JSX.Element
  triggerClassName?: string
  formClassName?: string
  inputClassName?: string
  addButtonClassName?: string
  cancelButtonClassName?: string
  showCancel?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = () => {
    setOpen(false)
    setName("")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isClickInside = containerRef.current?.contains(target)
      if (!isClickInside) {
        setOpen(false)
      } else if (open) {
        inputRef.current?.focus()
      }
    }

    document.body.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.body.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleAdd = async () => {
    if (!name.trim()) return
    await onAdd(name)
    close()
  }

  return (
    <div ref={containerRef}>
      {open ? (
        <section className={formClassName}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleAdd()
              if (e.key === "Escape") close()
            }}
            autoFocus
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className={inputClassName}
          />
          <div className="flex gap-2">
            <button onClick={() => handleAdd()} className={addButtonClassName}>
              Add
            </button>
            {showCancel && (
              <button onClick={close} className={cancelButtonClassName}>
                Cancel
              </button>
            )}
          </div>
        </section>
      ) : (
        <button onClick={() => setOpen(true)} className={triggerClassName}>
          {children}
        </button>
      )}
    </div>
  )
}