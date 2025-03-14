import "./css/index.css";

import Video from "./components/video";
import Canvas from "./components/canvas";
import CropBox from "./components/cropbox";
import ConstraintBox from "./components/constraintbox";
import {
  ICropBoxPositionFunc,
  IGrabInfo,
  IMouseInfo,
  IOptions,
  IRenderVideoInfo,
  ITransformInfo,
  IVideoInfo
} from "./types";
import Mask from "./components/mask";

export default class VideCropper {
  private videoElement: HTMLVideoElement;
  private parent: HTMLDivElement | null = null;
  private container: HTMLElement | null = null;
  private canvas: Canvas | null = null;
  private cropBox: CropBox | null = null;
  private constraintBox: ConstraintBox | null = null;
  private video: Video | null = null;
  private mask: Mask | null = null;
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
  private mouseInfo: IMouseInfo = {
    type: null,
    mouseX: 0,
    mouseY: 0,
    mouseDown: false
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
    this.initOptions();
    this.init();
  }

  private init() {
    this.parent = document.createElement("div"); // 创建一个父级容器
    this.container = this.videoElement.parentElement!; // 获取video标签的原始父级容器
    this.container.appendChild(this.parent);

    this.parent.setAttribute("class", "video-cropper-parent");
    this.parent.setAttribute(
      "style",
      `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
    );
    this.video = new Video(
      this.videoElement,
      this.videoInfo,
      this.options?.videoConfig
    );

    this.mask = new Mask(this.parent, this.videoInfo);
    this.video.setMask(this.mask);

    this.canvas = new Canvas(this.videoInfo);
    this.canvas.setVideo(this.video);

    this.cropBox = new CropBox(this.videoInfo, this.options?.cropBoxConfig);

    this.constraintBox = new ConstraintBox(
      this.parent,
      this.videoInfo,
      this.options?.constraintBoxConfig
    );
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
    this.grabInfo.originPosition = {
      x: this.constraintBox?.getConstraintBoxPosition().x!,
      y: this.constraintBox?.getConstraintBoxPosition().y!
    };
    this.registerEvent();
  }

  private initOptions() {
    if (this.options?.constraintBoxConfig) {
      // 初始位置
      if (this.options.constraintBoxConfig?.position) {
        this.transformInfo.scale = this.options.constraintBoxConfig.position.width / this.videoInfo.renderWidth;
      }
    }
  }

  private registerEvent() {
    // scale
    this.parent?.addEventListener("wheel", (e: any) => {
      if (e.target.dataset.eventType == "canvas-scale-move") {
        this.transformInfo.origin.x = e.offsetX;
        this.transformInfo.origin.y = e.offsetY;
      } else if (e.target.dataset.eventType != undefined) {
        const position = this.cropBox!.getPosition();
        this.transformInfo.origin.x = position.x + e.offsetX;
        this.transformInfo.origin.y = position.y + e.offsetY;
      } else {
        return;
      }

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
      if (this.options?.cropBoxConfig?.disengage) {
        this.miniLimitScale();
      }
      this.transformScale();
    });

    // parent event
    this.parent?.addEventListener("mousedown", (e: any) => {
      this.mouseInfo.mouseDown = true;
      this.mouseInfo.mouseX = e.clientX;
      this.mouseInfo.mouseY = e.clientY;
      this.mouseInfo.type = e.target.dataset.eventType;
      this.cropBox!.setOriginalPosition();
      if (this.mouseInfo.type === "canvas-scale-move") {
        this.grabInfo.grab = true;
        this.grabInfo.grabX = e.clientX;
        this.grabInfo.grabY = e.clientY;
        this.grabInfo.originPosition = {
          x: this.constraintBox?.getConstraintBoxPosition().x!,
          y: this.constraintBox?.getConstraintBoxPosition().y!
        };
        this.canvas?.setGrab(this.grabInfo.grab);
      }
    });

    document.body?.addEventListener("mouseup", (e) => {
      this.mouseInfo.mouseDown = false;
      if (this.mouseInfo.type === "canvas-scale-move") {
        this.grabInfo.grab = false;
        this.canvas?.setGrab(this.grabInfo.grab);
      }

      const position = this.cropBox!.normalizePosition(
        this.cropBox!.getPosition()
      );
      this.cropBox!.setPosition(position);
    });

    //TODO: 鼠标离开事件
    // this.parent?.addEventListener("mouseleave", (e) => {
    //   this.mouseInfo.mouseDown = false;
    //   if (this.mouseInfo.type === "canvas-scale-move") {
    //     this.grabInfo.grab = false;
    //     this.canvas?.setGrab(this.grabInfo.grab);
    //   }
    // });

    document.body?.addEventListener("mousemove", (e) => {
      if (this.mouseInfo.mouseDown) {
        const distanceX = e.clientX - this.mouseInfo.mouseX;
        const distanceY = e.clientY - this.mouseInfo.mouseY;

        switch (this.mouseInfo.type) {
          case "border-move-0": {
            this.cropBox!.borderMove(distanceX, distanceY, 0);
            break;
          }
          case "border-move-1": {
            this.cropBox!.borderMove(distanceX, distanceY, 1);
            break;
          }
          case "border-move-2": {
            this.cropBox!.borderMove(distanceX, distanceY, 2);
            break;
          }
          case "border-move-3": {
            this.cropBox!.borderMove(distanceX, distanceY, 3);
            break;
          }
          case "pointer-move-0": {
            this.cropBox!.pointerMove(distanceX, distanceY, 0);
            break;
          }
          case "pointer-move-1": {
            this.cropBox!.pointerMove(distanceX, distanceY, 1);
            break;
          }
          case "pointer-move-2": {
            this.cropBox!.pointerMove(distanceX, distanceY, 2);
            break;
          }
          case "pointer-move-3": {
            this.cropBox!.pointerMove(distanceX, distanceY, 3);
            break;
          }
          case "pointer-move-4": {
            this.cropBox!.pointerMove(distanceX, distanceY, 4);
            break;
          }
          case "pointer-move-5": {
            this.cropBox!.pointerMove(distanceX, distanceY, 5);
            break;
          }
          case "pointer-move-6": {
            this.cropBox!.pointerMove(distanceX, distanceY, 6);
            break;
          }
          case "pointer-move-7": {
            this.cropBox!.pointerMove(distanceX, distanceY, 7);
            break;
          }
          case "grid-move": {
            this.cropBox!.cropboxMove(distanceX, distanceY);
            break;
          }
          case "canvas-scale-move": {
            if (this.grabInfo.grab) {
              this.transformInfo.type = "move";
              this.transformInfo.translateX =
                e.clientX -
                this.grabInfo.grabX +
                this.grabInfo.originPosition?.x!;
              this.transformInfo.translateY =
                e.clientY -
                this.grabInfo.grabY +
                this.grabInfo.originPosition?.y!;
              this.constraintBox!.transform(this.transformInfo);
            }
          }
        }
      }
    });
  }

  private transformScale() {
    const constraintBoxPosition =
      this.constraintBox?.getConstraintBoxPosition()!;
    const x =
      constraintBoxPosition.x -
      (this.videoInfo.renderWidth * this.transformInfo.scale -
        constraintBoxPosition.width) *
        (this.transformInfo.origin.x / constraintBoxPosition.width);
    const y =
      constraintBoxPosition.y -
      (this.videoInfo.renderHeight * this.transformInfo.scale -
        constraintBoxPosition.height) *
        (this.transformInfo.origin.y / constraintBoxPosition.height);
    this.transformInfo.translateX = x;
    this.transformInfo.translateY = y;
    const cropBoxPosition = this.cropBox?.getPosition()!;

    let positionX = cropBoxPosition.x + (constraintBoxPosition.x - x);
    let positionY = cropBoxPosition.y + (constraintBoxPosition.y - y);
    if (this.options?.cropBoxConfig?.disengage) {
      const width =
        this.videoInfo?.renderWidth! * this.transformInfo.scale;
      const height =
        this.videoInfo?.renderHeight! * this.transformInfo.scale;
      const endX = width - cropBoxPosition.width;
      const endY = height - cropBoxPosition.height;
      positionX = positionX <= endX ? positionX : endX;
      positionY = positionY <= endY ? positionY : endY;
    }

    this.cropBox!.setPosition({
      x: positionX,
      y: positionY,
      width: cropBoxPosition.width,
      height: cropBoxPosition.height
    });
    this.constraintBox!.transform(this.transformInfo);
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

  public getConstraintBox(): ConstraintBox {
    return this.constraintBox!;
  }

  public getCropBox(): CropBox {
    return this.cropBox!;
  }

  public scale(scale: number, x?: number, y?: number) {
    this.transformInfo.origin.x = x || this.constraintBox!.width / 2;
    this.transformInfo.origin.y = y || this.constraintBox!.height / 2;
    this.transformInfo.type = "scale";
    this.transformInfo.scale += scale;
    if (this.options?.cropBoxConfig?.disengage) {
      this.miniLimitScale();
    }
    this.transformScale();
  }

  private miniLimitScale() {
    const position = this.cropBox!.getPosition();
    const max = Math.max(position.height, position.width);
    const minScale =
      max /
      (max === position.height
        ? this.videoInfo.renderHeight
        : this.videoInfo.renderWidth);
    if (this.transformInfo.scale <= minScale) {
      this.transformInfo.scale = minScale;
    }
  }

  public reset() {
    this.constraintBox!.reset();
  }

  public setCropBoxPositionFunc(cropPositionFunc: ICropBoxPositionFunc) {
    this.cropBox?.setCropBoxPositionFunc(cropPositionFunc);
  }
}
