declare interface ITransformInfo {
  scale: number;
  origin: { x: number; y: number };
  translateX: number;
  translateY: number;
  type: "move" | "scale";
}
