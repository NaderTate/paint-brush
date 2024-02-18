type Tool = {
  type: "brush" | "eraser";
  size: number;
  color: string;
};

type DrawnArray = {
  x: number;
  y: number;
  size: number;
  color: string;
  erase: boolean;
}[];
