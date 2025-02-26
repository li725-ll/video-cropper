import CropBox from "./cropbox";
import ConstraintBox from "./constraintbox";
import { IPosition, IVideoConfig, IVideoInfo } from "../types";

class Video {
  public videoElement: HTMLVideoElement | null = null;
  public duration: number = 0;
  private previewFlag: boolean = false;
  private constraintBox: ConstraintBox | null = null;
  private videoInfo: IVideoInfo = {
    elementWidth: 0,
    elementHeight: 0,
    duration: 0,
    videoWidth: 0,
    videoHeight: 0,
    realProportion: 0,
    renderHeight: 0,
    renderWidth: 0,
    displayProportion: 0,
    renderX: 0,
    renderY: 0
  };
  private cropbox: CropBox | null = null;
  private lastConstraintBoxPosition: IPosition | null = null;
  private videoConfig: IVideoConfig = { muted: true };

  constructor(
    videoElement: HTMLVideoElement,
    videoInfo: IVideoInfo,
    videoConfig?: IVideoConfig
  ) {
    this.videoElement = videoElement;
    this.videoInfo = videoInfo;
    this.duration = videoInfo.duration;
    this.videoConfig && (this.videoConfig = videoConfig!);
    this.videoElement.setAttribute("class", "video-cropper-video");

    if (this.videoConfig.muted) {
      this.videoElement!.muted = true;
      this.videoElement!.volume = 0;
    }
    this.updateStyle();
    this.registerEvent();
  }

  public setCropBox(cropbox: CropBox) {
    this.cropbox = cropbox;
  }

  private registerEvent() {
    // this.videoElement!.addEventListener("ended", () => {
    //   this.constraintBox?.setConstraintBoxPosition(
    //     this.lastConstraintBoxPosition!
    //   );
    //   this.constraintBox?.updateStyle();
    //   this.previewFlag = false;
    //   this.updateStyle();
    // });
  }

  public play() {
    this.previewFlag = true;
    this.updateStyle();
    this.videoElement!.play();
  }

  public preview() {
    if (!this.previewFlag) {
      const position = this.cropbox?.getPosition()!;
      const constraintBoxPosition =
        this.constraintBox?.getConstraintBoxPosition()!;
      this.lastConstraintBoxPosition = { ...constraintBoxPosition };

      const rateX = this.videoInfo.elementWidth / position.width;
      const rateY = this.videoInfo.elementHeight / position.height;

      constraintBoxPosition.height = constraintBoxPosition.height * rateX;
      constraintBoxPosition.width = constraintBoxPosition.width * rateY;
      constraintBoxPosition.x = -(position.x * rateX);
      constraintBoxPosition.y = -(position.y * rateY);
      this.constraintBox?.setConstraintBoxPosition(constraintBoxPosition);
      this.constraintBox?.updateStyle();
      this.play();
    }
  }

  public exitPreview() {
    if (this.previewFlag) {
      this.constraintBox?.setConstraintBoxPosition(
        this.lastConstraintBoxPosition!
      );
      this.constraintBox?.updateStyle();
      this.previewFlag = false;
      this.updateStyle();
      this.pause();
    }
  }

  public pause() {
    this.previewFlag = false;
    this.videoElement!.pause();
    this.updateStyle();
  }

  public setCurrentTime(time: number) {
    if (time >= this.videoInfo!.duration) {
      time = this.videoInfo!.duration;
    }

    if (time <= 0) {
      time = 0;
    }
    this.videoElement!.currentTime = time;
  }

  public setUpdateCallback(updateCallback: (e: Event) => void): () => void {
    this.videoElement?.addEventListener("timeupdate", updateCallback);
    return () => {
      this.videoElement?.removeEventListener("timeupdate", updateCallback);
    };
  }

  private updateStyle() {
    const style = `--video-cropper-video-origin: center;
      --video-cropper-video-z-index: ${this.previewFlag ? 1000 : 0};
      --video-cropper-video-position: ${this.previewFlag ? "absolute" : "static"};`;
    this.videoElement!.setAttribute("style", style);
  }

  public updateSize() {
    this.videoElement!.width! = this.constraintBox?.width!;
    this.videoElement!.height! = this.constraintBox?.height!;
  }

  public setConstraintBox(constraintbox: ConstraintBox) {
    this.constraintBox = constraintbox;
    this.updateSize();
  }
}

export default Video;
