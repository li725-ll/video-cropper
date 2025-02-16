class r {
  constructor(i, t) {
    this.anchors = [], this.grids = [], this.boders = [], this.cropBox = null, this.pointerContainer = null, this.gridContainer = null, this.broderContainer = null, this.parent = null, this.rate = 0.5, this.cropBoxStyle = "", this.disengage = !1, this.drawCropbox = () => {
    }, this.cropBoxPositionFunc = () => {
    }, this.originalPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.position = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.videoInfo = {
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
    }, this.borderLimit = {
      startX: 0,
      endX: 0,
      startY: 0,
      endY: 0
    }, this.mouseInfo = {
      type: "move",
      mouseX: 0,
      mouseY: 0,
      mouseDown: !1
    }, this.parent = i, this.videoInfo = t, this.position = {
      x: (this.videoInfo.elementWidth - this.videoInfo.renderWidth * this.rate) / 2,
      y: (this.videoInfo.elementWidth - this.videoInfo.renderHeight * this.rate) / 2,
      width: this.videoInfo.renderWidth * this.rate,
      height: this.videoInfo.renderHeight * this.rate
    }, this.borderLimit = this.disengage ? {
      startX: 0,
      endX: this.videoInfo.elementWidth - this.position.width,
      startY: 0,
      endY: this.videoInfo.elementHeight - this.position.height
    } : {
      startX: this.videoInfo.renderX,
      endX: this.videoInfo.renderX + this.videoInfo.renderWidth - this.position.width,
      startY: this.videoInfo.renderY,
      endY: this.videoInfo.renderY + this.videoInfo.renderHeight - this.position.height
    }, this.initCropbox(), this.registerGlobleEvent(), this.registerCropboxMoveEvents(), this.registerCropboxScaleEvents(), this.updateStyle();
  }
  registerGlobleEvent() {
    document.body.addEventListener("mouseup", (i) => {
      this.mouseInfo.mouseDown = !1;
    }), this.cropBox.addEventListener("mousemove", (i) => {
      this.mouseInfo.mouseDown && (this.mouseInfo.type === "move" && this.cropboxMove(i), this.mouseInfo.type === "scale" && this.cropboxScale(i), this.cropBoxPositionFunc(this.position));
    });
  }
  registerCropboxMoveEvents() {
    this.cropBox.addEventListener("mousedown", (i) => {
      this.mouseInfo.mouseX = i.clientX, this.mouseInfo.mouseY = i.clientY, this.mouseInfo.mouseDown = !0, this.mouseInfo.type = "move", this.originalPosition.x = this.position.x, this.originalPosition.y = this.position.y, this.originalPosition.width = this.position.width, this.originalPosition.height = this.position.height, console.log("move", this.mouseInfo);
    });
  }
  registerCropboxScaleEvents() {
    this.anchors.forEach((i, t) => {
      i.addEventListener("mousedown", (o) => {
        o.preventDefault(), o.stopPropagation(), this.mouseInfo.mouseDown = !0, this.mouseInfo.mouseX = o.clientX, this.mouseInfo.mouseY = o.clientY, this.mouseInfo.type = "scale", this.mouseInfo.index = t, this.originalPosition.x = this.position.x, this.originalPosition.y = this.position.y, this.originalPosition.width = this.position.width, this.originalPosition.height = this.position.height, console.log("scale", this.mouseInfo);
      });
    }), this.boders.forEach((i, t) => {
      i.addEventListener("mousedown", (o) => {
        o.preventDefault(), o.stopPropagation(), this.mouseInfo.mouseDown = !0, this.mouseInfo.mouseX = o.clientX, this.mouseInfo.mouseY = o.clientY, this.mouseInfo.type = "scale", this.mouseInfo.index = t === 0 ? 1 : t === 1 ? 4 : t === 2 ? 6 : 3, this.originalPosition.x = this.position.x, this.originalPosition.y = this.position.y, this.originalPosition.width = this.position.width, this.originalPosition.height = this.position.height, console.log("scale", this.mouseInfo);
      });
    });
  }
  updateStyle() {
    this.cropBoxStyle = `
            --crop-box-left: ${this.position.x}px;
            --crop-box-top: ${this.position.y}px;
            --crop-box-width: ${this.position.width}px;
            --crop-box-height: ${this.position.height}px;
        `, this.cropBox.setAttribute("style", this.cropBoxStyle);
  }
  setDrawCropBoxFunc(i) {
    this.drawCropbox = i, this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
  }
  setCropBoxPositionFunc(i) {
    this.cropBoxPositionFunc = i;
  }
  initCropbox() {
    var i;
    this.cropBox = document.createElement("div"), this.cropBox.setAttribute("class", "video-cropper-crop-box"), this.initGrid(), this.initBorder(), this.initPointer(), this.cropBox.appendChild(this.pointerContainer), this.cropBox.appendChild(this.gridContainer), this.cropBox.appendChild(this.broderContainer), (i = this.parent) == null || i.appendChild(this.cropBox);
  }
  initPointer() {
    this.pointerContainer = document.createElement("div"), this.pointerContainer.setAttribute(
      "class",
      "video-cropper-crop-box-pointer-container"
    ), this.anchors = Array(8).fill(null), this.anchors = this.anchors.map((i, t) => {
      const o = document.createElement("div");
      return o.setAttribute(
        "class",
        `video-cropper-anchor-${t} video-cropper-anchor`
      ), this.pointerContainer.appendChild(o), o;
    });
  }
  initGrid() {
    this.gridContainer = document.createElement("div"), this.gridContainer.setAttribute(
      "class",
      "video-cropper-crop-box-grid-container"
    ), this.grids = Array(9).fill(null), this.grids.forEach((i, t) => {
      const o = document.createElement("div");
      o.setAttribute(
        "class",
        `video-cropper-crop-box-grid-${t} video-cropper-crop-box-grid`
      ), this.gridContainer.appendChild(o);
    });
  }
  initBorder() {
    this.broderContainer = document.createElement("div"), this.broderContainer.setAttribute(
      "class",
      "video-cropper-crop-box-border-container"
    );
    const i = document.createElement("div");
    i.setAttribute("class", "video-cropper-crop-box-border-temp"), this.boders = Array(4).fill(null), this.boders = this.boders.map((t, o) => {
      const e = document.createElement("div");
      return e.setAttribute(
        "class",
        `video-cropper-crop-box-border-${o} video-cropper-crop-box-border`
      ), i.appendChild(e), e;
    }), this.broderContainer.appendChild(i);
  }
  cropboxMove(i) {
    const t = this.originalPosition.x + (i.clientX - this.mouseInfo.mouseX), o = this.originalPosition.y + (i.clientY - this.mouseInfo.mouseY);
    t >= this.borderLimit.startX && t <= this.borderLimit.endX && (this.position.x = t), o >= this.borderLimit.startY && o <= this.borderLimit.endY && (this.position.y = o), (t >= this.borderLimit.startX && t <= this.borderLimit.endX || o >= this.borderLimit.startY && o <= this.borderLimit.endY) && (this.updateStyle(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ));
  }
  cropboxScale(i) {
    switch (this.mouseInfo.index) {
      case 0: {
        this.position.x = this.originalPosition.x + (i.clientX - this.mouseInfo.mouseX), this.position.y = this.originalPosition.y + (i.clientY - this.mouseInfo.mouseY), this.position.width = this.originalPosition.width - (i.clientX - this.mouseInfo.mouseX), this.position.height = this.originalPosition.height - (i.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 1: {
        this.position.y = this.originalPosition.y + (i.clientY - this.mouseInfo.mouseY), this.position.height = this.originalPosition.height - (i.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 2: {
        this.position.y = this.originalPosition.y + (i.clientY - this.mouseInfo.mouseY), this.position.width = this.originalPosition.width + (i.clientX - this.mouseInfo.mouseX), this.position.height = this.originalPosition.height - (i.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 3: {
        this.position.x = this.originalPosition.x + (i.clientX - this.mouseInfo.mouseX), this.position.width = this.originalPosition.width - (i.clientX - this.mouseInfo.mouseX);
        break;
      }
      case 4: {
        this.position.width = this.originalPosition.width + (i.clientX - this.mouseInfo.mouseX);
        break;
      }
      case 5: {
        this.position.x = this.originalPosition.x + (i.clientX - this.mouseInfo.mouseX), this.position.width = this.originalPosition.width - (i.clientX - this.mouseInfo.mouseX), this.position.height = this.originalPosition.height + (i.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 6: {
        this.position.height = this.originalPosition.height + (i.clientY - this.mouseInfo.mouseY);
        break;
      }
      case 7: {
        this.position.width = this.originalPosition.width + (i.clientX - this.mouseInfo.mouseX), this.position.height = this.originalPosition.height + (i.clientY - this.mouseInfo.mouseY);
        break;
      }
    }
    this.updateStyle(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
  }
}
class d {
  constructor(i, t) {
    this.canvas = null, this.ctx = null, this.parent = null, this.videoInfo = {
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
    }, this.parent = i, this.videoInfo = t, this.canvas = document.createElement("canvas"), this.canvas.width = this.videoInfo.elementWidth, this.canvas.height = this.videoInfo.elementHeight, this.canvas.setAttribute("class", "video-cropper-canvas"), this.parent.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d");
  }
  drawCropbox(i, t, o, e) {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.32)", this.ctx.clearRect(
      0,
      0,
      this.videoInfo.elementWidth,
      this.videoInfo.elementHeight
    ), this.ctx.fillRect(
      0,
      0,
      this.videoInfo.elementWidth,
      this.videoInfo.elementHeight
    ), this.ctx.clearRect(i, t, o, e);
  }
}
class a {
  constructor(i) {
    this.videoInfo = {
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
    }, this.parent = null, this.container = null, this.canvas = null, this.cropBox = null, this.videoElement = i, this.videoInfo = {
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
    const t = this.calculateRenderVideoInfo();
    this.videoInfo.renderWidth = t.renderWidth, this.videoInfo.renderHeight = t.renderHeight, this.videoInfo.realProportion = t.realProportion, this.videoInfo.displayProportion = t.displayProportion, this.videoInfo.renderX = t.renderX, this.videoInfo.renderY = t.renderY, this.init();
  }
  init() {
    var i;
    this.parent = document.createElement("div"), this.container = this.videoElement.parentElement, this.container.appendChild(this.parent), this.parent.setAttribute("class", "video-cropper-parent"), this.parent.appendChild(this.videoElement), this.parent.setAttribute(
      "style",
      `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
    ), this.canvas = new d(this.parent, this.videoInfo), this.cropBox = new r(this.parent, this.videoInfo), (i = this.cropBox) == null || i.setDrawCropBoxFunc(
      (t, o, e, h) => {
        var n;
        (n = this.canvas) == null || n.drawCropbox(t, o, e, h);
      }
    ), console.log(this.videoInfo);
  }
  calculateRenderVideoInfo() {
    const i = this.videoInfo.videoWidth / this.videoInfo.videoHeight, t = this.videoInfo.elementWidth / this.videoInfo.elementHeight;
    if (i >= t) {
      const o = this.videoInfo.elementWidth / this.videoInfo.videoWidth, e = this.videoInfo.videoWidth / this.videoInfo.elementWidth;
      return {
        renderWidth: this.videoInfo.elementWidth,
        renderHeight: this.videoInfo.videoHeight * o,
        displayProportion: o,
        realProportion: e,
        renderX: 0,
        renderY: (this.videoInfo.elementHeight - this.videoInfo.videoHeight * o) / 2
      };
    } else {
      const o = this.videoInfo.elementHeight / this.videoInfo.videoHeight, e = this.videoInfo.videoHeight / this.videoInfo.elementHeight;
      return {
        renderWidth: this.videoInfo.videoWidth * o,
        renderHeight: this.videoInfo.elementHeight,
        displayProportion: o,
        realProportion: e,
        renderX: (this.videoInfo.elementWidth - this.videoInfo.videoWidth * o) / 2,
        renderY: 0
      };
    }
  }
  play() {
    this.videoElement.play();
  }
  setCropBoxPositionFunc(i) {
    var t;
    (t = this.cropBox) == null || t.setCropBoxPositionFunc(i);
  }
}
export {
  a as default
};
