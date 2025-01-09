import React from "react";
import Map from "../components/Map";
import LaserCutQueueList from "../components/LaserCutQueueList";
import ThreeDPQueueList from "@/components/ThreeDPQueueList";

export default function Home() {
  return (
    <>
      <div className="bg-black overflow-auto">
        <Map />
        <LaserCutQueueList />
        <ThreeDPQueueList />
      </div>
    </>
  );
}
