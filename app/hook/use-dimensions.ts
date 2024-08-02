import { useEffect, useRef } from "react";

interface Dimensions { 
    offsetWidth: number; 
    offsetHeight: number; 
}

export const useDimensions = (ref: React.MutableRefObject<null | Dimensions> ) => {
  const dimensions = useRef({ width: 0, height: 0 })

  useEffect(() => {

    if(ref.current) {
        dimensions.current.width = ref.current.offsetWidth;
        dimensions.current.height = ref.current.offsetHeight;
    }
    
  }, []);

  return dimensions.current;
};
