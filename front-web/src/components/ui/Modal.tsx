import { useEffect, useRef, type ReactNode } from "react"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  closeOnScroll?: boolean
}

export function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  closeOnBackdrop = true,
  closeOnEsc = true,
  closeOnScroll = true,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") onClose()
    }
    const onScroll = (e: Event) => {
      if (closeOnScroll && cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, true)
    return () => {
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [isOpen, closeOnEsc, closeOnScroll, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200]"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        ref={cardRef}
        className={`bg-white rounded-lg shadow-lg p-5 w-80 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
