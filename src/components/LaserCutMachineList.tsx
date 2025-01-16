"use client";
import { useState, useEffect } from "react";
import useLaserCutRequest from "@/hooks/useLaserCutRequest";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";
import CommentDialog from "./CommentDialog";
import FinishedDialog from "./FinishedDialog";
import { laserCutMachineListTableCells } from "@/constant/index";
import type {
  MachineListProps,
  broadcastMaterialRequest,
  broadcastStatusRequest,
  indRequestForLaserCut,
} from "@/shared/types";
import { io } from "socket.io-client";

function LaserCutMachineList({ index }: MachineListProps) {
  const {
    getLaserCutRequest,
    // putLaserCutRequestMachine,
    // putLaserCutRequestMaterial,
    // putLaserCutRequestStatus,
  } = useLaserCutRequest();

  const [requestList, setRequestList] = useState<indRequestForLaserCut[]>();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogString, setDialogString] = useState("");
  const [name, setName] = useState(0);
  const [groupID, setGroupID] = useState(0);

  useEffect(() => {
    const gReq = async () => {
      try {
        const requestListInit = await getLaserCutRequest();
        const requestListJson: indRequestForLaserCut[] =
          requestListInit["dbresultReq"];
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
    <>
      <div className="flex-col w-10/12 mx-auto justify-center mb-4">
        <h1 className="text-2xl mb-2 font-semibold">機台編號 {index}</h1>
        <TableContainer component={Paper} className="rounded-b-none">
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              <TableRow key="head" className="bg-yellow-300">
                {laserCutMachineListTableCells.map((cell, index) => (
                  <TableCell
                    key={index}
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer
          component={Paper}
          className="rounded-none overflow-auto max-h-96"
        >
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              {requestList?.map((request) =>
                request.machine === index &&
                request.status === "製作中" &&
                (request.finalMaterial === "3mm密集板" ||
                  request.finalMaterial === "5mm密集板" ||
                  request.finalMaterial === "3mm壓克力" ||
                  request.finalMaterial === "5mm壓克力") ? (
                  <TableRow key={request.id}>
                    <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                      {request.groupname}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                      {request.filename}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                      {request.finalMaterial}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                      {request.status}
                      <button
                        className="mx-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                          setDialogOpen(true);
                          setGroupID(request.id);
                          setName(request.groupname);
                        }}
                      >
                        完成
                      </button>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                      {request.comment ? (
                        <button
                          onClick={() => {
                            setCommentDialogOpen(true);
                            setDialogString(request.comment);
                          }}
                        >
                          {request.comment.slice(0, 13) + "..."}
                        </button>
                      ) : (
                        "無"
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  ""
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <CommentDialog
          open={commentDialogOpen}
          comment={dialogString}
          onClose={() => setCommentDialogOpen(false)}
        />
        <FinishedDialog
          open={dialogOpen}
          groupName={name}
          id={groupID}
          onClose={() => setDialogOpen(false)}
          type="laser"
        />
      </div>
    </>
  );
}

export default LaserCutMachineList;
