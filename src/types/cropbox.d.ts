declare interface IPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

declare type IDrawCropBoxFunc = (
  x: number,
  y: number,
  width: number,
  height: number
) => void;

declare interface IBorderLimit {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

declare interface ICropboxConfig {
  aspectRatio?: number; // 0 为默认值，表示不固定比例和视频同样的宽高比
}

declare interface IMouseInfo {
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  type: "move" | "scale";
  index?: number;
}

declare type ICropBoxPositionFunc  = (position: IPosition) => void;
