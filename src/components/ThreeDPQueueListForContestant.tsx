"use client";
import React, { useContext, useEffect, useState } from "react";
import { RequestContext } from "@/context/Request";
import { AccountContext } from "@/context/Account";
import StatusForContestant from "./StatusForContestant";
import useRequest from "@/hooks/useThreeDPRequest";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableHead, TableRow } from "@mui/material";
import io from "socket.io-client";

type indRequest = {
  id: number;
  groupname: number;
  filename: string;
  loadBearing: boolean;
  material: string[];
  status: string;
  comment: string;
  timeleft: Date;
};

type broadcastRequest = {
  id: number;
  status: string;
  timeCreated: Date;
};

export default function ThreeDPQueueListForContestant() {
  const { requests, setRequests } = useContext(RequestContext);
  const router = useRouter();
  const { user } = useContext(AccountContext);
  const [requestList, setRequestList] = useState<indRequest[]>();
  const pathname = usePathname();
  const pathTemp = pathname.split("/");
  const group = pathTemp[2];

  const { getThreeDPRequest } = useRequest();

  useEffect(() => {
    const gReq = async () => {
      try {
        const requestListInit = await getThreeDPRequest();
        const requestListJson: indRequest[] = requestListInit["dbresultReq"];
        setRequestList(requestListJson);
      } catch (e) {
        console.log(e);
      }
    };
    gReq();
  }, []);

  useEffect(() => {
    const socket = io();

    socket.on("threeDPQueue", (threeDPQueue: broadcastRequest) => {
      if (requestList) {
        const updatedRequestList = requestList.map((request) => {
          if (request.id === threeDPQueue.id) {
            return {
              ...request,
              status: threeDPQueue.status,
              timeleft: threeDPQueue.timeCreated,
            };
          }
          return request;
        });

        setRequestList(updatedRequestList);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [requestList]);

  const tableCells = [
    "預約組別",
    "檔案名稱",
    "承重與否",
    "使用材料",
    "列印狀態",
    "備註",
  ];

  return (
    <>
      <div className="flex items-center justify-center">
        <h1 className="text-3xl font-bold text-yellow-400">3DP等候列表</h1>
        <button
          className="m-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
          onClick={() => router.push(`${pathname}/threedpreserve`)}
        >
          登記
        </button>
      </div>
      <div className="flex w-10/12 mx-auto justify-center">
        <TableContainer component={Paper}>
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              <TableRow key="head" className="bg-yellow-300">
                {tableCells.map((cell) => (
                  <TableCell key={cell} className="font-bold text-center">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="flex w-10/12 mx-auto justify-center">
        <TableContainer
          component={Paper}
          className="rounded-none overflow-auto max-h-96"
        >
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              {requestList?.map((request) => (
                <TableRow
                  className={
                    String(request.groupname) === group ? "bg-yellow-100" : ""
                  }
                  key={request.id}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {String(request.groupname)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {request.filename}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {request.loadBearing ? "是" : "否"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {request.material}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <StatusForContestant
                      id={request.id}
                      initialState={request.status}
                      timeStarted={request.timeleft}
                      type="3dp"
                    ></StatusForContestant>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {request.comment}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="h-5 bg-black"></div>
    </>
  );
}
