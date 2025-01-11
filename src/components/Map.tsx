"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import map_path from "../../public/machineMap.png";

export default function Map() {
  return (
    <>
      <div className="w-6/12 mx-auto mt-4 relative">
        <div className="rounded border-2">
          <Image src={map_path} loading="lazy" alt="map" />
        </div>
      </div>
    </>
  );
}
