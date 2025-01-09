"use client";
import { useState, useEffect } from "react";
import React, { useContext } from "react";
import { RequestContext } from "@/context/Request";
import { AccountContext } from "@/context/Account";
import RequestCardForAdmin from "./RequestCardForAdmin";
import CommentDialog from "./CommentDialog";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import StatusForAdmin from "@/components/StatusForAdmin";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { FormControl, TableHead, TableRow } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

type indRequestForAdmin = {
  id: number;
  groupname: number;
  machine: number;
  loadBearing: boolean;
  filename: string;
  material: string[];
  status: string;
  comment: string;
  timeleft: Date;
};

export default function ThreeDPQueueListForAdmin() {
  const { requests } = useContext(RequestContext);
  const { user } = useContext(AccountContext);
  const [requestList, setRequestList] = useState<indRequestForAdmin[]>();
  const {
    getThreeDPRequest,
    putThreeDPRequestMachine,
    putThreeDPRequestStatus,
  } = useThreeDPRequest();
  const testRequest = {
    filename: "test1",
    type: "3DP",
    comment: "test1",
    status: "waiting",
  };
  const Button = require("@mui/material/Button").default;
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [dialogString, setDialogString] = useState("");

  useEffect(() => {
    const gReq = async () => {
      try {
        const requestListInit = await getThreeDPRequest();
        const requestListJson: indRequestForAdmin[] =
          requestListInit["dbresultReq"];
        setRequestList(requestListJson);
      } catch (e) {
        console.log(e);
      }
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

  const tableCells = [
    "預約組別",
    "檔案名稱",
    "使用機台",
    "承重與否",
    "使用材料",
    "列印狀態",
    "備註",
  ];

  return (
    <div className="w-10/12 mx-auto mb-6">
      <h1 className="text-2xl mb-2 font-semibold">申請列表</h1>
      <div className="flex justify-center">
        <TableContainer component={Paper} className="rounded-b-none">
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
      <div className="flex w-full justify-center">
        <TableContainer
          component={Paper}
          className="rounded-none overflow-auto max-h-96"
        >
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              {requestList?.map((request) => (
                <TableRow key={request.id}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {String(request.groupname)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {request.filename}
                  </TableCell>

                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        機台編號
                      </InputLabel>
                      <Select
                        // labelId="demo-simple-select-label"
                        // id="demo-simple-select"
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

                  <TableCell sx={{ textAlign: "center" }}>
                    {request.loadBearing ? "是" : "否"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {request.material}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <StatusForAdmin
                      id={request.id}
                      initialState={request.status}
                      timeStarted={request.timeleft}
                      type="3dp"
                    ></StatusForAdmin>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <CommentDialog
        open={commentDialogOpen}
        comment={dialogString}
        onClose={() => setCommentDialogOpen(false)}
      />
    </div>
  );
}
