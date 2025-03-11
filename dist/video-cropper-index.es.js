class B {
  constructor(i, t, o) {
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
    }, this.cropbox = null, this.mask = null, this.lastConstraintBoxPosition = null, this.videoConfig = { muted: !0 }, this.videoElement = i, this.videoInfo = t, this.duration = t.duration, this.videoConfig && (this.videoConfig = o), this.videoElement.setAttribute("class", "video-cropper-video"), this.videoConfig.muted && (this.videoElement.muted = !0, this.videoElement.volume = 0), this.updateStyle();
  }
  setCropBox(i) {
    this.cropbox = i;
  }
  setMask(i) {
    this.mask = i;
  }
  play() {
    this.previewFlag = !0, this.updateStyle(), this.videoElement.play();
  }
  preview() {
    var i, t, o, s, e, n, h, r, d, g, f, b, y, v;
    if (!this.previewFlag) {
      const p = (i = this.cropbox) == null ? void 0 : i.getPosition(), a = (t = this.constraintBox) == null ? void 0 : t.getConstraintBoxPosition();
      this.lastConstraintBoxPosition = { ...a };
      const m = this.videoInfo.elementWidth / this.videoInfo.elementHeight, P = p.width / p.height;
      if (console.log(m, P), P === m) {
        const c = this.videoInfo.elementWidth / p.width, l = this.videoInfo.elementHeight / p.height;
        a.height = a.height * c, a.width = a.width * l, a.x = -(p.x * c), a.y = -(p.y * l), (o = this.constraintBox) == null || o.setConstraintBoxPosition(a), (s = this.constraintBox) == null || s.updateStyle(), this.play();
      } else if (P > m) {
        const c = this.videoInfo.elementWidth / p.width, l = (this.videoInfo.elementHeight - p.height * c) / 2;
        a.height = a.height * c, a.width = a.width * c, a.x = -(p.x * c), a.y = -(p.y * c) + l, (e = this.mask) == null || e.topComponent(l), (n = this.mask) == null || n.bottomComponent(l), (h = this.mask) == null || h.show(1500), (r = this.constraintBox) == null || r.setConstraintBoxPosition(a), (d = this.constraintBox) == null || d.updateStyle(), this.play();
      } else {
        const c = this.videoInfo.elementHeight / p.height, l = (this.videoInfo.elementHeight - p.width * c) / 2;
        a.height = a.height * c, a.width = a.width * c, a.x = -(p.x * c) + l, a.y = -(p.y * c), (g = this.mask) == null || g.leftComponent(l), (f = this.mask) == null || f.rightComponent(l), (b = this.mask) == null || b.show(1500), (y = this.constraintBox) == null || y.setConstraintBoxPosition(a), (v = this.constraintBox) == null || v.updateStyle(), this.play();
      }
    }
  }
  exitPreview() {
    var i, t, o;
    this.previewFlag && ((i = this.constraintBox) == null || i.setConstraintBoxPosition(
      this.lastConstraintBoxPosition
    ), (t = this.constraintBox) == null || t.updateStyle(), this.previewFlag = !1, (o = this.mask) == null || o.hide(), this.updateStyle(), this.pause());
  }
  pause() {
    this.previewFlag = !1, this.videoElement.pause(), this.updateStyle();
  }
  setCurrentTime(i) {
    i >= this.videoInfo.duration && (i = this.videoInfo.duration), i <= 0 && (i = 0), this.videoElement.currentTime = i;
  }
  setUpdateCallback(i) {
    var t;
    return (t = this.videoElement) == null || t.addEventListener("timeupdate", i), () => {
      var o;
      (o = this.videoElement) == null || o.removeEventListener("timeupdate", i);
    };
  }
  updateStyle() {
    const i = `
      --video-cropper-video-z-index: ${this.previewFlag ? 1e3 : 0};
      --video-cropper-video-position: ${this.previewFlag ? "absolute" : "static"};`;
    this.videoElement.setAttribute("style", i);
  }
  updateSize() {
    var i, t;
    this.videoElement.width = (i = this.constraintBox) == null ? void 0 : i.width, this.videoElement.height = (t = this.constraintBox) == null ? void 0 : t.height;
  }
  setConstraintBox(i) {
    this.constraintBox = i, this.updateSize();
  }
}
class u {
  constructor(i) {
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
    }, this.videoInfo = i, this.canvasElement = document.createElement("canvas"), this.canvasElement.dataset.eventType = "canvas-scale-move", this.canvasElement.setAttribute("class", "video-cropper-canvas"), this.ctx = this.canvasElement.getContext("2d"), this.updateStyle();
  }
  updateSize() {
    var i, t;
    this.canvasElement.width = (i = this.constraintbox) == null ? void 0 : i.width, this.canvasElement.height = (t = this.constraintbox) == null ? void 0 : t.height;
  }
  setGrab(i) {
    var t;
    this.grab = i, (t = this.cropbox) == null || t.show(!i), this.updateStyle();
  }
  updateStyle() {
    const i = `--video-cropper-canvas-grab: ${this.grab ? "grabbing" : "grab"}`;
    this.canvasElement.setAttribute("style", i);
  }
  drawCropbox(i, t, o, s) {
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
    ), this.ctx.clearRect(i, t, o, s);
  }
  setVideo(i) {
    this.video = i;
  }
  setCropBox(i) {
    this.cropbox = i;
  }
  setConstraintBox(i) {
    this.constraintbox = i, this.updateSize();
  }
}
class I {
  constructor(i, t) {
    this.cropBoxElement = null, this.anchors = [], this.grids = [], this.boders = [], this.pointerContainer = null, this.gridContainer = null, this.broderContainer = null, this.zIndex = 99, this.constraintBox = null, this.disengage = !1, this.drawCropbox = () => {
    }, this.cropBoxPositionFunc = () => {
    }, this.borderLimitInfo = {
      direction: "top",
      position: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
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
      // 裁剪框的宽高比
      rate: 0.5
      // 裁剪框的大小缩放比例
    }, this.videoInfo = i, t && (this.cropBoxConfig = t), this.positionProxy = new Proxy(this.position, {
      set: (o, s, e) => {
        switch (s) {
          case "x": {
            if (e <= 0)
              return o[s] = 0, !0;
            if (e >= this.constraintBox.width - this.position.width)
              return o[s] = this.constraintBox.width - this.position.width, !0;
            break;
          }
          case "y": {
            if (e <= 0)
              return o[s] = 0, !0;
            if (e >= this.constraintBox.height - this.position.height)
              return o[s] = this.constraintBox.height - this.position.height, !0;
            break;
          }
          case "width": {
            if (e <= 20)
              return o[s] = 20, !0;
            break;
          }
          case "height": {
            if (e <= 20 / this.cropBoxConfig.aspectRatio)
              return o[s] = 20 / this.cropBoxConfig.aspectRatio, !0;
            break;
          }
        }
        return o[s] = e, !0;
      },
      get: (o, s) => o[s]
    }), this.initCropbox();
  }
  setConstraintBox(i) {
    var o;
    this.constraintBox = i, this.previewPosition = {
      x: this.constraintBox.x,
      y: this.constraintBox.y,
      width: this.constraintBox.width,
      height: this.constraintBox.height
    }, this.constraintBoxPosition = {
      ...this.previewPosition
    };
    const t = ((o = this.cropBoxConfig) == null ? void 0 : o.position) || this.calculateAspectRatio();
    this.positionProxy.x = t.x, this.positionProxy.y = t.y, this.positionProxy.width = t.width, this.positionProxy.height = t.height, this.updateStyle(), this.updateMapPostion();
  }
  borderMove(i, t, o) {
    switch (o) {
      case 0:
        this.cropboxScale(i, t, 1);
        break;
      case 1:
        this.cropboxScale(i, t, 4);
        break;
      case 2:
        this.cropboxScale(i, t, 6);
        break;
      case 3:
        this.cropboxScale(i, t, 3);
        break;
    }
  }
  pointerMove(i, t, o) {
    this.cropboxScale(i, t, o);
  }
  setOriginalPosition() {
    this.originalPosition.x = this.position.x, this.originalPosition.y = this.position.y, this.originalPosition.width = this.position.width, this.originalPosition.height = this.position.height;
  }
  getOriginalPosition() {
    return this.originalPosition;
  }
  updateStyle() {
    const i = this.normalizePosition(this.position), t = `
      --crop-box-z-index: ${this.zIndex};
      --crop-box-left: ${i.x}px;
      --crop-box-top: ${i.y}px;
      --crop-box-width: ${i.width}px;
      --crop-box-height: ${i.height}px;
    `;
    this.cropBoxElement.setAttribute("style", t);
  }
  normalizePosition(i) {
    const t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    return this.position.width < 0 ? (t.width = i.width * -1, t.x = i.x + i.width) : (t.width = i.width, t.x = i.x), i.height < 0 ? (t.height = i.height * -1, t.y = i.y + i.height) : (t.height = i.height, t.y = i.y), t;
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
  updataSize() {
    this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateStyle();
  }
  calculateBorderDistanceLeftTop() {
    const i = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right: this.constraintBox.width - this.originalPosition.x - this.originalPosition.width,
      bottom: this.constraintBox.height - this.originalPosition.y - this.originalPosition.height
    }, t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    this.originalPosition.y - i.left / this.cropBoxConfig.aspectRatio >= 0 ? (this.borderLimitInfo.direction = "left", t.x = this.originalPosition.x - i.left, t.y = this.originalPosition.y - i.left / this.cropBoxConfig.aspectRatio, t.width = this.originalPosition.width + i.left, t.height = this.originalPosition.height + i.left / this.cropBoxConfig.aspectRatio) : (this.borderLimitInfo.direction = "top", t.x = this.originalPosition.x - i.top * this.cropBoxConfig.aspectRatio, t.y = this.originalPosition.y - i.top, t.width = this.originalPosition.width + i.top * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.top), this.borderLimitInfo.position = t;
  }
  calculateBorderDistanceTop() {
    const i = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right: this.constraintBox.width - this.originalPosition.x - this.originalPosition.width,
      bottom: this.constraintBox.height - this.originalPosition.y - this.originalPosition.height
    }, t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, o = i.top / 1, s = i.right / (this.cropBoxConfig.aspectRatio / 2), e = 1 / 0, n = i.left / (this.cropBoxConfig.aspectRatio / 2);
    switch (Math.min(o, s, e, n)) {
      case o: {
        this.borderLimitInfo.direction = "top", t.x = this.originalPosition.x - i.top * this.cropBoxConfig.aspectRatio / 2, t.y = this.originalPosition.y - i.top, t.width = this.originalPosition.width + i.top * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.top;
        break;
      }
      case s: {
        this.borderLimitInfo.direction = "right", t.x = this.originalPosition.x - i.right, t.y = this.originalPosition.y - i.right * 2 / this.cropBoxConfig.aspectRatio, t.width = this.originalPosition.width + i.right * 2, t.height = this.originalPosition.height + i.right * 2 / this.cropBoxConfig.aspectRatio;
        break;
      }
      case n: {
        this.borderLimitInfo.direction = "left", t.x = this.originalPosition.x - i.left, t.y = this.originalPosition.y - i.left * 2 / this.cropBoxConfig.aspectRatio, t.width = this.originalPosition.width + i.left * 2, t.height = this.originalPosition.height + i.left * 2 / this.cropBoxConfig.aspectRatio;
        break;
      }
    }
    this.borderLimitInfo.position = t;
  }
  calculateBorderDistanceRightTop() {
    const i = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right: this.constraintBox.width - this.originalPosition.x - this.originalPosition.width,
      bottom: this.constraintBox.height - this.originalPosition.y - this.originalPosition.height
    }, t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    this.originalPosition.y - i.right / this.cropBoxConfig.aspectRatio >= 0 ? (this.borderLimitInfo.direction = "right", t.x = this.originalPosition.x, t.y = this.originalPosition.y - i.right / this.cropBoxConfig.aspectRatio, t.width = this.originalPosition.width + i.right, t.height = this.originalPosition.height + i.right / this.cropBoxConfig.aspectRatio) : (this.borderLimitInfo.direction = "top", t.x = this.originalPosition.x, t.y = this.originalPosition.y - i.top, t.width = this.originalPosition.width + i.top * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.top), this.borderLimitInfo.position = t;
  }
  calculateBorderDistanceRight() {
    const i = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right: this.constraintBox.width - this.originalPosition.x - this.originalPosition.width,
      bottom: this.constraintBox.height - this.originalPosition.y - this.originalPosition.height
    }, t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, o = i.top / (1 / 2 / this.cropBoxConfig.aspectRatio), s = i.right / 1, e = i.bottom / (1 / 2 / this.cropBoxConfig.aspectRatio);
    switch (Math.min(o, s, e, 1 / 0)) {
      case o: {
        this.borderLimitInfo.direction = "top", t.x = this.originalPosition.x, t.y = this.originalPosition.y - i.top, t.width = this.originalPosition.width + i.top * 2 * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.top * 2;
        break;
      }
      case s: {
        this.borderLimitInfo.direction = "right", t.x = this.originalPosition.x, t.y = this.originalPosition.y - i.right / this.cropBoxConfig.aspectRatio / 2, t.width = this.originalPosition.width + i.right, t.height = this.originalPosition.height + i.right / this.cropBoxConfig.aspectRatio;
        break;
      }
      case e: {
        this.borderLimitInfo.direction = "bottom", t.x = this.originalPosition.x, t.y = this.originalPosition.y - i.bottom, t.width = this.originalPosition.width + i.bottom * 2 * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.bottom * 2;
        break;
      }
    }
    this.borderLimitInfo.position = t;
  }
  calculateBorderDistanceRightBottom() {
    const i = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right: this.constraintBox.width - this.originalPosition.x - this.originalPosition.width,
      bottom: this.constraintBox.height - this.originalPosition.y - this.originalPosition.height
    }, t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    this.originalPosition.y + this.originalPosition.height + i.right / this.cropBoxConfig.aspectRatio <= this.constraintBox.height ? (this.borderLimitInfo.direction = "right", t.x = this.originalPosition.x, t.y = this.originalPosition.y, t.width = this.originalPosition.width + i.right, t.height = this.originalPosition.height + i.right / this.cropBoxConfig.aspectRatio) : (this.borderLimitInfo.direction = "bottom", t.x = this.originalPosition.x, t.y = this.originalPosition.y, t.width = this.originalPosition.width + i.bottom * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.bottom), this.borderLimitInfo.position = t;
  }
  calculateBorderDistanceBottom() {
    const i = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right: this.constraintBox.width - this.originalPosition.x - this.originalPosition.width,
      bottom: this.constraintBox.height - this.originalPosition.y - this.originalPosition.height
    }, t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, o = 1 / 0, s = i.right / (this.cropBoxConfig.aspectRatio / 2), e = i.bottom / 1, n = i.left / (this.cropBoxConfig.aspectRatio / 2);
    switch (Math.min(o, s, e, n)) {
      case s: {
        this.borderLimitInfo.direction = "right", t.x = this.originalPosition.x - i.right, t.y = this.originalPosition.y, t.width = this.originalPosition.width + i.right * 2, t.height = this.originalPosition.height + i.right * 2 / this.cropBoxConfig.aspectRatio;
        break;
      }
      case e: {
        this.borderLimitInfo.direction = "bottom", t.x = this.originalPosition.x - i.bottom * this.cropBoxConfig.aspectRatio / 2, t.y = this.originalPosition.y, t.width = this.originalPosition.width + i.bottom * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.bottom;
        break;
      }
      case n: {
        this.borderLimitInfo.direction = "left", t.x = this.originalPosition.x - i.left, t.y = this.originalPosition.y, t.width = this.originalPosition.width + i.left * 2, t.height = this.originalPosition.height + i.left * 2 / this.cropBoxConfig.aspectRatio;
        break;
      }
    }
    this.borderLimitInfo.position = t;
  }
  calculateBorderDistanceLeftBottom() {
    const i = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right: this.constraintBox.width - this.originalPosition.x - this.originalPosition.width,
      bottom: this.constraintBox.height - this.originalPosition.y - this.originalPosition.height
    }, t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    this.originalPosition.y + this.originalPosition.height + i.left / this.cropBoxConfig.aspectRatio <= this.constraintBox.height ? (this.borderLimitInfo.direction = "left", t.x = this.originalPosition.x - i.left, t.y = this.originalPosition.y, t.width = this.originalPosition.width + i.left, t.height = this.originalPosition.height + i.left / this.cropBoxConfig.aspectRatio) : (this.borderLimitInfo.direction = "bottom", t.x = this.originalPosition.x - i.bottom * this.cropBoxConfig.aspectRatio, t.y = this.originalPosition.y, t.width = this.originalPosition.width + i.bottom * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.bottom), this.borderLimitInfo.position = t;
  }
  calculateBorderDistanceLeft() {
    const i = {
      top: this.originalPosition.y,
      left: this.originalPosition.x,
      right: this.constraintBox.width - this.originalPosition.x - this.originalPosition.width,
      bottom: this.constraintBox.height - this.originalPosition.y - this.originalPosition.height
    }, t = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, o = i.top / 1, s = 1 / 0, e = i.bottom / (1 / 2 / this.cropBoxConfig.aspectRatio), n = i.left / (1 / 2 / this.cropBoxConfig.aspectRatio);
    switch (Math.min(o, s, e, n)) {
      case o: {
        this.borderLimitInfo.direction = "top", t.x = this.originalPosition.x - i.top * 2 * this.cropBoxConfig.aspectRatio, t.y = this.originalPosition.y - i.top, t.width = this.originalPosition.width + i.top * 2 * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.top * 2;
        break;
      }
      case e: {
        this.borderLimitInfo.direction = "bottom", t.x = this.originalPosition.x - i.bottom * 2 * this.cropBoxConfig.aspectRatio, t.y = this.originalPosition.y - i.bottom, t.width = this.originalPosition.width + i.bottom * 2 * this.cropBoxConfig.aspectRatio, t.height = this.originalPosition.height + i.bottom * 2;
        break;
      }
      case n: {
        this.borderLimitInfo.direction = "left", t.x = this.originalPosition.x - i.left, t.y = this.originalPosition.y - i.left / this.cropBoxConfig.aspectRatio / 2, t.width = this.originalPosition.width + i.left, t.height = this.originalPosition.height + i.left / this.cropBoxConfig.aspectRatio;
        break;
      }
    }
    this.borderLimitInfo.position = t;
  }
  calculateAspectRatio() {
    var i;
    if (this.cropBoxConfig.aspectRatio = this.cropBoxConfig.aspectRatio || 0.5, ((i = this.cropBoxConfig) == null ? void 0 : i.aspectRatio) === 0)
      return {
        x: (this.constraintBoxPosition.width - this.videoInfo.renderWidth * this.cropBoxConfig.aspectRatio) / 2,
        y: (this.constraintBoxPosition.height - this.videoInfo.renderHeight * this.cropBoxConfig.aspectRatio) / 2,
        width: this.videoInfo.renderWidth * this.cropBoxConfig.aspectRatio,
        height: this.videoInfo.renderHeight * this.cropBoxConfig.aspectRatio
      };
    {
      const t = Math.min(
        this.videoInfo.renderWidth * this.cropBoxConfig.aspectRatio,
        this.videoInfo.renderHeight * this.cropBoxConfig.aspectRatio
      );
      if (this.cropBoxConfig.aspectRatio >= 1) {
        const o = t, s = t / this.cropBoxConfig.aspectRatio;
        return {
          x: (this.constraintBoxPosition.width - o) / 2,
          y: (this.constraintBoxPosition.height - s) / 2,
          width: o,
          height: s
        };
      } else {
        const o = t * this.cropBoxConfig.aspectRatio, s = t;
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
    this.cropBoxElement = document.createElement("div"), this.cropBoxElement.setAttribute("class", "video-cropper-crop-box"), this.initGrid(), this.initBorder(), this.initPointer(), this.cropBoxElement.appendChild(this.gridContainer), this.cropBoxElement.appendChild(this.broderContainer), this.cropBoxElement.appendChild(this.pointerContainer);
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
      ), o.dataset.eventType = `pointer-move-${t}`, this.pointerContainer.appendChild(o), o;
    });
  }
  initGrid() {
    this.gridContainer = document.createElement("div"), this.gridContainer.setAttribute(
      "class",
      "video-cropper-crop-box-grid-container"
    ), this.gridContainer.dataset.eventType = "grid-move", this.grids = Array(9).fill(null), this.grids.forEach((i, t) => {
      const o = document.createElement("div");
      o.setAttribute(
        "class",
        `video-cropper-crop-box-grid-${t} video-cropper-crop-box-grid`
      ), o.dataset.eventType = "grid-move", this.gridContainer.appendChild(o);
    });
  }
  initBorder() {
    this.broderContainer = document.createElement("div"), this.broderContainer.setAttribute(
      "class",
      "video-cropper-crop-box-border-container"
    );
    const i = document.createElement("div");
    i.dataset.eventType = "grid-move", i.setAttribute("class", "video-cropper-crop-box-border-temp"), this.boders = Array(4).fill(null), this.boders = this.boders.map((t, o) => {
      const s = document.createElement("div");
      return s.setAttribute(
        "class",
        `video-cropper-crop-box-border-${o} video-cropper-crop-box-border`
      ), s.dataset.eventType = `border-move-${o}`, i.appendChild(s), s;
    }), this.broderContainer.appendChild(i);
  }
  cropboxMove(i, t) {
    const o = this.originalPosition.x + i, s = this.originalPosition.y + t;
    this.positionProxy.x = o, this.positionProxy.y = s, this.updateStyle(), this.drawCropbox(
      this.position.x,
      this.position.y,
      this.position.width,
      this.position.height
    ), this.updateMapPostion(), this.cropBoxPositionFunc(
      this.mapPosition,
      this.normalizePosition(this.position)
    );
  }
  borderTopMove(i, t) {
    let o = this.originalPosition.x;
    const s = this.originalPosition.y + i;
    let e = this.originalPosition.width;
    const n = this.originalPosition.height - i;
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const h = -i * this.cropBoxConfig.aspectRatio;
      switch (t === 0 ? o = this.originalPosition.x - h : t === 1 && (o = this.originalPosition.x - h / 2), e = this.originalPosition.width + h, this.borderLimitInfo.direction) {
        case "top": {
          if (s <= this.borderLimitInfo.position.y) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
        case "right": {
          if (o <= this.borderLimitInfo.position.x) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
        case "left": {
          if (o <= this.borderLimitInfo.position.x) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
      }
    }
    this.positionProxy.x = o, this.positionProxy.y = s, this.positionProxy.width = e, this.positionProxy.height = n;
  }
  borderRightMove(i, t) {
    let o = this.originalPosition.x, s = this.originalPosition.y;
    const e = this.originalPosition.width + i;
    let n = this.originalPosition.height;
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const h = i / this.cropBoxConfig.aspectRatio;
      switch (t === 2 ? s = this.originalPosition.y - h : t === 4 && (s = this.originalPosition.y - h / 2), n = this.originalPosition.height + h, this.borderLimitInfo.direction) {
        case "top": {
          if (s <= this.borderLimitInfo.position.y) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
        case "right": {
          if (e >= this.borderLimitInfo.position.width) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
        case "bottom": {
          if (n >= this.borderLimitInfo.position.height) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
      }
    }
    this.positionProxy.x = o, this.positionProxy.y = s, this.positionProxy.width = e, this.positionProxy.height = n;
  }
  borderBottomMove(i, t) {
    let o = this.originalPosition.x;
    const s = this.originalPosition.y;
    let e = this.originalPosition.width;
    const n = this.originalPosition.height + i;
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const h = i * this.cropBoxConfig.aspectRatio;
      switch (t === 5 ? o = this.originalPosition.x - h : t === 6 && (o = this.originalPosition.x - h / 2), e = this.originalPosition.width + h, this.borderLimitInfo.direction) {
        case "right": {
          if (e >= this.borderLimitInfo.position.width) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
        case "left": {
          if (o <= this.borderLimitInfo.position.x) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
        case "bottom": {
          if (n >= this.borderLimitInfo.position.height) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
      }
    }
    this.positionProxy.x = o, this.positionProxy.y = s, this.positionProxy.width = e, this.positionProxy.height = n;
  }
  borderLeftMove(i, t) {
    const o = this.originalPosition.x + i;
    let s = this.originalPosition.y;
    const e = this.originalPosition.width - i;
    let n = this.originalPosition.height;
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const h = -i / this.cropBoxConfig.aspectRatio;
      switch (t === 0 ? s = this.originalPosition.y - h : t === 3 && (s = this.originalPosition.y - h / 2), n = this.originalPosition.height + h, this.borderLimitInfo.direction) {
        case "top": {
          if (s <= this.borderLimitInfo.position.y) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
        case "left": {
          if (o <= this.borderLimitInfo.position.x) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
        case "bottom": {
          if (n >= this.borderLimitInfo.position.height) {
            this.positionProxy.x = this.borderLimitInfo.position.x, this.positionProxy.y = this.borderLimitInfo.position.y, this.positionProxy.width = this.borderLimitInfo.position.width, this.positionProxy.height = this.borderLimitInfo.position.height;
            return;
          }
          break;
        }
      }
    }
    this.positionProxy.x = o, this.positionProxy.y = s, this.positionProxy.width = e, this.positionProxy.height = n;
  }
  // TODO: disengage = true还未实现，等比缩放未实现
  cropboxScale(i, t, o) {
    switch (o) {
      case 0: {
        this.calculateBorderDistanceLeftTop(), this.borderLeftMove(i, o), this.borderTopMove(t, o);
        break;
      }
      case 1: {
        this.calculateBorderDistanceTop(), this.borderTopMove(t, o);
        break;
      }
      case 2: {
        this.calculateBorderDistanceRightTop(), this.borderTopMove(t, o), this.borderRightMove(i, o);
        break;
      }
      case 3: {
        this.calculateBorderDistanceLeft(), this.borderLeftMove(i, o);
        break;
      }
      case 4: {
        this.calculateBorderDistanceRight(), this.borderRightMove(i, o);
        break;
      }
      case 5: {
        this.calculateBorderDistanceLeftBottom(), this.borderBottomMove(t, o), this.borderLeftMove(i, o);
        break;
      }
      case 6: {
        this.calculateBorderDistanceBottom(), this.borderBottomMove(t, o);
        break;
      }
      case 7: {
        this.calculateBorderDistanceRightBottom(), this.borderBottomMove(t, o), this.borderRightMove(i, o);
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
    var i, t, o, s;
    this.mapPosition.x = Math.round(
      this.positionProxy.x * this.videoInfo.renderWidth / ((i = this.constraintBox) == null ? void 0 : i.getConstraintBoxPosition().width) * this.videoInfo.realProportion
    ), this.mapPosition.y = Math.round(
      this.positionProxy.y * this.videoInfo.renderHeight / ((t = this.constraintBox) == null ? void 0 : t.getConstraintBoxPosition().height) * this.videoInfo.realProportion
    ), this.mapPosition.width = Math.round(
      this.positionProxy.width * this.videoInfo.renderWidth / ((o = this.constraintBox) == null ? void 0 : o.getConstraintBoxPosition().width) * this.videoInfo.realProportion
    ), this.mapPosition.height = Math.round(
      this.positionProxy.height * this.videoInfo.renderHeight / ((s = this.constraintBox) == null ? void 0 : s.getConstraintBoxPosition().height) * this.videoInfo.realProportion
    );
  }
  setPreviewPosition(i) {
    this.previewPosition = i;
  }
  show(i) {
    this.zIndex = i ? 99 : -1, this.updateStyle();
  }
  getPosition() {
    return this.position;
  }
  setPosition(i) {
    this.positionProxy.x = i.x, this.positionProxy.y = i.y, this.positionProxy.width = i.width, this.positionProxy.height = i.height;
  }
  getMapPosition() {
    return this.mapPosition;
  }
}
class w {
  constructor(i, t, o) {
    this.constraintBoxElement = null, this.constraintBoxBodyElement = null, this.parent = null, this.x = 0, this.y = 0, this.width = 0, this.height = 0, this.constraintBoxPosition = {
      // 相对父元素的位置
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }, this.videoInfo = null, this.cropbox = null, this.canvas = null, this.video = null, this.videoInfo = t, this.parent = i, this.constraintBoxElement = document.createElement("div"), this.constraintBoxElement.setAttribute(
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
  /**
   * 缩放和移动
   * @param transformInfo
   */
  transform(i) {
    var t, o, s, e, n;
    i.type === "scale" ? (this.constraintBoxPosition.x = i.translateX, this.constraintBoxPosition.y = i.translateY, this.constraintBoxPosition.width = ((t = this.videoInfo) == null ? void 0 : t.renderWidth) * i.scale, this.constraintBoxPosition.height = ((o = this.videoInfo) == null ? void 0 : o.renderHeight) * i.scale, this.width = this.constraintBoxPosition.width, this.height = this.constraintBoxPosition.height, (s = this.canvas) == null || s.updateSize(), (e = this.video) == null || e.updateSize(), (n = this.cropbox) == null || n.updataSize()) : (this.constraintBoxPosition.x = i.translateX, this.constraintBoxPosition.y = i.translateY), this.updateStyle();
  }
  updateStyle() {
    const i = `
      --video-cropper-constraint-box-left: ${this.constraintBoxPosition.x}px;
      --video-cropper-constraint-box-top: ${this.constraintBoxPosition.y}px;
      --video-cropper-constraint-box-width: ${this.constraintBoxPosition.width}px;
      --video-cropper-constraint-box-height: ${this.constraintBoxPosition.height}px;`;
    this.constraintBoxElement.setAttribute("style", i);
  }
  setVideo(i) {
    this.video = i, this.constraintBoxBodyElement.appendChild(this.video.videoElement);
  }
  setCropBox(i) {
    this.cropbox = i, this.constraintBoxBodyElement.appendChild(this.cropbox.cropBoxElement);
  }
  setCanvas(i) {
    this.canvas = i, this.constraintBoxBodyElement.appendChild(this.canvas.canvasElement), this.parent.appendChild(this.constraintBoxElement);
  }
  getConstraintBoxPosition() {
    return this.constraintBoxPosition;
  }
  setConstraintBoxPosition(i) {
    this.constraintBoxPosition = i;
  }
}
class C {
  constructor(i, t) {
    this.maskElement = null, this.maskComponents = null, this.zIndex = 0, this.parent = i, this.videoInfo = t, this.init();
  }
  init() {
    this.maskElement = document.createElement("div"), this.maskElement.setAttribute("class", "video-cropper-mask");
    const i = document.createElement("div");
    i.setAttribute("class", "video-cropper-mask-container"), this.maskComponents = Array.from(
      { length: 4 },
      () => document.createElement("div")
    ), this.maskComponents.forEach((t, o) => {
      t.setAttribute(
        "class",
        `video-cropper-mask-component-${o}`
      ), i.appendChild(t);
    }), this.maskElement.appendChild(i), this.parent.appendChild(this.maskElement), this.updateStyle(), this.leftComponent(0), this.rightComponent(0), this.bottomComponent(0), this.topComponent(0);
  }
  show(i = 1) {
    this.zIndex = i, this.updateStyle();
  }
  hide() {
    this.zIndex = 0, this.leftComponent(0), this.rightComponent(0), this.bottomComponent(0), this.topComponent(0), this.updateStyle();
  }
  topComponent(i) {
    const t = `
      --height: ${i}px;
    `;
    this.maskComponents[0].setAttribute("style", t);
  }
  rightComponent(i) {
    const t = `
      --width: ${i}px;
    `;
    this.maskComponents[1].setAttribute("style", t);
  }
  bottomComponent(i) {
    const t = `
      --height: ${i}px;
    `;
    this.maskComponents[2].setAttribute("style", t);
  }
  leftComponent(i) {
    const t = `
      --width: ${i}px;
    `;
    this.maskComponents[3].setAttribute("style", t);
  }
  updateStyle() {
    const i = `
      --color: rgba(0, 0, 0, 1);
      --video-cropper-mask-z-index: ${this.zIndex};
      --video-cropper-mask-width: ${this.videoInfo.renderWidth}px;
      --video-cropper-mask-height: ${this.videoInfo.renderHeight}px;
      --video-cropper-mask-x: ${this.videoInfo.renderX}px;
      --video-cropper-mask-y: ${this.videoInfo.renderY}px;
    `;
    this.maskElement.setAttribute("style", i);
  }
}
class L {
  constructor(i, t) {
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
    }, this.videoElement = i, this.options = t, this.videoInfo = {
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
    var i, t, o, s, e, n;
    this.parent = document.createElement("div"), this.container = this.videoElement.parentElement, this.container.appendChild(this.parent), this.parent.setAttribute("class", "video-cropper-parent"), this.parent.setAttribute(
      "style",
      `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
    ), this.video = new B(
      this.videoElement,
      this.videoInfo,
      (i = this.options) == null ? void 0 : i.videoConfig
    ), this.mask = new C(this.parent, this.videoInfo), this.video.setMask(this.mask), this.canvas = new u(this.videoInfo), this.canvas.setVideo(this.video), this.cropBox = new I(this.videoInfo, (t = this.options) == null ? void 0 : t.cropBoxConfig), this.constraintBox = new w(
      this.parent,
      this.videoInfo,
      (o = this.options) == null ? void 0 : o.constraintBoxConfig
    ), this.constraintBox.setVideo(this.video), this.constraintBox.setCanvas(this.canvas), this.constraintBox.setCropBox(this.cropBox), this.video.setCropBox(this.cropBox), this.canvas.setCropBox(this.cropBox), this.canvas.setConstraintBox(this.constraintBox), this.cropBox.setConstraintBox(this.constraintBox), this.video.setConstraintBox(this.constraintBox), (s = this.cropBox) == null || s.setDrawCropBoxFunc(
      (h, r, d, g) => {
        var f;
        (f = this.canvas) == null || f.drawCropbox(h, r, d, g);
      }
    ), this.grabInfo.originPosition = {
      x: (e = this.constraintBox) == null ? void 0 : e.getConstraintBoxPosition().x,
      y: (n = this.constraintBox) == null ? void 0 : n.getConstraintBoxPosition().y
    }, this.registerEvent();
  }
  registerEvent() {
    var i, t, o, s;
    (i = this.parent) == null || i.addEventListener("wheel", (e) => {
      var n, h, r;
      if (e.target.dataset.eventType === "canvas-scale-move") {
        if (this.transformInfo.origin.x = e.offsetX, this.transformInfo.origin.y = e.offsetY, this.transformInfo.type = "scale", this.transformInfo.scale - 0.1 >= 0 && e.deltaY < 0) {
          const { width: d, height: g } = (n = this.cropBox) == null ? void 0 : n.getPosition();
          ((h = this.videoInfo) == null ? void 0 : h.renderWidth) * (this.transformInfo.scale - 0.1) <= d ? this.transformInfo.scale = d / this.videoInfo.renderWidth : this.transformInfo.scale -= 0.1, ((r = this.videoInfo) == null ? void 0 : r.renderHeight) * (this.transformInfo.scale - 0.1) <= g ? this.transformInfo.scale = g / this.videoInfo.renderHeight : this.transformInfo.scale -= 0.1;
        }
        e.deltaY > 0 && (this.transformInfo.scale += 0.1), this.transformScale();
      }
    }), (t = this.parent) == null || t.addEventListener("mousedown", (e) => {
      var n, h, r;
      this.mouseInfo.mouseDown = !0, this.mouseInfo.mouseX = e.clientX, this.mouseInfo.mouseY = e.clientY, this.mouseInfo.type = e.target.dataset.eventType, this.cropBox.setOriginalPosition(), this.mouseInfo.type === "canvas-scale-move" && (this.grabInfo.grab = !0, this.grabInfo.grabX = e.clientX, this.grabInfo.grabY = e.clientY, this.grabInfo.originPosition = {
        x: (n = this.constraintBox) == null ? void 0 : n.getConstraintBoxPosition().x,
        y: (h = this.constraintBox) == null ? void 0 : h.getConstraintBoxPosition().y
      }, (r = this.canvas) == null || r.setGrab(this.grabInfo.grab));
    }), (o = document.body) == null || o.addEventListener("mouseup", (e) => {
      var h;
      this.mouseInfo.mouseDown = !1, this.mouseInfo.type === "canvas-scale-move" && (this.grabInfo.grab = !1, (h = this.canvas) == null || h.setGrab(this.grabInfo.grab));
      const n = this.cropBox.normalizePosition(
        this.cropBox.getPosition()
      );
      this.cropBox.setPosition(n);
    }), (s = document.body) == null || s.addEventListener("mousemove", (e) => {
      var n, h;
      if (this.mouseInfo.mouseDown) {
        const r = e.clientX - this.mouseInfo.mouseX, d = e.clientY - this.mouseInfo.mouseY;
        switch (this.mouseInfo.type) {
          case "border-move-0": {
            this.cropBox.borderMove(r, d, 0);
            break;
          }
          case "border-move-1": {
            this.cropBox.borderMove(r, d, 1);
            break;
          }
          case "border-move-2": {
            this.cropBox.borderMove(r, d, 2);
            break;
          }
          case "border-move-3": {
            this.cropBox.borderMove(r, d, 3);
            break;
          }
          case "pointer-move-0": {
            this.cropBox.pointerMove(r, d, 0);
            break;
          }
          case "pointer-move-1": {
            this.cropBox.pointerMove(r, d, 1);
            break;
          }
          case "pointer-move-2": {
            this.cropBox.pointerMove(r, d, 2);
            break;
          }
          case "pointer-move-3": {
            this.cropBox.pointerMove(r, d, 3);
            break;
          }
          case "pointer-move-4": {
            this.cropBox.pointerMove(r, d, 4);
            break;
          }
          case "pointer-move-5": {
            this.cropBox.pointerMove(r, d, 5);
            break;
          }
          case "pointer-move-6": {
            this.cropBox.pointerMove(r, d, 6);
            break;
          }
          case "pointer-move-7": {
            this.cropBox.pointerMove(r, d, 7);
            break;
          }
          case "grid-move": {
            this.cropBox.cropboxMove(r, d);
            break;
          }
          case "canvas-scale-move":
            this.grabInfo.grab && (this.transformInfo.type = "move", this.transformInfo.translateX = e.clientX - this.grabInfo.grabX + ((n = this.grabInfo.originPosition) == null ? void 0 : n.x), this.transformInfo.translateY = e.clientY - this.grabInfo.grabY + ((h = this.grabInfo.originPosition) == null ? void 0 : h.y), this.constraintBox.transform(this.transformInfo));
        }
      }
    });
  }
  transformScale() {
    var e, n;
    const i = (e = this.constraintBox) == null ? void 0 : e.getConstraintBoxPosition(), t = i.x - (this.videoInfo.renderWidth * this.transformInfo.scale - i.width) * (this.transformInfo.origin.x / i.width), o = i.y - (this.videoInfo.renderHeight * this.transformInfo.scale - i.height) * (this.transformInfo.origin.y / i.height);
    this.transformInfo.translateX = t, this.transformInfo.translateY = o;
    const s = (n = this.cropBox) == null ? void 0 : n.getPosition();
    this.cropBox.setPosition({
      x: s.x + (i.x - t),
      y: s.y + (i.y - o),
      width: s.width,
      height: s.height
    }), this.constraintBox.transform(this.transformInfo);
  }
  calculateRenderVideoInfo() {
    const i = this.videoInfo.videoWidth / this.videoInfo.videoHeight, t = this.videoInfo.elementWidth / this.videoInfo.elementHeight;
    if (i >= t) {
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
  getConstraintBox() {
    return this.constraintBox;
  }
  getCropBox() {
    return this.cropBox;
  }
  scale(i, t, o) {
    this.transformInfo.origin.x = t || this.videoElement.width / 2, this.transformInfo.origin.y = o || this.videoElement.height / 2, this.transformInfo.scale += i, this.transformScale();
  }
  setCropBoxPositionFunc(i) {
    var t;
    (t = this.cropBox) == null || t.setCropBoxPositionFunc(i);
  }
}
export {
  L as default
};
