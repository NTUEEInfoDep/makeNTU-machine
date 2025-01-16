"use client";
import { useState, useEffect } from "react";
import StatusForContestant from "./StatusForContestant";
import useRequest from "@/hooks/useLaserCutRequest";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";
import io from "socket.io-client";
import { laserCutQueueListTableCells } from "@/constant/index";
import CommentDialog from "./CommentDialog";
import type {
  indRequestForLaserCutQueue,
  broadcastStatusRequest,
  broadcastMaterialRequest,
  broadcastNewLaserCutReserveRequest,
} from "@/shared/types";
import LoaderSpinner from "./LoaderSpinner";
import { useRouter } from "next/navigation";

function LaserCutQueueList() {
  const router = useRouter();
  const [requestList, setRequestList] =
    useState<indRequestForLaserCutQueue[]>();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [dialogString, setDialogString] = useState("");
  const [loading, setLoading] = useState(false);

  const { getLaserCutRequest } = useRequest();

  useEffect(() => {
    const gReq = async () => {
      setLoading(true);
      try {
        const requestListInit = await getLaserCutRequest();
        const requestListJson: indRequestForLaserCutQueue[] =
          requestListInit["dbresultReq"];
        setRequestList(requestListJson);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
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

    socket.on(
      "newLaserCutReserveRequest",
      (_: broadcastNewLaserCutReserveRequest) => {
        const gReq = async () => {
          try {
            const requestListInit = await getLaserCutRequest();
            const requestListJson: indRequestForLaserCutQueue[] =
              requestListInit["dbresultReq"];
            setRequestList(requestListJson);
          } catch (e) {
            console.log(e);
          }
        };
        gReq();
        router.refresh();
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [requestList]);

  if (loading) {
    return <LoaderSpinner />;
  }

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
                <TableRow className="bg-white" key={request.id}>
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
                    />
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CommentDialog
          open={commentDialogOpen}
          comment={dialogString}
          onClose={() => setCommentDialogOpen(false)}
        />
      </div>
    </div>
  );
}

export default LaserCutQueueList;
