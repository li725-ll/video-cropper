class l {
  constructor(t, i) {
    this.videoElement = null, this.duration = 0, this.previewFlag = !1, this.constraintBox = null, this.videoInfo = {
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
    }, this.cropbox = null, this.lastConstraintBoxPosition = null, this.videoElement = t, this.videoInfo = i, this.duration = i.duration, this.videoElement.setAttribute("class", "video-cropper-video"), this.updateStyle(), this.registerEvent();
  }
  setCropBox(t) {
    this.cropbox = t;
  }
  registerEvent() {
    this.videoElement.addEventListener("ended", () => {
      var t, i;
      (t = this.constraintBox) == null || t.setConstraintBoxPosition(
        this.lastConstraintBoxPosition
      ), (i = this.constraintBox) == null || i.updateStyle(), this.previewFlag = !1, this.updateStyle();
    });
  }
  play() {
    this.previewFlag = !0, this.updateStyle(), this.videoElement.play();
  }
  preview() {
    var e, n, h, r;
    const t = (e = this.cropbox) == null ? void 0 : e.getPosition(), i = (n = this.constraintBox) == null ? void 0 : n.getConstraintBoxPosition();
    this.lastConstraintBoxPosition = { ...i };
    const o = this.videoInfo.elementWidth / t.width, s = this.videoInfo.elementHeight / t.height;
    i.height = i.height * o, i.width = i.width * s, i.x = -(t.x * o), i.y = -(t.y * s), (h = this.constraintBox) == null || h.setConstraintBoxPosition(i), (r = this.constraintBox) == null || r.updateStyle(), this.play();
  }
  pause() {
    this.previewFlag = !1, this.videoElement.pause(), this.updateStyle();
  }
  setCurrentTime(t) {
    t >= this.videoInfo.duration && (t = this.videoInfo.duration), t <= 0 && (t = 0), this.videoElement.currentTime = t;
  }
  updateStyle() {
    const t = `--video-cropper-video-origin: center;
      --video-cropper-video-z-index: ${this.previewFlag ? 1e3 : 0};
      --video-cropper-video-position: ${this.previewFlag ? "absolute" : "static"};`;
    this.videoElement.setAttribute("style", t);
  }
  updateSize() {
    var t, i;
    this.videoElement.width = (t = this.constraintBox) == null ? void 0 : t.width, this.videoElement.height = (i = this.constraintBox) == null ? void 0 : i.height;
  }
  setConstraintBox(t) {
    this.constraintBox = t, this.updateSize();
  }
}
class c {
  constructor(t) {
    this.canvasElement = null, this.ctx = null, this.cropbox = null, this.video = null, this.constraintbox = null, this.grab = !1, this.videoInfo = {
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
    }, this.videoInfo = t, this.canvasElement = document.createElement("canvas"), this.canvasElement.setAttribute("class", "video-cropper-canvas"), this.ctx = this.canvasElement.getContext("2d"), this.updateStyle();
  }
  updateSize() {
    var t, i;
    this.canvasElement.width = (t = this.constraintbox) == null ? void 0 : t.width, this.canvasElement.height = (i = this.constraintbox) == null ? void 0 : i.height;
  }
  setGrab(t) {
    var i;
    this.grab = t, (i = this.cropbox) == null || i.show(!t), this.updateStyle();
  }
  updateStyle() {
    const t = `--video-cropper-canvas-grab: ${this.grab ? "grabbing" : "grab"}`;
    this.canvasElement.setAttribute("style", t);
  }
  drawCropbox(t, i, o, s) {
    var e, n, h, r;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.32)", this.ctx.clearRect(
      0,
      0,
      (e = this.canvasElement) == null ? void 0 : e.width,
      (n = this.canvasElement) == null ? void 0 : n.height
    ), this.ctx.fillRect(
      0,
      0,
      (h = this.canvasElement) == null ? void 0 : h.width,
      (r = this.canvasElement) == null ? void 0 : r.height
    ), this.ctx.clearRect(t, i, o, s);
  }
  setVideo(t) {
    this.video = t;
  }
  setCropBox(t) {
    this.cropbox = t;
  }
  setConstraintBox(t) {
    this.constraintbox = t, this.updateSize();
  }
}
class m {
  constructor(t, i) {
    this.cropBoxElement = null, this.anchors = [], this.grids = [], this.boders = [], this.pointerContainer = null, this.gridContainer = null, this.broderContainer = null, this.rate = 0.8, this.cropBoxStyle = "", this.zIndex = 99, this.constraintBox = null, this.disengage = !1, this.drawCropbox = () => {
    }, this.cropBoxPositionFunc = () => {
    }, this.originalPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.previewPositon = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.position = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.constraintBoxPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.mapPosition = {
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
    }, this.cropboxConfig = {
      aspectRatio: 0
    }, this.mouseInfo = {
      type: "move",
      mouseX: 0,
      mouseY: 0,
      mouseDown: !1
    }, this.videoInfo = t, i && (this.cropboxConfig = i), this.initCropbox(), this.registerGlobleEvent(), this.registerCropboxMoveEvents(), this.registerCropboxScaleEvents();
  }
  setConstraintBox(t) {
    this.constraintBox = t, this.previewPositon = {
      x: this.constraintBox.x,
      y: this.constraintBox.y,
      width: this.constraintBox.width,
      height: this.constraintBox.height
    }, this.constraintBoxPosition = {
      ...this.previewPositon
    }, this.position = this.calculateAspectRatio(), this.calculateBorderLimit(), this.updateStyle();
  }
  registerGlobleEvent() {
    this.cropBoxElement.addEventListener("mouseup", (t) => {
      this.mouseInfo.mouseDown = !1;
    }), this.cropBoxElement.addEventListener("mousemove", (t) => {
      t.stopPropagation(), t.preventDefault(), this.mouseInfo.mouseDown && (this.mouseInfo.type === "move" && this.cropboxMove(t), this.mouseInfo.type === "scale" && (this.cropboxScale(t), this.calculateBorderLimit()), this.cropBoxPositionFunc(this.mapPosition));
    });
  }
  registerCropboxMoveEvents() {
    this.cropBoxElement.addEventListener("mousedown", (t) => {
      t.stopPropagation(), t.preventDefault(), this.mouseInfo.mouseX = t.clientX, this.mouseInfo.mouseY = t.clientY, this.mouseInfo.mouseDown = !0, this.mouseInfo.type = "move", this.originalPosition.x = this.position.x, this.originalPosition.y = this.position.y, this.originalPosition.width = this.position.width, this.originalPosition.height = this.position.height, console.log("move", this.mouseInfo);
    });
  }
  registerCropboxScaleEvents() {
    this.anchors.forEach((t, i) => {
      t.addEventListener("mousedown", (o) => {
        o.preventDefault(), o.stopPropagation(), this.mouseInfo.mouseDown = !0, this.mouseInfo.mouseX = o.clientX, this.mouseInfo.mouseY = o.clientY, this.mouseInfo.type = "scale", this.mouseInfo.index = i, this.originalPosition.x = this.position.x, this.originalPosition.y = this.position.y, this.originalPosition.width = this.position.width, this.originalPosition.height = this.position.height, console.log("scale", this.mouseInfo);
      });
    }), this.boders.forEach((t, i) => {
      t.addEventListener("mousedown", (o) => {
        o.preventDefault(), o.stopPropagation(), this.mouseInfo.mouseDown = !0, this.mouseInfo.mouseX = o.clientX, this.mouseInfo.mouseY = o.clientY, this.mouseInfo.type = "scale", this.mouseInfo.index = i === 0 ? 1 : i === 1 ? 4 : i === 2 ? 6 : 3, this.originalPosition.x = this.position.x, this.originalPosition.y = this.position.y, this.originalPosition.width = this.position.width, this.originalPosition.height = this.position.height, console.log("scale", this.mouseInfo);
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
    `, this.cropBoxElement.setAttribute("style", this.cropBoxStyle);
  }
  setDrawCropBoxFunc(t) {
    this.drawCropbox = t, this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    );
  }
  setCropBoxPositionFunc(t) {
    this.cropBoxPositionFunc = t;
  }
  calculateBorderLimit() {
    const t = this.disengage ? {
      startX: 0,
      endX: this.videoInfo.elementWidth - this.position.width,
      startY: 0,
      endY: this.videoInfo.elementHeight - this.position.height
    } : {
      startX: this.constraintBox.x,
      endX: this.constraintBox.x + this.constraintBox.width - this.position.width,
      startY: this.constraintBox.y,
      endY: this.constraintBox.y + this.constraintBox.height - this.position.height
    };
    this.position.x < t.startX && (this.position.x = t.startX), this.position.y < t.startY && (this.position.y = t.startY), this.position.x > t.endX && (this.position.x = t.endX), this.position.y > t.endY && (this.position.y = t.endY), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateStyle(), this.borderLimit = t;
  }
  calculateAspectRatio() {
    var t;
    if (((t = this.cropboxConfig) == null ? void 0 : t.aspectRatio) === 0)
      return {
        x: (this.constraintBoxPosition.width - this.previewPositon.width * this.rate) / 2,
        y: (this.constraintBoxPosition.width - this.previewPositon.height * this.rate) / 2,
        width: this.previewPositon.width * this.rate,
        height: this.previewPositon.height * this.rate
      };
    {
      const i = Math.min(
        this.previewPositon.width * this.rate,
        this.previewPositon.height * this.rate
      );
      if (this.cropboxConfig.aspectRatio >= 1) {
        const o = i, s = i / this.cropboxConfig.aspectRatio;
        return {
          x: (this.constraintBoxPosition.width - o) / 2,
          y: (this.constraintBoxPosition.height - s) / 2,
          width: o,
          height: s
        };
      } else {
        const o = i * this.cropboxConfig.aspectRatio, s = i;
        return {
          x: (this.constraintBoxPosition.width - o) / 2,
          y: (this.constraintBoxPosition.height - s) / 2,
          width: o,
          height: s
        };
      }
    }
  }
  initCropbox() {
    this.cropBoxElement = document.createElement("div"), this.cropBoxElement.setAttribute("class", "video-cropper-crop-box"), this.initGrid(), this.initBorder(), this.initPointer(), this.cropBoxElement.appendChild(this.pointerContainer), this.cropBoxElement.appendChild(this.gridContainer), this.cropBoxElement.appendChild(this.broderContainer);
  }
  initPointer() {
    this.pointerContainer = document.createElement("div"), this.pointerContainer.setAttribute(
      "class",
      "video-cropper-crop-box-pointer-container"
    ), this.anchors = Array(8).fill(null), this.anchors = this.anchors.map((t, i) => {
      const o = document.createElement("div");
      return o.setAttribute(
        "class",
        `video-cropper-anchor-${i} video-cropper-anchor`
      ), this.pointerContainer.appendChild(o), o;
    });
  }
  initGrid() {
    this.gridContainer = document.createElement("div"), this.gridContainer.setAttribute(
      "class",
      "video-cropper-crop-box-grid-container"
    ), this.grids = Array(9).fill(null), this.grids.forEach((t, i) => {
      const o = document.createElement("div");
      o.setAttribute(
        "class",
        `video-cropper-crop-box-grid-${i} video-cropper-crop-box-grid`
      ), this.gridContainer.appendChild(o);
    });
  }
  initBorder() {
    this.broderContainer = document.createElement("div"), this.broderContainer.setAttribute(
      "class",
      "video-cropper-crop-box-border-container"
    );
    const t = document.createElement("div");
    t.setAttribute("class", "video-cropper-crop-box-border-temp"), this.boders = Array(4).fill(null), this.boders = this.boders.map((i, o) => {
      const s = document.createElement("div");
      return s.setAttribute(
        "class",
        `video-cropper-crop-box-border-${o} video-cropper-crop-box-border`
      ), t.appendChild(s), s;
    }), this.broderContainer.appendChild(t);
  }
  cropboxMove(t) {
    const i = this.originalPosition.x + (t.clientX - this.mouseInfo.mouseX), o = this.originalPosition.y + (t.clientY - this.mouseInfo.mouseY);
    i <= this.borderLimit.startX ? this.position.x = this.borderLimit.startX : i >= this.borderLimit.endX ? this.position.x = this.borderLimit.endX : this.position.x = i, o <= this.borderLimit.startY ? this.position.y = this.borderLimit.startY : o >= this.borderLimit.endY ? this.position.y = this.borderLimit.endY : this.position.y = o, this.updateStyle(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateMapPostion();
  }
  // TODO: disengage = true还未实现，等比缩放未实现
  cropboxScale(t) {
    switch (this.mouseInfo.index) {
      case 0: {
        const i = this.originalPosition.x + (t.clientX - this.mouseInfo.mouseX), o = this.originalPosition.y + (t.clientY - this.mouseInfo.mouseY), s = this.originalPosition.width - (t.clientX - this.mouseInfo.mouseX), e = this.originalPosition.height - (t.clientY - this.mouseInfo.mouseY), n = 0, h = this.position.width + (this.position.x - this.borderLimit.startX), r = 0, a = this.position.height + (this.position.y - this.borderLimit.startY);
        i <= this.borderLimit.startX ? this.position.x = this.borderLimit.startX : i >= this.borderLimit.endX ? this.position.x = this.borderLimit.endX : this.position.x = i, o <= this.borderLimit.startY ? this.position.y = this.borderLimit.startY : o >= this.borderLimit.endY ? this.position.y = this.borderLimit.endY : this.position.y = o, s <= n ? this.position.width = n : s >= h ? this.position.width = h : this.position.width = s, e <= r ? this.position.height = r : e >= a ? this.position.height = a : this.position.height = e, this.position.height = e;
        break;
      }
      case 1: {
        const i = this.originalPosition.y + (t.clientY - this.mouseInfo.mouseY), o = this.originalPosition.height - (t.clientY - this.mouseInfo.mouseY), s = 0, e = this.position.height + (this.position.y - this.borderLimit.startY);
        i <= this.borderLimit.startY ? this.position.y = this.borderLimit.startY : i >= this.borderLimit.endY ? this.position.y = this.borderLimit.endY : this.position.y = i, o <= s ? this.position.height = s : o >= e ? this.position.height = e : this.position.height = o;
        break;
      }
      case 2: {
        const i = this.originalPosition.y + (t.clientY - this.mouseInfo.mouseY), o = this.originalPosition.width + (t.clientX - this.mouseInfo.mouseX), s = this.originalPosition.height - (t.clientY - this.mouseInfo.mouseY), e = 0, n = this.borderLimit.startX + this.previewPositon.width - this.position.x, h = 0, r = this.position.height + (this.position.y - this.borderLimit.startY);
        i <= this.borderLimit.startY ? this.position.y = this.borderLimit.startY : i >= this.borderLimit.endY ? this.position.y = this.borderLimit.endY : this.position.y = i, o <= e ? this.position.width = e : o >= n ? this.position.width = n : this.position.width = o, s <= h ? this.position.height = h : s >= r ? this.position.height = r : this.position.height = s;
        break;
      }
      case 3: {
        const i = this.originalPosition.x + (t.clientX - this.mouseInfo.mouseX), o = this.originalPosition.width - (t.clientX - this.mouseInfo.mouseX), s = 0, e = this.position.width + (this.position.x - this.borderLimit.startX);
        i <= this.borderLimit.startX ? this.position.x = this.borderLimit.startX : i >= this.borderLimit.endX ? this.position.x = this.borderLimit.endX : this.position.x = i, o <= s ? this.position.width = s : o >= e ? this.position.width = e : this.position.width = o;
        break;
      }
      case 4: {
        const i = this.originalPosition.width + (t.clientX - this.mouseInfo.mouseX), o = 0, s = this.borderLimit.startX + this.previewPositon.width - this.position.x;
        i <= o ? this.position.width = o : i >= s ? this.position.width = s : this.position.width = i;
        break;
      }
      case 5: {
        const i = this.originalPosition.x + (t.clientX - this.mouseInfo.mouseX), o = this.originalPosition.width - (t.clientX - this.mouseInfo.mouseX), s = this.originalPosition.height + (t.clientY - this.mouseInfo.mouseY), e = 0, n = this.borderLimit.startX + this.previewPositon.width - this.position.x, h = 0, r = this.borderLimit.startY + this.previewPositon.height - this.position.y;
        i <= this.borderLimit.startX ? this.position.x = this.borderLimit.startX : i >= this.borderLimit.endX ? this.position.x = this.borderLimit.endX : this.position.x = i, o <= e ? this.position.width = e : o >= n ? this.position.width = n : this.position.width = o, s <= h ? this.position.height = h : s >= r ? this.position.height = r : this.position.height = s;
        break;
      }
      case 6: {
        const i = this.originalPosition.height + (t.clientY - this.mouseInfo.mouseY), o = 0, s = this.borderLimit.startY + this.previewPositon.height - this.position.y;
        i <= o ? this.position.height = o : i >= s ? this.position.height = s : this.position.height = i;
        break;
      }
      case 7: {
        const i = this.originalPosition.width + (t.clientX - this.mouseInfo.mouseX), o = this.originalPosition.height + (t.clientY - this.mouseInfo.mouseY), s = 0, e = this.borderLimit.startX + this.previewPositon.width - this.position.x, n = 0, h = this.borderLimit.startY + this.previewPositon.height - this.position.y;
        i <= s ? this.position.width = s : i >= e ? this.position.width = e : this.position.width = i, o <= n ? this.position.height = n : o >= h ? this.position.height = h : this.position.height = o;
        break;
      }
    }
    this.updateStyle(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateMapPostion();
  }
  updateMapPostion() {
    var t, i, o, s;
    this.mapPosition.x = Math.round(
      this.position.x * this.videoInfo.renderWidth / ((t = this.constraintBox) == null ? void 0 : t.getConstraintBoxPosition().width) * this.videoInfo.realProportion
    ), this.mapPosition.y = Math.round(
      this.position.y * this.videoInfo.renderHeight / ((i = this.constraintBox) == null ? void 0 : i.getConstraintBoxPosition().height) * this.videoInfo.realProportion
    ), this.mapPosition.width = Math.round(
      this.position.width * this.videoInfo.renderWidth / ((o = this.constraintBox) == null ? void 0 : o.getConstraintBoxPosition().width) * this.videoInfo.realProportion
    ), this.mapPosition.height = Math.round(
      this.position.height * this.videoInfo.renderHeight / ((s = this.constraintBox) == null ? void 0 : s.getConstraintBoxPosition().height) * this.videoInfo.realProportion
    );
  }
  setPreviewPosition(t) {
    this.previewPositon = t, this.calculateBorderLimit();
  }
  show(t) {
    this.zIndex = t ? 99 : -1, this.updateStyle();
  }
  getPosition() {
    return this.position;
  }
  getPreviewPosition() {
    return this.mapPosition;
  }
  getBorderLimit() {
    return this.borderLimit;
  }
}
class x {
  constructor(t, i) {
    this.constraintBoxElement = null, this.constraintBoxBodyElement = null, this.parent = null, this.x = 0, this.y = 0, this.width = 0, this.height = 0, this.constraintBoxPosition = {
      // 相对父元素的位置
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.videoInfo = null, this.cropbox = null, this.canvas = null, this.video = null, this.videoInfo = i, this.parent = t, this.constraintBoxElement = document.createElement("div"), this.constraintBoxElement.setAttribute(
      "class",
      "video-cropper-constraint-box"
    ), this.constraintBoxBodyElement = document.createElement("div"), this.constraintBoxBodyElement.setAttribute(
      "class",
      "video-cropper-constraint-box-body"
    ), this.constraintBoxElement.appendChild(this.constraintBoxBodyElement), this.width = this.videoInfo.renderWidth, this.height = this.videoInfo.renderHeight, this.constraintBoxPosition = {
      x: this.videoInfo.renderX,
      y: this.videoInfo.renderY,
      width: this.videoInfo.renderWidth,
      height: this.videoInfo.renderHeight
    }, this.updateStyle();
  }
  transform(t) {
    var i, o, s, e, n;
    t.type === "scale" ? (this.constraintBoxPosition.width = ((i = this.videoInfo) == null ? void 0 : i.renderWidth) * t.scale, this.constraintBoxPosition.height = ((o = this.videoInfo) == null ? void 0 : o.renderHeight) * t.scale, this.width = this.constraintBoxPosition.width, this.height = this.constraintBoxPosition.height, (s = this.canvas) == null || s.updateSize(), (e = this.video) == null || e.updateSize(), (n = this.cropbox) == null || n.calculateBorderLimit()) : (this.constraintBoxPosition.x = t.translateX, this.constraintBoxPosition.y = t.translateY), this.updateStyle();
  }
  updateStyle() {
    const t = `
      --video-cropper-constraint-box-left: ${this.constraintBoxPosition.x}px;
      --video-cropper-constraint-box-top: ${this.constraintBoxPosition.y}px;
      --video-cropper-constraint-box-width: ${this.constraintBoxPosition.width}px;
      --video-cropper-constraint-box-height: ${this.constraintBoxPosition.height}px;`;
    this.constraintBoxElement.setAttribute("style", t);
  }
  setVideo(t) {
    this.video = t, this.constraintBoxBodyElement.appendChild(this.video.videoElement);
  }
  setCropBox(t) {
    this.cropbox = t, this.constraintBoxBodyElement.appendChild(this.cropbox.cropBoxElement);
  }
  setCanvas(t) {
    this.canvas = t, this.constraintBoxBodyElement.appendChild(this.canvas.canvasElement), this.parent.appendChild(this.constraintBoxElement);
  }
  getConstraintBoxPosition() {
    return this.constraintBoxPosition;
  }
  setConstraintBoxPosition(t) {
    this.constraintBoxPosition = t;
  }
}
class g {
  constructor(t, i) {
    this.parent = null, this.container = null, this.canvas = null, this.cropBox = null, this.constraintBox = null, this.video = null, this.options = void 0, this.videoInfo = {
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
    }, this.transformInfo = {
      scale: 1,
      origin: { x: 0, y: 0 },
      translateX: 0,
      translateY: 0,
      type: "scale"
    }, this.grabInfo = {
      grab: !1,
      grabX: 0,
      grabY: 0,
      originPosition: { x: 0, y: 0 }
    }, this.videoElement = t, this.options = i, this.videoInfo = {
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
    const o = this.calculateRenderVideoInfo();
    this.videoInfo.renderWidth = o.renderWidth, this.videoInfo.renderHeight = o.renderHeight, this.videoInfo.realProportion = o.realProportion, this.videoInfo.displayProportion = o.displayProportion, this.videoInfo.renderX = o.renderX, this.videoInfo.renderY = o.renderY, this.init();
  }
  init() {
    var t, i;
    this.parent = document.createElement("div"), this.container = this.videoElement.parentElement, this.container.appendChild(this.parent), this.parent.setAttribute("class", "video-cropper-parent"), this.parent.setAttribute(
      "style",
      `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
    ), this.video = new l(this.videoElement, this.videoInfo), this.canvas = new c(this.videoInfo), this.canvas.setVideo(this.video), this.cropBox = new m(this.videoInfo, (t = this.options) == null ? void 0 : t.cropboxConfig), this.constraintBox = new x(this.parent, this.videoInfo), this.constraintBox.setVideo(this.video), this.constraintBox.setCanvas(this.canvas), this.constraintBox.setCropBox(this.cropBox), this.video.setCropBox(this.cropBox), this.canvas.setCropBox(this.cropBox), this.canvas.setConstraintBox(this.constraintBox), this.cropBox.setConstraintBox(this.constraintBox), this.video.setConstraintBox(this.constraintBox), (i = this.cropBox) == null || i.setDrawCropBoxFunc(
      (o, s, e, n) => {
        var h;
        (h = this.canvas) == null || h.drawCropbox(o, s, e, n);
      }
    ), this.registerEvent(), console.log(this.videoInfo);
  }
  registerEvent() {
    var t, i, o, s;
    (t = this.constraintBox) == null || t.constraintBoxElement.addEventListener(
      "wheel",
      (e) => {
        var n, h, r;
        if (this.transformInfo.origin.x = e.offsetX, this.transformInfo.origin.y = e.offsetY, this.transformInfo.type = "scale", this.transformInfo.scale - 0.1 >= 0 && e.deltaY < 0) {
          const { width: a, height: p } = (n = this.cropBox) == null ? void 0 : n.getPosition();
          ((h = this.videoInfo) == null ? void 0 : h.renderWidth) * (this.transformInfo.scale - 0.1) <= a ? this.transformInfo.scale = a / this.videoInfo.renderWidth : this.transformInfo.scale -= 0.1, ((r = this.videoInfo) == null ? void 0 : r.renderHeight) * (this.transformInfo.scale - 0.1) <= p ? this.transformInfo.scale = p / this.videoInfo.renderHeight : this.transformInfo.scale -= 0.1;
        }
        e.deltaY > 0 && (this.transformInfo.scale += 0.1), this.constraintBox.transform(this.transformInfo);
      }
    ), (i = this.constraintBox.constraintBoxElement) == null || i.addEventListener(
      "mousedown",
      (e) => {
        var n, h, r;
        e.preventDefault(), e.stopPropagation(), this.grabInfo.grab = !0, this.grabInfo.grabX = e.clientX, this.grabInfo.grabY = e.clientY, this.grabInfo.originPosition = {
          x: (n = this.constraintBox) == null ? void 0 : n.getConstraintBoxPosition().x,
          y: (h = this.constraintBox) == null ? void 0 : h.getConstraintBoxPosition().y
        }, (r = this.canvas) == null || r.setGrab(this.grabInfo.grab);
      }
    ), (o = this.constraintBox.constraintBoxElement) == null || o.addEventListener(
      "mousemove",
      (e) => {
        var n, h;
        e.preventDefault(), e.stopPropagation(), this.grabInfo.grab && (this.transformInfo.type = "move", this.transformInfo.translateX = e.clientX - this.grabInfo.grabX + ((n = this.grabInfo.originPosition) == null ? void 0 : n.x), this.transformInfo.translateY = e.clientY - this.grabInfo.grabY + ((h = this.grabInfo.originPosition) == null ? void 0 : h.y), this.constraintBox.transform(this.transformInfo));
      }
    ), (s = this.constraintBox.constraintBoxElement) == null || s.addEventListener(
      "mouseup",
      (e) => {
        var n;
        e.preventDefault(), e.stopPropagation(), this.grabInfo.grab = !1, (n = this.canvas) == null || n.setGrab(this.grabInfo.grab);
      }
    );
  }
  calculateRenderVideoInfo() {
    const t = this.videoInfo.videoWidth / this.videoInfo.videoHeight, i = this.videoInfo.elementWidth / this.videoInfo.elementHeight;
    if (t >= i) {
      const o = this.videoInfo.elementWidth / this.videoInfo.videoWidth, s = this.videoInfo.videoWidth / this.videoInfo.elementWidth;
      return {
        renderWidth: this.videoInfo.elementWidth,
        renderHeight: this.videoInfo.videoHeight * o,
        displayProportion: o,
        realProportion: s,
        renderX: 0,
        renderY: (this.videoInfo.elementHeight - this.videoInfo.videoHeight * o) / 2
      };
    } else {
      const o = this.videoInfo.elementHeight / this.videoInfo.videoHeight, s = this.videoInfo.videoHeight / this.videoInfo.elementHeight;
      return {
        renderWidth: this.videoInfo.videoWidth * o,
        renderHeight: this.videoInfo.elementHeight,
        displayProportion: o,
        realProportion: s,
        renderX: (this.videoInfo.elementWidth - this.videoInfo.videoWidth * o) / 2,
        renderY: 0
      };
    }
  }
  getVideo() {
    return this.video;
  }
  setCropBoxPositionFunc(t) {
    var i;
    (i = this.cropBox) == null || i.setCropBoxPositionFunc(t);
  }
}
export {
  g as default
};
