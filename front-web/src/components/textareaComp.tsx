export function TextareaComp({ value, onChange, onBlur, onKeyDown, className, placeholder, name, autoFocus = true, ref }: {
  value: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  className?: string
  placeholder?: string
  name?: string
  autoFocus?: boolean
  ref?: React.Ref<HTMLTextAreaElement>
}) {
  return (
    <textarea
      value={value}
      ref={ref}
      autoFocus={autoFocus}
      name={name}
      placeholder={placeholder}
      className={`resize-none field-sizing-content w-full focus:outline-none ${className ?? ""}`}
      onChange={e => onChange?.(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onFocus={e => e.currentTarget.setSelectionRange(e.target.value.length, e.target.value.length)}
    />
  )
}
