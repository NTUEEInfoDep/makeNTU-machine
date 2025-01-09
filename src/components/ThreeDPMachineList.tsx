"use client";
import React, { useContext, useState, useEffect } from "react";
import RequestCardForMachine from "./RequestCardForMachine";
import { RequestContext } from "@/context/Request";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { FormControl, TableHead, TableRow } from "@mui/material";
import CommentDialog from "./CommentDialog";
import { request } from "http";
import { useRouter } from "next/navigation";
import FinishedDialog from "./FinishedDialog";
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
  const { requests } = useContext(RequestContext);
  const Button = require("@mui/material/Button").default;
  const router = useRouter();
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

  const tableCells = ["預約組別", "檔案名稱", "承重與否", "狀態", "備註"];
  return (
    <>
      <div className="flex-col content-start mb-6">
        <h1 className="text-2xl mb-2 font-semibold">機台編號 {index}</h1>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "400px", overflow: "auto" }}
        >
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableHead></TableHead>
            <TableBody>
              <TableRow key="head" className="bg-yellow-300">
                {tableCells.map((cell, index) => (
                  <TableCell key={index} className="font-bold text-center">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
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
        <TableContainer
          component={Paper}
          sx={{ width: "95%", maxHeight: "400px", overflow: "auto" }}
        >
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableHead></TableHead>
            <TableBody>
              {requestList?.map((request) =>
                request.machine === index && request.status === "製作中" ? (
                  <TableRow key={request.id}>
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
                      {request.status}
                      <Button
                        onClick={() => {
                          setDialogOpen(true);
                          setGroupID(request.id);
                          setName(request.groupname);
                        }}
                      >
                        完成
                      </Button>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {request.comment ? (
                        <button
                          onClick={() => {
                            setCommentDialogOpen(true);
                            setDialogString(request.comment);
                          }}
                        >
                          {request.comment}
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
