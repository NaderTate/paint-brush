"use client";

import { useState } from "react";
const useTools = () => {
  const [toolData, setToolData] = useState<Tool>({
    type: "brush",
    size: 10,
    color: "#000000",
  });
  const [bgColour, setBgColour] = useState("#2581f8");

  return {
    toolData,
    setToolData,
    bgColour,
    setBgColour,
  };
};

export default useTools;
