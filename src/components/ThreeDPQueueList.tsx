"use client";
import React, { useContext, useEffect, useState } from "react";
import { RequestContext } from "@/context/Request";
import { AccountContext } from "@/context/Account";
import StatusForContestant from "./StatusForContestant";
import useRequest from "@/hooks/useThreeDPRequest";
import { usePathname } from "next/navigation";

import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";
import io from "socket.io-client";
import { threeDPQueueListTableCells } from "@/constant/index";

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

export default function ThreeDPQueueList() {
  const { requests, setRequests } = useContext(RequestContext);
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

  return (
    <div className="mb-2">
      <div className="flex items-center justify-center my-4">
        <h1 className="text-3xl font-bold text-yellow-400">3DP等候列表</h1>
      </div>
      <div className="flex w-10/12 mx-auto justify-center">
        <TableContainer component={Paper} className="rounded-b-none">
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              <TableRow key="head" className="bg-yellow-300">
                {threeDPQueueListTableCells.map((cell) => (
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
                    String(request.groupname) === group ? "bg-gray-300" : ""
                  }
                  key={request.id}
                >
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {String(request.groupname)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {request.filename}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {request.loadBearing ? "是" : "否"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {request.material}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    <StatusForContestant
                      id={request.id}
                      initialState={request.status}
                      timeStarted={request.timeleft}
                      type="3dp"
                    ></StatusForContestant>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {request.comment === "" ? "無" : request.comment}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
