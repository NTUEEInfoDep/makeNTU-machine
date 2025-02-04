import { Dialog, DialogContent } from "@mui/material";
import { Separator } from "@/components/ui/Separator";
import type { StatusDialogProps } from "@/shared/types";

function StatusDialog({ open, status, onClose }: StatusDialogProps) {
  const handleClick = (index: number) => {
    console.log(`機台${index + 1}`);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogContent className="w-96 h-40">
          <div className="mb-1 w-full flex flex-col items-top justify-center">
            <p className="text-lg font-bold">分配機台</p>
          </div>
          <Separator />
          <div className="mt-1 w-full g-4 flex items-top justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <button
                key={i}
                className="m-1 w-16 h-16 flex items-center justify-center rounded bg-white hover:bg-gray-200"
                onClick={() => handleClick(i)}
              >
                <p className="text-lg font-bold">機台{i + 1}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StatusDialog;
