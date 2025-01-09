"use client";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useAccount from "@/hooks/useAccount";
import Papa from "papaparse";
import LoaderSpiner from "@/components/LoaderSpinner";

type userData = {
  id: string;
  name: string;
  authority: string;
  password: string;
};

type dbUserData = {
  id: number;
  name: string;
  permission: string;
  password: string;
};

export default function TeamData() {
  const router = useRouter();
  const { createAccount, getAccountbyToken, deleteUsers } = useAccount();
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function decodeJWT(token: string): Record<string, any> | null {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null; // Invalid JWT format
    }
    const payload = Buffer.from(parts[1], "base64").toString("utf-8");
    return JSON.parse(payload);
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt-token: ");
    if (!token) {
      alert("You are not logged in.");
      router.push("/login");
    } else {
      const decodedPayload = decodeJWT(token);
      const permission = decodedPayload?.permission;
      setUsername(decodedPayload?.username);
      if (!permission || permission !== "admin") {
        router.push("/login");
        alert("權限錯誤，請重新登入");
      }
    }
  }, []);

  const handleCSVUpload = (event: any) => {
    const csvFile = event.target.files[0];

    Papa.parse(csvFile, {
      skipEmptyLines: true,
      header: true,
      complete: async function (results) {
        const result: userData[] = results.data as userData[];
        try {
          const db = await getAccountbyToken();
          const dbData: dbUserData[] = db.user;
          result.map(async (dat: userData) => {
            let auth: string = "contestant";
            if (dat.authority === "1") {
              auth = "admin";
            }
            const findUser = dbData.find((user) => user.name === dat.name);
            if (findUser === undefined) {
              try {
                const { user: user, token: token } = await createAccount({
                  username: dat.name,
                  password: dat.password,
                  permission: auth,
                });
              } catch (error) {
                alert("An error occurred");
                console.log(error);
                return;
              }
            }
          });
          setMsg("User data has been uploaded");
        } catch (error) {
          alert("An error occurred");
          console.log(error);
          return;
        }
      },
    });
  };

  const handleClear = () => {
    deleteUsers();
    setMsg("User data has been cleared");
  };

  const hanleLeave = () => {
    setLoading(true);
    router.push(`/admin/${username}`);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return loading ? (
    <LoaderSpiner />
  ) : (
    <>
      <div className="bg-black flex flex-row justify-center gap-4 mt-4">
        <div className="flex items-center justify-center">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleClear}
          >
            清除所有使用者
          </button>
        </div>
        <div className="flex items-center justify-center">
          <input
            type="file"
            id="uploader"
            className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded text-white"
            accept=".csv"
            onChange={handleCSVUpload}
          />
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm font-bold text-red-500">{msg}</p>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={hanleLeave}
          >
            離開
          </button>
        </div>
      </div>
    </>
  );
}
