"use client";
import { forwardRef } from "react";

type InputProps = {
  placeHolder?: string;
  editable: boolean;
  value?: string;
  type?: string;
  onChange?: (value: string) => void;
};

const InputArea = forwardRef<HTMLInputElement, InputProps>(
  ({ placeHolder, editable, value, type = "text", onChange }, ref) => {
    return (
      <>
        {editable ? (
          <input
            className="h-10 w-full text-[16px] leading-normal placeholder:text-[16px] px-3 py-2 bg-[#15171C] border-none text-white rounded-lg placeholder:text-[#71788B] hover:ring-blue-400 hover:ring-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-0"
            ref={ref}
            type={type}
            value={value}
            placeholder={placeHolder}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : (
          <input
            className="h-10 w-full text-[16px] leading-normal placeholder:text-[16px] px-3 py-2 border-2 bg-[#15171C] border-gray-600 text-gray-300 rounded-lg"
            ref={ref}
            type="text"
            value={value}
            readOnly
            placeholder={placeHolder}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )}
      </>
    );
  },
);

InputArea.displayName = "InputArea";

export default InputArea;
