import { useRouter } from "next/navigation";

export default function useThreeDPRequest() {
    const router = useRouter();

    //POST
    const postThreeDPRequest = async ({
        group,
        filename,
        loadBearing,
        material,
        comment,
      }: {
        group:string
        filename:string
        loadBearing: boolean,
        material:string[]
        comment?:string
      }) => {
        const res = await fetch("/api/reserveforThreeDP", {
          method: "POST",
          body: JSON.stringify({
            group,
            filename,
            loadBearing,
            material,
            comment,
          }),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error);
        }
        // router.refresh() is a Next.js function that refreshes the page without
        // reloading the page. This is useful for when we want to update the UI
        // from server components.
        router.refresh();
      };
    
    //GET
    const getThreeDPRequest = async () => {
      const res = await fetch("/api/reserveforThreeDP", {
        method: "GET",
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      router.refresh();
      return res.json();
    }
    
    //PUT
    const putThreeDPRequestStatus = async ({id, newStatus}:
      {id: number, newStatus: string}) => {
      const res = await fetch("/api/reserveforThreeDP", {
        method: "PUT",
        body: JSON.stringify({
          id,
          newStatus
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
      router.refresh();
    }

    const putThreeDPRequestMachine = async ({id, newMachine}:
      {id: number, newMachine: number}) => {
      console.log(newMachine)
        const res = await fetch("/api/reserveforThreeDP", {
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
    }

    const putThreeDPRequestTimeLeft = async ({id, newTimeLeft}:
      {id: number, newTimeLeft: Date}) => {
        const res = await fetch("/api/reserveforThreeDP", {
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
    }

    return {
      postThreeDPRequest,
      getThreeDPRequest,
      putThreeDPRequestStatus,
      putThreeDPRequestMachine,
      putThreeDPRequestTimeLeft
    };
}