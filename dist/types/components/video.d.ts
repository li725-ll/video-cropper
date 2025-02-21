import CropBox from "./cropbox";
import ConstraintBox from "./constraintbox";
import { IVideoInfo } from "../types";
declare class Video {
    videoElement: HTMLVideoElement | null;
    duration: number;
    private previewFlag;
    private constraintBox;
    private videoInfo;
    private cropbox;
    private lastConstraintBoxPosition;
    constructor(videoElement: HTMLVideoElement, videoInfo: IVideoInfo);
    setCropBox(cropbox: CropBox): void;
    private registerEvent;
    play(): void;
    preview(): void;
    pause(): void;
    setCurrentTime(time: number): void;
    private updateStyle;
    updateSize(): void;
    setConstraintBox(constraintbox: ConstraintBox): void;
}
export default Video;
