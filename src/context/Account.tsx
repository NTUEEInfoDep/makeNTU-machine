'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export type Account = {
    id: number;
    name: string;
    password: string;
    permission: string;
}
export type AccountRequest = {
    account: Account["name"];
    password: Account["password"];
    permission: Account["permission"];
}
export type AccountResponse = {
    account: Account["name"];
    token: string;
}

export type AccountContext = {
    user?: Account | null;
    setAccount?: (user: Account) => void;
}

export const AccountContext = createContext<AccountContext>({
    user: null,
    setAccount: () => {},
});

type Props = {
    children: React.ReactNode;
}
export const AccountProvider = ({ children }: Props) => {
    const router = useRouter();
    const [user, setAccount] = useState<Account | undefined>();
    const [userList, setUserList] = useState<Account[] | undefined>();
    
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
        }
        const getUser = async () => {
            const UserListInit = await userHook();
            const UserListJson:Account[] = UserListInit["user"]
            setUserList(UserListJson)
        }
        getUser();
        const token = localStorage.getItem("jwt-token: ");
        function decodeJWT(token: string): Record<string, any> | null {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null; // Invalid JWT format
            }
            const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
            return JSON.parse(payload);
        }
        if (!token) {
            // alert("You are not logged in.");
            // router.push("/login");
        } else {
            const decodedPayload = decodeJWT(token);
            const name = decodedPayload?.username;
            if(!name) {
                console.log("No name");
            }
            else{
                const temp: Account|undefined = userList?.find( item => item.name === name) 
                setAccount(temp)
            }
        }
    },[]);

    return (
        <AccountContext.Provider value={{ user, setAccount }}>
            {children}
        </AccountContext.Provider>
    )
}

export function useAccountContext() {
    const context = useContext(AccountContext);
    return context;
  }