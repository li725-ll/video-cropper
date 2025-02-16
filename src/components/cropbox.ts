class CropBox {
  private anchors: HTMLElement[] = [];
  private grids: HTMLElement[] = [];
  private boders: HTMLElement[] = [];
  private cropBox: HTMLElement | null = null;
  private pointerContainer: HTMLElement | null = null;
  private gridContainer: HTMLElement | null = null;
  private broderContainer: HTMLElement | null = null;
  private parent: HTMLElement | null = null;
  private rate = 0.5; // 裁剪框的比例
  private cropBoxStyle: string = "";
  private disengage = false; //是否可以脱离视频区域
  private drawCropbox: IDrawCropBoxFunc = () => {};
  private cropBoxPositionFunc:ICropBoxPositionFunc = () => {};
  private originalPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 裁剪框的位置
  private position: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }; // 裁剪框的位置
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

  private mouseInfo: IMouseInfo = {
    type: "move",
    mouseX: 0,
    mouseY: 0,
    mouseDown: false
  };

  constructor(parent: HTMLElement | null, videoInfo: IVideoInfo) {
    this.parent = parent;
    this.videoInfo = videoInfo;
    this.position = {
      x:
        (this.videoInfo.elementWidth - this.videoInfo.renderWidth * this.rate) /
        2,
      y:
        (this.videoInfo.elementWidth -
          this.videoInfo.renderHeight * this.rate) /
        2,
      width: this.videoInfo.renderWidth * this.rate,
      height: this.videoInfo.renderHeight * this.rate
    };
    this.borderLimit = this.disengage
      ? {
          startX: 0,
          endX: this.videoInfo.elementWidth - this.position.width,
          startY: 0,
          endY: this.videoInfo.elementHeight - this.position.height
        }
      : {
          startX: this.videoInfo.renderX,
          endX:
            this.videoInfo.renderX +
            this.videoInfo.renderWidth -
            this.position.width,
          startY: this.videoInfo.renderY,
          endY:
            this.videoInfo.renderY +
            this.videoInfo.renderHeight -
            this.position.height
        };
    this.initCropbox();
    this.registerGlobleEvent();
    this.registerCropboxMoveEvents();
    this.registerCropboxScaleEvents();
    this.updateStyle();
  }

  registerGlobleEvent() {
    document.body.addEventListener("mouseup", (e) => {
      this.mouseInfo.mouseDown = false;
    });

    // TODO：还有优化空间，暂时先这样
    this.cropBox!.addEventListener("mousemove", (e) => {
      if (this.mouseInfo.mouseDown) {
        if (this.mouseInfo.type === "move") {
          this.cropboxMove(e);
        }

        if (this.mouseInfo.type === "scale") {
          this.cropboxScale(e);
        }
        this.cropBoxPositionFunc(this.position);
      }
    });
  }

  registerCropboxMoveEvents() {
    this.cropBox!.addEventListener("mousedown", (e: MouseEvent) => {
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
    // this.cropBox.addEventListener("mouseleave", (e) => {
    //     this.mouseDown = false;
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
            --crop-box-left: ${this.position.x}px;
            --crop-box-top: ${this.position.y}px;
            --crop-box-width: ${this.position.width}px;
            --crop-box-height: ${this.position.height}px;
        `;
    this.cropBox!.setAttribute("style", this.cropBoxStyle);
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

  initCropbox() {
    this.cropBox = document.createElement("div");
    this.cropBox.setAttribute("class", "video-cropper-crop-box");
    this.initGrid();
    this.initBorder();
    this.initPointer();
    this.cropBox.appendChild(this.pointerContainer!);
    this.cropBox.appendChild(this.gridContainer!);
    this.cropBox.appendChild(this.broderContainer!);
    this.parent?.appendChild(this.cropBox);
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

  cropboxMove(e: MouseEvent) {
    const x = this.originalPosition.x + (e.clientX - this.mouseInfo.mouseX);
    const y = this.originalPosition.y + (e.clientY - this.mouseInfo.mouseY);
    if (x >= this.borderLimit.startX && x <= this.borderLimit.endX) {
      this.position.x = x;
    }

    if (y >= this.borderLimit.startY && y <= this.borderLimit.endY) {
      this.position.y = y;
    }

    if (
      (x >= this.borderLimit.startX && x <= this.borderLimit.endX) ||
      (y >= this.borderLimit.startY && y <= this.borderLimit.endY)
    ) {
      this.updateStyle();
      this.drawCropbox(
        this.position.x,
        this.position.y,
        this.position.width,
        this.position.height
      );
    }
  }

  cropboxScale(e: MouseEvent) {
    switch (this.mouseInfo.index) {
      case 0: {
        this.position.x =
          this.originalPosition.x + (e.clientX - this.mouseInfo.mouseX);
        this.position.y =
          this.originalPosition.y + (e.clientY - this.mouseInfo.mouseY);
        this.position.width =
          this.originalPosition.width - (e.clientX - this.mouseInfo.mouseX);
        this.position.height =
          this.originalPosition.height - (e.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 1: {
        this.position.y =
          this.originalPosition.y + (e.clientY - this.mouseInfo.mouseY);
        this.position.height =
          this.originalPosition.height - (e.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 2: {
        this.position.y =
          this.originalPosition.y + (e.clientY - this.mouseInfo.mouseY);
        this.position.width =
          this.originalPosition.width + (e.clientX - this.mouseInfo.mouseX);
        this.position.height =
          this.originalPosition.height - (e.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 3: {
        this.position.x =
          this.originalPosition.x + (e.clientX - this.mouseInfo.mouseX);
        this.position.width =
          this.originalPosition.width - (e.clientX - this.mouseInfo.mouseX);
        break;
      }
      case 4: {
        this.position.width =
          this.originalPosition.width + (e.clientX - this.mouseInfo.mouseX);
        break;
      }
      case 5: {
        this.position.x =
          this.originalPosition.x + (e.clientX - this.mouseInfo.mouseX);
        this.position.width =
          this.originalPosition.width - (e.clientX - this.mouseInfo.mouseX);
        this.position.height =
          this.originalPosition.height + (e.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 6: {
        this.position.height =
          this.originalPosition.height + (e.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 7: {
        this.position.width =
          this.originalPosition.width + (e.clientX - this.mouseInfo.mouseX);
        this.position.height =
          this.originalPosition.height + (e.clientY - this.mouseInfo.mouseY);
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
  }
}

export default CropBox;
