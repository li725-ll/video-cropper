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
  private rate = 0.3; // 裁剪框的大小缩放比例
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
    aspectRatio: 0
  };

  constructor(videoInfo: IVideoInfo, cropBoxConfig?: ICropBoxConfig) {
    this.videoInfo = videoInfo;
    cropBoxConfig && (this.cropBoxConfig = cropBoxConfig);
    this.positionProxy = new Proxy<IPosition>(this.position, {
      set: (target: IPosition, key: "x" | "y" | "width" | "height", value: number) => {
        switch (key) { // 增加约束条件，用于限制裁剪框的位置
          case "x": {break;}
          case "y": {break;}
          case "width": {break;}
          case "height": {break;}
          default: {break;}
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

    const position = this.cropBoxConfig?.position || this.calculateAspectRatio();
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

  public calculateBorderLimit() {
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
    this.updateStyle();
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
    this.cropBoxPositionFunc(this.mapPosition, this.normalizePosition(this.position));
  }

  private borderLeftMove(distanceX: number, direction: number) {
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const height = -distanceX / this.cropBoxConfig!.aspectRatio!;
      if (direction === 0) {
        this.positionProxy.y = this.originalPosition.y - height;
        this.positionProxy.height = this.originalPosition.height + height;
      } else if (direction === 5) {
      } else {
        this.positionProxy.y = this.originalPosition.y - height / 2;
        this.positionProxy.height = this.originalPosition.height + height;
      }
    }

    this.positionProxy.x = this.originalPosition.x + distanceX;
    this.positionProxy.width = this.originalPosition.width - distanceX;
  }
  private borderTopMove(distanceY: number, direction: number) {
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const width = -distanceY * this.cropBoxConfig!.aspectRatio!;
      if (direction === 0) {
        this.positionProxy.x = this.originalPosition.x - width;
      } else if (direction === 2) {
      } else {
        this.positionProxy.x = this.originalPosition.x - width / 2;
      }
      this.positionProxy.width = this.originalPosition.width + width;
    }

    this.positionProxy.y  = this.originalPosition.y + distanceY;
    this.positionProxy.height = this.originalPosition.height - distanceY;
  }

  private borderRightMove(distanceX: number, direction: number) {
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const height = distanceX / this.cropBoxConfig!.aspectRatio!;

      if (direction === 2){
        this.positionProxy.y = this.originalPosition.y - height;
      } else if (direction === 7) {
      } else {
        this.positionProxy.y = this.originalPosition.y - height / 2;
      }
      this.positionProxy.height = this.originalPosition.height + height;
    }

    this.positionProxy.width = this.originalPosition.width + distanceX;
  }

  private borderBottomMove(distanceY: number, direction: number) {
    if (this.cropBoxConfig!.aspectRatio !== 0) {
      const width = distanceY * this.cropBoxConfig!.aspectRatio!;
      if (direction === 5) {
        this.positionProxy.x = this.originalPosition.x - width;
      } else if (direction === 7) {
      } else {
        this.positionProxy.x = this.originalPosition.x - width / 2;
      }
    
      this.positionProxy.width = this.originalPosition.width + width;
    }
    this.positionProxy.height = this.originalPosition.height + distanceY;
  }

  // TODO: disengage = true还未实现，等比缩放未实现
  private cropboxScale(
    distanceX: number,
    distanceY: number,
    direction: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  ) {
    switch (direction) {
      case 0: {
        this.borderLeftMove(distanceX, direction);
        this.borderTopMove(distanceY, direction);
        break;
      }
      case 1: {
        this.borderTopMove(distanceY, direction);
        break;
      }
      case 2: {
        this.borderTopMove(distanceY, direction);
        this.borderRightMove(distanceX, direction);
        break;
      }
      case 3: {
        this.borderLeftMove(distanceX, direction);
        break;
      }
      case 4: {
        this.borderRightMove(distanceX, direction);
        break;
      }
      case 5: {
        this.borderBottomMove(distanceY, direction);
        this.borderLeftMove(distanceX, direction);
        break;
      }
      case 6: {
        this.borderBottomMove(distanceY, direction);
        break;
      }
      case 7: {
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

  public getPreviewPosition(): IPosition {
    return this.mapPosition;
  }
}

export default CropBox;
