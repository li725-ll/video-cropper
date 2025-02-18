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
  private relativeOriginPreviewPosition = {
    x: 0,
    y: 0
  }; // 相对放大原点的距离
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
    this.renderPosition = {
      x: 0,
      y: 0,
      width: this.videoInfo.elementWidth,
      height: this.videoInfo.elementHeight
    };
    this.originPosition.x = Math.round(this.videoInfo.elementHeight / 2);
    this.originPosition.y = Math.round(this.videoInfo.elementHeight / 2);
    this.updateRelativeOriginPreviewDistance();
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
    // TODO: video-cropper-video-origin存在问题但元素位置居中时有问题 ${this.transformInfo.origin}
    const style = `--video-cropper-video-origin: center;
      --video-cropper-video-z-index: ${this.previewFlag ? 1000 : 0};
      --video-cropper-video-position: ${this.previewFlag ? "absolute" : "static"};
      --video-cropper-video-scale-x: ${this.transformInfo.scaleX};
       --video-cropper-video-scale-y: ${this.transformInfo.scaleY};
      --video-cropper-video-translate-x: ${this.transformInfo.translateX}px;
      --video-cropper-video-translate-y: ${this.transformInfo.translateY}px;`;
    this.videoElement!.setAttribute("style", style);
  }

  private updateRelativeOriginPreviewDistance(){
    this.relativeOriginPreviewPosition.x =
      this.previewPositon.x - this.originPosition.x
    this.relativeOriginPreviewPosition.y =
      this.previewPositon.y - this.originPosition.y
  }

  public scale(e: WheelEvent) {
    const direction = e.deltaY;
    // const x = e.clientX;
    // const y = e.clientY;
    // this.transformInfo.origin = `${x}px ${y}px`; // TODO: origin存在bug
    const position = this.cropbox?.getPosition();
    const scale = this.transformInfo.scaleX - 0.1;
    if (direction < 0) {
      if (scale <= 0.1) {
        return;
      }
      const temp = this.transformInfo.scaleX - 0.1; // 放大比例
      const distanceX = this.relativeOriginPreviewPosition.x * temp;
      const distanceY = this.relativeOriginPreviewPosition.y * temp;

      const x = this.originPosition.x - Math.abs(distanceX);
      const y = this.originPosition.y - Math.abs(distanceY);

      this.previewPositon.x = Math.max(0, x);
      this.previewPositon.y = Math.max(0, y);
      const endX = Math.min(
        this.videoInfo.elementWidth,
        x + this.videoInfo.renderWidth * temp
      );
      const endY = Math.min(
        this.videoInfo.elementHeight,
        y + this.videoInfo.renderHeight * temp
      );
      this.previewPositon.width = endX - this.previewPositon.x;
      this.previewPositon.height = endY - this.previewPositon.y;
      console.log("scale", this.previewPositon);
      this.cropbox?.setPreviewPosition(this.previewPositon);
      this.transformInfo.scaleX = temp;
      this.transformInfo.scaleY = temp;
    } else {
      const temp = this.transformInfo.scaleY + 0.1; // 放大比例
      const distanceX = this.relativeOriginPreviewPosition.x * temp;
      const distanceY = this.relativeOriginPreviewPosition.y * temp;

      const x = this.originPosition.x - Math.abs(distanceX);
      const y = this.originPosition.y - Math.abs(distanceY);

      this.previewPositon.x = Math.max(0, x);
      this.previewPositon.y = Math.max(0, y);
      const endX = Math.min(
        this.videoInfo.elementWidth,
        x + this.videoInfo.renderWidth * temp
      );
      const endY = Math.min(
        this.videoInfo.elementHeight,
        y + this.videoInfo.renderHeight * temp
      );
      this.previewPositon.width = endX - this.previewPositon.x;
      this.previewPositon.height = endY - this.previewPositon.y;

      this.cropbox?.setPreviewPosition(this.previewPositon);
      this.transformInfo.scaleX = temp;
      this.transformInfo.scaleY = temp;
    }

    this.updateStyle();
  }

  public videoTransfromDown() {
    this.lastTransformInfo = { ...this.transformInfo };
  }

  public videoTransfromMove(e: MouseEvent, grabInfo: IGrabInfo) {
    if (grabInfo.grab) {
      const position = this.cropbox?.getPosition();

      const translateX =
        this.lastTransformInfo.translateX + e.clientX - grabInfo.grabX;
      const translateY =
        this.lastTransformInfo.translateY + e.clientY - grabInfo.grabY;
      const x = this.videoInfo.renderX + translateX; // 平移后坐标
      const y = this.videoInfo.renderY + translateY;

      this.previewPositon.x = Math.max(0, x);
      this.previewPositon.y = Math.max(0, y);
      const endX = Math.min(
        this.videoInfo.elementWidth,
        x + this.videoInfo.renderWidth
      );
      const endY = Math.min(
        this.videoInfo.elementHeight,
        y + this.videoInfo.renderHeight
      );

      const changedWidth = endX - this.previewPositon.x;
      const changedHeight = endY - this.previewPositon.y;

      if (
        changedWidth <= position?.width! ||
        changedHeight <= position?.height!
      ) {
        if (changedWidth <= position?.width!) {
          this.previewPositon.width = position?.width!;
        } else {
          this.transformInfo.translateX = translateX;
        }

        if (changedHeight <= position?.height!) {
          this.previewPositon.height = position?.height!;
        } else {
          this.transformInfo.translateY = translateY;
        }
      } else {
        this.previewPositon.width = changedWidth;
        this.previewPositon.height = changedHeight;
        this.transformInfo.translateX = translateX;
        this.transformInfo.translateY = translateY;
        this.cropbox?.setPreviewPosition(this.previewPositon);
        this.updateRelativeOriginPreviewDistance();
      }
      this.updateStyle();
    }
  }
}

export default Video;
