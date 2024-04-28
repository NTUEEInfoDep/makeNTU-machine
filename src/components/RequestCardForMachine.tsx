import React, { useState } from "react";
import CommentDialog from "./CommentDialog";

export type RequestCardProps = {
    information: {
        filename: string;
        type: string;
        comment: string;
        status: string;
    };
};

export default function RequestCardForMachine({ information }: RequestCardProps) {
    const [ dialogOpen , setDialogOpen ] = useState(false);

    const setRequestFinished = async() => {

    }

    return (
        <>
        <div className="g-3 w-full h-12 flex items-center justify-between bg-white border-b-2 border-black">
            <p className="ml-2">{information?.filename}</p>
            <button
                className="ml-5 w-12 h-full hover:bg-gray-200"
                onClick={() => setDialogOpen(true)}
            >
                <p className="whitespace-no-wrap overflow-hidden overflow-ellipsis">{information?.comment}</p>
            </button>
            <button
                className="m-0.5 bg-white text-black hover:text-white hover:bg-green-600 rounded border-black border-2"
                onClick={() => setRequestFinished()}
            >
                <p className="text-sm">finished</p>
            </button>
        </div>
            
        <CommentDialog open={dialogOpen} comment={information.comment} onClose={() => setDialogOpen(false)}/>
        </>
    )
}