"use client";
import React, { useContext, useEffect, useState } from "react";
import { RequestContext } from "@/context/Request";
import { AccountContext } from "@/context/Account";
import StatusForContestant from "./StatusForContestant";
import useRequest from "@/hooks/useLaserCutRequest";
import { usePathname } from "next/navigation";

import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";
import io from "socket.io-client";
import { laserCutQueueListTableCells } from "@/constant/index";

type indRequest = {
  id: number;
  groupname: number;
  filename: string;
  material: string[];
  finalMaterial: string;
  status: string;
  comment: string;
  timeleft: Date;
};

type broadcastStatusRequest = {
  id: number;
  status: string;
  timeCreated: Date;
};

type broadcastMaterialRequest = {
  id: number;
  finalMaterial: string;
};

export default function LaserCutQueueList() {
  const { requests, setRequests } = useContext(RequestContext);
  const { user } = useContext(AccountContext);
  const [requestList, setRequestList] = useState<indRequest[]>();
  const pathname = usePathname();
  const pathTemp = pathname.split("/");
  const group = pathTemp[2];

  const { getLaserCutRequest } = useRequest();

  useEffect(() => {
    const gReq = async () => {
      try {
        const requestListInit = await getLaserCutRequest();
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

    socket.on("laserCutQueue", (laserCutQueue: broadcastStatusRequest) => {
      if (requestList) {
        const updatedRequestList = requestList.map((request) => {
          if (request.id === laserCutQueue.id) {
            return {
              ...request,
              status: laserCutQueue.status,
              timeleft: laserCutQueue.timeCreated,
            };
          }
          return request;
        });

        setRequestList(updatedRequestList);
      }
    });

    socket.on(
      "laserCutMaterial",
      (laserCutMaterial: broadcastMaterialRequest) => {
        if (requestList) {
          const updatedRequestList = requestList.map((request) => {
            if (request.id === laserCutMaterial.id) {
              return {
                ...request,
                finalMaterial: laserCutMaterial.finalMaterial,
              };
            }
            return request;
          });

          setRequestList(updatedRequestList);
        }
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [requestList]);

  return (
    <div className="mb-2">
      <div className="flex items-center justify-center my-4">
        <h1 className="text-3xl font-bold text-yellow-400">雷切機等候列表</h1>
      </div>
      <div className="flex w-10/12 mx-auto justify-center">
        <TableContainer component={Paper} className="rounded-b-none">
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              <TableRow key="head" className="bg-yellow-300">
                {laserCutQueueListTableCells.map((cell) => (
                  <TableCell className="font-bold text-center" key={cell}>
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
                    {request.material.map((mat) => (
                      <p id={mat} key={mat}>
                        {request.material.indexOf(mat) + 1 + ". " + mat}
                      </p>
                    ))}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: "16px",
                    }}
                  >
                    {request.finalMaterial}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    <StatusForContestant
                      id={request.id}
                      initialState={request.status}
                      timeStarted={request.timeleft}
                      type="laser"
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
