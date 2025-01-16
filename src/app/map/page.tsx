"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import mapURL from "../../../public/machineMap.png";
import LoaderSpinner from "@/components/LoaderSpinner";

function MapPage() {
  const router = useRouter();

  if (!mapURL) {
    return <LoaderSpinner />;
  }

  return (
    <div className="flex flex-col gap-2 mt-10 w-8/12 mx-auto items-center justify-center">
      <div className="relative">
        <Image
          src={mapURL}
          loading="lazy"
          alt="map"
          className="rounded border-2"
        />
        <button
          className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
          onClick={() => {
            router.back();
          }}
        >
          離開
        </button>
      </div>
    </div>
  );
}

export default MapPage;
