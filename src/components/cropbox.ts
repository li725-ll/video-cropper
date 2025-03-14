import {
  ICropBoxConfig,
  ICropBoxPositionFunc,
  IDrawCropBoxFunc,
  IPosition,
  IVideoInfo
} from "../types";
import ConstraintBox from "./constraintbox";

class CropBox {
  public cropBoxElement: HTMLElement | null = null;
  private anchors: HTMLElement[] = [];
  private grids: HTMLElement[] = [];
  private boders: HTMLElement[] = [];
  private pointerContainer: HTMLElement | null = null;
  private gridContainer: HTMLElement | null = null;
  private broderContainer: HTMLElement | null = null;
  private zIndex = 99;
  private constraintBox: ConstraintBox | null = null;
  private drawCropbox: IDrawCropBoxFunc = () => {};
  private cropBoxPositionFunc: ICropBoxPositionFunc = () => {};
  private borderLimitInfo: {
    direction: "top" | "bottom" | "left" | "right";
    position: IPosition;
  } = {
    direction: "top",
    position: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  };
  private originalPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 上一次裁剪框的位置
  private previewPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  private readonly position: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 裁剪框的位置
  private positionProxy: any;
  private constraintBoxPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  private mapPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 原始视频映射位置
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
  private cropBoxConfig: ICropBoxConfig = {
    aspectRatio: 0, // 裁剪框的宽高比
    rate: 0.5, // 裁剪框的大小缩放比例
    disengage: false
  };

  constructor(videoInfo: IVideoInfo, cropBoxConfig?: ICropBoxConfig) {
    this.videoInfo = videoInfo;
    cropBoxConfig && (this.cropBoxConfig = cropBoxConfig);
    this.cropBoxConfig.disengage = this.cropBoxConfig.disengage || false;

    this.positionProxy = new Proxy<IPosition>(this.position, {
      set: (
        target: IPosition,
        key: "x" | "y" | "width" | "height",
        value: number
      ) => {
        if (this.cropBoxConfig.disengage) {
          switch (
            key // 增加约束条件，用于限制裁剪框的位置
          ) {
            case "x": {
              if (value <= 0) {
                target[key] = 0;
                return true;
              }

              if (value >= this.constraintBox!.width - this.position.width) {
                target[key] = this.constraintBox!.width - this.position.width;
                return true;
              }
              break;
            }
            case "y": {
              if (value <= 0) {
                target[key] = 0;
                return true;
              }

              if (value >= this.constraintBox!.height - this.position.height) {
                target[key] = this.constraintBox!.height - this.position.height;
                return true;
              }
              break;
            }
            case "width": {
              if (value <= 20) {
                target[key] = 20;
                return true;
              }
              break;
            }
            case "height": {
              if(value <= 20 / this.cropBoxConfig.aspectRatio!) {
                target[key] = 20 / this.cropBoxConfig.aspectRatio!;
                return true;
              }
              break;
            }
            default: {
              break;
            }
          }
        }
        target[key] = value;
        return true;
      },
      get: (target: IPosition, key: "x" | "y" | "width" | "height") => {
        return target[key];
      }
    });
    this.initCropbox();
  }

  public setConstraintBox(constraintBox: ConstraintBox) {
    // 设置约束框
    this.constraintBox = constraintBox;
    this.previewPosition = {
      x: this.constraintBox.x,
      y: this.constraintBox.y,
      width: this.constraintBox.width,
      height: this.constraintBox.height
    };
    this.constraintBoxPosition = {
      ...this.previewPosition
    };

    const position =
      this.cropBoxConfig?.position || this.calculateAspectRatio();
    this.positionProxy.x = position.x;
    this.positionProxy.y = position.y;
    this.positionProxy.width = position.width;
    this.positionProxy.height = position.height;

    this.updateStyle();
    this.updateMapPostion();
  }

