import React, {forwardRef} from "react";
import {useInput} from "@nextui-org/react";
// import {} from "./SearchIcon";
// import {CloseFilledIcon} from "./CloseFilledIcon";

import { AiFillCloseCircle as CloseFilledIcon } from "react-icons/ai";
import { CiSearch as SearchIcon} from "react-icons/ci";

// const styles = {
//   label: "text-black/50 dark:text-white/90",
//   input: [
//     "bg-transparent",
//     "text-black/90 dark:text-white/90",
//     "placeholder:text-default-700/50 dark:placeholder:text-white/60",
//   ],
//   innerWrapper: "bg-transparent",
//   inputWrapper: [
//     "shadow-xl",
//     "bg-default-200/50",
//     "dark:bg-default/60",
//     "backdrop-blur-xl",
//     "backdrop-saturate-200",
//     "hover:bg-default-200/70",
//     "focus-within:!bg-default-200/50",
//     "dark:hover:bg-default/70",
//     "dark:focus-within:!bg-default/60",
//     "!cursor-text",
//   ],
// };

export const MyInput = forwardRef((props, ref: React.ForwardedRef<HTMLInputElement | null>) => {

    console.log({ref});

  const {
    Component,
    label,
    domRef,
    description,
    isClearable,
    startContent,
    endContent,
    shouldLabelBeOutside,
    shouldLabelBeInside,
    errorMessage,
    getBaseProps,
    getLabelProps,
    getInputProps,
    getInnerWrapperProps,
    getInputWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
    getClearButtonProps,
  } = useInput({
    ...props,
    // this is just for the example, the props bellow should be passed by the parent component
    label: "Search",
    type: "search",
    placeholder: "Type to search...",
    startContent: (
      <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
    ),
    // custom styles
  });

  const labelContent = <label {...getLabelProps()}>{label}</label>;

  const end = React.useMemo(() => {
    if (isClearable) {
      return <span {...getClearButtonProps()}>{endContent || <CloseFilledIcon />}</span>;
    }

    return endContent;
  }, [isClearable, getClearButtonProps]);

//   const innerWrapper = React.useMemo(() => {
//     if (startContent || end) {
//       return (
//         <div {...getInnerWrapperProps()}>
//           {startContent}
//           <input {...getInputProps()} ref={ref}/>
//           {end}
//         </div>
//       );
//     }

//     return <input {...getInputProps()} ref={ref}/>;
//   }, [startContent, end, getInputProps, getInnerWrapperProps, ref]);

  return (

      <Component {...getBaseProps()}>
        {shouldLabelBeOutside ? labelContent : null}
        <div {...getInputWrapperProps()} >
        
          <input {...getInputProps()} ref={ref}/>
        </div>
      </Component>
  );
});

MyInput.displayName = "MyInput";

export default MyInput;