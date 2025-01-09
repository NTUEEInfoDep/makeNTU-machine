import React, { useState } from "react";
import CommentDialog from "./CommentDialog";
import StatusDialog from "./StatusDialog";

export type RequestCardProps = {
  information: {
    filename: string;
    type: string;
    comment: string;
    status: string;
  };
};

export default function RequestCard({ information }: RequestCardProps) {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const Button = require("@mui/material/Button").default;
  const setRequestDead = () => {};

  return (
    <>
      <div
        className="g-4 w-full h-12 flex items-center justify-between bg-white border-b-2 border-black"
        draggable="true"
      >
        <button
          className="ml-1 w-16 h-full hover:bg-gray-200"
          onClick={() => setStatusDialogOpen(true)}
        >
          <p className="text-lg font-bold">{information?.filename}</p>
        </button>
        <p className="m-2 text-lg font-bold">{information?.type}</p>
        <button
          className="ml-2 w-16 h-full hover:bg-gray-200"
          onClick={() => setCommentDialogOpen(true)}
        >
          <p className="text-lg font-bold whitespace-no-wrap overflow-hidden overflow-ellipsis">
            {information?.comment}
          </p>
        </button>
        <Button onClick={() => setCommentDialogOpen(true)}>
          <p className="text-lg font-bold whitespace-no-wrap overflow-hidden overflow-ellipsis">
            {information?.comment}
          </p>
        </Button>
        <button
          className="m-3 bg-white text-black hover:text-white hover:bg-red-600 rounded border-black border-2"
          onClick={() => setRequestDead()}
        >
          <p className="text-sm">dead</p>
        </button>
      </div>

      <CommentDialog
        open={commentDialogOpen}
        comment={information.comment}
        onClose={() => setCommentDialogOpen(false)}
      />
      <StatusDialog
        open={statusDialogOpen}
        status={information.status}
        onClose={() => setStatusDialogOpen(false)}
      />
    </>
  );
}
