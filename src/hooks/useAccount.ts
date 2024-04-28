import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Account } from "@/context/Account";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function useAccount() {
    const router = useRouter();
    
    const createAccount = async ({
      username, password, permission
    }:{username: string, password: string, permission: string}) => {
      const res = await fetch("/api/account", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
          permission: permission,
          login: false,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        console.log(body.error)
        throw new Error(body.error);
      }
      router.refresh();
      return res.json();
    };

    const getAccount = async ({ username, password} : { username: string, password: string }) =>{
      const res = await fetch("/api/account", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
          login: true,
        })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      router.refresh();
      return res.json();
    }
    
    const getAccountbyToken = async () => {
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

    const deleteUsers = async () => {
      const res = await fetch("/api/account", {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      router.refresh();
      return res.json();
    }

    return {
      createAccount,
      getAccount,
      getAccountbyToken,
      deleteUsers
    };
}