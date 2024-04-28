import { AccountProvider } from "@/context/Account";
import { RequestProvider } from "@/context/Request";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function Providers({ children }: Props) {
  return (
    <>
    <AccountProvider>
      <RequestProvider>
        {children}
      </RequestProvider>
    </AccountProvider>
    </>
  );
}

export default Providers;