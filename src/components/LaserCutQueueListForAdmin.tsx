"use client";
import { useState, useEffect } from "react";
// import { useContext } from "react";
// import { RequestContext } from "@/context/Request";
// import { AccountContext } from "@/context/Account";
import CommentDialog from "./CommentDialog";
import useLaserCutRequest from "@/hooks/useLaserCutRequest";
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
import { laserCutQueueListForAdminTableCells } from "@/constant/index";

type indRequestForAdmin = {
  id: number;
  groupname: number;
  machine: number;
  filename: string;
  material: string[];
  finalMaterial: string;
  status: string;
  comment: string;
  timeleft: Date;
};

type broadcastRequest = {
  id: number;
  finalMaterial: string;
};

export default function LaserCutQueueListForAdmin() {
  // const { requests } = useContext(RequestContext);
  // const { user } = useContext(AccountContext);
  const [requestList, setRequestList] = useState<indRequestForAdmin[]>();
  const {
    getLaserCutRequest,
    putLaserCutRequestMachine,
    putLaserCutRequestMaterial,
  } = useLaserCutRequest();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [dialogString, setDialogString] = useState("");

  useEffect(() => {
    const gReq = async () => {
      try {
        const requestListInit = await getLaserCutRequest();
        const requestListJson: indRequestForAdmin[] =
          requestListInit["dbresultReq"];
        setRequestList(requestListJson);
      } catch (e) {
        console.log(e);
      }
    };
    gReq();
  }, []);

  const handleMaterialChange = async (id: number, newFinalMaterial: string) => {
    const socket = io();

    try {
      await putLaserCutRequestMaterial({
        id,
        newFinalMaterial,
      });
      const broadcastChange: broadcastRequest = {
        id: id,
        finalMaterial: newFinalMaterial,
      };
      socket.emit("laserCutMaterial", broadcastChange);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMachineChange = async (id: number, newMachine: number) => {
    try {
      await putLaserCutRequestMachine({
        id,
        newMachine,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-10/12 mx-auto mb-6">
      <h1 className="text-2xl mb-2 font-semibold">申請列表</h1>
      <div className="flex justify-center">
        <TableContainer component={Paper} className="rounded-b-none">
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              <TableRow key="head" className="bg-yellow-300">
                {laserCutQueueListForAdminTableCells.map((cell) => (
                  <TableCell
                    key={cell}
                    sx={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="flex justify-center">
        <TableContainer
          component={Paper}
          className="rounded-none overflow-auto max-h-96"
        >
          <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
            <TableBody>
              {requestList?.map((request) => (
                <TableRow key={request.id}>
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
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "pre", textAlign: "center" }}>
                    {request.material.map((mat) => (
                      <p
                        className={
                          request.material.indexOf(mat) === 0
                            ? "text-red-400"
                            : ""
                        }
                        id={mat}
                        key={mat}
                      >
                        {request.material.indexOf(mat) + 1 + ". " + mat}
                      </p>
                    ))}
                  </TableCell>

                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        板材種類
                      </InputLabel>
                      <Select
                        defaultValue={request.finalMaterial}
                        label="板材種類"
                        onChange={(e) => {
                          handleMaterialChange(
                            request.id,
                            e.target.value as string,
                          );
                        }}
                      >
                        {request.material.map((eachMaterial) => (
                          <MenuItem value={eachMaterial} key={eachMaterial}>
                            {eachMaterial}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell className="text-center">
                    <StatusForAdmin
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
