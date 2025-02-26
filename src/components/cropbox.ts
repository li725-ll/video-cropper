import { IBorderLimit, ICropBoxConfig, ICropBoxPositionFunc, IDrawCropBoxFunc, IMouseInfo, IPosition, IVideoInfo } from "../types";
import ConstraintBox from "./constraintbox";

class CropBox {
  public cropBoxElement: HTMLElement | null = null;
  private anchors: HTMLElement[] = [];
  private grids: HTMLElement[] = [];
  private boders: HTMLElement[] = [];
  private pointerContainer: HTMLElement | null = null;
  private gridContainer: HTMLElement | null = null;
  private broderContainer: HTMLElement | null = null;
  private rate = 0.5; // 裁剪框的大小缩放比例
  private zIndex = 99;
  private constraintBox: ConstraintBox | null = null;
  private disengage = false; //是否可以脱离视频区域
  private drawCropbox: IDrawCropBoxFunc = () => {};
  private cropBoxPositionFunc: ICropBoxPositionFunc = () => {};
  private originalPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 上一次裁剪框的位置
  private previewPositon: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  private position: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 裁剪框的位置
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
  private borderLimit: IBorderLimit = {
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0
  };
  private cropBoxConfig: ICropBoxConfig = {
    aspectRatio: 0
  };

  constructor(videoInfo: IVideoInfo, cropBoxConfig?: ICropBoxConfig) {
    this.videoInfo = videoInfo;
    cropBoxConfig && (this.cropBoxConfig = cropBoxConfig);
    this.initCropbox();
  }

