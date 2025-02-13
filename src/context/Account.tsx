"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { decodeJWT } from "@/lib/decodeJWT";

export type Account = {
  id: number;
  name: string;
  password: string;
  permission: string;
};

export type AccountRequest = {
  account: Account["name"];
  password: Account["password"];
  permission: Account["permission"];
};

export type AccountResponse = {
  account: Account["name"];
  token: string;
};

export type AccountContext = {
  user?: Account | null;
  pushToLoginPage: boolean;
  userList?: Account[];
  setAccount?: (user: Account) => void;
  setPushToLoginPage: (pushToLoginPage: boolean) => void;
};

export const AccountContext = createContext<AccountContext>({
  user: null,
  pushToLoginPage: false,
  userList: [],
  setAccount: () => {},
  setPushToLoginPage: () => {},
});

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setAccount] = useState<Account | undefined>();
  const [userList, setUserList] = useState<Account[] | undefined>();
  const [pushToLoginPage, setPushToLoginPage] = useState(false);

  useEffect(() => {
    const userHook = async () => {
      const res = await fetch("/api/account", {
        method: "GET",
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      router.refresh();
      return res.json();
    };

    const getUser = async () => {
      const UserListInit = await userHook();
      const UserListJson: Account[] = UserListInit["user"];
      setUserList(UserListJson);
    };
    getUser();

    const token = localStorage.getItem("jwt-token: ");
    if (!token) {
      // alert("未登入");
      // router.push("/login");
    } else {
      const decodedPayload = decodeJWT(token);
      const name = decodedPayload?.username;
      if (!name) {
        console.log("No name");
      } else {
        const temp: Account | undefined = userList?.find(
          (item) => item.name === name,
        );
        setAccount(temp);
      }
    }
  }, []);

  return (
    <AccountContext.Provider
      value={{
        user,
        pushToLoginPage,
        userList,
        setAccount,
        setPushToLoginPage,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useContext must be used within a AccountProvider");
  }
  return context;
};
