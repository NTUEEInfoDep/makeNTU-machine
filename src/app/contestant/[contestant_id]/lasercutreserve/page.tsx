"use client";
import { useState, useEffect } from "react";
// import { useRef, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import InputArea from "@/components/ui/InputArea";
import { Checkbox } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LaserReserveDialog from "@/components/LaserReserveDialog";
import { decodeJWT } from "@/lib/decodeJWT";

function useReserve() {
  const router = useRouter();
  const pathname = usePathname();
  // const secretkey: string = process.env.PASSWORD_SECRET
  //   ? process.env.PASSWORD_SECRET
  //   : "Secret";
  const [filename, setFilename] = useState("");
  const [comment, setComment] = useState("");
  const [falseTitle, setFalseTitle] = useState(false);
  const [tooLong, setTooLong] = useState(false);
  const [noteTooLong, setNoteTooLong] = useState(false);
  const [material, setMaterial] = useState([
    "3mm密集板",
    "5mm密集板",
    "3mm壓克力",
  ]);
  const [materialBackUp, setMaterialBackUp] = useState([
    "3mm密集板",
    "5mm密集板",
    "3mm壓克力",
  ]);
  const [customized, setCustomized] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token: ");
    if (!token) {
      alert("未登入");
      router.push("/login");
    } else {
      const decodedPayload = decodeJWT(token);
      const permission = decodedPayload?.permission;
      const username = decodedPayload?.username;
      const currPath = pathname.split("/").slice(-2)[0];
      if (
        !permission ||
        permission !== "contestant" ||
        !username ||
        username !== currPath
      ) {
        router.push("/login");
        alert("權限錯誤，請重新登入");
      }
    }
  });

  const pathTemp = pathname.split("/");

  const switchCase = () => {
    if (customized === false) {
      setCustomized(true);
      setMaterial(["自訂"]);
    } else {
      setCustomized(false);
      setMaterial(materialBackUp);
    }
  };

  const handleSubmit = async () => {
    if (!filename) {
      setFalseTitle(true);
      return;
    } else {
      setFalseTitle(false);
    }

    if (filename.length > 15) {
      setTooLong(true);
      return;
    } else {
      setTooLong(false);
    }

    if (comment.length > 30) {
      setNoteTooLong(true);
      return;
    }

    setOpen(true);
  };

  return (
    <div className="flex flex-col w-6/12 mx-auto px-6 py-5 border rounded-lg my-6 bg-black border-[#444444]">
      <p className="text-4xl font-semibold">雷切使用登記</p>
      <ul className="list-disc px-2 ml-2 pt-3 flex flex-col gap-1">
        <li className="text-lg">隊伍編號：{pathTemp[2]}</li>
        <li className="text-lg">
          <div className="flex flex-col gap-1">
            拖拉下方方塊選擇板材志願序
            <div className="text-center w-6/12">
              <div className={customized ? "none" : "block"}>
                <DragDropContext
                  onDragEnd={(event) => {
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
                    {(provided, _) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-col gap-2"
                      >
                        {material.map((item, index) => (
                          <Draggable
                            key={item}
                            draggableId={item}
                            index={index}
                          >
                            {(provided, _) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="bg-yellow-400 rounded text-black">
                                  {item}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                        <div
                          style={{
                            position: "absolute",
                          }}
                        />
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
            <div className="flex items-center">
              <Checkbox style={{ color: "yellow" }} onClick={switchCase} />
              <p>自行攜帶板材雷切(需在備註寫下材質與速度、功率等參數)</p>
            </div>
          </div>
        </li>
        <div className="flex flex-col gap-1">
          <p className="text-yellow-300 text-base">
            ＊ 主辦方將視情況使用部分板材測試調整
          </p>
          <p className="text-yellow-300 text-base">＊ 板材最大為 80cm x 60cm</p>
        </div>
        <li>
          <div className="flex flex-col w-full gap-1">
            <p className="text-white text-lg">
              檔案名稱<span className="text-red-500">*</span>
            </p>
            <InputArea
              placeHolder="Filename"
              editable={true}
              value={filename}
              onChange={(e) => setFilename(e)}
            />
            <div className="flex flex-col ml-2">
              {falseTitle && (
                <p className="text-sm text-red-500">請輸入檔案名稱！</p>
              )}
              {tooLong && (
                <p className="text-sm text-red-500">檔案名稱不可超過15字！</p>
              )}
            </div>
          </div>
        </li>
        <li>
          <div className="flex flex-col gap-1">
            <p className="text-white text-lg">
              備註{customized && <span className="text-red-500">*</span>}
              {` (${comment.length}/30)`}
            </p>
            <textarea
              className="w-full bg-[#15171C] border-none text-white text-[16px] leading-normal placeholder:text-[16px] px-3 py-2 rounded-lg placeholder:text-[#71788B] hover:ring-blue-400 hover:ring-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-0"
              value={comment}
              placeholder="Note"
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex flex-col ml-2">
              {customized && comment.length === 0 && (
                <p className="text-sm text-red-500">請輸入備註！至多30字</p>
              )}
              {comment.length > 30 && (
                <p className="text-sm text-red-500">備註不可超過30字</p>
              )}
            </div>
          </div>
        </li>
      </ul>
      <div className="mt-2 flex flex-row-reverse gap-1">
        <button
          className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          登記
        </button>
        <button
          className="m-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push(`/contestant/${pathTemp[2]}`)}
        >
          取消
        </button>
      </div>
      <LaserReserveDialog
        open={open}
        group={pathTemp[2]}
        material={material}
        comment={comment}
        filename={filename}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

export default useReserve;
