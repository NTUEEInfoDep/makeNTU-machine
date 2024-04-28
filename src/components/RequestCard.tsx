import React from "react";
import { Tab, TableCell } from "@mui/material";
import Table from '@mui/material/Table';
import  { TableRow } from "@mui/material";
import TableBody from '@mui/material/TableBody';

export type RequestCardProps = {
    information: {
        id: number;
        group: string;
        filename: string;
        material: number[];
        status: string;
        comment: string;
    };
    isSender?: boolean;
};

export default function RequestCard({ information, isSender }: RequestCardProps) {
    const materialList = ["3mm密集板","5mm密集板","3mm壓克力","5mm壓克力"]

    return (
        <>
            <Table>
                <TableBody>
                    <TableRow key={information.id}>
                        <TableCell>{information?.group}</TableCell>
                        <TableCell>{information?.filename}</TableCell>
                        <TableCell>{materialList[information?.material[1]]}</TableCell>
                        <TableCell>{information?.status}</TableCell>
                        <TableCell>{information?.comment}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}