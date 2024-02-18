"use client";
import { useOnDraw } from "../hooks/use-on-draw";
type canvasProps = {
  tool: { type: "brush" | "eraser"; size: number; color: string };
  bgColor: string;
};
const Canvas = ({ tool, bgColor }: canvasProps) => {
  const { setCanvasRef, onCanvasMouseDown } = useOnDraw({ ...tool }, bgColor);

  return (
    <canvas
      width={window?.innerWidth}
      height={window?.innerHeight - 50}
      onMouseDown={onCanvasMouseDown}
      style={{ backgroundColor: bgColor }}
      ref={setCanvasRef}
    />
  );
};

export default Canvas;
