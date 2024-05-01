import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import useLaserCutRequest from "@/hooks/useLaserCutRequest";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import { useRef } from "react";

type StatusProps = {
    id:number;
    initialState:string;
    timeStarted: Date;
    type:string;
}

type indRequestForStatus = {
    id: number
    timeleft: Date
    status: string
}

type broadcastRequest = {
    id: number
    status: string
}

export default function Status( {id, initialState, timeStarted, type}: StatusProps ){
    const router = useRouter();
    const [ timer, setTimer ] = useState<NodeJS.Timeout>();
    const statusArray = ['等待確認','等待檔案','過號','製作中','已完成'];
    const { getLaserCutRequest, putLaserCutRequestStatus, putLaserCutRequestTimeLeft } = useLaserCutRequest();
    const { getThreeDPRequest, putThreeDPRequestStatus, putThreeDPRequestTimeLeft } = useThreeDPRequest();
    const [ requestList, setRequestList ] = useState<indRequestForStatus[]>();
    const select = useRef<HTMLDivElement>();
    const [ current, setCurrent ] = useState('等待確認');  // current status
    const [ timeCreated, setTimeCreated] = useState<Date | undefined>(new Date());  // the latest time switched to "到"
    const [ countdown, setCountdown ] = useState(false);  // whether counting down or not
    const [ timeLeft, setTimeLeft ] = useState(0);  // left time
    const [ wrong, setWrong ] = useState(false);  // pass number or not
    const [ flag, setFlag ] = useState(false);
    
    function checkID(req:indRequestForStatus){
        return req.id === id
    }

    const gReq = async () => {
        try{
            const requestListLaserInit = await getLaserCutRequest();
            const requestListLaserJson:indRequestForStatus[] = requestListLaserInit["dbresultReq"];
            const requestListTDPInit = await getThreeDPRequest();
            const requestListTDPJson:indRequestForStatus[] = requestListTDPInit["dbresultReq"];
            const requestListJson = requestListLaserJson.concat(requestListTDPJson)
            setRequestList(requestListJson);
            if (requestListJson.find(checkID) !== undefined) {
                setTimeCreated(requestListJson.find(checkID)?.timeleft);
            }
            else{
                setTimeCreated(new Date(0));
            }   
        }
        catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        if (statusArray.includes(initialState)){
            setCurrent(initialState)
        }
        setFlag(true);
        if (initialState === '等待檔案'){
            setCountdown(true);
            setTimeLeft(Math.trunc(180-(new Date().getTime()-new Date(timeStarted).getTime())/1000))
        }
        else {
            setCountdown(false);
        }
    },[initialState])
    
    useEffect(() => {
        if ( flag === true ){
            if(countdown === true){
                gReq();
                const countDownByState = () => {
                    setTimeLeft((prev)=>(prev-1))
                }
                setTimer(setInterval(countDownByState, 1000));
            }
            else{
                clearInterval(timer);
            }
        }
    },[countdown])

    useEffect(()=>{
        if( flag === true ){
            if(timeLeft <= 0){
                clearInterval(timer);
                setCountdown(false);
                setWrong(true);
                setCurrent('過號')
            }
        }
    },[timeLeft])

    const handleTimeChange = async(id: number, newTimeLeft: Date) => {
        if(type === "laser"){
            try{
                await putLaserCutRequestTimeLeft({
                    id,
                    newTimeLeft
                })
            }catch(e){
                console.error(e);
            }
        }
        else{
            try{
                await putThreeDPRequestTimeLeft({
                    id,
                    newTimeLeft
                })
            }catch(e){
                console.error(e);
            }
        }
        router.refresh();
    }

    return(
        <>
            <div className="h-1"></div>
            <div className="flex h-10 items-end justify-center">
                <div className="inline-flex flex-row text-orange-500 font-bold">
                    {current}
                </div>
            </div>
            <div className="flex h-6 items-center justify-center">
                <p className={`text-sm font-bold text-red-500 ${countdown? "block" : "hidden"}`}>{timeLeft}</p>
            </div>
        </>
    )
}