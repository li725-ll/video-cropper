import "./css/index.css";
import Video from "./components/video";
import CropBox from "./components/cropbox";
import ConstraintBox from "./components/constraintbox";
import { ICropBoxPositionFunc, IOptions } from "./types";
export default class VideCropper {
    private videoElement;
    private parent;
    private container;
    private canvas;
    private cropBox;
    private constraintBox;
    private video;
    private options;
    private videoInfo;
    private transformInfo;
    private grabInfo;
    private mouseInfo;
    constructor(root: HTMLVideoElement, options?: IOptions);
    private init;
    private registerEvent;
    private transformScale;
    private calculateRenderVideoInfo;
    getVideo(): Video;
    getConstraintBox(): ConstraintBox;
    getCropBox(): CropBox;
    scale(scale: number, x?: number, y?: number): void;
    setCropBoxPositionFunc(cropPositionFunc: ICropBoxPositionFunc): void;
}
