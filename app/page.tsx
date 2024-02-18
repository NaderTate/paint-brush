"use client";

import { NextPage } from "next";
import Canvas from "./components/canvas";
import useTools from "./hooks/use-tools";
import Toolbar from "./components/toolbar";
import { useState, useEffect } from "react";
const HomePage: NextPage = () => {
  const { toolData, setToolData, bgColour, setBgColour } = useTools();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Toolbar
        setTool={(tool) => {
          setToolData(tool);
        }}
        setBgColor={(color) => {
          setBgColour(color);
        }}
      />
      <Canvas tool={toolData} bgColor={bgColour} />
    </>
  );
};

export default HomePage;
