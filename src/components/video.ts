class Video {
  private videoElement: HTMLVideoElement | null = null;
  public duration: number = 0;
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
  private previewPositonFunc: (transformInfo: ITransformInfo) => void = () => {};
  public transformInfo: ITransformInfo = {
    scale: 1,
    translateX: 0,
    translateY: 0
  }

  constructor(videoElement: HTMLVideoElement, videoInfo: IVideoInfo) {
    this.videoElement = videoElement;
    this.videoInfo = videoInfo;
    this.duration = videoInfo.duration;
    this.videoElement.setAttribute("class", "video-cropper-video");
    this.updateStyle();
  }

  play() {
    this.videoElement!.play();
  }

  pause() {
    this.videoElement!.pause();
  }

  setCurrentTime(time: number) {
    if (time >= this.videoInfo!.duration) {
      time = this.videoInfo!.duration;
    }

    if (time <= 0) {
      time = 0;
    }
    this.videoElement!.currentTime = time;
  }

  updateStyle() {
     this.videoElement!.setAttribute(
      "style",
      `--video-cropper-video-scale: ${this.transformInfo.scale};
      --video-cropper-video-translate-x: ${this.transformInfo.translateX}px;
      --video-cropper-video-translate-y: ${this.transformInfo.translateY}px;`
    );
  }

  // TODO: 以鼠标点为中心缩放未实现
  scale(direction: number){
    const scale = this.transformInfo.scale - 0.1;
    if (direction > 0) {
      this.transformInfo.scale += 0.1;
    } else {
      if (scale <= 0.1) {
        return;
      }
      this.transformInfo.scale -= 0.1;
    }
    this.updateStyle();
    this.previewPositonFunc(this.transformInfo);
  }

  setPreviewPositonFunc(func: (transformInfo: ITransformInfo) => void) {
    this.previewPositonFunc = func;
  }
}

export default Video;
