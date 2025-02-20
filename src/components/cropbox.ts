import ConstraintBox from "./constraintbox";

class CropBox {
  public cropBoxElement: HTMLElement | null = null;
  private anchors: HTMLElement[] = [];
  private grids: HTMLElement[] = [];
  private boders: HTMLElement[] = [];
  private pointerContainer: HTMLElement | null = null;
  private gridContainer: HTMLElement | null = null;
  private broderContainer: HTMLElement | null = null;
  private rate = 0.8; // 裁剪框的大小缩放比例
  private cropBoxStyle: string = "";
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
  private cropboxConfig?: ICropboxConfig = {
    aspectRatio: 0
  };
  private mouseInfo: IMouseInfo = {
    type: "move",
    mouseX: 0,
    mouseY: 0,
    mouseDown: false
  };

  constructor(videoInfo: IVideoInfo, cropboxConfig?: ICropboxConfig) {
    this.videoInfo = videoInfo;
    cropboxConfig && (this.cropboxConfig = cropboxConfig);
    this.initCropbox();
    this.registerGlobleEvent();
    this.registerCropboxMoveEvents();
    this.registerCropboxScaleEvents();
  }

  setConstraintBox(constraintBox: ConstraintBox) { // 设置约束框
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

    this.position = this.calculateAspectRatio();
    this.calculateBorderLimit();
    console.log("this.constraintBoxPosition", this.borderLimit, this.position);
    this.updateStyle();
    // this.updateMapPostion();
  }

