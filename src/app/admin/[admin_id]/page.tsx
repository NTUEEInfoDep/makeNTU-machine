'use client'
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import LaserCutQueueListForAdmin from "@/components/LaserCutQueueListForAdmin";
import ThreeDPQueueListForAdmin from "@/components/ThreeDPQueueListForAdmin";
import LaserCutMachineList from "@/components/LaserCutMachineList";
import ThreeDPMachineList from "@/components/ThreeDPMachineList";
import Map from "@/components/Map";

export default function useAdmin() {
    const router = useRouter();
    const pathname = usePathname();
    const secretkey : string = process.env.PASSWORD_SECRET ? process.env.PASSWORD_SECRET : "Secret";

    function decodeJWT(token: string): Record<string, any> | null {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null; // Invalid JWT format
        }
        const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
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
            const username = decodedPayload?.username;
            const currPath = pathname.split('/').slice(-1)[0];
            if(!permission || permission !== "admin" || !username || username !== currPath) {
                router.push("/login");
                alert("權限錯誤，請重新登入");
            }
        }
    }, [])

    const handleRefresh = () => {
        window.location.reload();
    }

    return (
        <div className="bg-black">
            <Map />
            <div className="flex items-center justify-center">
                <button 
                    className="m-4 bg-yellow-500 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded"
                    onClick={() => handleRefresh()}>Refresh
                </button>
                <button 
                    className="m-4 bg-yellow-500 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded"
                    onClick={() => router.push("/teamData")}>管理使用者
                </button>
            </div>
            <LaserCutQueueListForAdmin/>
            <div className="h-7"></div>
            <div className="flex w-full justify-center content-start">
                <div className="flex w-4/5 justify-center">
                    <LaserCutMachineList index={1}/>
                </div>
            </div>
            <div className="h-7"></div>
            <ThreeDPQueueListForAdmin/>
            <div className="h-7"></div>
            <div className="flex w-full justify-center content-start">
                <div className="flex w-4/5 justify-center">
                    <ThreeDPMachineList index={1}/>
                    <ThreeDPMachineList index={2}/> 
                </div>
            </div>
            <div className="h-5"></div>
            <div className="flex w-full justify-center content-start">
                <div className="flex w-4/5 justify-center">
                    <ThreeDPMachineList index={3}/>
                    <ThreeDPMachineList index={4}/> 
                </div>
            </div>
        </div>
    )
}