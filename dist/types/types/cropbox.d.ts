export interface IPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}
export type IDrawCropBoxFunc = (x: number, y: number, width: number, height: number) => void;
export interface IBorderLimit {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}
export interface ICropboxConfig {
    aspectRatio?: number;
}
export interface IMouseInfo {
    mouseX: number;
    mouseY: number;
    mouseDown: boolean;
    type: "move" | "scale";
    index?: number;
}
export type ICropBoxPositionFunc = (position: IPosition) => void;
