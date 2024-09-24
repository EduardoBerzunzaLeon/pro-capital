import { useEffect, useRef, useState } from "react"

export const useComponentVisible = (defaultValue: boolean) => {
    const [isComponentVisible, setIsComponentVisible] = useState(defaultValue);
    const ref = useRef< HTMLElement | null>(null);
  
    const handleClickOutside = (event: Event) => {
        if (ref.current && !ref.current.contains(event.target as Element))  {
        setIsComponentVisible(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener("click", handleClickOutside, !isComponentVisible);
  
      return () => {
        document.removeEventListener(
          "click",
          handleClickOutside,
          !isComponentVisible
        );
      };
    });
  
    return { ref, isComponentVisible, setIsComponentVisible };
}