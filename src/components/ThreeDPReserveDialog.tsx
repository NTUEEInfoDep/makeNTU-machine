import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import { useRouter } from "next/navigation";
import type {
  broadcastNewThreeDPReserveRequest,
  ThreeDPReserveDialogProps,
} from "@/shared/types";
import io from "socket.io-client";

function ThreeDPReserveDialog({
  open,
  group,
  filename,
  material,
  loadBearing,
  comment,
  onClose,
}: ThreeDPReserveDialogProps) {
  const { postThreeDPRequest } = useThreeDPRequest();
  const router = useRouter();

  const handleSubmit = async (
    group: string,
    filename: string,
    material: string[],
    loadBearing: boolean,
    comment: string,
  ) => {
    const socket = io();
    try {
      await postThreeDPRequest({
        group,
        filename,
        material,
        loadBearing,
        comment,
      });
      const broadcastChange: broadcastNewThreeDPReserveRequest = {
        groupname: group,
        filename: filename,
        material: material,
        loadBearing: loadBearing,
        comment: comment,
      };
      socket.emit("newThreeDPReserveRequest", broadcastChange);
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
        <DialogTitle>以下是您即將預約的3D列印內容</DialogTitle>
        <DialogContent className="w-full">
          <p className="text-base">組別：{group}</p>
          <p className="text-base">材料：{material}</p>
          <p className="text-base">檔名：{filename}</p>
          <p className="text-base">支撐材：{loadBearing ? "需要" : "不需要"}</p>
          <p className="text-base mb-5">
            備註：{comment === "" ? "無" : comment}
          </p>
          <p className="text-base">確認無誤後，請按下確認，並預祝比賽順利!</p>
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
            onClick={() =>
              handleSubmit(group, filename, material, loadBearing, comment)
            }
          >
            確定
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ThreeDPReserveDialog;
