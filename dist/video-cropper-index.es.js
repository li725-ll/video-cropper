class l {
  constructor(t, i, o) {
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
    }, this.cropbox = null, this.lastConstraintBoxPosition = null, this.videoConfig = { muted: !0 }, this.videoElement = t, this.videoInfo = i, this.duration = i.duration, this.videoConfig && (this.videoConfig = o), this.videoElement.setAttribute("class", "video-cropper-video"), this.videoConfig.muted && (this.videoElement.muted = !0, this.videoElement.volume = 0), this.updateStyle(), this.registerEvent();
  }
  setCropBox(t) {
    this.cropbox = t;
  }
  registerEvent() {
  }
  play() {
    this.previewFlag = !0, this.updateStyle(), this.videoElement.play();
  }
  preview() {
    var t, i, o, e;
    if (!this.previewFlag) {
      const n = (t = this.cropbox) == null ? void 0 : t.getPosition(), s = (i = this.constraintBox) == null ? void 0 : i.getConstraintBoxPosition();
      this.lastConstraintBoxPosition = { ...s };
      const r = this.videoInfo.elementWidth / n.width, d = this.videoInfo.elementHeight / n.height;
      s.height = s.height * r, s.width = s.width * d, s.x = -(n.x * r), s.y = -(n.y * d), (o = this.constraintBox) == null || o.setConstraintBoxPosition(s), (e = this.constraintBox) == null || e.updateStyle(), this.play();
    }
  }
  exitPreview() {
    var t, i;
    this.previewFlag && ((t = this.constraintBox) == null || t.setConstraintBoxPosition(
      this.lastConstraintBoxPosition
    ), (i = this.constraintBox) == null || i.updateStyle(), this.previewFlag = !1, this.updateStyle(), this.pause());
  }
  pause() {
    this.previewFlag = !1, this.videoElement.pause(), this.updateStyle();
  }
  setCurrentTime(t) {
    t >= this.videoInfo.duration && (t = this.videoInfo.duration), t <= 0 && (t = 0), this.videoElement.currentTime = t;
  }
  setUpdateCallback(t) {
    var i;
    return (i = this.videoElement) == null || i.addEventListener("timeupdate", t), () => {
      var o;
      (o = this.videoElement) == null || o.removeEventListener("timeupdate", t);
    };
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
class v {
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
    }, this.videoInfo = t, this.canvasElement = document.createElement("canvas"), this.canvasElement.dataset.eventType = "canvas-scale-move", this.canvasElement.setAttribute("class", "video-cropper-canvas"), this.ctx = this.canvasElement.getContext("2d"), this.updateStyle();
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
  drawCropbox(t, i, o, e) {
    var n, s, r, d;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.32)", this.ctx.clearRect(
      0,
      0,
      (n = this.canvasElement) == null ? void 0 : n.width,
      (s = this.canvasElement) == null ? void 0 : s.height
    ), this.ctx.fillRect(
      0,
      0,
      (r = this.canvasElement) == null ? void 0 : r.width,
      (d = this.canvasElement) == null ? void 0 : d.height
    ), this.ctx.clearRect(t, i, o, e);
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
class x {
  constructor(t, i) {
    this.cropBoxElement = null, this.anchors = [], this.grids = [], this.boders = [], this.pointerContainer = null, this.gridContainer = null, this.broderContainer = null, this.rate = 0.5, this.zIndex = 99, this.constraintBox = null, this.disengage = !1, this.drawCropbox = () => {
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
    }, this.cropBoxConfig = {
      aspectRatio: 0
    }, this.videoInfo = t, i && (this.cropBoxConfig = i), this.initCropbox();
  }
  setConstraintBox(t) {
    var i;
    this.constraintBox = t, this.previewPositon = {
      x: this.constraintBox.x,
      y: this.constraintBox.y,
      width: this.constraintBox.width,
      height: this.constraintBox.height
    }, this.constraintBoxPosition = {
      ...this.previewPositon
    }, this.position = ((i = this.cropBoxConfig) == null ? void 0 : i.position) || this.calculateAspectRatio(), this.calculateBorderLimit(), this.updateStyle();
  }
  borderMove(t, i, o) {
    switch (o) {
      case 0:
        this.cropboxScale(t, i, 1);
        break;
      case 1:
        this.cropboxScale(t, i, 4);
        break;
      case 2:
        this.cropboxScale(t, i, 6);
        break;
      case 3:
        this.cropboxScale(t, i, 3);
        break;
    }
  }
  pointerMove(t, i, o) {
    this.cropboxScale(t, i, o);
  }
  setOriginalPosition() {
    this.originalPosition.x = this.position.x, this.originalPosition.y = this.position.y, this.originalPosition.width = this.position.width, this.originalPosition.height = this.position.height;
  }
  updateStyle() {
    const t = `
      --crop-box-z-index: ${this.zIndex};
      --crop-box-left: ${this.position.x}px;
      --crop-box-top: ${this.position.y}px;
      --crop-box-width: ${this.position.width}px;
      --crop-box-height: ${this.position.height}px;
    `;
    this.cropBoxElement.setAttribute("style", t);
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
    if (((t = this.cropBoxConfig) == null ? void 0 : t.aspectRatio) === 0)
      return {
        x: (this.constraintBoxPosition.width - this.videoInfo.renderWidth * this.rate) / 2,
        y: (this.constraintBoxPosition.height - this.videoInfo.renderHeight * this.rate) / 2,
        width: this.videoInfo.renderWidth * this.rate,
        height: this.videoInfo.renderHeight * this.rate
      };
    {
      const i = Math.min(
        this.videoInfo.renderWidth * this.rate,
        this.videoInfo.renderHeight * this.rate
      );
      if (this.cropBoxConfig.aspectRatio >= 1) {
        const o = i, e = i / this.cropBoxConfig.aspectRatio;
        return {
          x: (this.constraintBoxPosition.width - o) / 2,
          y: (this.constraintBoxPosition.height - e) / 2,
          width: o,
          height: e
        };
      } else {
        const o = i * this.cropBoxConfig.aspectRatio, e = i;
        return {
          x: (this.constraintBoxPosition.width - o) / 2,
          y: (this.constraintBoxPosition.height - e) / 2,
          width: o,
          height: e
        };
      }
    }
  }
  initCropbox() {
    this.cropBoxElement = document.createElement("div"), this.cropBoxElement.setAttribute("class", "video-cropper-crop-box"), this.initGrid(), this.initBorder(), this.initPointer(), this.cropBoxElement.appendChild(this.gridContainer), this.cropBoxElement.appendChild(this.broderContainer), this.cropBoxElement.appendChild(this.pointerContainer);
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
      ), o.dataset.eventType = `pointer-move-${i}`, this.pointerContainer.appendChild(o), o;
    });
  }
  initGrid() {
    this.gridContainer = document.createElement("div"), this.gridContainer.setAttribute(
      "class",
      "video-cropper-crop-box-grid-container"
    ), this.gridContainer.dataset.eventType = "grid-move", this.grids = Array(9).fill(null), this.grids.forEach((t, i) => {
      const o = document.createElement("div");
      o.setAttribute(
        "class",
        `video-cropper-crop-box-grid-${i} video-cropper-crop-box-grid`
      ), o.dataset.eventType = "grid-move", this.gridContainer.appendChild(o);
    });
  }
  initBorder() {
    this.broderContainer = document.createElement("div"), this.broderContainer.setAttribute(
      "class",
      "video-cropper-crop-box-border-container"
    );
    const t = document.createElement("div");
    t.dataset.eventType = "grid-move", t.setAttribute("class", "video-cropper-crop-box-border-temp"), this.boders = Array(4).fill(null), this.boders = this.boders.map((i, o) => {
      const e = document.createElement("div");
      return e.setAttribute(
        "class",
        `video-cropper-crop-box-border-${o} video-cropper-crop-box-border`
      ), e.dataset.eventType = `border-move-${o}`, t.appendChild(e), e;
    }), this.broderContainer.appendChild(t);
  }
  cropboxMove(t, i) {
    const o = this.originalPosition.x + t, e = this.originalPosition.y + i;
    o <= this.borderLimit.startX ? this.position.x = this.borderLimit.startX : o >= this.borderLimit.endX ? this.position.x = this.borderLimit.endX : this.position.x = o, e <= this.borderLimit.startY ? this.position.y = this.borderLimit.startY : e >= this.borderLimit.endY ? this.position.y = this.borderLimit.endY : this.position.y = e, this.updateStyle(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateMapPostion(), this.cropBoxPositionFunc(this.mapPosition, this.position);
  }
  borderLeftMove(t) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const s = -t * this.cropBoxConfig.aspectRatio;
      this.position.y = this.originalPosition.y - s / 2, this.position.height = this.originalPosition.height + s;
    }
    const i = this.originalPosition.x + t, o = this.originalPosition.width - t, e = 20, n = this.originalPosition.x + this.originalPosition.width;
    i <= this.borderLimit.startX ? (this.position.x = this.borderLimit.startX, this.position.width = n) : i >= n - e ? (this.position.x = n - e, this.position.width = e) : (this.position.x = i, this.position.width = o);
  }
  borderTopMove(t) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const s = -t * this.cropBoxConfig.aspectRatio;
      this.position.x = this.originalPosition.x - s / 2, this.position.width = this.originalPosition.width + s;
    }
    const i = this.originalPosition.y + t, o = this.originalPosition.height - t, e = this.originalPosition.y + this.originalPosition.height, n = 20;
    i <= this.borderLimit.startY ? (this.position.y = this.borderLimit.startY, this.position.height = e) : i >= e - n ? (this.position.y = e - n, this.position.height = n) : (this.position.y = i, this.position.height = o);
  }
  borderRightMove(t) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const n = t * this.cropBoxConfig.aspectRatio;
      this.position.y = this.originalPosition.y - n / 2, this.position.height = this.originalPosition.height + n;
    }
    const i = this.originalPosition.width + t, o = 20, e = this.videoInfo.renderWidth - this.originalPosition.x;
    i <= o ? this.position.width = o : i >= e ? this.position.width = e : this.position.width = i;
  }
  borderBottomMove(t) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const n = t * this.cropBoxConfig.aspectRatio;
      this.position.x = this.originalPosition.x - n / 2, this.position.width = this.originalPosition.width + n;
    }
    const i = this.originalPosition.height + t, o = 20, e = this.videoInfo.renderHeight - this.originalPosition.y;
    i <= o ? this.position.height = o : i >= e ? this.position.height = e : this.position.height = i;
  }
  // TODO: disengage = true还未实现，等比缩放未实现
  cropboxScale(t, i, o) {
    switch (o) {
      case 0: {
        this.borderLeftMove(t), this.borderTopMove(i);
        break;
      }
      case 1: {
        this.borderTopMove(i);
        break;
      }
      case 2: {
        this.borderTopMove(i), this.borderRightMove(t);
        break;
      }
      case 3: {
        this.borderLeftMove(t);
        break;
      }
      case 4: {
        this.borderRightMove(t);
        break;
      }
      case 5: {
        this.borderBottomMove(i), this.borderLeftMove(t);
        break;
      }
      case 6: {
        this.borderBottomMove(i);
        break;
      }
      case 7: {
        this.borderBottomMove(i), this.borderRightMove(t);
        break;
      }
    }
    this.updateStyle(), this.calculateBorderLimit(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateMapPostion(), this.cropBoxPositionFunc(this.mapPosition, this.position);
  }
  updateMapPostion() {
    var t, i, o, e;
    this.mapPosition.x = Math.round(
      this.position.x * this.videoInfo.renderWidth / ((t = this.constraintBox) == null ? void 0 : t.getConstraintBoxPosition().width) * this.videoInfo.realProportion
    ), this.mapPosition.y = Math.round(
      this.position.y * this.videoInfo.renderHeight / ((i = this.constraintBox) == null ? void 0 : i.getConstraintBoxPosition().height) * this.videoInfo.realProportion
    ), this.mapPosition.width = Math.round(
      this.position.width * this.videoInfo.renderWidth / ((o = this.constraintBox) == null ? void 0 : o.getConstraintBoxPosition().width) * this.videoInfo.realProportion
    ), this.mapPosition.height = Math.round(
      this.position.height * this.videoInfo.renderHeight / ((e = this.constraintBox) == null ? void 0 : e.getConstraintBoxPosition().height) * this.videoInfo.realProportion
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
  setPosition(t) {
    this.position = t;
  }
  getPreviewPosition() {
    return this.mapPosition;
  }
  getBorderLimit() {
    return this.borderLimit;
  }
}
class g {
  constructor(t, i, o) {
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
    ), this.constraintBoxElement.appendChild(this.constraintBoxBodyElement), this.width = this.videoInfo.renderWidth, this.height = this.videoInfo.renderHeight, o != null && o.position ? this.constraintBoxPosition = o.position : this.constraintBoxPosition = {
      x: this.videoInfo.renderX,
      y: this.videoInfo.renderY,
      width: this.videoInfo.renderWidth,
      height: this.videoInfo.renderHeight
    }, this.updateStyle();
  }
  transform(t) {
    var i, o, e, n, s;
    t.type === "scale" ? (this.constraintBoxPosition.x = t.translateX, this.constraintBoxPosition.y = t.translateY, this.constraintBoxPosition.width = ((i = this.videoInfo) == null ? void 0 : i.renderWidth) * t.scale, this.constraintBoxPosition.height = ((o = this.videoInfo) == null ? void 0 : o.renderHeight) * t.scale, this.width = this.constraintBoxPosition.width, this.height = this.constraintBoxPosition.height, (e = this.canvas) == null || e.updateSize(), (n = this.video) == null || n.updateSize(), (s = this.cropbox) == null || s.calculateBorderLimit()) : (this.constraintBoxPosition.x = t.translateX, this.constraintBoxPosition.y = t.translateY), this.updateStyle();
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
class m {
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
    }, this.mouseInfo = {
      type: null,
      mouseX: 0,
      mouseY: 0,
      mouseDown: !1
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
    var t, i, o, e, n, s;
    this.parent = document.createElement("div"), this.container = this.videoElement.parentElement, this.container.appendChild(this.parent), this.parent.setAttribute("class", "video-cropper-parent"), this.parent.setAttribute(
      "style",
      `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
    ), this.video = new l(
      this.videoElement,
      this.videoInfo,
      (t = this.options) == null ? void 0 : t.videoConfig
    ), this.canvas = new v(this.videoInfo), this.canvas.setVideo(this.video), this.cropBox = new x(this.videoInfo, (i = this.options) == null ? void 0 : i.cropBoxConfig), this.constraintBox = new g(
      this.parent,
      this.videoInfo,
      (o = this.options) == null ? void 0 : o.constraintBoxConfig
    ), this.constraintBox.setVideo(this.video), this.constraintBox.setCanvas(this.canvas), this.constraintBox.setCropBox(this.cropBox), this.video.setCropBox(this.cropBox), this.canvas.setCropBox(this.cropBox), this.canvas.setConstraintBox(this.constraintBox), this.cropBox.setConstraintBox(this.constraintBox), this.video.setConstraintBox(this.constraintBox), (e = this.cropBox) == null || e.setDrawCropBoxFunc(
      (r, d, h, a) => {
        var p;
        (p = this.canvas) == null || p.drawCropbox(r, d, h, a);
      }
    ), this.grabInfo.originPosition = {
      x: (n = this.constraintBox) == null ? void 0 : n.getConstraintBoxPosition().x,
      y: (s = this.constraintBox) == null ? void 0 : s.getConstraintBoxPosition().y
    }, this.registerEvent();
  }
  registerEvent() {
    var t, i, o, e, n;
    (t = this.parent) == null || t.addEventListener("wheel", (s) => {
      var r, d, h;
      if (s.target.dataset.eventType === "canvas-scale-move") {
        if (this.transformInfo.origin.x = s.offsetX, this.transformInfo.origin.y = s.offsetY, this.transformInfo.type = "scale", this.transformInfo.scale - 0.1 >= 0 && s.deltaY < 0) {
          const { width: a, height: p } = (r = this.cropBox) == null ? void 0 : r.getPosition();
          ((d = this.videoInfo) == null ? void 0 : d.renderWidth) * (this.transformInfo.scale - 0.1) <= a ? this.transformInfo.scale = a / this.videoInfo.renderWidth : this.transformInfo.scale -= 0.1, ((h = this.videoInfo) == null ? void 0 : h.renderHeight) * (this.transformInfo.scale - 0.1) <= p ? this.transformInfo.scale = p / this.videoInfo.renderHeight : this.transformInfo.scale -= 0.1;
        }
        s.deltaY > 0 && (this.transformInfo.scale += 0.1), this.transformScale();
      }
    }), (i = this.parent) == null || i.addEventListener("mousedown", (s) => {
      var r, d, h;
      this.mouseInfo.mouseDown = !0, this.mouseInfo.mouseX = s.clientX, this.mouseInfo.mouseY = s.clientY, this.mouseInfo.type = s.target.dataset.eventType, this.cropBox.setOriginalPosition(), this.mouseInfo.type === "canvas-scale-move" && (this.grabInfo.grab = !0, this.grabInfo.grabX = s.clientX, this.grabInfo.grabY = s.clientY, this.grabInfo.originPosition = {
        x: (r = this.constraintBox) == null ? void 0 : r.getConstraintBoxPosition().x,
        y: (d = this.constraintBox) == null ? void 0 : d.getConstraintBoxPosition().y
      }, (h = this.canvas) == null || h.setGrab(this.grabInfo.grab));
    }), (o = this.parent) == null || o.addEventListener("mouseup", (s) => {
      var r;
      this.mouseInfo.mouseDown = !1, this.mouseInfo.type === "canvas-scale-move" && (this.grabInfo.grab = !1, (r = this.canvas) == null || r.setGrab(this.grabInfo.grab));
    }), (e = this.parent) == null || e.addEventListener("mouseleave", (s) => {
      var r;
      this.mouseInfo.mouseDown = !1, this.mouseInfo.type === "canvas-scale-move" && (this.grabInfo.grab = !1, (r = this.canvas) == null || r.setGrab(this.grabInfo.grab));
    }), (n = this.parent) == null || n.addEventListener("mousemove", (s) => {
      var r, d;
      if (this.mouseInfo.mouseDown) {
        const h = s.clientX - this.mouseInfo.mouseX, a = s.clientY - this.mouseInfo.mouseY;
        switch (this.mouseInfo.type) {
          case "border-move-0": {
            this.cropBox.borderMove(h, a, 0);
            break;
          }
          case "border-move-1": {
            this.cropBox.borderMove(h, a, 1);
            break;
          }
          case "border-move-2": {
            this.cropBox.borderMove(h, a, 2);
            break;
          }
          case "border-move-3": {
            this.cropBox.borderMove(h, a, 3);
            break;
          }
          case "pointer-move-0": {
            this.cropBox.pointerMove(h, a, 0);
            break;
          }
          case "pointer-move-1": {
            this.cropBox.pointerMove(h, a, 1);
            break;
          }
          case "pointer-move-2": {
            this.cropBox.pointerMove(h, a, 2);
            break;
          }
          case "pointer-move-3": {
            this.cropBox.pointerMove(h, a, 3);
            break;
          }
          case "pointer-move-4": {
            this.cropBox.pointerMove(h, a, 4);
            break;
          }
          case "pointer-move-5": {
            this.cropBox.pointerMove(h, a, 5);
            break;
          }
          case "pointer-move-6": {
            this.cropBox.pointerMove(h, a, 6);
            break;
          }
          case "pointer-move-7": {
            this.cropBox.pointerMove(h, a, 7);
            break;
          }
          case "grid-move": {
            this.cropBox.cropboxMove(h, a);
            break;
          }
          case "canvas-scale-move":
            this.grabInfo.grab && (this.transformInfo.type = "move", this.transformInfo.translateX = s.clientX - this.grabInfo.grabX + ((r = this.grabInfo.originPosition) == null ? void 0 : r.x), this.transformInfo.translateY = s.clientY - this.grabInfo.grabY + ((d = this.grabInfo.originPosition) == null ? void 0 : d.y), this.constraintBox.transform(this.transformInfo));
        }
      }
    });
  }
  transformScale() {
    var e;
    const t = (e = this.constraintBox) == null ? void 0 : e.getConstraintBoxPosition(), i = t.x - (this.videoInfo.renderWidth * this.transformInfo.scale - t.width) * (this.transformInfo.origin.x / t.width), o = t.y - (this.videoInfo.renderHeight * this.transformInfo.scale - t.height) * (this.transformInfo.origin.y / t.height);
    this.transformInfo.translateX = i, this.transformInfo.translateY = o, this.constraintBox.transform(this.transformInfo);
  }
  calculateRenderVideoInfo() {
    const t = this.videoInfo.videoWidth / this.videoInfo.videoHeight, i = this.videoInfo.elementWidth / this.videoInfo.elementHeight;
    if (t >= i) {
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
  getVideo() {
    return this.video;
  }
  getConstraintBox() {
    return this.constraintBox;
  }
  getCropBox() {
    return this.cropBox;
  }
  scale(t, i, o) {
    this.transformInfo.origin.x = i || this.videoElement.width / 2, this.transformInfo.origin.y = o || this.videoElement.height / 2, this.transformInfo.scale += t, this.transformScale();
  }
  setCropBoxPositionFunc(t) {
    var i;
    (i = this.cropBox) == null || i.setCropBoxPositionFunc(t);
  }
}
export {
  m as default
};
