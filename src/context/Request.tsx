"use client";
import { createContext, useEffect, useState } from "react";

export type Request = {
  id: number;
  group: string;
  type: string;
  number: number;
  filename: string;
  comment: string;
  status: string;
  createAt: Date;
};

export type RequestContext = {
  requests: Request[];
  setRequests: (requests: Request[]) => void;
  sendRequest: (
    request: Omit<Request, "id" | "number" | "status" | "createAt">,
  ) => Promise<void>;
};

export const RequestContext = createContext<RequestContext>({
  requests: [],
  setRequests: () => {},
  sendRequest: async () => {},
});

type Props = {
  children: React.ReactNode;
};
export const RequestProvider = async ({ children }: Props) => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch("/api/reserve", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data?.messages) {
          setRequests(data.messages);
          console.log(data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRequest();
  }, []);

  const sendRequest = async (
    request: Omit<Request, "id" | "number" | "status" | "createAt">,
  ) => {
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RequestContext.Provider value={{ requests, setRequests, sendRequest }}>
      {children}
    </RequestContext.Provider>
  );
};
