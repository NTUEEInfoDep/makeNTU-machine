"use client"
import { forwardRef } from "react"

type InputProps = {
  placeHolder?: string,
  editable: boolean,
  value?: string,
  type?: string,
  onChange?: (value: string) => void
}

const InputArea = forwardRef<HTMLInputElement, InputProps>(
  ({placeHolder, editable, value, type = "text", onChange}, ref) => {
    return(
      <>
        {editable ?
          <input
            className="p-2 h-12 border-2 bg-black border-blue-500 bg-slate-100d text-white text-base focus:outline-0 focus:border-blue-300 focus:border-4 md:min-w-[75%]"
            ref={ref}
            type={type}
            value={value}
            placeholder={placeHolder}
            onChange={(e)=>onChange?.(e.target.value)}
          /> :
          <input 
            className="p-2 h-12 border-2 bg-black border-gray-600 text-gray-300 text-base focus:outline-0 md:min-w-[75%]"
            ref={ref}
            type="text"
            value={value}
            readOnly
            placeholder={placeHolder}
            onChange={(e)=>onChange?.(e.target.value)}
          />
        }
      </>
    )

  }
)

InputArea.displayName = "InputArea";

export default InputArea;