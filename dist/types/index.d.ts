import "./css/index.css";
import Video from "./components/video";
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
    init(): void;
    private registerEvent;
    private calculateRenderVideoInfo;
    getVideo(): Video;
    setCropBoxPositionFunc(cropPositionFunc: ICropBoxPositionFunc): void;
}
