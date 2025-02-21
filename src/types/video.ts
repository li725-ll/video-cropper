import type { ICropboxConfig } from "./cropbox";

export interface ITransformInfo {
  scale: number;
  origin: { x: number; y: number };
  translateX: number;
  translateY: number;
  type: "move" | "scale";
}

export interface IOptions {
  cropboxConfig?: ICropboxConfig;
}
