"use client";
import React, { useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccountContext } from "@/context/Account";
import LoaderSpiner from "./LoaderSpinner";

export type Account = {
  username: string;
  permission: string;
};

export default function HeadBar() {
  const router = useRouter();
  const pathname = usePathname();
  const teamname = pathname.split("/")[2] || "";
  const { pushToLoginPage, setPushToLoginPage } = useAccountContext();
  const [loading, setLoading] = useState(false);
  // const [user, setUser] = useState<Account>();

  // const [userList, setUserList] = useState<Account[]>();

  function decodeJWT(token: string): Record<string, any> | null {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null; // Invalid JWT format
    }
    const payload = Buffer.from(parts[1], "base64").toString("utf-8");
    return JSON.parse(payload);
  }

  const handleLogin = () => {
    setLoading(true);
    router.push("/login");
    setTimeout(() => {
      setPushToLoginPage(true);
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setLoading(true);
    localStorage.clear();
    // setUser({ username: "", permission: "" });
    router.push("/");
    setPushToLoginPage(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (pushToLoginPage === false && pathname === "/") {
      localStorage.clear();
    } else {
      setPushToLoginPage(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token: ");
    if (!token) {
      // alert("You are not logged in.");
      // router.push("/login");
    } else {
      const decodedPayload = decodeJWT(token);
      const name = decodedPayload?.username;
      // const permission = decodedPayload?.permission;
      if (!name) {
        console.log("no name");
      } else {
        // setUser({ username: name, permission: permission });
      }
    }
  }, []);

  return loading ? (
    <LoaderSpiner />
  ) : (
    <>
      <div className="bg-slate-900 py-4 px-4 flex flex-row justify-between gap-2 items-center">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-white">
          MakeNTU 機台借用申請網站
        </h1>
        <div className="flex flex-row items-center gap-2">
          <div className="flex text-center mx-2">
            {teamname && (
              <p className="text-white text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl font-semibold">
                {teamname}
              </p>
            )}
          </div>
          <div className="flex flex-row justify-between">
            {pathname !== "/login" &&
              (!pushToLoginPage ? (
                <button
                  className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleLogin}
                >
                  登入
                </button>
              ) : (
                <button
                  className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleLogout}
                >
                  登出
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
