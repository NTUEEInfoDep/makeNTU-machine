"use client"
import React, { useState, useRef, useContext, useEffect } from "react";
import InputArea from "@/components/ui/InputArea";
import { Checkbox } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { AccountContext } from "@/context/Account";
import { RequestContext } from "@/context/Request";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useLaserCutRequest from "@/hooks/useLaserCutRequest";
import LaserReserveDialog from "@/components/LaserReserveDialog";

export default function useReserve() {
    const { user } = useContext(AccountContext);
    const { sendRequest } = useContext(RequestContext);
    const router = useRouter();
    const pathname = usePathname();
    const secretkey : string = process.env.PASSWORD_SECRET ? process.env.PASSWORD_SECRET : "Secret";
    const [filename, setFilename] = useState("");
    const [comment, setComment] = useState("");
    const [falseTitle, setFalseTitle] = useState(false);
    const [tooLong, setTooLong] = useState(false);
    const [NoteTooLong, setNoteTooLong] = useState(false);
    const [material, setMaterial] = useState(["3mm密集板","5mm密集板","3mm壓克力"]);
    const [materialBackUp, setMaterialBackUp] = useState(["3mm密集板","5mm密集板","3mm壓克力"]);
    const [customized, setCustomized] = useState(false);
    const [open, setOpen] = useState(false);

    function decodeJWT(token: string): Record<string, any> | null {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null; // Invalid JWT format
        }
        const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
        return JSON.parse(payload);
    }
    useEffect(() => {
        const token = localStorage.getItem("jwt-token: ");
        if (!token) {
            alert("You are not logged in.");
            router.push("/login");
        } else {
            const decodedPayload = decodeJWT(token);
            const permission = decodedPayload?.permission;
            const username = decodedPayload?.username;
            const currPath = pathname.split('/').slice(-2)[0];
            if(!permission || permission !== "contestant" || !username || username !== currPath) {
                router.push("/login");
                alert("權限錯誤，請重新登入");
            }
        }
    })

    const pathTemp = pathname.split("/");
    const switchCase = function(){
        if (customized===false){
            setCustomized(true);
            setMaterial(["自訂"]);
        }
        else{
            setCustomized(false);
            setMaterial(materialBackUp);
        }
    }
    const handleSubmit = async () => {
        if(!filename) {
            setFalseTitle(true);
            return;
        }
        else {
            setFalseTitle(false);
        }
        
        if(filename.length > 15) {
            setTooLong(true);
            return;
        }
        else {
            setTooLong(false);
        }
        
        if(comment.length > 60) {
            setNoteTooLong(true);
            return;
        }

        setOpen(true);
    }
    
    return (
        <div className="p-5 text-lg flex flex-col items-center justify-center justify-between bg-black text-white">

            <div>
                <div className="h-5"></div>
                <p className="font-bold text-3xl">雷切使用登記</p>
                <div className="h-5"></div>
            </div>
            
            <div className="m-3 mb-0.5 w-2/6 flex items-center gap-2">
                <p className="font-bold w-1/4 text-right">隊伍編號：</p>
                <InputArea
                    editable={false}
                    value={pathTemp[2]}
                    />
            </div>
            <div className="flex items-end w-2/6 h-5" />
            <div className="m-3 mb-0.5 w-2/6 flex items-center gap-2"></div>
            
            <div className="w-1/5 items-center text-center">
                <div style = {{display : customized?"none":"block"}}>
                <div>
                    <p className="text-xl">拖拉下方方塊選擇板材志願序</p>
                </div>
                <div className="h-5"></div>
                <DragDropContext 
                    onDragEnd ={ (event) => {
                        const { source, destination } = event;
                        if (!destination) {
                        return;
                        }
                        let newMaterial = [...material];
                        const [remove] = newMaterial.splice(source.index, 1);
                        newMaterial.splice(destination.index, 0, remove);
                        setMaterial(newMaterial);
                        setMaterialBackUp(newMaterial);
                    }}
                    
                    >
                    <Droppable droppableId="drop-id">
                        {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {material.map((item, index) => (
                                <Draggable key={item} draggableId={item} index={index} >
                                    {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <div className="bg-gray-600 rounded">
                                            {item}
                                        </div>
                                        <div className="h-2"></div>
                                    </div>
                                    )}
                                </Draggable>
                                )
                            )}

                            {provided.placeholder}
                            <div style={{
                                position: "absolute",
                            }}/>
                        </div>
                        )}
                    </Droppable>
                </DragDropContext>
                </div>
            </div>
            <div className="h-7"></div>
            <div className="flex items-center">
                <Checkbox style={{color: "yellow"}} onClick={ ()=>{switchCase()} }/>
                <p>自行攜帶板材雷切(需在備註寫下材質與速度、功率等參數)</p>
            </div>
            <div className="flex items-center">
                <p className="text-yellow-300">*主辦方將視情況使用部分板材測試調整</p>
            </div>
            <div className="flex items-center">
                <p className="text-yellow-300">*板材最大為80cm*60cm</p>
            </div>
            <div className="m-3 mb-0.5 w-2/6 flex items-center gap-2">
                <p className="font-bold w-1/4 text-right">檔案名稱：</p>
                <InputArea                   
                    placeHolder={"file name"}
                    editable={true}
                    value={filename}
                    onChange={(e) => setFilename(e)}
                />
            </div>

            <div className="flex items-end w-2/6 h-5">
                {falseTitle && <p className="ml-20 w-3/4 pl-5 text-sm text-red-500">請輸入檔案名稱</p>}
                {tooLong && <p className="ml-20 w-3/4 pl-5 text-sm text-red-500">檔案名稱不可超過15字</p>}
            </div>

            <div className="m-3 mb-0.5 w-2/6 flex gap-2">
                <p className="font-bold w-1/5 text-right">備註：</p>
                <textarea
                    
                    className="resize-none w-full p-2 border-2 bg-black text-white text-base border-blue-500 focus:border-blue-300 focus:border-4 focus:outline-none"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                />
            </div>

            <div className="flex items-end w-2/6 h-5">
                {NoteTooLong && <p className="ml-20 w-5/6 pl-5 text-sm text-red-500">備註不可超過60字</p>}
            </div>

            <div className="m-2 flex gap-2">
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={() => router.push(`/contestant/${pathTemp[2]}`)}
                >取消</button>
                <button
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    onClick={()=>handleSubmit()}>登記</button>
            </div>
            <div className="h-screen"></div>
            <LaserReserveDialog 
                open={open}
                group={pathTemp[2]}
                material={material}
                comment={comment}
                filename={filename}
                onClose={()=>setOpen(false)}
            />
        </div>
    )
}