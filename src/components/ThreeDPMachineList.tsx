"use client";
import { useState, useEffect } from "react";
// import { useContext } from "react";
// import RequestCardForMachine from "./RequestCardForMachine";
// import { RequestContext } from "@/context/Request";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableRow } from "@mui/material";
import CommentDialog from "./CommentDialog";
// import { request } from "http";
// import { useRouter } from "next/navigation";
import FinishedDialog from "./FinishedDialog";
import { threeDPMachineListTableCells } from "@/constant/index";

export type MachineListProps = {
  index: number;
};

export type indRequestForMachine = {
  id: number;
  groupname: number;
  machine: number;
  loadBearing: boolean;
  filename: string;
  status: string;
  comment: string;
};

export default function ThreeDPMachineList({ index }: MachineListProps) {
  // const { requests } = useContext(RequestContext);
  // const router = useRouter();
  const { getThreeDPRequest, putThreeDPRequestStatus } = useThreeDPRequest();

  const [requestList, setRequestList] = useState<indRequestForMachine[]>();

  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogString, setDialogString] = useState("");
  const [name, setName] = useState(0);
  const [groupID, setGroupID] = useState(0);

  useEffect(() => {
    const gReq = async () => {
      try {
        const requestListInit = await getThreeDPRequest();
        const requestListJson: indRequestForMachine[] =
          requestListInit["dbresultReq"];
        setRequestList(requestListJson);
      } catch (e) {
        console.log(e);
      }
    };
    gReq();
  }, []);

  return (
    <>
      <div className="flex-col w-10/12 mx-auto justify-center mb-4">
        <h1 className="text-2xl mb-2 font-semibold">機台編號 {index}</h1>
        <TableContainer component={Paper} className="rounded-b-none">
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              <TableRow key="head" className="bg-yellow-300">
                {threeDPMachineListTableCells.map((cell, index) => (
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
                request.machine === index && request.status === "製作中" ? (
                  <TableRow key={request.id}>
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
                      {request.status}
                      <button
                        className="m-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
          type="3dp"
        />
      </div>
    </>
  );
}
