"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccountContext } from "@/context/Account";
import { decodeJWT } from "@/lib/decodeJWT";

function HeadBar() {
  const router = useRouter();
  const pathname = usePathname();
  const teamname = pathname.split("/")[2] || "";
  const { pushToLoginPage, setPushToLoginPage } = useAccountContext();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setPushToLoginPage(true);
    router.push("/login");
    if (pathname === "/") {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    localStorage.clear();
    router.push("/");
    setPushToLoginPage(false);
    setTimeout(() => {
      setLoading(false);
    }, 500);
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
      // alert("未登入");
      // router.push("/login");
    } else {
      const decodedPayload = decodeJWT(token);
      const name = decodedPayload?.username;
      // const permission = decodedPayload?.permission;
      if (!name) {
        console.log("沒有使用者名稱");
      } else {
        // setUser({ username: name, permission: permission });
      }
    }
  }, []);

  useEffect(() => {
    if (pathname === "/") setPushToLoginPage(false);
  }, [pathname]);

  return (
    <>
      <div className="bg-slate-900 py-4 px-4 flex flex-row justify-between gap-2 items-center">
        <div className="flex flex-row items-center gap-1">
          <img
            data-testid="header-logo"
            className="w-12 h-12 rounded-full"
            src="/logo-2024.png"
            alt="logo-2024"
          />
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-white">
            MakeNTU 機台借用申請網站
          </h1>
        </div>
        {!loading && (
          <div className="flex flex-row items-center gap-2">
            <div className="flex text-center mx-2">
              {teamname && (
                <p className="text-white text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl font-semibold">
                  {teamname}
                </p>
              )}
            </div>
            <div className="flex flex-row justify-between gap-1.5">
              {pathname !== "/login" && (
                <>
                  {!pushToLoginPage && !teamname ? (
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
                  )}
                  <div>
                    <button
                      className="mx-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => router.push("/map")}
                    >
                      地圖
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HeadBar;
