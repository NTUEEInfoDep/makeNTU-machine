import { forwardRef } from "react";

const Separator = forwardRef((props, _) => (
  <div
    role="presentation"
    className={`
        shrink-0
        bg-neutral-200 dark:bg-neutral-800
        h-[1px] w-full`}
    {...props}
  />
));

Separator.displayName = "Separator";

export { Separator };
