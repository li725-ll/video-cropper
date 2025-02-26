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

export interface ICropBoxConfig {
  aspectRatio?: number; // 0 为默认值，表示不固定比例和视频同样的宽高比
  position?: IPosition; // 默认位置
}

export interface IMouseInfo {
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  type:
    | "border-move-0"
    | "border-move-1"
    | "border-move-2"
    | "border-move-3"
    | "pointer-move-0"
    | "pointer-move-1"
    | "pointer-move-2"
    | "pointer-move-3"
    | "pointer-move-4"
    | "pointer-move-5"
    | "pointer-move-6"
    | "pointer-move-7"
    | "canvas-scale-move"
    | "grid-move"
    | "scale"
    | null;
  index?: number;
}

export type ICropBoxPositionFunc = (nativePosition: IPosition, renderPosition?: IPosition) => void;
