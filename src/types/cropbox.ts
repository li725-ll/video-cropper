export interface IPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type IDrawCropBoxFunc = (
  x: number,
  y: number,
  width: number,
  height: number
) => void;

export interface IBorderLimit {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface ICropboxConfig {
  aspectRatio?: number; // 0 为默认值，表示不固定比例和视频同样的宽高比
}

export interface IMouseInfo {
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  type: "move" | "scale";
  index?: number;
}

export type ICropBoxPositionFunc = (position: IPosition) => void;
