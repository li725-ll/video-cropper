import { IPosition, ITransformInfo, IVideoInfo } from "../types";
import Canvas from "./canvas";
import CropBox from "./cropbox";
import Video from "./video";
declare class ConstraintBox {
    constraintBoxElement: HTMLDivElement | null;
    private constraintBoxBodyElement;
    private parent;
    x: number;
    y: number;
    width: number;
    height: number;
    private constraintBoxPosition;
    private videoInfo;
    private cropbox;
    private canvas;
    private video;
    constructor(parent: HTMLElement, videoInfo: IVideoInfo);
    transform(transformInfo: ITransformInfo): void;
    updateStyle(): void;
    setVideo(video: Video): void;
    setCropBox(cropbox: CropBox): void;
    setCanvas(canvas: Canvas): void;
    getConstraintBoxPosition(): IPosition;
    setConstraintBoxPosition(constraintBoxPosition: IPosition): void;
}
export default ConstraintBox;
