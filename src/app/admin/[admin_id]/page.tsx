"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import LaserCutQueueListForAdmin from "@/components/LaserCutQueueListForAdmin";
import ThreeDPQueueListForAdmin from "@/components/ThreeDPQueueListForAdmin";
import LaserCutMachineList from "@/components/LaserCutMachineList";
import ThreeDPMachineList from "@/components/ThreeDPMachineList";
import LoaderSpiner from "@/components/LoaderSpinner";

function useAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("laser");
  const [loading, setLoading] = useState(false);
  // const secretkey: string = process.env.PASSWORD_SECRET
  //   ? process.env.PASSWORD_SECRET
  //   : "Secret";

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
      alert("未登入");
      router.push("/login");
    } else {
      const decodedPayload = decodeJWT(token);
      const permission = decodedPayload?.permission;
      const username = decodedPayload?.username;
      const currPath = pathname.split("/").slice(-1)[0];
      if (
        !permission ||
        permission !== "admin" ||
        !username ||
        username !== currPath
      ) {
        router.push("/login");
        alert("權限錯誤，請重新登入");
      }
    }
  }, []);

  const handleSwitchTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handlePushToTeamData = () => {
    setLoading(true);
    router.push("/teamData");
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return loading ? (
    <LoaderSpiner />
  ) : (
    <div className="bg-background pb-5">
      <div className="flex items-center justify-center gap-2.5 my-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
          onClick={handlePushToTeamData}
        >
          管理使用者
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <div
          className={`px-12 xs:px-12 sm:px-16 md:px-24 lg:px-32 xl:px-44 py-2.5 ${activeTab === "laser" ? "bg-yellow-400 text-white" : "bg-gray-700 text-black"} rounded-l-lg text-lg xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl cursor-pointer font-bold`}
          onClick={() => handleSwitchTab("laser")}
        >
          雷切使用申請
        </div>
        <div
          className={`px-12 xs:px-12 sm:px-16 md:px-24 lg:px-32 xl:px-44 py-2.5 ${activeTab === "3dp" ? "bg-yellow-400 text-white" : "bg-gray-700 text-black"} rounded-r-lg text-lg xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl cursor-pointer font-bold`}
          onClick={() => handleSwitchTab("3dp")}
        >
          3DP使用申請
        </div>
      </div>

      {activeTab === "laser" && (
        <div className="flex flex-col">
          <LaserCutQueueListForAdmin />
          <LaserCutMachineList index={1} />
        </div>
      )}

      {activeTab === "3dp" && (
        <div className="flex flex-col">
          <ThreeDPQueueListForAdmin />
          <div className="flex w-full justify-center">
            <div className="flex w-10/12 justify-center gap-6">
              <ThreeDPMachineList index={1} />
              <ThreeDPMachineList index={2} />
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="flex w-10/12 justify-center gap-6">
              <ThreeDPMachineList index={3} />
              <ThreeDPMachineList index={4} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default useAdmin;
