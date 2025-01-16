"use client";
import { useEffect, useState } from "react";
import StatusForContestant from "./StatusForContestant";
import useRequest from "@/hooks/useThreeDPRequest";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";
import io from "socket.io-client";
import { threeDPQueueListTableCells } from "@/constant/index";
import CommentDialog from "./CommentDialog";
import type {
  indRequestForThreeDPQueue,
  broadcastStatusRequest,
  broadcastNewThreeDPReserveRequest,
} from "@/shared/types";
import LoaderSpinner from "./LoaderSpinner";

function ThreeDPQueueListForContestant() {
  const router = useRouter();
  const [requestList, setRequestList] = useState<indRequestForThreeDPQueue[]>();
  const pathname = usePathname();
  const pathTemp = pathname.split("/");
  const groupname = pathTemp[2];
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [dialogString, setDialogString] = useState("");
  const [loading, setLoading] = useState(false);

  const { getThreeDPRequest } = useRequest();

  useEffect(() => {
    const gReq = async () => {
      setLoading(true);
      try {
        const requestListInit = await getThreeDPRequest();
        const requestListJson: indRequestForThreeDPQueue[] =
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

    socket.on("threeDPQueue", (threeDPQueue: broadcastStatusRequest) => {
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

    socket.on(
      "newThreeDPReserveRequest",
      (_: broadcastNewThreeDPReserveRequest) => {
        const gReq = async () => {
          try {
            const requestListInit = await getThreeDPRequest();
            const requestListJson: indRequestForThreeDPQueue[] =
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
                    String(request.groupname) === groupname
                      ? "bg-yellow-100"
                      : "bg-white"
                  }
                  key={request.id}
                >
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {String(request.groupname)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {request.filename}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {request.loadBearing ? "是" : "否"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {request.material}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    <StatusForContestant
                      id={request.id}
                      initialState={request.status}
                      timeStarted={request.timeleft}
                      type="3dp"
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
    </>
  );
}

export default ThreeDPQueueListForContestant;
