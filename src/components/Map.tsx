"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import map_path from "../../public/machineMap.png";

export default function Map() {
  const [closeMap, setCloseMap] = useState(false);

  useEffect(() => {
    // Check if running in the browser
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("closeMap");
      if (savedState !== null) {
        setCloseMap(JSON.parse(savedState));
      }
    }
  }, []);

  useEffect(() => {
    // Update localStorage whenever closeMap changes
    if (typeof window !== "undefined") {
      localStorage.setItem("closeMap", JSON.stringify(closeMap));
    }
  }, [closeMap]);

  return (
    <>
      <div className="w-6/12 mx-auto mt-4 relative">
        {closeMap ? (
          <button
            className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => setCloseMap(false)}
          >
            顯示地圖
          </button>
        ) : (
          <div className="rounded border-2">
            <Image src={map_path} loading="lazy" alt="map" />
            <button
              className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
              onClick={() => setCloseMap(true)}
            >
              關閉地圖
            </button>
          </div>
        )}
      </div>
    </>
  );
}