  registerGlobleEvent() {
    this.cropBoxElement!.addEventListener("mouseup", (e) => {
      this.mouseInfo.mouseDown = false;
    });

    // TODO：还有优化空间，暂时先这样
    this.cropBoxElement!.addEventListener("mousemove", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.mouseInfo.mouseDown) {
        if (this.mouseInfo.type === "move") {
          this.cropboxMove(e);
        }

        if (this.mouseInfo.type === "scale") {
          this.cropboxScale(e);
          this.calculateBorderLimit();
        }
        this.cropBoxPositionFunc(this.mapPosition);
      }
    });
  }

  private registerCropboxMoveEvents() {
    this.cropBoxElement!.addEventListener("mousedown", (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      this.mouseInfo.mouseX = e.clientX;
      this.mouseInfo.mouseY = e.clientY;
      this.mouseInfo.mouseDown = true;
      this.mouseInfo.type = "move";
      this.originalPosition.x = this.position.x;
      this.originalPosition.y = this.position.y;
      this.originalPosition.width = this.position.width;
      this.originalPosition.height = this.position.height;
      console.log("move", this.mouseInfo);
    });

    // TODO：先禁用鼠标移动事件，后续再优化
    // this.cropBox!.addEventListener("mouseleave", (e) => {
    //     this.mouseInfo.mouseDown = false;
    // });
  }

  registerCropboxScaleEvents() {
    this.anchors.forEach((anchor, index) => {
      anchor.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.mouseInfo.mouseDown = true;
        this.mouseInfo.mouseX = e.clientX;
        this.mouseInfo.mouseY = e.clientY;
        this.mouseInfo.type = "scale";
        this.mouseInfo.index = index;
        this.originalPosition.x = this.position.x;
        this.originalPosition.y = this.position.y;
        this.originalPosition.width = this.position.width;
        this.originalPosition.height = this.position.height;
        console.log("scale", this.mouseInfo);
      });
    });
    this.boders.forEach((border, index) => {
      border.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.mouseInfo.mouseDown = true;
        this.mouseInfo.mouseX = e.clientX;
        this.mouseInfo.mouseY = e.clientY;
        this.mouseInfo.type = "scale";
        this.mouseInfo.index =
          index === 0 ? 1 : index === 1 ? 4 : index === 2 ? 6 : 3;
        this.originalPosition.x = this.position.x;
        this.originalPosition.y = this.position.y;
        this.originalPosition.width = this.position.width;
        this.originalPosition.height = this.position.height;
        console.log("scale", this.mouseInfo);
      });
    });
  }

  updateStyle() {
    this.cropBoxStyle = `
      --crop-box-z-index: ${this.zIndex};
      --crop-box-left: ${this.position.x}px;
      --crop-box-top: ${this.position.y}px;
      --crop-box-width: ${this.position.width}px;
      --crop-box-height: ${this.position.height}px;
    `;
    this.cropBoxElement!.setAttribute("style", this.cropBoxStyle);
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
    if (this.cropboxConfig?.aspectRatio === 0) {
      // 自由比例
      return {
        x:
          (this.constraintBoxPosition.width -
            this.previewPositon.width * this.rate) /
          2,
        y:
          (this.constraintBoxPosition.width -
            this.previewPositon.height * this.rate) /
          2,
        width: this.previewPositon.width * this.rate,
        height: this.previewPositon.height * this.rate
      };
    } else {
      const temp = Math.min(
        this.previewPositon.width * this.rate,
        this.previewPositon.height * this.rate
      ); // 宽和高中窄的那一个
      if (this.cropboxConfig!.aspectRatio! >= 1) {
        const width = temp;
        const height = temp / this.cropboxConfig!.aspectRatio!;
        return {
          x: (this.constraintBoxPosition.width - width) / 2,
          y: (this.constraintBoxPosition.height - height) / 2,
          width,
          height
        };
      } else {
        const width = temp * this.cropboxConfig!.aspectRatio!;
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
    this.cropBoxElement.appendChild(this.pointerContainer!);
    this.cropBoxElement.appendChild(this.gridContainer!);
    this.cropBoxElement.appendChild(this.broderContainer!);
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
    this.grids = Array(9).fill(null);
    this.grids.forEach((_, index) => {
      const grid = document.createElement("div");
      grid.setAttribute(
        "class",
        `video-cropper-crop-box-grid-${index} video-cropper-crop-box-grid`
      );
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
    temp.setAttribute("class", "video-cropper-crop-box-border-temp");
    this.boders = Array(4).fill(null);
    this.boders = this.boders.map((_, index) => {
      const border = document.createElement("div");
      border.setAttribute(
        "class",
        `video-cropper-crop-box-border-${index} video-cropper-crop-box-border`
      );
      temp.appendChild(border);
      return border;
    });
    this.broderContainer!.appendChild(temp);
  }

  private cropboxMove(e: MouseEvent) {
    const x = this.originalPosition.x + (e.clientX - this.mouseInfo.mouseX);
    const y = this.originalPosition.y + (e.clientY - this.mouseInfo.mouseY);
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
  }

  // TODO: disengage = true还未实现，等比缩放未实现
  private cropboxScale(e: MouseEvent) {
    switch (this.mouseInfo.index) {
      case 0: {
        const x = this.originalPosition.x + (e.clientX - this.mouseInfo.mouseX);
        const y = this.originalPosition.y + (e.clientY - this.mouseInfo.mouseY);
        const width =
          this.originalPosition.width - (e.clientX - this.mouseInfo.mouseX);
        const height =
          this.originalPosition.height - (e.clientY - this.mouseInfo.mouseY);
        const minWidth = 0;
        const maxWidth =
          this.position.width + (this.position.x - this.borderLimit.startX);
        const minHeight = 0;
        const maxHeight =
          this.position.height + (this.position.y - this.borderLimit.startY);
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

        if (width <= minWidth) {
          this.position.width = minWidth;
        } else if (width >= maxWidth) {
          this.position.width = maxWidth;
        } else {
          this.position.width = width;
        }

        if (height <= minHeight) {
          this.position.height = minHeight;
        } else if (height >= maxHeight) {
          this.position.height = maxHeight;
        } else {
          this.position.height = height;
        }

        this.position.height = height;
        break;
      }
      case 1: {
        const y = this.originalPosition.y + (e.clientY - this.mouseInfo.mouseY);
        const height =
          this.originalPosition.height - (e.clientY - this.mouseInfo.mouseY);
        const minHeight = 0;
        const maxHeight =
          this.position.height + (this.position.y - this.borderLimit.startY);
        if (y <= this.borderLimit.startY) {
          this.position.y = this.borderLimit.startY;
        } else if (y >= this.borderLimit.endY) {
          this.position.y = this.borderLimit.endY;
        } else {
          this.position.y = y;
        }

        if (height <= minHeight) {
          this.position.height = minHeight;
        } else if (height >= maxHeight) {
          this.position.height = maxHeight;
        } else {
          this.position.height = height;
        }
        break;
      }
      case 2: {
        const y = this.originalPosition.y + (e.clientY - this.mouseInfo.mouseY);
        const width =
          this.originalPosition.width + (e.clientX - this.mouseInfo.mouseX);
        const height =
          this.originalPosition.height - (e.clientY - this.mouseInfo.mouseY);
        const minWidth = 0;
        const maxWidth =
          this.borderLimit.startX + this.previewPositon.width - this.position.x;
        const minHeight = 0;
        const maxHeight =
          this.position.height + (this.position.y - this.borderLimit.startY);
        if (y <= this.borderLimit.startY) {
          this.position.y = this.borderLimit.startY;
        } else if (y >= this.borderLimit.endY) {
          this.position.y = this.borderLimit.endY;
        } else {
          this.position.y = y;
        }

        if (width <= minWidth) {
          this.position.width = minWidth;
        } else if (width >= maxWidth) {
          this.position.width = maxWidth;
        } else {
          this.position.width = width;
        }

        if (height <= minHeight) {
          this.position.height = minHeight;
        } else if (height >= maxHeight) {
          this.position.height = maxHeight;
        } else {
          this.position.height = height;
        }
        break;
      }
      case 3: {
        const x = this.originalPosition.x + (e.clientX - this.mouseInfo.mouseX);
        const width =
          this.originalPosition.width - (e.clientX - this.mouseInfo.mouseX);
        const minWidth = 0;
        const maxWidth =
          this.position.width + (this.position.x - this.borderLimit.startX);
        if (x <= this.borderLimit.startX) {
          this.position.x = this.borderLimit.startX;
        } else if (x >= this.borderLimit.endX) {
          this.position.x = this.borderLimit.endX;
        } else {
          this.position.x = x;
        }

        if (width <= minWidth) {
          this.position.width = minWidth;
        } else if (width >= maxWidth) {
          this.position.width = maxWidth;
        } else {
          this.position.width = width;
        }
        break;
      }
      case 4: {
        const width =
          this.originalPosition.width + (e.clientX - this.mouseInfo.mouseX);
        const minWidth = 0;
        const maxWidth =
          this.borderLimit.startX + this.previewPositon.width - this.position.x;
        if (width <= minWidth) {
          this.position.width = minWidth;
        } else if (width >= maxWidth) {
          this.position.width = maxWidth;
        } else {
          this.position.width = width;
        }
        break;
      }
      case 5: {
        const x = this.originalPosition.x + (e.clientX - this.mouseInfo.mouseX);
        const width =
          this.originalPosition.width - (e.clientX - this.mouseInfo.mouseX);
        const height =
          this.originalPosition.height + (e.clientY - this.mouseInfo.mouseY);
        const minWidth = 0;
        const maxWidth =
          this.borderLimit.startX + this.previewPositon.width - this.position.x;
        const minHeight = 0;
        const maxHeight =
          this.borderLimit.startY +
          this.previewPositon.height -
          this.position.y;

        if (x <= this.borderLimit.startX) {
          this.position.x = this.borderLimit.startX;
        } else if (x >= this.borderLimit.endX) {
          this.position.x = this.borderLimit.endX;
        } else {
          this.position.x = x;
        }

        if (width <= minWidth) {
          this.position.width = minWidth;
        } else if (width >= maxWidth) {
          this.position.width = maxWidth;
        } else {
          this.position.width = width;
        }

        if (height <= minHeight) {
          this.position.height = minHeight;
        } else if (height >= maxHeight) {
          this.position.height = maxHeight;
        } else {
          this.position.height = height;
        }

        break;
      }
      case 6: {
        const height =
          this.originalPosition.height + (e.clientY - this.mouseInfo.mouseY);
        const minHeight = 0;
        const maxHeight =
          this.borderLimit.startY +
          this.previewPositon.height -
          this.position.y;
        if (height <= minHeight) {
          this.position.height = minHeight;
        } else if (height >= maxHeight) {
          this.position.height = maxHeight;
        } else {
          this.position.height = height;
        }

        break;
      }
      case 7: {
        const width =
          this.originalPosition.width + (e.clientX - this.mouseInfo.mouseX);
        const height =
          this.originalPosition.height + (e.clientY - this.mouseInfo.mouseY);
        const minWidth = 0;
        const maxWidth =
          this.borderLimit.startX + this.previewPositon.width - this.position.x;
        const minHeight = 0;
        const maxHeight =
          this.borderLimit.startY +
          this.previewPositon.height -
          this.position.y;
        if (width <= minWidth) {
          this.position.width = minWidth;
        } else if (width >= maxWidth) {
          this.position.width = maxWidth;
        } else {
          this.position.width = width;
        }

        if (height <= minHeight) {
          this.position.height = minHeight;
        } else if (height >= maxHeight) {
          this.position.height = maxHeight;
        } else {
          this.position.height = height;
        }

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
  }

  private updateMapPostion() {
    this.mapPosition.x = Math.round(
      (this.position.x - this.previewPositon.x) * this.videoInfo.realProportion
    );
    this.mapPosition.y = Math.round(
      (this.position.y - this.previewPositon.y) * this.videoInfo.realProportion
    );
    this.mapPosition.width = Math.round(
      this.position.width * this.videoInfo.realProportion
    );
    this.mapPosition.height = Math.round(
      this.position.height * this.videoInfo.realProportion
    );
  }

  public setPreviewPosition(previewPositon: IPosition) {
    this.previewPositon = previewPositon;
    this.calculateBorderLimit();
  }

  show(flag: boolean) {
    this.zIndex = flag ? 99 : -1;
    this.updateStyle();
  }

  public getPosition(): IPosition {
    return this.position;
  }

  public getPreviewPosition(): IPosition {
    return this.mapPosition;
  }

  public getBorderLimit(): IBorderLimit {
    return this.borderLimit;
  }
}

export default CropBox;