  public borderMove(
    distanceX: number,
    distanceY: number,
    direction: 0 | 1 | 2 | 3
  ) {
    switch (direction) {
      case 0:
        this.cropboxScale(distanceX, distanceY, 1);
        break;
      case 1:
        this.cropboxScale(distanceX, distanceY, 4);
        break;
      case 2:
        this.cropboxScale(distanceX, distanceY, 6);
        break;
      case 3:
        this.cropboxScale(distanceX, distanceY, 3);
        break;
      default:
        break;
    }
  }

  public pointerMove(
    distanceX: number,
    distanceY: number,
    direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  ) {
    this.cropboxScale(distanceX, distanceY, direction);
  }

  public setOriginalPosition() {
    this.originalPosition.x = this.position.x;
    this.originalPosition.y = this.position.y;
    this.originalPosition.width = this.position.width;
    this.originalPosition.height = this.position.height;
  }

  public getOriginalPosition() {
    return this.originalPosition;
  }

  private updateStyle() {
    const position = this.normalizePosition(this.position);
    const style = `
      --crop-box-z-index: ${this.zIndex};
      --crop-box-left: ${position.x}px;
      --crop-box-top: ${position.y}px;
      --crop-box-width: ${position.width}px;
      --crop-box-height: ${position.height}px;
    `;
    this.cropBoxElement!.setAttribute("style", style);
  }

  public normalizePosition(position: IPosition) {
    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    if (this.position.width < 0) {
      result.width = position.width * -1;
      result.x = position.x + position.width;
    } else {
      result.width = position.width;
      result.x = position.x;
    }

    if (position.height < 0) {
      result.height = position.height * -1;
      result.y = position.y + position.height;
    } else {
      result.height = position.height;
      result.y = position.y;
    }

    return result;
  }

  setDrawCropBoxFunc(drawCropbox: IDrawCropBoxFunc) {
    this.drawCropbox = drawCropbox;
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
  }

  setCropBoxPositionFunc(cropBoxPositionFunc: ICropBoxPositionFunc) {
    this.cropBoxPositionFunc = cropBoxPositionFunc;
  }

  public updataSize() {
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
    this.updateStyle();
  }

