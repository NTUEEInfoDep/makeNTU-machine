"use client";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InputArea from "@/components/ui/InputArea";
import useAccount from "@/hooks/useAccount";
import { useAccountContext } from "@/context/Account";
import LoaderSpinner from "@/components/LoaderSpinner";
import { usePathname } from "next/navigation";

function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [permission, setPermission] = useState("");
  const [loading, setLoading] = useState(false);
  const { setPushToLoginPage } = useAccountContext();
  const { getAccount } = useAccount();

  useEffect(() => {
    if (username.startsWith("admin")) {
      setPermission("admin");
    } else if (username.startsWith("team")) {
      setPermission("contestant");
    } else {
      setPermission("");
    }
  }, [username]);

  // const handleRegister = async () => {
  //   const validInput = checkInput();
  //   if (!validInput) {
  //     return;
  //   }
  //   try {
  //     const { user: user, token: token } = await createAccount({
  //       username,
  //       password,
  //       permission,
  //     });
  //     localStorage.setItem("jwt-token: ", token);
  //     router.refresh();
  //     router.push("/login");
  //   } catch (error) {
  //     alert("發生錯誤");
  //     console.log(error);
  //     return;
  //   }
  // };

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
      if (user && pathname !== "/login") {
        setTimeout(() => {
          setLoading(false);
        }, 2500);
      }
    } catch (error) {
      setUsername("");
      setPassword("");
      alert("登入失敗: " + String(error).split(": ")[1]);
      setLoading(false);
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

  useEffect(() => {
    const token = localStorage.getItem("jwt-token: ");
    if (token) {
      alert("已登入");
    }
  }, []);

  return loading ? (
    <LoaderSpinner />
  ) : (
    <div className="flex flex-col gap-1.5 w-4/12 mx-auto px-6 py-5 border rounded-lg mt-16 bg-black border-[#444444]">
      <div className="flex flex-row items-center gap-1">
        <img
          data-testid="header-logo"
          className="w-20 h-20 rounded-full"
          src="/logo-2024.png"
          alt="logo-2024"
        />
        <p className="text-white text-5xl font-semibold">MakeNTU</p>
      </div>
      <p className="text-[#71788B] mb-2">登入以申請機台借用</p>
      <div className="flex flex-col items-center justify-between gap-4">
        <div className="flex flex-col w-full gap-1">
          <p className="text-white text-base">帳號</p>
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
        <div className="flex flex-col w-full gap-1">
          <p className="text-white text-base">密碼</p>
          <InputArea
            ref={passwordRef}
            value={password}
            editable={true}
            type="password"
            placeHolder="Team Password"
            onChange={(e) => setPassword(e)}
          />
        </div>
      </div>
      <p className="text-[#71788B] text-sm mt-2">
        ＊ 隊伍帳號與密碼於參賽手冊中
        <br />＊ 每支帳號僅限一人使用
      </p>
      <div className="mt-2 flex flex-row-reverse gap-1">
        <button
          className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogin}
        >
          登入
        </button>
        <button
          className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCancel}
        >
          取消
        </button>
      </div>
    </div>
  );
}

export default Login;
