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

declare interface IWidthHeightLimit {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

declare interface IMouseInfo {
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  type: "move" | "scale";
  index?: number;
}

declare type ICropBoxPositionFunc  = (position: IPosition) => void;
