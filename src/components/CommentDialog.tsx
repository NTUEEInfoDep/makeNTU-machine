import { Dialog, DialogContent } from "@mui/material";
import { Separator } from "@/components/ui/Separator";

export type CommentDialogProps = {
  open: boolean;
  comment: string;
  onClose: () => void;
};

export default function CommentDialog({
  open,
  comment,
  onClose,
}: CommentDialogProps) {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogContent className="w-96 h-40">
          <div className="m-1 w-full flex flex-col items-top justify-center">
            <p className="text-xl font-bold">備註</p>
          </div>
          <Separator />
          <div className="m-1 mt-4 w-full flex flex-col items-top justify-center">
            <p className="text-base" style={{ wordWrap: "break-word" }}>
              {comment}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
