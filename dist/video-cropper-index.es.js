class b {
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
    }, this.cropbox = null, this.mask = null, this.lastConstraintBoxPosition = null, this.videoConfig = { muted: !0 }, this.videoElement = t, this.videoInfo = i, this.duration = i.duration, this.videoConfig && (this.videoConfig = o), this.videoElement.setAttribute("class", "video-cropper-video"), this.videoConfig.muted && (this.videoElement.muted = !0, this.videoElement.volume = 0), this.updateStyle();
  }
  setCropBox(t) {
    this.cropbox = t;
  }
  setMask(t) {
    this.mask = t;
  }
  play() {
    this.previewFlag = !0, this.updateStyle(), this.videoElement.play();
  }
  preview() {
    var t, i, o, e, s, r, d, n, a, x, m, u, B, y;
    if (!this.previewFlag) {
      const p = (t = this.cropbox) == null ? void 0 : t.getPosition(), h = (i = this.constraintBox) == null ? void 0 : i.getConstraintBoxPosition();
      this.lastConstraintBoxPosition = { ...h };
      const g = this.videoInfo.elementWidth / this.videoInfo.elementHeight, f = p.width / p.height;
      if (console.log(g, f), f === g) {
        const c = this.videoInfo.elementWidth / p.width, l = this.videoInfo.elementHeight / p.height;
        h.height = h.height * c, h.width = h.width * l, h.x = -(p.x * c), h.y = -(p.y * l), (o = this.constraintBox) == null || o.setConstraintBoxPosition(h), (e = this.constraintBox) == null || e.updateStyle(), this.play();
      } else if (f > g) {
        const c = this.videoInfo.elementWidth / p.width, l = (this.videoInfo.elementHeight - p.height * c) / 2;
        h.height = h.height * c, h.width = h.width * c, h.x = -(p.x * c), h.y = -(p.y * c) + l, (s = this.mask) == null || s.topComponent(l), (r = this.mask) == null || r.bottomComponent(l), (d = this.mask) == null || d.show(1500), (n = this.constraintBox) == null || n.setConstraintBoxPosition(h), (a = this.constraintBox) == null || a.updateStyle(), this.play();
      } else {
        const c = this.videoInfo.elementHeight / p.height, l = (this.videoInfo.elementHeight - p.width * c) / 2;
        h.height = h.height * c, h.width = h.width * c, h.x = -(p.x * c) + l, h.y = -(p.y * c), (x = this.mask) == null || x.leftComponent(l), (m = this.mask) == null || m.rightComponent(l), (u = this.mask) == null || u.show(1500), (B = this.constraintBox) == null || B.setConstraintBoxPosition(h), (y = this.constraintBox) == null || y.updateStyle(), this.play();
      }
    }
  }
  exitPreview() {
    var t, i, o;
    this.previewFlag && ((t = this.constraintBox) == null || t.setConstraintBoxPosition(
      this.lastConstraintBoxPosition
    ), (i = this.constraintBox) == null || i.updateStyle(), this.previewFlag = !1, (o = this.mask) == null || o.hide(), this.updateStyle(), this.pause());
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
    const t = `
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
class P {
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
    var s, r, d, n;
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.32)", this.ctx.clearRect(
      0,
      0,
      (s = this.canvasElement) == null ? void 0 : s.width,
      (r = this.canvasElement) == null ? void 0 : r.height
    ), this.ctx.fillRect(
      0,
      0,
      (d = this.canvasElement) == null ? void 0 : d.width,
      (n = this.canvasElement) == null ? void 0 : n.height
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
class I {
  constructor(t, i) {
    this.cropBoxElement = null, this.anchors = [], this.grids = [], this.boders = [], this.pointerContainer = null, this.gridContainer = null, this.broderContainer = null, this.zIndex = 99, this.constraintBox = null, this.disengage = !1, this.drawCropbox = () => {
    }, this.cropBoxPositionFunc = () => {
    }, this.originalPosition = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.previewPosition = {
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
    }, this.cropBoxConfig = {
      aspectRatio: 0,
      rate: 0.5
      // 裁剪框的大小缩放比例
    }, this.videoInfo = t, i && (this.cropBoxConfig = i), this.positionProxy = new Proxy(this.position, {
      set: (o, e, s) => (o[e] = s, !0),
      get: (o, e) => o[e]
    }), this.initCropbox();
  }
  setConstraintBox(t) {
    var o;
    this.constraintBox = t, this.previewPosition = {
      x: this.constraintBox.x,
      y: this.constraintBox.y,
      width: this.constraintBox.width,
      height: this.constraintBox.height
    }, this.constraintBoxPosition = {
      ...this.previewPosition
    };
    const i = ((o = this.cropBoxConfig) == null ? void 0 : o.position) || this.calculateAspectRatio();
    this.positionProxy.x = i.x, this.positionProxy.y = i.y, this.positionProxy.width = i.width, this.positionProxy.height = i.height, this.updateStyle(), this.updateMapPostion();
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
  getOriginalPosition() {
    return this.originalPosition;
  }
  updateStyle() {
    const t = this.normalizePosition(this.position), i = `
      --crop-box-z-index: ${this.zIndex};
      --crop-box-left: ${t.x}px;
      --crop-box-top: ${t.y}px;
      --crop-box-width: ${t.width}px;
      --crop-box-height: ${t.height}px;
    `;
    this.cropBoxElement.setAttribute("style", i);
  }
  normalizePosition(t) {
    const i = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    return this.position.width < 0 ? (i.width = t.width * -1, i.x = t.x + t.width) : (i.width = t.width, i.x = t.x), t.height < 0 ? (i.height = t.height * -1, i.y = t.y + t.height) : (i.height = t.height, i.y = t.y), i;
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
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateStyle();
  }
  calculateAspectRatio() {
    var t;
    if (this.cropBoxConfig.rate = this.cropBoxConfig.rate || 0.5, ((t = this.cropBoxConfig) == null ? void 0 : t.aspectRatio) === 0)
      return {
        x: (this.constraintBoxPosition.width - this.videoInfo.renderWidth * this.cropBoxConfig.rate) / 2,
        y: (this.constraintBoxPosition.height - this.videoInfo.renderHeight * this.cropBoxConfig.rate) / 2,
        width: this.videoInfo.renderWidth * this.cropBoxConfig.rate,
        height: this.videoInfo.renderHeight * this.cropBoxConfig.rate
      };
    {
      const i = Math.min(
        this.videoInfo.renderWidth * this.cropBoxConfig.rate,
        this.videoInfo.renderHeight * this.cropBoxConfig.rate
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
    this.positionProxy.x = o, this.positionProxy.y = e, this.updateStyle(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateMapPostion(), this.cropBoxPositionFunc(
      this.mapPosition,
      this.normalizePosition(this.position)
    );
  }
  borderLeftMove(t, i) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const o = -t / this.cropBoxConfig.aspectRatio;
      i === 0 ? (this.positionProxy.y = this.originalPosition.y - o, this.positionProxy.height = this.originalPosition.height + o) : i === 5 || (this.positionProxy.y = this.originalPosition.y - o / 2), this.positionProxy.height = this.originalPosition.height + o;
    }
    this.positionProxy.x = this.originalPosition.x + t, this.positionProxy.width = this.originalPosition.width - t;
  }
  borderTopMove(t, i) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const o = -t * this.cropBoxConfig.aspectRatio;
      i === 0 ? this.positionProxy.x = this.originalPosition.x - o : i === 2 || (this.positionProxy.x = this.originalPosition.x - o / 2), this.positionProxy.width = this.originalPosition.width + o;
    }
    this.positionProxy.y = this.originalPosition.y + t, this.positionProxy.height = this.originalPosition.height - t;
  }
  borderRightMove(t, i) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const o = t / this.cropBoxConfig.aspectRatio;
      i === 2 ? this.positionProxy.y = this.originalPosition.y - o : i === 7 || (this.positionProxy.y = this.originalPosition.y - o / 2), this.positionProxy.height = this.originalPosition.height + o;
    }
    this.positionProxy.width = this.originalPosition.width + t;
  }
  borderBottomMove(t, i) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const o = t * this.cropBoxConfig.aspectRatio;
      i === 5 ? this.positionProxy.x = this.originalPosition.x - o : i === 7 || (this.positionProxy.x = this.originalPosition.x - o / 2), this.positionProxy.width = this.originalPosition.width + o;
    }
    this.positionProxy.height = this.originalPosition.height + t;
  }
  // TODO: disengage = true还未实现，等比缩放未实现
  cropboxScale(t, i, o) {
    switch (o) {
      case 0: {
        this.borderLeftMove(t, o), this.borderTopMove(i, o);
        break;
      }
      case 1: {
        this.borderTopMove(i, o);
        break;
      }
      case 2: {
        this.borderTopMove(i, o), this.borderRightMove(t, o);
        break;
      }
      case 3: {
        this.borderLeftMove(t, o);
        break;
      }
      case 4: {
        this.borderRightMove(t, o);
        break;
      }
      case 5: {
        this.borderBottomMove(i, o), this.borderLeftMove(t, o);
        break;
      }
      case 6: {
        this.borderBottomMove(i, o);
        break;
      }
      case 7: {
        this.borderBottomMove(i, o), this.borderRightMove(t, o);
        break;
      }
    }
    this.updateStyle(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateMapPostion(), this.cropBoxPositionFunc(
      this.normalizePosition(this.mapPosition),
      this.normalizePosition(this.position)
    );
  }
  updateMapPostion() {
    var t, i, o, e;
    this.mapPosition.x = Math.round(
      this.positionProxy.x * this.videoInfo.renderWidth / ((t = this.constraintBox) == null ? void 0 : t.getConstraintBoxPosition().width) * this.videoInfo.realProportion
    ), this.mapPosition.y = Math.round(
      this.positionProxy.y * this.videoInfo.renderHeight / ((i = this.constraintBox) == null ? void 0 : i.getConstraintBoxPosition().height) * this.videoInfo.realProportion
    ), this.mapPosition.width = Math.round(
      this.positionProxy.width * this.videoInfo.renderWidth / ((o = this.constraintBox) == null ? void 0 : o.getConstraintBoxPosition().width) * this.videoInfo.realProportion
    ), this.mapPosition.height = Math.round(
      this.positionProxy.height * this.videoInfo.renderHeight / ((e = this.constraintBox) == null ? void 0 : e.getConstraintBoxPosition().height) * this.videoInfo.realProportion
    );
  }
  setPreviewPosition(t) {
    this.previewPosition = t;
  }
  show(t) {
    this.zIndex = t ? 99 : -1, this.updateStyle();
  }
  getPosition() {
    return this.position;
  }
  setPosition(t) {
    this.positionProxy.x = t.x, this.positionProxy.y = t.y, this.positionProxy.width = t.width, this.positionProxy.height = t.height;
  }
  getMapPosition() {
    return this.mapPosition;
  }
}
class C {
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
    var i, o, e, s, r;
    t.type === "scale" ? (this.constraintBoxPosition.x = t.translateX, this.constraintBoxPosition.y = t.translateY, this.constraintBoxPosition.width = ((i = this.videoInfo) == null ? void 0 : i.renderWidth) * t.scale, this.constraintBoxPosition.height = ((o = this.videoInfo) == null ? void 0 : o.renderHeight) * t.scale, this.width = this.constraintBoxPosition.width, this.height = this.constraintBoxPosition.height, (e = this.canvas) == null || e.updateSize(), (s = this.video) == null || s.updateSize(), (r = this.cropbox) == null || r.calculateBorderLimit()) : (this.constraintBoxPosition.x = t.translateX, this.constraintBoxPosition.y = t.translateY), this.updateStyle();
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
class w {
  constructor(t, i) {
    this.maskElement = null, this.maskComponents = null, this.zIndex = 0, this.parent = t, this.videoInfo = i, this.init();
  }
  init() {
    this.maskElement = document.createElement("div"), this.maskElement.setAttribute("class", "video-cropper-mask");
    const t = document.createElement("div");
    t.setAttribute("class", "video-cropper-mask-container"), this.maskComponents = Array.from(
      { length: 4 },
      () => document.createElement("div")
    ), this.maskComponents.forEach((i, o) => {
      i.setAttribute(
        "class",
        `video-cropper-mask-component-${o}`
      ), t.appendChild(i);
    }), this.maskElement.appendChild(t), this.parent.appendChild(this.maskElement), this.updateStyle(), this.leftComponent(0), this.rightComponent(0), this.bottomComponent(0), this.topComponent(0);
  }
  show(t = 1) {
    this.zIndex = t, this.updateStyle();
  }
  hide() {
    this.zIndex = 0, this.leftComponent(0), this.rightComponent(0), this.bottomComponent(0), this.topComponent(0), this.updateStyle();
  }
  topComponent(t) {
    const i = `
      --height: ${t}px;
    `;
    this.maskComponents[0].setAttribute("style", i);
  }
  rightComponent(t) {
    const i = `
      --width: ${t}px;
    `;
    this.maskComponents[1].setAttribute("style", i);
  }
  bottomComponent(t) {
    const i = `
      --height: ${t}px;
    `;
    this.maskComponents[2].setAttribute("style", i);
  }
  leftComponent(t) {
    const i = `
      --width: ${t}px;
    `;
    this.maskComponents[3].setAttribute("style", i);
  }
  updateStyle() {
    const t = `
      --color: rgba(0, 0, 0, 1);
      --video-cropper-mask-z-index: ${this.zIndex};
      --video-cropper-mask-width: ${this.videoInfo.renderWidth}px;
      --video-cropper-mask-height: ${this.videoInfo.renderHeight}px;
      --video-cropper-mask-x: ${this.videoInfo.renderX}px;
      --video-cropper-mask-y: ${this.videoInfo.renderY}px;
    `;
    this.maskElement.setAttribute("style", t);
  }
}
class E {
  constructor(t, i) {
    this.parent = null, this.container = null, this.canvas = null, this.cropBox = null, this.constraintBox = null, this.video = null, this.mask = null, this.options = void 0, this.videoInfo = {
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
    var t, i, o, e, s, r;
    this.parent = document.createElement("div"), this.container = this.videoElement.parentElement, this.container.appendChild(this.parent), this.parent.setAttribute("class", "video-cropper-parent"), this.parent.setAttribute(
      "style",
      `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
    ), this.video = new b(
      this.videoElement,
      this.videoInfo,
      (t = this.options) == null ? void 0 : t.videoConfig
    ), this.mask = new w(this.parent, this.videoInfo), this.video.setMask(this.mask), this.canvas = new P(this.videoInfo), this.canvas.setVideo(this.video), this.cropBox = new I(this.videoInfo, (i = this.options) == null ? void 0 : i.cropBoxConfig), this.constraintBox = new C(
      this.parent,
      this.videoInfo,
      (o = this.options) == null ? void 0 : o.constraintBoxConfig
    ), this.constraintBox.setVideo(this.video), this.constraintBox.setCanvas(this.canvas), this.constraintBox.setCropBox(this.cropBox), this.video.setCropBox(this.cropBox), this.canvas.setCropBox(this.cropBox), this.canvas.setConstraintBox(this.constraintBox), this.cropBox.setConstraintBox(this.constraintBox), this.video.setConstraintBox(this.constraintBox), (e = this.cropBox) == null || e.setDrawCropBoxFunc(
      (d, n, a, x) => {
        var m;
        (m = this.canvas) == null || m.drawCropbox(d, n, a, x);
      }
    ), this.grabInfo.originPosition = {
      x: (s = this.constraintBox) == null ? void 0 : s.getConstraintBoxPosition().x,
      y: (r = this.constraintBox) == null ? void 0 : r.getConstraintBoxPosition().y
    }, this.registerEvent();
  }
  registerEvent() {
    var t, i, o, e;
    (t = this.parent) == null || t.addEventListener("wheel", (s) => {
      var r, d, n;
      if (s.target.dataset.eventType === "canvas-scale-move") {
        if (this.transformInfo.origin.x = s.offsetX, this.transformInfo.origin.y = s.offsetY, this.transformInfo.type = "scale", this.transformInfo.scale - 0.1 >= 0 && s.deltaY < 0) {
          const { width: a, height: x } = (r = this.cropBox) == null ? void 0 : r.getPosition();
          ((d = this.videoInfo) == null ? void 0 : d.renderWidth) * (this.transformInfo.scale - 0.1) <= a ? this.transformInfo.scale = a / this.videoInfo.renderWidth : this.transformInfo.scale -= 0.1, ((n = this.videoInfo) == null ? void 0 : n.renderHeight) * (this.transformInfo.scale - 0.1) <= x ? this.transformInfo.scale = x / this.videoInfo.renderHeight : this.transformInfo.scale -= 0.1;
        }
        s.deltaY > 0 && (this.transformInfo.scale += 0.1), this.transformScale();
      }
    }), (i = this.parent) == null || i.addEventListener("mousedown", (s) => {
      var r, d, n;
      this.mouseInfo.mouseDown = !0, this.mouseInfo.mouseX = s.clientX, this.mouseInfo.mouseY = s.clientY, this.mouseInfo.type = s.target.dataset.eventType, this.cropBox.setOriginalPosition(), this.mouseInfo.type === "canvas-scale-move" && (this.grabInfo.grab = !0, this.grabInfo.grabX = s.clientX, this.grabInfo.grabY = s.clientY, this.grabInfo.originPosition = {
        x: (r = this.constraintBox) == null ? void 0 : r.getConstraintBoxPosition().x,
        y: (d = this.constraintBox) == null ? void 0 : d.getConstraintBoxPosition().y
      }, (n = this.canvas) == null || n.setGrab(this.grabInfo.grab));
    }), (o = document.body) == null || o.addEventListener("mouseup", (s) => {
      var d;
      this.mouseInfo.mouseDown = !1, this.mouseInfo.type === "canvas-scale-move" && (this.grabInfo.grab = !1, (d = this.canvas) == null || d.setGrab(this.grabInfo.grab));
      const r = this.cropBox.normalizePosition(
        this.cropBox.getPosition()
      );
      this.cropBox.setPosition(r);
    }), (e = document.body) == null || e.addEventListener("mousemove", (s) => {
      var r, d;
      if (this.mouseInfo.mouseDown) {
        const n = s.clientX - this.mouseInfo.mouseX, a = s.clientY - this.mouseInfo.mouseY;
        switch (console.log(n, this.mouseInfo.type), this.mouseInfo.type) {
          case "border-move-0": {
            this.cropBox.borderMove(n, a, 0);
            break;
          }
          case "border-move-1": {
            this.cropBox.borderMove(n, a, 1);
            break;
          }
          case "border-move-2": {
            this.cropBox.borderMove(n, a, 2);
            break;
          }
          case "border-move-3": {
            this.cropBox.borderMove(n, a, 3);
            break;
          }
          case "pointer-move-0": {
            this.cropBox.pointerMove(n, a, 0);
            break;
          }
          case "pointer-move-1": {
            this.cropBox.pointerMove(n, a, 1);
            break;
          }
          case "pointer-move-2": {
            this.cropBox.pointerMove(n, a, 2);
            break;
          }
          case "pointer-move-3": {
            this.cropBox.pointerMove(n, a, 3);
            break;
          }
          case "pointer-move-4": {
            this.cropBox.pointerMove(n, a, 4);
            break;
          }
          case "pointer-move-5": {
            this.cropBox.pointerMove(n, a, 5);
            break;
          }
          case "pointer-move-6": {
            this.cropBox.pointerMove(n, a, 6);
            break;
          }
          case "pointer-move-7": {
            this.cropBox.pointerMove(n, a, 7);
            break;
          }
          case "grid-move": {
            this.cropBox.cropboxMove(n, a);
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
  E as default
};
