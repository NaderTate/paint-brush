"use client";
import { ChangeEvent } from "react";

import useTools from "@/app/hooks/use-tools";
import { useDrawnArray } from "@/store/use-drawn-array";

import { IoReload } from "react-icons/io5";
import { TfiPaintBucket } from "react-icons/tfi";
import { FaSave, FaBrush } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaUpload, FaEraser, FaDownload } from "react-icons/fa6";

type ToolbarProps = {
  setTool: (tool: Tool) => void;
  setBgColor: (color: string) => void;
};
function Toolbar({ setTool, setBgColor }: ToolbarProps) {
  const { drawnArray } = useDrawnArray((state) => state);
  const { toolData, setToolData, bgColour, setBgColour } = useTools();

  const removeFromStorage = () => {
    localStorage.removeItem("savedCanvas");
  };

  const saveCanvas = () => {
    localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
  };

  const clearCanvas = () => {
    setToolData({ ...toolData, type: "brush" });
    setBgColor("#FFFFFF");
    useDrawnArray.setState({ drawnArray: [] });
  };

  const loadCanvas = () => {
    const savedCanvas = localStorage.getItem("savedCanvas");
    if (savedCanvas) {
      useDrawnArray.setState({ drawnArray: JSON.parse(savedCanvas) });
    }
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the tool by only modifying the color property
    setTimeout(() => {
      setToolData({ ...toolData, color: e.target.value, type: "brush" });
      setTool({ ...toolData, color: e.target.value, type: "brush" });
    }, 100);
  };

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the tool by only modifying the size property
    setToolData({ ...toolData, size: parseInt(e.target.value) });
    setTool({ ...toolData, size: parseInt(e.target.value) });
  };

  const handleChangeToolType = (type: "brush" | "eraser") => {
    setToolData({ ...toolData, type });
    setTool({ ...toolData, type });
  };

  const handleBgColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setBgColour(e.target.value);
      setBgColor(e.target.value);
      setToolData({ ...toolData, type: "brush" });
      setTool({ ...toolData, type: "brush" });
    }, 100);
  };

  const iconSize = 26;
  const iconStyles = "cursor-pointer ";
  return (
    <div className="bg-gray-500 text-white p-4 flex items-center">
      <h1>Logo</h1>
      <div className="absolute justify-center right-0 flex left-0 gap-x-4 items-center">
        <FaBrush
          style={{ color: toolData.type == "brush" ? "black" : "white" }}
          className={iconStyles}
          onClick={() => handleChangeToolType("brush")}
          size={iconSize}
        />
        <div
          onClick={() => {
            document.getElementById("color-input")?.click();
          }}
          className="flex items-center gap-x-2 cursor-pointer bg-white text-black w-32 rounded-md"
        >
          <input
            style={{ backgroundColor: toolData.color }}
            onChange={handleColorChange}
            type="color"
            className="h-8 w-8 rounded-l-md cursor-pointer"
            id="color-input"
          />
          <span>{toolData.color}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className=" bg-gray-600 p-1 w-8 text-center rounded-md">
            {toolData.size}
          </span>
          <input
            defaultValue={toolData.size}
            type="range"
            min="1"
            max="50"
            step="1"
            className="slider"
            onChange={handleSizeChange}
          />
        </div>
        <TfiPaintBucket size={iconSize} />
        <div
          onClick={() => {
            document.getElementById("bg-color-input")?.click();
          }}
          className="flex items-center gap-x-2 cursor-pointer bg-white text-black w-32 rounded-md"
        >
          <input
            defaultValue={bgColour}
            style={{ backgroundColor: bgColour }}
            onChange={handleBgColorChange}
            type="color"
            className="h-8 w-8 rounded-l-md cursor-pointer"
            id="bg-color-input"
          />
          <span>{bgColour}</span>
        </div>
        <FaEraser
          style={{ color: toolData.type == "eraser" ? "black" : "white" }}
          className={iconStyles}
          onClick={() => handleChangeToolType("eraser")}
          size={iconSize}
        />
        <IoReload
          className={iconStyles}
          onClick={clearCanvas}
          size={iconSize}
        />
        <FaDownload
          className={iconStyles}
          onClick={saveCanvas}
          size={iconSize}
        />
        <FaUpload className={iconStyles} onClick={loadCanvas} size={iconSize} />
        <RiDeleteBin6Line
          className={iconStyles}
          onClick={removeFromStorage}
          size={iconSize}
        />
        <FaSave className={iconStyles} id="save-btn" size={iconSize} />
      </div>
    </div>
  );
}

export default Toolbar;
