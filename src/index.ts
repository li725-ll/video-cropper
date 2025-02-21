import "./css/index.css";

import Video from "./components/video";
import Canvas from "./components/canvas";
import CropBox from "./components/cropbox";
import ConstraintBox from "./components/constraintbox";
import { ICropBoxPositionFunc, IGrabInfo, IOptions, IRenderVideoInfo, ITransformInfo, IVideoInfo } from "./types";

export default class VideCropper {
  private videoElement: HTMLVideoElement;
  private parent: HTMLDivElement | null = null;
  private container: HTMLElement | null = null;
  private canvas: Canvas | null = null;
  private cropBox: CropBox | null = null;
  private constraintBox: ConstraintBox | null = null;
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
  private transformInfo: ITransformInfo = {
    scale: 1,
    origin: { x: 0, y: 0 },
    translateX: 0,
    translateY: 0,
    type: "scale"
  };

  private grabInfo: IGrabInfo = {
    grab: false,
    grabX: 0,
    grabY: 0,
    originPosition: { x: 0, y: 0 }
  };

  constructor(root: HTMLVideoElement, options?: IOptions) {
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
    this.parent.setAttribute(
      "style",
      `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
    );
    this.video = new Video(this.videoElement, this.videoInfo);

    this.canvas = new Canvas(this.videoInfo);
    this.canvas.setVideo(this.video);

    this.cropBox = new CropBox(this.videoInfo, this.options?.cropboxConfig);

    this.constraintBox = new ConstraintBox(this.parent, this.videoInfo);
    this.constraintBox.setVideo(this.video);
    this.constraintBox.setCanvas(this.canvas);
    this.constraintBox.setCropBox(this.cropBox);

    this.video.setCropBox(this.cropBox);
    this.canvas.setCropBox(this.cropBox);
    this.canvas.setConstraintBox(this.constraintBox);
    this.cropBox.setConstraintBox(this.constraintBox);
    this.video.setConstraintBox(this.constraintBox);

    this.cropBox?.setDrawCropBoxFunc(
      (x: number, y: number, width: number, height: number) => {
        this.canvas?.drawCropbox(x, y, width, height);
      }
    );
    this.registerEvent();
    console.log(this.videoInfo);
  }

  private registerEvent() {
    // scale
    this.constraintBox?.constraintBoxElement!.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        this.transformInfo.origin.x = e.offsetX;
        this.transformInfo.origin.y = e.offsetY;
        this.transformInfo.type = "scale";
        if (this.transformInfo.scale - 0.1 >= 0 && e.deltaY < 0) {
          const { width, height } = this.cropBox?.getPosition()!;
          if (
            this.videoInfo?.renderWidth! * (this.transformInfo.scale - 0.1) <=
            width
          ) {
            this.transformInfo.scale = width / this.videoInfo.renderWidth;
          } else {
            this.transformInfo.scale -= 0.1;
          }

          if (
            this.videoInfo?.renderHeight! * (this.transformInfo.scale - 0.1) <=
            height
          ) {
            this.transformInfo.scale = height / this.videoInfo.renderHeight;
          } else {
            this.transformInfo.scale -= 0.1;
          }
        }
        if (e.deltaY > 0) {
          this.transformInfo.scale += 0.1;
        }
        this.constraintBox!.transform(this.transformInfo);
      }
    );

    // move
    this.constraintBox!.constraintBoxElement?.addEventListener(
      "mousedown",
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.grabInfo.grab = true;
        this.grabInfo.grabX = e.clientX;
        this.grabInfo.grabY = e.clientY;
        this.grabInfo.originPosition = {
          x: this.constraintBox?.getConstraintBoxPosition().x!,
          y: this.constraintBox?.getConstraintBoxPosition().y!
        };
        this.canvas?.setGrab(this.grabInfo.grab);
      }
    );
    this.constraintBox!.constraintBoxElement?.addEventListener(
      "mousemove",
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.grabInfo.grab) {
          this.transformInfo.type = "move";
          this.transformInfo.translateX =
            e.clientX - this.grabInfo.grabX + this.grabInfo.originPosition?.x!;
          this.transformInfo.translateY =
            e.clientY - this.grabInfo.grabY + this.grabInfo.originPosition?.y!;
          this.constraintBox!.transform(this.transformInfo);
        }
      }
    );
    this.constraintBox!.constraintBoxElement?.addEventListener(
      "mouseup",
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.grabInfo.grab = false;
        this.canvas?.setGrab(this.grabInfo.grab);
      }
    );
  }

  private calculateRenderVideoInfo(): IRenderVideoInfo {
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

  public getVideo(): Video {
    return this.video!;
  }

  public setCropBoxPositionFunc(cropPositionFunc: ICropBoxPositionFunc) {
    this.cropBox?.setCropBoxPositionFunc(cropPositionFunc);
  }
}
