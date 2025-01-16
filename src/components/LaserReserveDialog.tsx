import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import useLaserCutRequest from "@/hooks/useLaserCutRequest";
import { useRouter } from "next/navigation";
import type {
  broadcastNewLaserCutReserveRequest,
  LaserReserveDialogProps,
} from "@/shared/types";
import io from "socket.io-client";

function LaserReserveDialog({
  open,
  group,
  material,
  filename,
  comment,
  onClose,
}: LaserReserveDialogProps) {
  const { postLaserCutRequest } = useLaserCutRequest();
  const router = useRouter();

  const handleSubmit = async (
    group: string,
    material: string[],
    filename: string,
    comment: string,
  ) => {
    const socket = io();
    try {
      await postLaserCutRequest({
        group,
        filename,
        material,
        comment,
      });
      const broadcastChange: broadcastNewLaserCutReserveRequest = {
        groupname: group,
        filename: filename,
        material: material,
        comment: comment,
      };
      socket.emit("newLaserCutReserveRequest", broadcastChange);
    } catch (e) {
      console.error(e);
    }
    router.refresh();
    router.push(`/contestant/${group}`);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>以下是您即將預約的雷切內容</DialogTitle>
        <DialogContent className="w-full">
          <p className="text-base">組別：{group}</p>
          <p className="text-base">
            板材志願序：
            {material.map((mat) => (
              <p key={mat}>{material.indexOf(mat) + 1 + ". " + mat}</p>
            ))}
          </p>
          <p className="text-base">檔名：{filename}</p>
          <p className="text-base mb-5">
            備註：{comment === "" ? "無" : comment}
          </p>
          <p className="text-base">確認無誤後，請按下確定，並預祝比賽順利!</p>
        </DialogContent>
        <DialogActions>
          <button
            className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="m-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleSubmit(group, material, filename, comment)}
          >
            確定
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LaserReserveDialog;
