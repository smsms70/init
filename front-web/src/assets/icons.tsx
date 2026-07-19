
export function DotsIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  )
}
export function PersonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}
export function DeleteIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}
export function AddIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
export function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  )
}
export function CheckIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
export function MoveIcon({ className = "size-6" }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
    </svg>
  )
}
export function TaskIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 2048 2048"><title >task-list</title><path fill="currentColor" d="M768 256h1280v128H768zm0 768V896h1280v128zm0 640v-128h1280v128zM256 768q53 0 99 20t82 55t55 81t20 100q0 53-20 99t-55 82t-81 55t-100 20q-53 0-99-20t-82-55t-55-81t-20-100q0-53 20-99t55-82t81-55t100-20m0 400q30 0 56-11t45-31t31-46t12-56t-11-56t-31-45t-46-31t-56-12t-56 11t-45 31t-31 46t-12 56t11 56t31 45t46 31t56 12m0 240q53 0 99 20t82 55t55 81t20 100q0 53-20 99t-55 82t-81 55t-100 20q-53 0-99-20t-82-55t-55-81t-20-100q0-53 20-99t55-82t81-55t100-20m0 400q30 0 56-11t45-31t31-46t12-56t-11-56t-31-45t-46-31t-56-12t-56 11t-45 31t-31 46t-12 56t11 56t31 45t46 31t56 12M192 358L467 83l90 90l-365 365L19 365l90-90z" /></svg>
  )
}
export function ChecklistIcon({ className = "size-5 " }: { className: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8 6v3H5V6zM3 4v7h7V4zm10 0h8v2h-8zm0 7h8v2h-8zm0 7h8v2h-8zm-2.293-1.793l-1.414-1.414L6 18.086l-1.793-1.793l-1.414 1.414L6 20.914z" /></svg>
  )
}
export function DotListIcon({ className = "size-5 " }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className={className} viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M2.5 5a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5m3.25-2a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zm0 8.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM5 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8M3.75 8a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M2.5 13.5a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5" clipRule="evenodd" /></svg>
  )
}
export function NumberListIcon({ className = "size-5 " }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className={className} viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M3.21 2.5a.5.5 0 0 0-.796-.403l-.71.524a.5.5 0 0 0 .507.856V5a.5.5 0 0 0 1 0zm2.54.5a.75.75 0 1 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zm0 8.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5zM5 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8m-2.596-.67c-.07.051-.087.097-.09.116a.5.5 0 0 1-.988-.149c.051-.345.26-.61.495-.779c.236-.169.531-.268.83-.268c.345 0 .666.109.902.343s.337.543.337.85c0 .51-.321.855-.76 1.278l-.02.018l-.013.011h.493a.5.5 0 0 1 0 1H1.75a.5.5 0 0 1-.326-.879l1.022-.88c.223-.216.338-.344.398-.434c.046-.069.046-.092.046-.111v-.002c0-.09-.027-.127-.041-.141c-.013-.013-.062-.053-.199-.053a.44.44 0 0 0-.246.08M1.9 10.5a.5.5 0 0 0 0 1h.38l-.15.18a.5.5 0 0 0 .383.82c.259 0 .365.077.407.122c.051.054.08.133.08.218a.02.02 0 0 1-.004.014a.2.2 0 0 1-.057.052a.7.7 0 0 1-.371.094a.55.55 0 0 1-.258-.057c-.059-.032-.075-.061-.076-.064a.5.5 0 0 0-.91.416c.213.464.728.705 1.244.705c.319 0 .651-.082.92-.258c.275-.181.512-.487.512-.902c0-.293-.096-.634-.355-.906a1.3 1.3 0 0 0-.252-.206l.34-.407a.5.5 0 0 0-.383-.821z" clipRule="evenodd" /></svg>
  )
}
export function CodeListIcon({ className = "size-5 " }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className={className} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 8l-4 4l4 4m10-8l4 4l-4 4M14 4l-4 16" /></svg>
  )
}
export function DotsMoveIcon({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className={className} viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M9 4.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m1.5 7.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0m0 6a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0m6-6a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0M15 16.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3M16.5 6a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0" /></g></svg>)
}
export function EditPencilIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className={className} viewBox="0 0 24 24"><path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" /></svg>
  )
}
