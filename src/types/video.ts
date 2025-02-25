import type { ICropBoxConfig } from "./cropbox";

export interface ITransformInfo {
  scale: number;
  origin: { x: number; y: number };
  translateX: number;
  translateY: number;
  type: "move" | "scale";
}

export interface IVideoConfig {
  muted: boolean;
}

export interface IOptions {
  cropBoxConfig?: ICropBoxConfig;
  videoConfig?: IVideoConfig;
}
