import { Dialog, DialogTitle ,DialogContent, DialogActions } from "@mui/material";
import { Separator } from "@/components/ui/Separator";
import useThreeDPRequest from "@/hooks/useThreeDPRequest";
import { useRouter } from "next/navigation";

export type FinishDialogProps = {
    open: boolean;
    group: string;
    material: string[];
    filename: string;
    comment: string;
    loadBearing: boolean;
    onClose: () => void;
};

export default function ThreeDPReserveDialog({
     open, 
     group, 
     filename,
     material,
     loadBearing, 
     comment, 
     onClose }: FinishDialogProps) {
    const { postThreeDPRequest } = useThreeDPRequest();
    const Button = require("@mui/material/Button").default;
    const router = useRouter();
    const handleSumbit = async (
        group: string,
        filename: string,
        material: string[],
        loadBearing: boolean,
        comment: string) => {
        try{
            await postThreeDPRequest({
                group,
                filename,
                material,
                loadBearing,
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
                <DialogTitle>以下是您即將預約的3D列印內容</DialogTitle>
                <Separator />
                <DialogContent className="w-96 h-72">
                    <p className="text-base font-bold">組別：{group}</p>
                    <p className="text-base font-bold">材料：{material}</p>
                    <p className="text-base font-bold">檔名：{filename}</p>
                    <p className="text-base font-bold">支撐材：{loadBearing? "需要" : "不需要" }</p>
                    <p className="text-base font-bold">備註：{comment}</p>
                    <br />
                    <Separator />
                    <br />
                    <p className="text-base font-bold">確認無誤後，請按下確認，並預祝比賽順利!</p>                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>取消</Button>
                    <Button onClick={()=>{
                        handleSumbit(group, filename, material, loadBearing, comment);
                        onClose();
                    }}>確定</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}