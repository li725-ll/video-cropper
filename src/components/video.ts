import CropBox from "./cropbox";
import ConstraintBox from "./constraintbox";

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
  private previewPositon: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 能看到的视频部分
  private renderPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 视频渲染部分（包含超出画布的部分）
  private originPosition = {
    x: 0,
    y: 0
  };


  constructor(videoElement: HTMLVideoElement, videoInfo: IVideoInfo) {
    this.videoElement = videoElement;
    this.videoInfo = videoInfo;
    this.duration = videoInfo.duration;
    this.videoElement.setAttribute("class", "video-cropper-video");
    this.updateStyle();
    this.registerEvent();
    this.previewPositon = {
      x: this.videoInfo.renderX,
      y: this.videoInfo.renderY,
      width: this.videoInfo.renderWidth,
      height: this.videoInfo.renderHeight
    };
    this.renderPosition = {
      x: 0,
      y: 0,
      width: this.videoInfo.elementWidth,
      height: this.videoInfo.elementHeight
    };
    this.originPosition.x = Math.round(this.videoInfo.elementHeight / 2);
    this.originPosition.y = Math.round(this.videoInfo.elementHeight / 2);
  }

  public setCropBox(cropbox: CropBox) {
    this.cropbox = cropbox;
  }

  private registerEvent() {
    this.videoElement!.addEventListener("ended", () => {
      this.previewFlag = false;
      this.updateStyle();
    });
  }

  public play() {
    const position = this.cropbox?.getPosition();

    console.log(position);

    this.previewFlag = true;
    this.updateStyle();
    this.videoElement!.play();
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

  private updateStyle() {
    // TODO: video-cropper-video-origin存在问题但元素位置居中时有问题 ${this.transformInfo.origin}
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
