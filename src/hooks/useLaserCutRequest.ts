import { useRouter } from "next/navigation";

export default function useLaserCutRequest() {
  const router = useRouter();

  //POST
  const postLaserCutRequest = async ({
    group,
    filename,
    material,
    comment,
  }: {
    group: string;
    filename: string;
    material: string[];
    comment?: string;
  }) => {
    const res = await fetch("/api/reserveforLaser", {
      method: "POST",
      body: JSON.stringify({
        group,
        filename,
        material,
        comment,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
  };

  //GET
  const getLaserCutRequest = async () => {
    const res = await fetch("/api/reserveforLaser", {
      method: "GET",
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
    return res.json();
  };

  //PUT
  const putLaserCutRequestStatus = async ({
    id,
    newStatus,
  }: {
    id: number;
    newStatus: string;
  }) => {
    const res = await fetch("/api/reserveforLaser", {
      method: "PUT",
      body: JSON.stringify({
        id,
        newStatus,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
  };

  const putLaserCutRequestMachine = async ({
    id,
    newMachine,
  }: {
    id: number;
    newMachine: number;
  }) => {
    const res = await fetch("/api/reserveforLaser", {
      method: "PUT",
      body: JSON.stringify({
        id,
        newMachine,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
  };

  const putLaserCutRequestMaterial = async ({
    id,
    newFinalMaterial,
  }: {
    id: number;
    newFinalMaterial: string;
  }) => {
    const res = await fetch("/api/reserveforLaser", {
      method: "PUT",
      body: JSON.stringify({
        id,
        newFinalMaterial,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
  };

  const putLaserCutRequestTimeLeft = async ({
    id,
    newTimeLeft,
  }: {
    id: number;
    newTimeLeft: Date;
  }) => {
    console.log("time changed");
    const res = await fetch("/api/reserveforLaser", {
      method: "PUT",
      body: JSON.stringify({
        id,
        newTimeLeft,
      }),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }
    router.refresh();
  };

  return {
    postLaserCutRequest,
    getLaserCutRequest,
    putLaserCutRequestStatus,
    putLaserCutRequestMachine,
    putLaserCutRequestMaterial,
    putLaserCutRequestTimeLeft,
  };
}
