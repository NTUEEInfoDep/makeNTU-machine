import { statuses } from "@/constant/index";

function ColorExplain() {
  const colors = ["白色", "灰色", "橘色", "紅色", "綠色"];
  const statusToTextColor = [
    "text-white",
    "text-gray-400",
    "text-orange-400",
    "text-red-400",
    "text-green-400",
  ];
  return (
    <div className="flex flex-row gap-1">
      <p>＊背景顏色代表意義:</p>
      {colors.map((color, index) => (
        <div key={color}>
          <p className={statusToTextColor[index]}>{statuses[index]}</p>
        </div>
      ))}
    </div>
  );
}

export default ColorExplain;
