import { Dialog, DialogTitle ,DialogContent, DialogActions } from "@mui/material";
import { Separator } from "@/components/ui/Separator";
import useLaserCutRequest from "@/hooks/useLaserCutRequest";
import { useRouter } from "next/navigation";

export type FinishDialogProps = {
    open: boolean;
    group: string;
    material: string[];
    filename: string;
    comment: string;
    onClose: () => void;
};

export default function LaserReserveDialog({
     open, 
     group, 
     material, 
     filename, 
     comment, 
     onClose }: FinishDialogProps) {
    const { postLaserCutRequest } = useLaserCutRequest();
    const Button = require("@mui/material/Button").default;
    const router = useRouter();
    const handleSumbit = async (
        group: string,
        material: string[],
        filename: string,
        comment: string) => {
        try{
            await postLaserCutRequest({
                group,
                filename,
                material,
                comment,
            })
            
        }catch(e){
            console.error(e);
        }
        router.refresh();
        router.push(`/contestant/${group}`);
    }
    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>以下是您即將預約的雷切內容</DialogTitle>
                <Separator />
                <DialogContent className="w-96 h-72">
                    <p className="text-base font-bold">組別：{group}</p>
                    <p className="text-base font-bold">
                        板材志願序：
                        {material.map(( mat )=>( <p key={mat}>{(material.indexOf(mat)+1)+". "+mat}</p> )) }
                    </p>
                    <p className="text-base font-bold">檔名：{filename}</p>
                    <p className="text-base font-bold">備註：{comment}</p>
                    <br />
                    <Separator />
                    <br />
                    <p className="text-base font-bold">確認無誤後，請按下確定，並預祝比賽順利!</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>取消</Button>
                    <Button onClick={()=>{
                        handleSumbit(group, material, filename, comment);
                        onClose();
                    }}>確定</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}