  private calculateBorderDistanceLeftTop() {
    const borderDistance = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right:
        this.constraintBox!.width -
        this.originalPosition.x -
        this.originalPosition.width,
      bottom:
        this.constraintBox!.height -
        this.originalPosition.y -
        this.originalPosition.height
    };
    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    if (
      this.originalPosition.y -
        borderDistance.left / this.cropBoxConfig.aspectRatio! >=
      0
    ) {
      this.borderLimitInfo.direction = "left";
      result.x = this.originalPosition.x - borderDistance.left;
      result.y =
        this.originalPosition.y -
        borderDistance.left / this.cropBoxConfig.aspectRatio!;
      result.width = this.originalPosition.width + borderDistance.left;
      result.height =
        this.originalPosition.height +
        borderDistance.left / this.cropBoxConfig.aspectRatio!;
    } else {
      this.borderLimitInfo.direction = "top";
      result.x =
        this.originalPosition.x - borderDistance.top * this.cropBoxConfig.aspectRatio!;
      result.y = this.originalPosition.y - borderDistance.top;
      result.width =
        this.originalPosition.width +
        borderDistance.top * this.cropBoxConfig.aspectRatio!;
      result.height = this.originalPosition.height + borderDistance.top;
    }
    this.borderLimitInfo.position = result;
  }

  private calculateBorderDistanceTop() {
    const borderDistance = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right:
        this.constraintBox!.width -
        this.originalPosition.x -
        this.originalPosition.width,
      bottom:
        this.constraintBox!.height -
        this.originalPosition.y -
        this.originalPosition.height
    };

    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    const topTime = borderDistance.top / 1;
    const rightTime = borderDistance.right / (this.cropBoxConfig.aspectRatio! / 2);
    const bottomTime = Infinity;
    const leftTime = borderDistance.left / (this.cropBoxConfig.aspectRatio! / 2);

    const time = Math.min(topTime, rightTime, bottomTime, leftTime);
    switch (time) {
      case topTime: {
        this.borderLimitInfo.direction = "top";
        result.x =
          this.originalPosition.x -
          (borderDistance.top * this.cropBoxConfig.aspectRatio!) / 2;
        result.y = this.originalPosition.y - borderDistance.top;
        result.width =
          this.originalPosition.width +
          borderDistance.top * this.cropBoxConfig.aspectRatio!;
        result.height = this.originalPosition.height + borderDistance.top;
        break;
      }
      case rightTime: {
        this.borderLimitInfo.direction = "right";
        result.x = this.originalPosition.x - borderDistance.right;
        result.y =
          this.originalPosition.y -
          (borderDistance.right * 2) / this.cropBoxConfig.aspectRatio!;
        result.width = this.originalPosition.width + borderDistance.right * 2;
        result.height =
          this.originalPosition.height +
          (borderDistance.right * 2) / this.cropBoxConfig.aspectRatio!;
        break;
      }
      case leftTime: {
        this.borderLimitInfo.direction = "left";
        result.x = this.originalPosition.x - borderDistance.left;
        result.y =
          this.originalPosition.y -
          (borderDistance.left * 2) / this.cropBoxConfig.aspectRatio!;
        result.width = this.originalPosition.width + borderDistance.left * 2;
        result.height =
          this.originalPosition.height +
          (borderDistance.left * 2) / this.cropBoxConfig.aspectRatio!;
        break;
      }
    }
    this.borderLimitInfo.position = result;
  }

  private calculateBorderDistanceRightTop() {
    const borderDistance = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right:
        this.constraintBox!.width -
        this.originalPosition.x -
        this.originalPosition.width,
      bottom:
        this.constraintBox!.height -
        this.originalPosition.y -
        this.originalPosition.height
    };
    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    if (
      this.originalPosition.y -
        borderDistance.right / this.cropBoxConfig.aspectRatio! >=
      0
    ) {
      this.borderLimitInfo.direction = "right";
      result.x = this.originalPosition.x;
      result.y =
        this.originalPosition.y -
        borderDistance.right / this.cropBoxConfig.aspectRatio!;
      result.width = this.originalPosition.width + borderDistance.right;
      result.height =
        this.originalPosition.height +
        borderDistance.right / this.cropBoxConfig.aspectRatio!;
    } else {
      this.borderLimitInfo.direction = "top";
      result.x = this.originalPosition.x;
      result.y = this.originalPosition.y - borderDistance.top;
      result.width =
        this.originalPosition.width +
        borderDistance.top * this.cropBoxConfig.aspectRatio!;
      result.height = this.originalPosition.height + borderDistance.top;
    }
    this.borderLimitInfo.position = result;
  }

  private calculateBorderDistanceRight() {
    const borderDistance = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right:
        this.constraintBox!.width -
        this.originalPosition.x -
        this.originalPosition.width,
      bottom:
        this.constraintBox!.height -
        this.originalPosition.y -
        this.originalPosition.height
    };
    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    const topTime = borderDistance.top / (1 / 2 / this.cropBoxConfig.aspectRatio!);
    const rightTime = borderDistance.right / 1;
    const bottomTime =
      borderDistance.bottom / (1 / 2 / this.cropBoxConfig.aspectRatio!);
    const leftTime = Infinity;

    const time = Math.min(topTime, rightTime, bottomTime, leftTime);
    switch (time) {
      case topTime: {
        this.borderLimitInfo.direction = "top";
        result.x = this.originalPosition.x;
        result.y = this.originalPosition.y - borderDistance.top;
        result.width =
          this.originalPosition.width +
          borderDistance.top * 2 * this.cropBoxConfig.aspectRatio!;
        result.height = this.originalPosition.height + borderDistance.top * 2;
        break;
      }
      case rightTime: {
        this.borderLimitInfo.direction = "right";
        result.x = this.originalPosition.x;
        result.y =
          this.originalPosition.y -
          borderDistance.right / this.cropBoxConfig.aspectRatio! / 2;
        result.width = this.originalPosition.width + borderDistance.right;
        result.height =
          this.originalPosition.height +
          borderDistance.right / this.cropBoxConfig.aspectRatio!;
        break;
      }
      case bottomTime: {
        this.borderLimitInfo.direction = "bottom";
        result.x = this.originalPosition.x;
        result.y = this.originalPosition.y - borderDistance.bottom;
        result.width =
          this.originalPosition.width +
          borderDistance.bottom * 2 * this.cropBoxConfig.aspectRatio!;
        result.height =
          this.originalPosition.height + borderDistance.bottom * 2;
        break;
      }
    }

    this.borderLimitInfo.position = result;
  }

  private calculateBorderDistanceRightBottom() {
    const borderDistance = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right:
        this.constraintBox!.width -
        this.originalPosition.x -
        this.originalPosition.width,
      bottom:
        this.constraintBox!.height -
        this.originalPosition.y -
        this.originalPosition.height
    };
    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    if (
      this.originalPosition.y +
        this.originalPosition.height +
        borderDistance.right / this.cropBoxConfig.aspectRatio! <=
      this.constraintBox!.height
    ) {
      this.borderLimitInfo.direction = "right";
      result.x = this.originalPosition.x;
      result.y = this.originalPosition.y;
      result.width = this.originalPosition.width + borderDistance.right;
      result.height =
        this.originalPosition.height +
        borderDistance.right / this.cropBoxConfig.aspectRatio!;
    } else {
      this.borderLimitInfo.direction = "bottom";
      result.x = this.originalPosition.x;
      result.y = this.originalPosition.y;
      result.width =
        this.originalPosition.width +
        borderDistance.bottom * this.cropBoxConfig.aspectRatio!;
      result.height = this.originalPosition.height + borderDistance.bottom;
    }
    this.borderLimitInfo.position = result;
  }

  private calculateBorderDistanceBottom() {
    const borderDistance = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right:
        this.constraintBox!.width -
        this.originalPosition.x -
        this.originalPosition.width,
      bottom:
        this.constraintBox!.height -
        this.originalPosition.y -
        this.originalPosition.height
    };
    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    const topTime = Infinity;
    const rightTime = borderDistance.right / (this.cropBoxConfig.aspectRatio! / 2);
    const bottomTime = borderDistance.bottom / 1;
    const leftTime = borderDistance.left / (this.cropBoxConfig.aspectRatio! / 2);

    const time = Math.min(topTime, rightTime, bottomTime, leftTime);
    switch (time) {
      case rightTime: {
        this.borderLimitInfo.direction = "right";
        result.x = this.originalPosition.x - borderDistance.right;
        result.y = this.originalPosition.y;
        result.width = this.originalPosition.width + borderDistance.right * 2;
        result.height =
          this.originalPosition.height +
          (borderDistance.right * 2) / this.cropBoxConfig.aspectRatio!;
        break;
      }
      case bottomTime: {
        this.borderLimitInfo.direction = "bottom";
        result.x =
          this.originalPosition.x -
          (borderDistance.bottom * this.cropBoxConfig.aspectRatio!) / 2;
        result.y = this.originalPosition.y;
        result.width =
          this.originalPosition.width +
          borderDistance.bottom * this.cropBoxConfig.aspectRatio!;
        result.height = this.originalPosition.height + borderDistance.bottom;
        break;
      }
      case leftTime: {
        this.borderLimitInfo.direction = "left";
        result.x = this.originalPosition.x - borderDistance.left;
        result.y = this.originalPosition.y;
        result.width = this.originalPosition.width + borderDistance.left * 2;
        result.height =
          this.originalPosition.height +
          (borderDistance.left * 2) / this.cropBoxConfig.aspectRatio!;
        break;
      }
    }

    this.borderLimitInfo.position = result;
  }

  private calculateBorderDistanceLeftBottom() {
    const borderDistance = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right:
        this.constraintBox!.width -
        this.originalPosition.x -
        this.originalPosition.width,
      bottom:
        this.constraintBox!.height -
        this.originalPosition.y -
        this.originalPosition.height
    };
    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    if (
      this.originalPosition.y +
        this.originalPosition.height +
        borderDistance.left / this.cropBoxConfig.aspectRatio! <=
      this.constraintBox!.height
    ) {
      this.borderLimitInfo.direction = "left";
      result.x = this.originalPosition.x - borderDistance.left;
      result.y = this.originalPosition.y;
      result.width = this.originalPosition.width + borderDistance.left;
      result.height =
        this.originalPosition.height +
        borderDistance.left / this.cropBoxConfig.aspectRatio!;
    } else {
      this.borderLimitInfo.direction = "bottom";
      result.x =
        this.originalPosition.x -
        borderDistance.bottom * this.cropBoxConfig.aspectRatio!;
      result.y = this.originalPosition.y;
      result.width =
        this.originalPosition.width +
        borderDistance.bottom * this.cropBoxConfig.aspectRatio!;
      result.height = this.originalPosition.height + borderDistance.bottom;
    }
    this.borderLimitInfo.position = result;
  }

  private calculateBorderDistanceLeft() {
    const borderDistance = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right:
        this.constraintBox!.width -
        this.originalPosition.x -
        this.originalPosition.width,
      bottom:
        this.constraintBox!.height -
        this.originalPosition.y -
        this.originalPosition.height
    };
    const result: IPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    const topTime = borderDistance.top / 1;
    const rightTime = Infinity;
    const bottomTime =
      borderDistance.bottom / (1 / 2 / this.cropBoxConfig.aspectRatio!);
    const leftTime = borderDistance.left / (1 / 2 / this.cropBoxConfig.aspectRatio!);

    const time = Math.min(topTime, rightTime, bottomTime, leftTime);
    switch (time) {
      case topTime: {
        this.borderLimitInfo.direction = "top";
        result.x =
          this.originalPosition.x -
          borderDistance.top * 2 * this.cropBoxConfig.aspectRatio!;
        result.y = this.originalPosition.y - borderDistance.top;
        result.width =
          this.originalPosition.width +
          borderDistance.top * 2 * this.cropBoxConfig.aspectRatio!;
        result.height = this.originalPosition.height + borderDistance.top * 2;
        break;
      }
      case bottomTime: {
        this.borderLimitInfo.direction = "bottom";
        result.x =
          this.originalPosition.x -
          borderDistance.bottom * 2 * this.cropBoxConfig.aspectRatio!;
        result.y = this.originalPosition.y - borderDistance.bottom;
        result.width =
          this.originalPosition.width +
          borderDistance.bottom * 2 * this.cropBoxConfig.aspectRatio!;
        result.height =
          this.originalPosition.height + borderDistance.bottom * 2;
        break;
      }
      case leftTime: {
        this.borderLimitInfo.direction = "left";
        result.x = this.originalPosition.x - borderDistance.left;
        result.y =
          this.originalPosition.y -
          borderDistance.left / this.cropBoxConfig.aspectRatio! / 2;
        result.width = this.originalPosition.width + borderDistance.left;
        result.height =
          this.originalPosition.height +
          borderDistance.left / this.cropBoxConfig.aspectRatio!;
        break;
      }
    }

    this.borderLimitInfo.position = result;
  }

  private calculateAspectRatio(): IPosition {
    this.cropBoxConfig.rate = this.cropBoxConfig.rate || 0.5;
    if (this.cropBoxConfig?.aspectRatio === 0) {
      // 自由比例
      return {
        x:
          (this.constraintBoxPosition.width -
            this.videoInfo.renderWidth * this.cropBoxConfig.rate!) /
          2,
        y:
          (this.constraintBoxPosition.height -
            this.videoInfo.renderHeight * this.cropBoxConfig.rate!) /
          2,
        width: this.videoInfo.renderWidth * this.cropBoxConfig.rate!,
        height: this.videoInfo.renderHeight * this.cropBoxConfig.rate!
      };
    } else {
      const temp = Math.min(
        this.videoInfo.renderWidth * this.cropBoxConfig.rate!,
        this.videoInfo.renderHeight * this.cropBoxConfig.rate!
      ); // 宽和高中窄的那一个
      if (this.cropBoxConfig!.aspectRatio! >= 1) { // TODO:非自由模式需要加限制
        const width = temp;
        const height = temp / this.cropBoxConfig!.aspectRatio!;
        return {
          x: (this.constraintBoxPosition.width - width) / 2,
          y: (this.constraintBoxPosition.height - height) / 2,
          width,
          height
        };
      } else {
        const width = temp * this.cropBoxConfig!.aspectRatio!;
        const height = temp;

        return {
          x: (this.constraintBoxPosition.width - width) / 2,
          y: (this.constraintBoxPosition.height - height) / 2,
          width,
          height
        };
      }
    }
  }

  private initCropbox() {
    this.cropBoxElement = document.createElement("div");
    this.cropBoxElement.setAttribute("class", "video-cropper-crop-box");
    this.initGrid();
    this.initBorder();
    this.initPointer();
    this.cropBoxElement.appendChild(this.gridContainer!);
    this.cropBoxElement.appendChild(this.broderContainer!);
    this.cropBoxElement.appendChild(this.pointerContainer!);
  }

  private initPointer() {
    this.pointerContainer = document.createElement("div");
    this.pointerContainer.setAttribute(
      "class",
      "video-cropper-crop-box-pointer-container"
    );
    this.anchors = Array(8).fill(null);
    this.anchors = this.anchors.map((_, index) => {
      const anchor = document.createElement("div");
      anchor.setAttribute(
        "class",
        `video-cropper-anchor-${index} video-cropper-anchor`
      );
      anchor.dataset.eventType = `pointer-move-${index}`;
      this.pointerContainer!.appendChild(anchor);
      return anchor;
    });
  }

  private initGrid() {
    this.gridContainer = document.createElement("div");
    this.gridContainer.setAttribute(
      "class",
      "video-cropper-crop-box-grid-container"
    );
    this.gridContainer.dataset.eventType = "grid-move";
    this.grids = Array(9).fill(null);
    this.grids.forEach((_, index) => {
      const grid = document.createElement("div");
      grid.setAttribute(
        "class",
        `video-cropper-crop-box-grid-${index} video-cropper-crop-box-grid`
      );
      grid.dataset.eventType = "grid-move";
      this.gridContainer!.appendChild(grid);
    });
  }

  private initBorder() {
    this.broderContainer = document.createElement("div");
    this.broderContainer.setAttribute(
      "class",
      "video-cropper-crop-box-border-container"
    );
    const temp = document.createElement("div");
    temp.dataset.eventType = "grid-move";
    temp.setAttribute("class", "video-cropper-crop-box-border-temp");
    this.boders = Array(4).fill(null);
    this.boders = this.boders.map((_, index) => {
      const border = document.createElement("div");
      border.setAttribute(
        "class",
        `video-cropper-crop-box-border-${index} video-cropper-crop-box-border`
      );
      border.dataset.eventType = `border-move-${index}`;
      temp.appendChild(border);
      return border;
    });
    this.broderContainer!.appendChild(temp);
  }

  public cropboxMove(distanceX: number, distanceY: number) {
    const x = this.originalPosition.x + distanceX;
    const y = this.originalPosition.y + distanceY;
    this.positionProxy.x = x;
    this.positionProxy.y = y;

    this.updateStyle();
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );

    this.updateMapPostion();
    this.cropBoxPositionFunc(
      this.mapPosition,
      this.normalizePosition(this.position)
    );
  }

  private borderTopMove(distanceY: number, direction: number) {
    let x = this.originalPosition.x;
    const y = this.originalPosition.y + distanceY;
    let width = this.originalPosition.width;
    const height = this.originalPosition.height - distanceY;
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const temp = -distanceY * this.cropBoxConfig!.aspectRatio!; // 向上拉升导致增加的宽度
      if (direction === 0) {
        x = this.originalPosition.x - temp; // 向左上角拉升导致增加的宽度全部改到x上
      } else if (direction === 1) {
        // 向上角拉升导致增加的宽度的一半改到x上
        x = this.originalPosition.x - temp / 2;
      }
      // 向上角拉升不改变x，只改变宽度。其他的改变也都该宽度
      width = this.originalPosition.width + temp;

      if (this.cropBoxConfig.disengage) {
        switch (this.borderLimitInfo.direction) {
          case "top": {
            if (y <= this.borderLimitInfo.position.y) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
          case "right": {
            if (x <= this.borderLimitInfo.position.x) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
          case "left": {
            if (x <= this.borderLimitInfo.position.x) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
        }
      }
    }

    this.positionProxy.x = x;
    this.positionProxy.y = y;
    this.positionProxy.width = width;
    this.positionProxy.height = height;
  }

  private borderRightMove(distanceX: number, direction: number) {
    let x = this.originalPosition.x;
    let y = this.originalPosition.y;
    const width = this.originalPosition.width + distanceX;
    let height = this.originalPosition.height;
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const temp = distanceX / this.cropBoxConfig!.aspectRatio!;

      if (direction === 2) {
        y = this.originalPosition.y - temp;
      } else if (direction === 4) {
        y = this.originalPosition.y - temp / 2;
      }
      height = this.originalPosition.height + temp;

      if (this.cropBoxConfig.disengage) {
        switch (this.borderLimitInfo.direction) {
          case "top": {
            if (y <= this.borderLimitInfo.position.y) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
          case "right": {
            if (width >= this.borderLimitInfo.position.width) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
          case "bottom": {
            if (height >= this.borderLimitInfo.position.height) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
        }
      }
    }

    this.positionProxy.x = x;
    this.positionProxy.y = y;
    this.positionProxy.width = width;
    this.positionProxy.height = height;
  }

  private borderBottomMove(distanceY: number, direction: number) {
    let x = this.originalPosition.x;
    const y = this.originalPosition.y;
    let width = this.originalPosition.width;
    const height = this.originalPosition.height + distanceY;

    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const temp = distanceY * this.cropBoxConfig!.aspectRatio!;

      if (direction === 5) {
        x = this.originalPosition.x - temp;
      } else if (direction === 6) {
        x = this.originalPosition.x - temp / 2;
      }

      width = this.originalPosition.width + temp;

      if (this.cropBoxConfig.disengage) {
        switch (this.borderLimitInfo.direction) {
          case "right": {
            if (width >= this.borderLimitInfo.position.width) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
          case "left": {
            if (x <= this.borderLimitInfo.position.x) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
          case "bottom": {
            if (height >= this.borderLimitInfo.position.height) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
        }
      }
    }

    this.positionProxy.x = x;
    this.positionProxy.y = y;
    this.positionProxy.width = width;
    this.positionProxy.height = height;
  }

  public borderLeftMove(distanceX: number, direction: number) {
    const x = this.originalPosition.x + distanceX;
    let y = this.originalPosition.y;
    const width = this.originalPosition.width - distanceX;
    let height = this.originalPosition.height;

    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const temp = -distanceX / this.cropBoxConfig!.aspectRatio!;

      if (direction === 0) {
        y = this.originalPosition.y - temp;
      } else if (direction === 3) {
        y = this.originalPosition.y - temp / 2;
      }

      height = this.originalPosition.height + temp;

      if (this.cropBoxConfig.disengage) {
        switch (this.borderLimitInfo.direction) {
          case "top": {
            if (y <= this.borderLimitInfo.position.y) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
          case "left": {
            if (x <= this.borderLimitInfo.position.x) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
          case "bottom": {
            if (height >= this.borderLimitInfo.position.height) {
              this.positionProxy.x = this.borderLimitInfo.position.x;
              this.positionProxy.y = this.borderLimitInfo.position.y;
              this.positionProxy.width = this.borderLimitInfo.position.width;
              this.positionProxy.height = this.borderLimitInfo.position.height;
              return;
            }
            break;
          }
        }
      }
    }

    this.positionProxy.x = x;
    this.positionProxy.y = y;
    this.positionProxy.width = width;
    this.positionProxy.height = height;
  }

  // TODO: disengage = true还未实现，等比缩放未实现
  private cropboxScale(
    distanceX: number,
    distanceY: number,
    direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  ) {
    switch (direction) {
      case 0: {
        this.calculateBorderDistanceLeftTop();
        this.borderLeftMove(distanceX, direction);
        this.borderTopMove(distanceY, direction);
        break;
      }
      case 1: {
        this.calculateBorderDistanceTop();
        this.borderTopMove(distanceY, direction);
        break;
      }
      case 2: {
        this.calculateBorderDistanceRightTop();
        this.borderTopMove(distanceY, direction);
        this.borderRightMove(distanceX, direction);
        break;
      }
      case 3: {
        this.calculateBorderDistanceLeft();
        this.borderLeftMove(distanceX, direction);
        break;
      }
      case 4: {
        this.calculateBorderDistanceRight();
        this.borderRightMove(distanceX, direction);
        break;
      }
      case 5: {
        this.calculateBorderDistanceLeftBottom();
        this.borderBottomMove(distanceY, direction);
        this.borderLeftMove(distanceX, direction);
        break;
      }
      case 6: {
        this.calculateBorderDistanceBottom();
        this.borderBottomMove(distanceY, direction);
        break;
      }
      case 7: {
        this.calculateBorderDistanceRightBottom();
        this.borderBottomMove(distanceY, direction);
        this.borderRightMove(distanceX, direction);
        break;
      }
    }
    this.updateStyle();
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
    this.updateMapPostion();
    this.cropBoxPositionFunc(
      this.normalizePosition(this.mapPosition),
      this.normalizePosition(this.position)
    );
  }

  private updateMapPostion() {
    this.mapPosition.x = Math.round(
      ((this.positionProxy.x * this.videoInfo.renderWidth) /
        this.constraintBox?.getConstraintBoxPosition().width!) *
        this.videoInfo.realProportion
    );
    this.mapPosition.y = Math.round(
      ((this.positionProxy.y * this.videoInfo.renderHeight) /
        this.constraintBox?.getConstraintBoxPosition().height!) *
        this.videoInfo.realProportion
    );
    this.mapPosition.width = Math.round(
      ((this.positionProxy.width * this.videoInfo.renderWidth) /
        this.constraintBox?.getConstraintBoxPosition().width!) *
        this.videoInfo.realProportion
    );
    this.mapPosition.height = Math.round(
      ((this.positionProxy.height * this.videoInfo.renderHeight) /
        this.constraintBox?.getConstraintBoxPosition().height!) *
        this.videoInfo.realProportion
    );
  }

  public setPreviewPosition(previewPositon: IPosition) {
    this.previewPosition = previewPositon;
  }

  public show(flag: boolean) {
    this.zIndex = flag ? 99 : -1;
    this.updateStyle();
  }

  public getPosition(): IPosition {
    return this.position;
  }

  public setPosition(position: IPosition): void {
    this.positionProxy.x = position.x;
    this.positionProxy.y = position.y;
    this.positionProxy.width = position.width;
    this.positionProxy.height = position.height;
  }

  public getMapPosition(): IPosition {
    return this.mapPosition;
  }
}

export default CropBox;
