import React from "react";

const Separator = React.forwardRef(
  (props, ref) => (
    <div
      role="presentation"
      className={`
        shrink-0
        bg-neutral-200 dark:bg-neutral-800
        h-[1px] w-full`
      }
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export { Separator };
