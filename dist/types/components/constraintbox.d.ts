import { IConstraintBoxConfig, IPosition, ITransformInfo, IVideoInfo } from "../types";
import { IConstraintBoxPositionFunc } from "../types/constraintbox";
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
    private constraintBoxConfig;
    private constraintBoxPositionFunc;
    constructor(parent: HTMLElement, videoInfo: IVideoInfo, constraintBoxConfig?: IConstraintBoxConfig);
    /**
     * 缩放和移动
     * @param transformInfo
     */
    transform(transformInfo: ITransformInfo): void;
    reset(): void;
    updateStyle(): void;
    setVideo(video: Video): void;
    setCropBox(cropbox: CropBox): void;
    setCanvas(canvas: Canvas): void;
    getConstraintBoxPosition(): IPosition;
    setConstraintBoxPosition(constraintBoxPosition: IPosition): void;
    setConstraintBoxPositionFunc(constraintBoxPositionFunc: IConstraintBoxPositionFunc): void;
}
export default ConstraintBox;
