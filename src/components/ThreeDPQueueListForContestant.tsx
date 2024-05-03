'use client'
import React, { useContext, useEffect, useState } from "react";
import { RequestContext } from "@/context/Request";
import { AccountContext } from "@/context/Account";
import StatusForContestant from "./StatusForContestant"; 
import useRequest from "@/hooks/useThreeDPRequest";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { TableHead, TableRow } from "@mui/material";
import io from 'socket.io-client';

type indRequest = {
    id: number
    groupname: number
    filename: string
    loadBearing: boolean
    material: string[]
    status: string
    comment: string
    timeleft: Date
}

type broadcastRequest = {
    id: number
    status: string
    timeCreated: Date
}

export default function ThreeDPQueueListForContestant() {      
    const { requests, setRequests } = useContext(RequestContext);
    const router = useRouter();
    const { user } = useContext(AccountContext);
    const [ requestList, setRequestList ] = useState<indRequest[]>();
    const pathname = usePathname();
    const pathTemp = pathname.split("/");
    const group = pathTemp[2];
      
    const { getThreeDPRequest } = useRequest();
    
    useEffect(() => {
        const gReq = async () => {
            try{
                const requestListInit = await getThreeDPRequest();
                const requestListJson: indRequest[] = requestListInit["dbresultReq"];
                setRequestList(requestListJson);
            }
            catch(e){
                console.log(e);
            }
        }
        gReq();
    }, []);

    useEffect(() => {
        const socket = io();

        socket.on('threeDPQueue', (threeDPQueue: broadcastRequest) => {
            if (requestList) {
                const updatedRequestList = requestList.map((request) => {
                    if (request.id === threeDPQueue.id) {
                        return { ...request, status: threeDPQueue.status, timeleft: threeDPQueue.timeCreated };
                    }
                    return request;
                });

                setRequestList(updatedRequestList);
            }
        })

        return () => {
            socket.disconnect();
        };
    }, [requestList]);

    return (
        <>
        <div className="h-10 m-2 flex items-center justify-center cursor-pointer">
            <h1 className="text-3xl font-bold text-yellow-400">3DP等候列表</h1>
            <button 
                    className="m-4 bg-yellow-500 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded"
                    onClick={() => router.push(`${pathname}/threedpreserve`)}>3DP登記</button>
        </div>
        <div className="h-3"></div>
        <div className="flex w-full justify-center">
            <TableContainer component={Paper} sx={{width: '80%', maxHeight: '400px', overflow: 'auto'}}>
                <Table aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        <TableRow key="head" className="bg-yellow-300">
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>預約組別</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>檔案名稱</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>承重與否</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>使用材料</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>列印狀態</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>備註</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div className="flex w-full justify-center">
            <TableContainer component={Paper} sx={{width: '80%', maxHeight: '400px', overflow: 'auto'}}>
                <Table aria-label="simple table" style={{tableLayout: 'fixed'}}>
                    <TableHead>
                    </TableHead>
                    <TableBody>
                        {
                            requestList?.map((request)=>(
                            <TableRow className={String(request.groupname)===group ? "bg-yellow-100" : "" } key={request.id}>
                                <TableCell sx={{textAlign: 'center'}}>{String(request.groupname)}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.filename}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.loadBearing? "是" : "否"}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.material}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <StatusForContestant id={request.id} initialState={request.status} timeStarted={request.timeleft} type="3dp"></StatusForContestant>
                                </TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.comment}</TableCell>
                            </TableRow>
                                )
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        <div className="h-5 bg-black"></div>
        </>
    )
}