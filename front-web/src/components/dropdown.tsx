import { useEffect, useState, useRef, useCallback, type JSX } from "react";

export function DropDownComponent({ children, icon, iconContainer_Class, func, optionalRef }: {
  children: JSX.Element;
  icon: JSX.Element;
  iconContainer_Class?: string;
  func?: () => void;
  optionalRef?: React.RefObject<HTMLElement>;
}) {
  const [dropdown, showDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);

  const HandleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node;

    const isClickInsideIcon = iconRef.current?.contains(target)
    const isClickInsideDropdown = dropdownRef.current?.contains(target)
    const isClickInsideExternalRef = optionalRef?.current?.contains(target)

    if (!isClickInsideIcon && !isClickInsideDropdown && !isClickInsideExternalRef) {
      showDropdown(false);
      if (func) func();
    }
  }, [func, optionalRef])

  useEffect(() => {
    document.body.addEventListener("mousedown", HandleClickOutside);

    return () => {
      document.body.removeEventListener("mousedown", HandleClickOutside);
    }
  }, [HandleClickOutside])

  return (
    <>
      <button className={iconContainer_Class}
        ref={iconRef} onClick={() => showDropdown(!dropdown)}>
        {icon}
      </button>
      <div ref={dropdownRef} className="relative">
        {dropdown && children}
      </div>
    </>
  )
}
