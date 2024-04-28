import React from "react";
import Image from "next/image";
import map_path from "../../public/machineMap.png";

export default function Map() {
    return (
        <>
        <div className="w-800 h-full p-6 flex justify-center">
            <div className="rounded border-4 border-gray-600">
                <Image src={map_path} width={1000} height={500} loading="lazy" alt="map" className="w-full h-full rounded" />
            </div>
        </div>
        <div className="h-1"></div>
        </>
    )
}