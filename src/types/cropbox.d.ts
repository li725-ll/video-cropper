declare interface IPosition {
    x: number;
    y: number;
    width: number;
    height: number;
};

declare type IDrawCropBoxFunc = (x: number, y: number, width: number, height: number) => void;

declare interface IBorderLimit {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}