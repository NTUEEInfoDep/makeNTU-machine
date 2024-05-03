"use client"
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import LaserCutQueueListForContestant from "@/components/LaserCutQueueListForContestant";
import ThreeDPQueueListForContestant from "@/components/ThreeDPQueueListForContestant"
import Map from "@/components/Map";
import { env } from "../../../utils/env";

export default function useContestant() {
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
            if(!permission || permission !== "contestant" || !username || username !== currPath) {
                router.push("/login");
                alert("權限錯誤，請重新登入");
            }
        }
    }, [])

    return (
        <div className="bg-black">
            <Map />
            <LaserCutQueueListForContestant/>
            <ThreeDPQueueListForContestant/>
            <div className="h-screen"></div>
        </div>
    )
}