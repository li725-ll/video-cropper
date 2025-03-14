import CropBox from "./cropbox";
import ConstraintBox from "./constraintbox";
import { IVideoConfig, IVideoInfo } from "../types";
import Mask from "./mask";
declare class Video {
    videoElement: HTMLVideoElement | null;
    duration: number;
    private previewFlag;
    private constraintBox;
    private videoInfo;
    private cropbox;
    private mask;
    private lastConstraintBoxPosition;
    private videoConfig;
    constructor(videoElement: HTMLVideoElement, videoInfo: IVideoInfo, videoConfig?: IVideoConfig);
    setCropBox(cropbox: CropBox): void;
    setMask(mask: Mask): void;
    play(): void;
    preview(): void;
    exitPreview(): void;
    pause(): void;
    setCurrentTime(time: number): void;
    setUpdateCallback(updateCallback: (e: Event) => void): () => void;
    private updateStyle;
    updateSize(): void;
    setConstraintBox(constraintbox: ConstraintBox): void;
}
export default Video;
