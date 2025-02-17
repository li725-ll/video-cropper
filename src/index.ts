import "./css/index.css";

import Video from "./components/video";
import Canvas from "./components/canvas";
import CropBox from "./components/cropbox";

export default class VideCropper {
  private videoElement: HTMLVideoElement;
  private parent: HTMLDivElement | null = null;
  private container: HTMLElement | null = null;
  private canvas: Canvas | null = null;
  private cropBox: CropBox | null = null;
  private video: Video | null = null;
  private options: IOptions | undefined = undefined;
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

  constructor(root: HTMLVideoElement, options?:IOptions) {
    this.videoElement = root;
    this.options = options;
    this.videoInfo = {
      elementWidth: this.videoElement.width,
      elementHeight: this.videoElement.height,
      duration: this.videoElement.duration,
      videoWidth: this.videoElement.videoWidth,
      videoHeight: this.videoElement.videoHeight,
      realProportion: 0,
      displayProportion: 0,
      renderHeight: 0,
      renderWidth: 0,
      renderX: 0,
      renderY: 0
    };
    const renderVideoInfo = this.calculateRenderVideoInfo();
    this.videoInfo.renderWidth = renderVideoInfo.renderWidth;
    this.videoInfo.renderHeight = renderVideoInfo.renderHeight;
    this.videoInfo.realProportion = renderVideoInfo.realProportion;
    this.videoInfo.displayProportion = renderVideoInfo.displayProportion;
    this.videoInfo.renderX = renderVideoInfo.renderX;
    this.videoInfo.renderY = renderVideoInfo.renderY;
    this.init();
  }

  init() {
    this.parent = document.createElement("div"); // 创建一个父级容器
    this.container = this.videoElement.parentElement!; // 获取video标签的原始父级容器
    this.container.appendChild(this.parent);

    this.parent.setAttribute("class", "video-cropper-parent");
    this.parent.appendChild(this.videoElement);
    this.parent.setAttribute(
      "style",
      `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
    );
    this.canvas = new Canvas(this.parent, this.videoInfo);
    this.cropBox = new CropBox(this.parent, this.videoInfo, this.options?.cropboxConfig);
    this.video = new Video(this.videoElement, this.videoInfo);
    this.cropBox?.setDrawCropBoxFunc(
      (x: number, y: number, width: number, height: number) => {
        this.canvas?.drawCropbox(x, y, width, height);
      }
    );

    console.log(this.videoInfo);
  }

  calculateRenderVideoInfo(): IRenderVideoInfo {
    const videoAspectRatio =
      this.videoInfo.videoWidth / this.videoInfo.videoHeight;
    const containerAspectRatio =
      this.videoInfo.elementWidth / this.videoInfo.elementHeight;

    if (videoAspectRatio >= containerAspectRatio) {
      const displayProportion =
        this.videoInfo.elementWidth / this.videoInfo.videoWidth;
      const realProportion =
        this.videoInfo.videoWidth / this.videoInfo.elementWidth;
      return {
        renderWidth: this.videoInfo.elementWidth,
        renderHeight: this.videoInfo.videoHeight * displayProportion,
        displayProportion,
        realProportion,
        renderX: 0,
        renderY:
          (this.videoInfo.elementHeight -
            this.videoInfo.videoHeight * displayProportion) /
          2
      };
    } else {
      const displayProportion =
        this.videoInfo.elementHeight / this.videoInfo.videoHeight;
      const realProportion =
        this.videoInfo.videoHeight / this.videoInfo.elementHeight;
      return {
        renderWidth: this.videoInfo.videoWidth * displayProportion,
        renderHeight: this.videoInfo.elementHeight,
        displayProportion,
        realProportion,
        renderX:
          (this.videoInfo.elementWidth -
            this.videoInfo.videoWidth * displayProportion) /
          2,
        renderY: 0
      };
    }
  }

  getVideo(): Video {
    return this.video!;
  }

  setCropBoxPositionFunc(cropPositionFunc: ICropBoxPositionFunc) {
    this.cropBox?.setCropBoxPositionFunc(cropPositionFunc);
  }
}
