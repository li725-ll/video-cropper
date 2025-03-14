import Video from "./video";
import CropBox from "./cropbox";
import ConstraintBox from "./constraintbox";
import { IVideoInfo } from "../types";
declare class Canvas {
    canvasElement: HTMLCanvasElement | null;
    private ctx;
    private cropbox;
    private video;
    private constraintbox;
    private grab;
    private videoInfo;
    constructor(videoInfo: IVideoInfo);
    updateSize(): void;
    setGrab(grab: boolean): void;
    private updateStyle;
    drawCropbox(x: number, y: number, width: number, height: number): void;
    setVideo(video: Video): void;
    setCropBox(cropbox: CropBox): void;
    setConstraintBox(constraintbox: ConstraintBox): void;
}
export default Canvas;
