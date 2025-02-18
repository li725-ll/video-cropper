import CropBox from "./cropbox";

class Video {
  private videoElement: HTMLVideoElement | null = null;
  public duration: number = 0;
  private previewFlag: boolean = false;
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
  };
  public transformInfo: ITransformInfo = {
    scaleX: 1,
    scaleY: 1,
    origin: "center",
    translateX: 0,
    translateY: 0
  };

  public lastTransformInfo: ITransformInfo = {
    scaleX: 1,
    scaleY: 1,
    origin: "center",
    translateX: 0,
    translateY: 0
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
    this.transformInfo.scaleX = this.videoInfo.elementWidth / position!.width;
    this.transformInfo.scaleY = this.videoInfo.elementHeight / position!.height;
    console.log(position);
    console.log(this.transformInfo);

    const previewWidth = Math.round(
      this.videoInfo.renderWidth * (1 - this.transformInfo.scaleX)
    );
    const previewHeight = Math.round(
      this.videoInfo.renderHeight * (1 - this.transformInfo.scaleY)
    );
    this.previewPositon.x = -Math.round(
      this.videoInfo.renderX + previewWidth / 2
    );
    this.previewPositon.y = -Math.round(
      this.videoInfo.renderY + previewHeight / 2
    );
    this.previewPositon.width = Math.round(
      this.videoInfo.renderWidth * this.transformInfo.scaleX
    );
    this.previewPositon.height = Math.round(
      this.videoInfo.renderHeight * this.transformInfo.scaleY
    );
    console.log(this.previewPositon);
    console.log(previewHeight, previewWidth);

    this.transformInfo.translateX = 527;
    this.transformInfo.translateY = 200;

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
    const style = `--video-cropper-video-origin: ${this.transformInfo.origin};
      --video-cropper-video-z-index: ${this.previewFlag ? 1000 : 0};
      --video-cropper-video-position: ${this.previewFlag ? "absolute" : "static"};
      --video-cropper-video-scale-x: ${this.transformInfo.scaleX};
       --video-cropper-video-scale-y: ${this.transformInfo.scaleY};
      --video-cropper-video-translate-x: ${this.transformInfo.translateX}px;
      --video-cropper-video-translate-y: ${this.transformInfo.translateY}px;`;
    this.videoElement!.setAttribute("style", style);
  }

  public scale(e: WheelEvent) {
    const direction = e.deltaY;
    const x = e.clientX;
    const y = e.clientY;
    this.transformInfo.origin = `${x}px ${y}px`;
    const scale = this.transformInfo.scaleX - 0.1;
    if (direction < 0) {
      if (scale <= 0.1) {
        return;
      }
      this.transformInfo.scaleX += 0.1;
      this.transformInfo.scaleY += 0.1;
    } else {
      this.transformInfo.scaleX -= 0.1;
      this.transformInfo.scaleY -= 0.1;
    }

    const previewWidth = Math.round(
      this.videoInfo.renderWidth * (1 - this.transformInfo.scaleX)
    );
    const previewHeight = Math.round(
      this.videoInfo.renderHeight * (1 - this.transformInfo.scaleY)
    );
    this.previewPositon.x = Math.round(
      this.videoInfo.renderX + previewWidth / 2
    );
    this.previewPositon.y = Math.round(
      this.videoInfo.renderY + previewHeight / 2
    );
    this.previewPositon.width = Math.round(
      this.videoInfo.renderWidth * this.transformInfo.scaleX
    );
    this.previewPositon.height = Math.round(
      this.videoInfo.renderHeight * this.transformInfo.scaleY
    );

    this.updateStyle();
  }

  public videoTransfromDown() {
    this.lastTransformInfo = {...this.transformInfo};
  }

  public videoTransfromMove(e: MouseEvent, grabInfo: IGrabInfo) {
    if (grabInfo.grab) {
      console.log(this.lastTransformInfo);
      const x = e.clientX - grabInfo.grabX;
      const y = e.clientY - grabInfo.grabY;
      this.transformInfo.translateX = this.lastTransformInfo.translateX + x;
      this.transformInfo.translateY = this.lastTransformInfo.translateY + y;
      this.updateStyle();
    }
  }
}

export default Video;