  public setConstraintBox(constraintBox: ConstraintBox) {
    // 设置约束框
    this.constraintBox = constraintBox;
    this.previewPositon = {
      x: this.constraintBox.x,
      y: this.constraintBox.y,
      width: this.constraintBox.width,
      height: this.constraintBox.height
    };
    this.constraintBoxPosition = {
      ...this.previewPositon
    };

    this.position = this.cropBoxConfig?.position || this.calculateAspectRatio();
    this.calculateBorderLimit();

    this.updateStyle();
    // this.updateMapPostion();
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

  updateStyle() {
    const style = `
      --crop-box-z-index: ${this.zIndex};
      --crop-box-left: ${this.position.x}px;
      --crop-box-top: ${this.position.y}px;
      --crop-box-width: ${this.position.width}px;
      --crop-box-height: ${this.position.height}px;
    `;
    this.cropBoxElement!.setAttribute("style", style);
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

  public calculateBorderLimit() {
    const result = this.disengage // 是否越过图像边缘
      ? {
          startX: 0,
          endX: this.videoInfo.elementWidth - this.position.width,
          startY: 0,
          endY: this.videoInfo.elementHeight - this.position.height
        }
      : {
          startX: this.constraintBox!.x,
          endX:
            this.constraintBox!.x +
            this.constraintBox!.width -
            this.position.width,
          startY: this.constraintBox!.y,
          endY:
            this.constraintBox!.y +
            this.constraintBox!.height -
            this.position.height
        };

    if (this.position.x < result.startX) {
      this.position.x = result.startX;
    }
    if (this.position.y < result.startY) {
      this.position.y = result.startY;
    }
    if (this.position.x > result.endX) {
      this.position.x = result.endX;
    }
    if (this.position.y > result.endY) {
      this.position.y = result.endY;
    }

    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
    this.updateStyle();
    this.borderLimit = result;
  }

  private calculateAspectRatio(): IPosition {
    if (this.cropBoxConfig?.aspectRatio === 0) {
      // 自由比例
      return {
        x:
          (this.constraintBoxPosition.width -
            this.videoInfo.renderWidth * this.rate) /
          2,
        y:
          (this.constraintBoxPosition.height -
            this.videoInfo.renderHeight * this.rate) /
          2,
        width: this.videoInfo.renderWidth * this.rate,
        height: this.videoInfo.renderHeight * this.rate
      };
    } else {
      const temp = Math.min(
        this.videoInfo.renderWidth * this.rate,
        this.videoInfo.renderHeight * this.rate
      ); // 宽和高中窄的那一个
      if (this.cropBoxConfig!.aspectRatio! >= 1) {
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

  initCropbox() {
    this.cropBoxElement = document.createElement("div");
    this.cropBoxElement.setAttribute("class", "video-cropper-crop-box");
    this.initGrid();
    this.initBorder();
    this.initPointer();
    this.cropBoxElement.appendChild(this.gridContainer!);
    this.cropBoxElement.appendChild(this.broderContainer!);
    this.cropBoxElement.appendChild(this.pointerContainer!);
  }

  initPointer() {
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

  initGrid() {
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

  initBorder() {
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
    if (x <= this.borderLimit.startX) {
      this.position.x = this.borderLimit.startX;
    } else if (x >= this.borderLimit.endX) {
      this.position.x = this.borderLimit.endX;
    } else {
      this.position.x = x;
    }

    if (y <= this.borderLimit.startY) {
      this.position.y = this.borderLimit.startY;
    } else if (y >= this.borderLimit.endY) {
      this.position.y = this.borderLimit.endY;
    } else {
      this.position.y = y;
    }

    this.updateStyle();
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
    this.updateMapPostion();
    this.cropBoxPositionFunc(this.mapPosition, this.position);
  }

  private borderLeftMove(distanceX: number) {
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const height = -distanceX * this.cropBoxConfig!.aspectRatio!;
      this.position.y = this.originalPosition.y - height / 2;
      this.position.height = this.originalPosition.height + height;
    }
    const x = this.originalPosition.x + distanceX;
    const width = this.originalPosition.width - distanceX;
    const minWidth = 20;
    const maxWidth = this.originalPosition.x + this.originalPosition.width;
    if (x <= this.borderLimit.startX) {
      this.position.x = this.borderLimit.startX;
      this.position.width = maxWidth;
    } else if (x >= maxWidth - minWidth) {
      this.position.x = maxWidth - minWidth;
      this.position.width = minWidth;
    } else {
      this.position.x = x;
      this.position.width = width;
    }
  }
  private borderTopMove(distanceY: number) {
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const width = -distanceY * this.cropBoxConfig!.aspectRatio!;
      this.position.x = this.originalPosition.x - width / 2;
      this.position.width = this.originalPosition.width + width;
    }
    const y = this.originalPosition.y + distanceY;
    const height = this.originalPosition.height - distanceY;
    const maxHeight = this.originalPosition.y + this.originalPosition.height;
    const minHeight = 20;

    if (y <= this.borderLimit.startY) {
      this.position.y = this.borderLimit.startY;
      this.position.height = maxHeight;
    } else if (y >= maxHeight - minHeight) {
      this.position.y = maxHeight - minHeight;
      this.position.height = minHeight;
    } else {
      this.position.y = y;
      this.position.height = height;
    }
  }

  private borderRightMove(distanceX: number) {
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const height = distanceX * this.cropBoxConfig!.aspectRatio!;
      this.position.y = this.originalPosition.y - height / 2;
      this.position.height = this.originalPosition.height + height;
    }

    const width = this.originalPosition.width + distanceX;
    const minWidth = 20;
    const maxWidth = this.videoInfo.renderWidth - this.originalPosition.x;

    if (width <= minWidth) {
      this.position.width = minWidth;
    } else if (width >= maxWidth) {
      this.position.width = maxWidth;
    } else {
      this.position.width = width;
    }
  }

  private borderBottomMove(distanceY: number) {
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const width = distanceY * this.cropBoxConfig!.aspectRatio!;
      this.position.x = this.originalPosition.x - width / 2;
      this.position.width = this.originalPosition.width + width;
    }
    const height = this.originalPosition.height + distanceY;
    const minHeight = 20;
    const maxHeight = this.videoInfo.renderHeight - this.originalPosition.y;
    if (height <= minHeight) {
      this.position.height = minHeight;
    } else if (height >= maxHeight) {
      this.position.height = maxHeight;
    } else {
      this.position.height = height;
    }
  }

  // TODO: disengage = true还未实现，等比缩放未实现
  private cropboxScale(
    distanceX: number,
    distanceY: number,
    direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  ) {
    switch (direction) {
      case 0: {
        this.borderLeftMove(distanceX);
        this.borderTopMove(distanceY);
        break;
      }
      case 1: {
        this.borderTopMove(distanceY);
        break;
      }
      case 2: {
        this.borderTopMove(distanceY);
        this.borderRightMove(distanceX);
        break;
      }
      case 3: {
        this.borderLeftMove(distanceX);
        break;
      }
      case 4: {
        this.borderRightMove(distanceX);
        break;
      }
      case 5: {
        this.borderBottomMove(distanceY);
        this.borderLeftMove(distanceX);

        break;
      }
      case 6: {
        this.borderBottomMove(distanceY);
        break;
      }
      case 7: {
        this.borderBottomMove(distanceY);
        this.borderRightMove(distanceX);
        break;
      }
    }
    this.updateStyle();
    this.calculateBorderLimit();
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
    this.updateMapPostion();
    this.cropBoxPositionFunc(this.mapPosition, this.position);
  }

  private updateMapPostion() {
    this.mapPosition.x = Math.round(
      ((this.position.x * this.videoInfo.renderWidth) /
        this.constraintBox?.getConstraintBoxPosition().width!) *
        this.videoInfo.realProportion
    );
    this.mapPosition.y = Math.round(
      ((this.position.y * this.videoInfo.renderHeight) /
        this.constraintBox?.getConstraintBoxPosition().height!) *
        this.videoInfo.realProportion
    );
    this.mapPosition.width = Math.round(
      ((this.position.width * this.videoInfo.renderWidth) /
        this.constraintBox?.getConstraintBoxPosition().width!) *
        this.videoInfo.realProportion
    );
    this.mapPosition.height = Math.round(
      ((this.position.height * this.videoInfo.renderHeight) /
        this.constraintBox?.getConstraintBoxPosition().height!) *
        this.videoInfo.realProportion
    );
  }

  public setPreviewPosition(previewPositon: IPosition) {
    this.previewPositon = previewPositon;
    this.calculateBorderLimit();
  }

  public show(flag: boolean) {
    this.zIndex = flag ? 99 : -1;
    this.updateStyle();
  }

  public getPosition(): IPosition {
    return this.position;
  }

  public setPosition(position: IPosition): void {
    this.position = position;
  }

  public getPreviewPosition(): IPosition {
    return this.mapPosition;
  }

  public getBorderLimit(): IBorderLimit {
    return this.borderLimit;
  }
}

export default CropBox;
