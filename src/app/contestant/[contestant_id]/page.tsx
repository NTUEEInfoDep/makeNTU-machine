"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import LaserCutQueueListForContestant from "@/components/LaserCutQueueListForContestant";
import ThreeDPQueueListForContestant from "@/components/ThreeDPQueueListForContestant";
import { decodeJWT } from "@/lib/decodeJWT";

function useContestant() {
  const router = useRouter();
  const pathname = usePathname();
  const teamName = pathname.split("/").slice(-1)[0];
  // const secretkey: string = process.env.PASSWORD_SECRET
  //   ? process.env.PASSWORD_SECRET
  //   : "Secret";

  useEffect(() => {
    const token = localStorage.getItem("jwt-token: ");
    if (!token) {
      alert("未登入");
      router.push("/login");
    } else {
      const decodedPayload = decodeJWT(token);
      const permission = decodedPayload?.permission;
      const username = decodedPayload?.username;
      if (
        !permission ||
        permission !== "contestant" ||
        !username ||
        username !== teamName
      ) {
        router.push("/login");
        alert("權限錯誤，請重新登入");
      }
    }
  }, []);

  return (
    <div className="bg-background overflow-auto flex flex-col mb-4">
      <LaserCutQueueListForContestant />
      <ThreeDPQueueListForContestant />
    </div>
  );
}

export default useContestant;
