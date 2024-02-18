"use client";

import { useEffect, useRef } from "react";
import { useDrawnArray } from "@/store/use-drawn-array";

export function useOnDraw(tool: Tool, bgColor: string) {
  const canvasRef = useRef<any>(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef<any>(null);
  const mouseMoveListenerRef = useRef<any>(null);
  const mouseUpListenerRef = useRef<any>(null);

  function setCanvasRef(ref: any) {
    canvasRef.current = ref;
  }

  const { drawnArray } = useDrawnArray((state) => state);

  function onCanvasMouseDown() {
    isDrawingRef.current = true;
  }

  useEffect(() => {
    if (canvasRef.current) onDraw(canvasRef.current.getContext("2d"));

    function computePointInCanvas(clientX: number, clientY: number) {
      if (canvasRef.current) {
        const boundingRect = canvasRef.current.getBoundingClientRect();
        return {
          x: clientX - boundingRect.left,
          y: clientY - boundingRect.top,
        };
      } else {
        return null;
      }
    }

    let newLine: DrawnArray = [];

    function initMouseMoveListener() {
      const mouseMoveListener = (e: any) => {
        if (isDrawingRef.current && canvasRef.current) {
          const point = computePointInCanvas(e.clientX, e.clientY) as {
            x: number;
            y: number;
          };
          const ctx: CanvasRenderingContext2D =
            canvasRef.current.getContext("2d");

          ctx.fillStyle = tool.type == "brush" ? tool.color : bgColor;
          ctx.lineWidth = tool.size * 3;
          ctx.strokeStyle = tool.type == "brush" ? tool.color : bgColor;
          ctx.lineCap = "round";
          ctx.beginPath();
          if (!prevPointRef.current) {
            prevPointRef.current = point;
          }
          ctx.moveTo(prevPointRef.current.x, prevPointRef.current.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
          ctx.arc(point.x, point.y, tool.size, 0, 2 * Math.PI);
          ctx.fill();

          newLine.push({
            x: point.x,
            y: point.y,
            size: tool.size,
            color: tool.type == "brush" ? tool.color : bgColor,
            erase: tool.type == "eraser",
          });

          prevPointRef.current = point;
        }
      };

      mouseMoveListenerRef.current = mouseMoveListener;
      window.addEventListener("mousemove", mouseMoveListener);
    }

    function initMouseUpListener() {
      const listener = () => {
        useDrawnArray.setState({ drawnArray: [...drawnArray, newLine] });
        newLine = [];
        isDrawingRef.current = false;
        prevPointRef.current = null;
      };

      mouseUpListenerRef.current = listener;
      window.addEventListener("mouseup", listener);
    }

    function cleanup() {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("mousemove", mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseUpListenerRef.current);
      }
    }

    initMouseMoveListener();
    initMouseUpListener();
    return () => cleanup();
  }, [drawnArray, tool.type, tool.size, tool.color, bgColor]);

  // attach event listener to the save button in a separate useEffect to prevent adding multiple event listeners
  useEffect(() => {
    const saveButton = document.getElementById("save-btn");

    saveButton?.addEventListener("click", () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      // Convert the canvas to an image data URL
      const dataURL = canvas.toDataURL();
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, []);

  function clearCanvas() {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function onDraw(ctx: CanvasRenderingContext2D) {
    console.log(drawnArray);
    clearCanvas();
    for (let j = 0; j < drawnArray.length; j++) {
      let line = drawnArray[j];
      for (let i = 0; i < line.length - 1; i++) {
        let start = line[i];
        let end = line[i + 1];
        if (end) {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.fillStyle = start.erase ? bgColor : start.color;
          ctx.strokeStyle = start.erase ? bgColor : start.color;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(start.x, start.y, start.size, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }

  return {
    setCanvasRef,
    onCanvasMouseDown,
    clearCanvas,
  };
}
