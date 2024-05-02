"use client"
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InputArea from "@/components/ui/InputArea";
import useAccount from "@/hooks/useAccount";

export default function Login() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const comfirmPasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [comfirmPassword, setComfirmPassword] = useState("");
    const [permission, setPermission] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
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
        if (!validInput){
            return;
        } 
        try {
            const { user: user, token: token } = await createAccount({ username, password, permission });
            localStorage.setItem("jwt-token: ", token);
            router.refresh();
            router.push("/login");
        } catch(error) {
            alert("發生錯誤");
            console.log(error);
            return;
        }
    }

    const handleLogin = async () => {
        if (!checkInput()) {
            return;
        }
        try {
            const { user: user, token: token } = await getAccount({ username, password });
            localStorage.setItem("jwt-token: ", token);
            if (parseInt(user.name) > 45 || parseInt(user.name) === 0) {
                router.push(`/admin/${username}`);
            }
            else {
                router.push(`/contestant/${username}`); 
            }
        } catch(error) {
            alert("登入失敗");
            console.log(error);
            return;
        }
    }

    const checkInput = () => {
        if (!isSignUp && (username === "" || password === "")) {
            alert("帳號或密碼不得為空");
            return false;
        } else if (isSignUp) {
            if (username === "" || password === "" || comfirmPassword === "")    {
                alert("帳號或密碼不得為空");
                return false;    
            } else if (password !== comfirmPassword) {
                alert("密碼不一致");
                return false;
            }
        } else{
            return true;
        }
    }

    return (
        <div className="bg-black">
        <div className="h-8"></div>
        <div className="p-2 flex flex-col items-center justify-between bg-black">
            <div className="m-2 flex w-2/6 justify-center items-center gap-2 active:none">
                <p className="font-bold text-white">帳號：</p>
                <InputArea
                    ref={usernameRef}
                    editable={true}
                    value={username}
                    placeHolder={"Team account"}
                    onChange={(e) => {setUsername(e)}}
                />
            </div>
            <div className="h-5"></div>
            <div className="m-2 flex w-2/6 justify-center items-center gap-2">
                <p className="font-bold text-white">密碼：</p>
                <InputArea
                    ref={passwordRef}
                    value={password}
                    editable={true}
                    type={"password"}
                    placeHolder={"Enter Password"}
                    onChange={(e) => setPassword(e)}
                />
            </div>
            <div className="h-4"></div>
            {isSignUp && <div className="w-1/3 m-2 flex items-center gap-2">
                <p className="font-bold">確認密碼：</p>
                <InputArea
                    ref={comfirmPasswordRef}
                    value={comfirmPassword}
                    editable={true}
                    type={"password"}
                    placeHolder={"Comfirm Password"}
                    onChange={(e) => setComfirmPassword(e)}
                />
            </div>}
            <div className="m-2 flex gap-2">
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={() => router.push("/")}
                >取消</button>
                {!isSignUp && <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={()=>handleLogin()}
                >登入</button>}
            </div>
        </div>
        <div className="h-screen"></div>
        </div>
    )
}