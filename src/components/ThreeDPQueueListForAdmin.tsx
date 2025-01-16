"use client";
import { useState, useEffect } from "react";
import CommentDialog from "./CommentDialog";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import StatusForAdmin from "@/components/StatusForAdmin";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { FormControl, TableRow } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import io from "socket.io-client";
import { threeDPQueueListForAdminTableCells } from "@/constant/index";
import type {
  broadcastNewThreeDPReserveRequest,
  broadcastStatusRequest,
  indRequestForThreeDPQueueForAdmin,
} from "@/shared/types";
import LoaderSpinner from "./LoaderSpinner";
import ColorExplain from "./ColorExplain";
import { statuses } from "@/constant/index";
import { useRouter } from "next/navigation";

function ThreeDPQueueListForAdmin() {
  const router = useRouter();
  const [requestList, setRequestList] =
    useState<indRequestForThreeDPQueueForAdmin[]>();
  const {
    getThreeDPRequest,
    putThreeDPRequestMachine,
    // putThreeDPRequestStatus,
  } = useThreeDPRequest();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [dialogString, setDialogString] = useState("");
  const [loading, setLoading] = useState(false);
  const statusToBgColor = [
    "bg-white",
    "bg-gray-100",
    "bg-red-100",
    "bg-orange-100",
    "bg-green-100",
  ];

  const mapStatusToBgColor = (status: string) => {
    return statusToBgColor[statuses.indexOf(status)];
  };

  useEffect(() => {
    const gReq = async () => {
      setLoading(true);
      try {
        const requestListInit = await getThreeDPRequest();
        const requestListJson: indRequestForThreeDPQueueForAdmin[] =
          requestListInit["dbresultReq"];
        setRequestList(requestListJson);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    gReq();
  }, []);

  const handleMachineChange = async (id: number, newMachine: number) => {
    try {
      await putThreeDPRequestMachine({
        id,
        newMachine,
      });
    } catch (e) {
      console.error(e);
    }
  };

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
            const requestListJson: indRequestForThreeDPQueueForAdmin[] =
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
    <div className="w-10/12 mx-auto mb-6">
      <div className="flex flex-row items-center mb-2 gap-4">
        <h1 className="text-2xl font-semibold">申請列表</h1>
        <ColorExplain />
      </div>
      <div className="flex justify-center">
        <TableContainer component={Paper} className="rounded-b-none">
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              <TableRow key="head" className="bg-yellow-300">
                {threeDPQueueListForAdminTableCells.map((cell) => (
                  <TableCell key={cell} className="font-bold text-center">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="flex w-full justify-center">
        <TableContainer
          component={Paper}
          className="rounded-none overflow-auto max-h-96"
        >
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              {requestList?.map((request) => (
                <TableRow
                  key={request.id}
                  className={mapStatusToBgColor(request.status)}
                >
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {String(request.groupname)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {request.filename}
                  </TableCell>

                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        機台編號
                      </InputLabel>
                      <Select
                        defaultValue={String(request.machine)}
                        label="機台編號"
                        onChange={(e) => {
                          handleMachineChange(
                            request.id,
                            Number(e.target.value),
                          );
                        }}
                      >
                        <MenuItem value={0}>未安排</MenuItem>
                        <MenuItem value={1}>{Number(1)}</MenuItem>
                        <MenuItem value={2}>{Number(2)}</MenuItem>
                        <MenuItem value={3}>{Number(3)}</MenuItem>
                        <MenuItem value={4}>{Number(4)}</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {request.loadBearing ? "是" : "否"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    {request.material}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center", fontSize: "16px" }}>
                    <StatusForAdmin
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
    </div>
  );
}

export default ThreeDPQueueListForAdmin;
