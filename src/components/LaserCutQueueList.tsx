'use client'
import React, { useContext, useEffect, useState } from "react";
import { RequestContext } from "@/context/Request";
import { AccountContext } from "@/context/Account";
import StatusForContestant from "./StatusForContestant";
import useRequest from "@/hooks/useLaserCutRequest";
import { usePathname } from "next/navigation";

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
    material: string[]
    finalMaterial: string
    status: string
    comment: string
    timeleft: Date
}

type broadcastStatusRequest = {
    id: number
    status: string
    timeCreated: Date
}

type broadcastMaterialRequest = {
    id: number
    finalMaterial: string
}

export default function LaserCutQueueList() {      
    const { requests, setRequests } = useContext(RequestContext);
    const { user } = useContext(AccountContext);
    const [ requestList, setRequestList ] = useState<indRequest[]>();
    const pathname = usePathname();
    const pathTemp = pathname.split("/");
    const group = pathTemp[2];
      
    const { getLaserCutRequest } = useRequest();
    
    useEffect(() => {
        const gReq = async () => {
            try{
                const requestListInit = await getLaserCutRequest();
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

        socket.on('laserCutQueue', (laserCutQueue: broadcastStatusRequest) => {
            if (requestList) {
                const updatedRequestList = requestList.map((request) => {
                    if (request.id === laserCutQueue.id) {
                        return { ...request, status: laserCutQueue.status, timeleft: laserCutQueue.timeCreated };
                    }
                    return request;
                });

                setRequestList(updatedRequestList);
            }
        });

        socket.on('laserCutMaterial', (laserCutMaterial: broadcastMaterialRequest) => {
            if (requestList) {
                const updatedRequestList = requestList.map((request) => {
                    if (request.id === laserCutMaterial.id) {
                        return { ...request, finalMaterial: laserCutMaterial.finalMaterial };
                    }
                    return request;
                });

                setRequestList(updatedRequestList);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [requestList]);

    return (
        <>
        <div className="h-10 m-2 flex items-center justify-center cursor-pointer">
            <h1 className="text-3xl font-bold text-yellow-400">雷切機等候列表</h1>
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
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>板材志願序</TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>最終板材</TableCell>
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
                            <TableRow className={String(request.groupname)===group ? "bg-gray-300" : "" } key={request.id}>
                                <TableCell sx={{textAlign: 'center'}}>{String(request.groupname)}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>{request.filename}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    {request.material.map((mat)=>
                                            (<p id={mat} key={mat}>
                                                {(request.material.indexOf(mat)+1)+'. '+mat}
                                            </p>))}
                                </TableCell>
                                <TableCell sx={{textAlign: 'center', color: '#f97316', fontWeight: 'bold'}}>{request.finalMaterial}</TableCell>
                                <TableCell sx={{textAlign: 'center'}}>
                                    <StatusForContestant id={request.id} initialState={request.status} timeStarted={request.timeleft} type="laser"></StatusForContestant>
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
        <div className="h-5"></div>
        </>
    )
}