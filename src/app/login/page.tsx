"use client";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InputArea from "@/components/ui/InputArea";
import useAccount from "@/hooks/useAccount";
import { useAccountContext } from "@/context/Account";
import LoaderSpiner from "@/components/LoaderSpinner";

export default function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [permission, setPermission] = useState("");
  const [loading, setLoading] = useState(false);
  const { setPushToLoginPage } = useAccountContext();
  const { createAccount, getAccount } = useAccount();

  useEffect(() => {
    if (username.startsWith("admin")) {
      setPermission("admin");
    } else if (username.startsWith("team")) {
      setPermission("contestant");
    } else {
      setPermission("");
    }
  }, [username]);

  const handleRegister = async () => {
    const validInput = checkInput();
    if (!validInput) {
      return;
    }
    try {
      const { user: user, token: token } = await createAccount({
        username,
        password,
        permission,
      });
      localStorage.setItem("jwt-token: ", token);
      router.refresh();
      router.push("/login");
    } catch (error) {
      alert("發生錯誤");
      console.log(error);
      return;
    }
  };

  const handleLogin = async () => {
    if (!checkInput()) {
      return;
    }
    try {
      setLoading(true);
      const { user: user, token: token } = await getAccount({
        username,
        password,
      });
      localStorage.setItem("jwt-token: ", token);
      if (parseInt(user.name) > 45 || parseInt(user.name) === 0) {
        router.push(`/admin/${username}`);
      } else {
        router.push(`/contestant/${username}`);
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      alert("登入失敗");
      setUsername("");
      setPassword("");
      console.log(error);
      return;
    }
  };

  const checkInput = () => {
    if (username === "" || password === "") {
      alert("帳號或密碼不得為空");
      return false;
    } else {
      return true;
    }
  };

  const handleCancel = () => {
    setPushToLoginPage(false);
    router.push("/");
  };

  return loading ? (
    <LoaderSpiner />
  ) : (
    <div className="bg-black">
      <div className="h-8"></div>
      <div className="p-2 flex flex-col items-center justify-between bg-black">
        <div className="m-2 flex w-2/6 justify-center items-center gap-2 active:none">
          <p className="font-bold text-white">帳號：</p>
          <InputArea
            ref={usernameRef}
            editable={true}
            value={username}
            placeHolder="Team Account"
            onChange={(e) => {
              setUsername(e);
            }}
          />
        </div>
        <div className="h-5"></div>
        <div className="m-2 flex w-2/6 justify-center items-center gap-2">
          <p className="font-bold text-white">密碼：</p>
          <InputArea
            ref={passwordRef}
            value={password}
            editable={true}
            type="password"
            placeHolder="Team Password"
            onChange={(e) => setPassword(e)}
          />
        </div>
        <div className="h-4"></div>
        <div className="m-2 flex gap-2">
          <button
            className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCancel}
          >
            取消
          </button>
          <button
            className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogin}
          >
            登入
          </button>
        </div>
      </div>
      <div className="h-screen"></div>
    </div>
  );
}
