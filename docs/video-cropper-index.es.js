class l {
  constructor(t, o, i) {
    (this.videoElement = null),
      (this.duration = 0),
      (this.previewFlag = !1),
      (this.constraintBox = null),
      (this.videoInfo = {
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
      }),
      (this.cropbox = null),
      (this.lastConstraintBoxPosition = null),
      (this.videoConfig = { muted: !0 }),
      (this.videoElement = t),
      (this.videoInfo = o),
      (this.duration = o.duration),
      this.videoConfig && (this.videoConfig = i),
      this.videoElement.setAttribute("class", "video-cropper-video"),
      this.videoConfig.muted &&
        ((this.videoElement.muted = !0), (this.videoElement.volume = 0)),
      this.updateStyle(),
      this.registerEvent();
  }
  setCropBox(t) {
    this.cropbox = t;
  }
  registerEvent() {}
  play() {
    (this.previewFlag = !0), this.updateStyle(), this.videoElement.play();
  }
  preview() {
    var t, o, i, e;
    if (!this.previewFlag) {
      const s = (t = this.cropbox) == null ? void 0 : t.getPosition(),
        n =
          (o = this.constraintBox) == null
            ? void 0
            : o.getConstraintBoxPosition();
      this.lastConstraintBoxPosition = { ...n };
      const h = this.videoInfo.elementWidth / s.width,
        r = this.videoInfo.elementHeight / s.height;
      (n.height = n.height * h),
        (n.width = n.width * r),
        (n.x = -(s.x * h)),
        (n.y = -(s.y * r)),
        (i = this.constraintBox) == null || i.setConstraintBoxPosition(n),
        (e = this.constraintBox) == null || e.updateStyle(),
        this.play();
    }
  }
  exitPreview() {
    var t, o;
    this.previewFlag &&
      ((t = this.constraintBox) == null ||
        t.setConstraintBoxPosition(this.lastConstraintBoxPosition),
      (o = this.constraintBox) == null || o.updateStyle(),
      (this.previewFlag = !1),
      this.updateStyle(),
      this.pause());
  }
  pause() {
    (this.previewFlag = !1), this.videoElement.pause(), this.updateStyle();
  }
  setCurrentTime(t) {
    t >= this.videoInfo.duration && (t = this.videoInfo.duration),
      t <= 0 && (t = 0),
      (this.videoElement.currentTime = t);
  }
  setUpdateCallback(t) {
    var o;
    return (
      (o = this.videoElement) == null || o.addEventListener("timeupdate", t),
      () => {
        var i;
        (i = this.videoElement) == null ||
          i.removeEventListener("timeupdate", t);
      }
    );
  }
  updateStyle() {
    const t = `--video-cropper-video-origin: center;
      --video-cropper-video-z-index: ${this.previewFlag ? 1e3 : 0};
      --video-cropper-video-position: ${this.previewFlag ? "absolute" : "static"};`;
    this.videoElement.setAttribute("style", t);
  }
  updateSize() {
    var t, o;
    (this.videoElement.width =
      (t = this.constraintBox) == null ? void 0 : t.width),
      (this.videoElement.height =
        (o = this.constraintBox) == null ? void 0 : o.height);
  }
  setConstraintBox(t) {
    (this.constraintBox = t), this.updateSize();
  }
}
class x {
  constructor(t) {
    (this.canvasElement = null),
      (this.ctx = null),
      (this.cropbox = null),
      (this.video = null),
      (this.constraintbox = null),
      (this.grab = !1),
      (this.videoInfo = {
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
      }),
      (this.videoInfo = t),
      (this.canvasElement = document.createElement("canvas")),
      (this.canvasElement.dataset.eventType = "canvas-scale-move"),
      this.canvasElement.setAttribute("class", "video-cropper-canvas"),
      (this.ctx = this.canvasElement.getContext("2d")),
      this.updateStyle();
  }
  updateSize() {
    var t, o;
    (this.canvasElement.width =
      (t = this.constraintbox) == null ? void 0 : t.width),
      (this.canvasElement.height =
        (o = this.constraintbox) == null ? void 0 : o.height);
  }
  setGrab(t) {
    var o;
    (this.grab = t),
      (o = this.cropbox) == null || o.show(!t),
      this.updateStyle();
  }
  updateStyle() {
    const t = `--video-cropper-canvas-grab: ${this.grab ? "grabbing" : "grab"}`;
    this.canvasElement.setAttribute("style", t);
  }
  drawCropbox(t, o, i, e) {
    var s, n, h, r;
    (this.ctx.fillStyle = "rgba(0, 0, 0, 0.32)"),
      this.ctx.clearRect(
        0,
        0,
        (s = this.canvasElement) == null ? void 0 : s.width,
        (n = this.canvasElement) == null ? void 0 : n.height
      ),
      this.ctx.fillRect(
        0,
        0,
        (h = this.canvasElement) == null ? void 0 : h.width,
        (r = this.canvasElement) == null ? void 0 : r.height
      ),
      this.ctx.clearRect(t, o, i, e);
  }
  setVideo(t) {
    this.video = t;
  }
  setCropBox(t) {
    this.cropbox = t;
  }
  setConstraintBox(t) {
    (this.constraintbox = t), this.updateSize();
  }
}
class v {
  constructor(t, o) {
    (this.cropBoxElement = null),
      (this.anchors = []),
      (this.grids = []),
      (this.boders = []),
      (this.pointerContainer = null),
      (this.gridContainer = null),
      (this.broderContainer = null),
      (this.rate = 0.3),
      (this.zIndex = 99),
      (this.constraintBox = null),
      (this.disengage = !1),
      (this.drawCropbox = () => {}),
      (this.cropBoxPositionFunc = () => {}),
      (this.originalPosition = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }),
      (this.previewPosition = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }),
      (this.position = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }),
      (this.constraintBoxPosition = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }),
      (this.mapPosition = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }),
      (this.videoInfo = {
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
      }),
      (this.cropBoxConfig = {
        aspectRatio: 0
      }),
      (this.videoInfo = t),
      o && (this.cropBoxConfig = o),
      (this.positionProxy = new Proxy(this.position, {
        set: (i, e, s) => ((i[e] = s), !0),
        get: (i, e) => i[e]
      })),
      this.initCropbox();
  }
  setConstraintBox(t) {
    var i;
    (this.constraintBox = t),
      (this.previewPosition = {
        x: this.constraintBox.x,
        y: this.constraintBox.y,
        width: this.constraintBox.width,
        height: this.constraintBox.height
      }),
      (this.constraintBoxPosition = {
        ...this.previewPosition
      });
    const o =
      ((i = this.cropBoxConfig) == null ? void 0 : i.position) ||
      this.calculateAspectRatio();
    (this.positionProxy.x = o.x),
      (this.positionProxy.y = o.y),
      (this.positionProxy.width = o.width),
      (this.positionProxy.height = o.height),
      this.updateStyle(),
      this.updateMapPostion();
  }
  borderMove(t, o, i) {
    switch (i) {
      case 0:
        this.cropboxScale(t, o, 1);
        break;
      case 1:
        this.cropboxScale(t, o, 4);
        break;
      case 2:
        this.cropboxScale(t, o, 6);
        break;
      case 3:
        this.cropboxScale(t, o, 3);
        break;
    }
  }
  pointerMove(t, o, i) {
    this.cropboxScale(t, o, i);
  }
  setOriginalPosition() {
    (this.originalPosition.x = this.position.x),
      (this.originalPosition.y = this.position.y),
      (this.originalPosition.width = this.position.width),
      (this.originalPosition.height = this.position.height);
  }
  getOriginalPosition() {
    return this.originalPosition;
  }
  updateStyle() {
    const t = this.normalizePosition(this.position),
      o = `
      --crop-box-z-index: ${this.zIndex};
      --crop-box-left: ${t.x}px;
      --crop-box-top: ${t.y}px;
      --crop-box-width: ${t.width}px;
      --crop-box-height: ${t.height}px;
    `;
    this.cropBoxElement.setAttribute("style", o);
  }
  normalizePosition(t) {
    const o = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    return (
      this.position.width < 0
        ? ((o.width = t.width * -1), (o.x = t.x + t.width))
        : ((o.width = t.width), (o.x = t.x)),
      t.height < 0
        ? ((o.height = t.height * -1), (o.y = t.y + t.height))
        : ((o.height = t.height), (o.y = t.y)),
      o
    );
  }
  setDrawCropBoxFunc(t) {
    (this.drawCropbox = t),
      this.drawCropbox(
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
    ),
      this.updateStyle();
  }
  calculateAspectRatio() {
    var t;
    if (((t = this.cropBoxConfig) == null ? void 0 : t.aspectRatio) === 0)
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
    {
      const o = Math.min(
        this.videoInfo.renderWidth * this.rate,
        this.videoInfo.renderHeight * this.rate
      );
      if (this.cropBoxConfig.aspectRatio >= 1) {
        const i = o,
          e = o / this.cropBoxConfig.aspectRatio;
        return {
          x: (this.constraintBoxPosition.width - i) / 2,
          y: (this.constraintBoxPosition.height - e) / 2,
          width: i,
          height: e
        };
      } else {
        const i = o * this.cropBoxConfig.aspectRatio,
          e = o;
        return {
          x: (this.constraintBoxPosition.width - i) / 2,
          y: (this.constraintBoxPosition.height - e) / 2,
          width: i,
          height: e
        };
      }
    }
  }
  initCropbox() {
    (this.cropBoxElement = document.createElement("div")),
      this.cropBoxElement.setAttribute("class", "video-cropper-crop-box"),
      this.initGrid(),
      this.initBorder(),
      this.initPointer(),
      this.cropBoxElement.appendChild(this.gridContainer),
      this.cropBoxElement.appendChild(this.broderContainer),
      this.cropBoxElement.appendChild(this.pointerContainer);
  }
  initPointer() {
    (this.pointerContainer = document.createElement("div")),
      this.pointerContainer.setAttribute(
        "class",
        "video-cropper-crop-box-pointer-container"
      ),
      (this.anchors = Array(8).fill(null)),
      (this.anchors = this.anchors.map((t, o) => {
        const i = document.createElement("div");
        return (
          i.setAttribute(
            "class",
            `video-cropper-anchor-${o} video-cropper-anchor`
          ),
          (i.dataset.eventType = `pointer-move-${o}`),
          this.pointerContainer.appendChild(i),
          i
        );
      }));
  }
  initGrid() {
    (this.gridContainer = document.createElement("div")),
      this.gridContainer.setAttribute(
        "class",
        "video-cropper-crop-box-grid-container"
      ),
      (this.gridContainer.dataset.eventType = "grid-move"),
      (this.grids = Array(9).fill(null)),
      this.grids.forEach((t, o) => {
        const i = document.createElement("div");
        i.setAttribute(
          "class",
          `video-cropper-crop-box-grid-${o} video-cropper-crop-box-grid`
        ),
          (i.dataset.eventType = "grid-move"),
          this.gridContainer.appendChild(i);
      });
  }
  initBorder() {
    (this.broderContainer = document.createElement("div")),
      this.broderContainer.setAttribute(
        "class",
        "video-cropper-crop-box-border-container"
      );
    const t = document.createElement("div");
    (t.dataset.eventType = "grid-move"),
      t.setAttribute("class", "video-cropper-crop-box-border-temp"),
      (this.boders = Array(4).fill(null)),
      (this.boders = this.boders.map((o, i) => {
        const e = document.createElement("div");
        return (
          e.setAttribute(
            "class",
            `video-cropper-crop-box-border-${i} video-cropper-crop-box-border`
          ),
          (e.dataset.eventType = `border-move-${i}`),
          t.appendChild(e),
          e
        );
      })),
      this.broderContainer.appendChild(t);
  }
  cropboxMove(t, o) {
    const i = this.originalPosition.x + t,
      e = this.originalPosition.y + o;
    (this.positionProxy.x = i),
      (this.positionProxy.y = e),
      this.updateStyle(),
      this.drawCropbox(
        this.position.x,
        this.position.y,
        this.position.width,
        this.position.height
      ),
      this.updateMapPostion(),
      this.cropBoxPositionFunc(
        this.mapPosition,
        this.normalizePosition(this.position)
      );
  }
  borderLeftMove(t, o) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const i = -t / this.cropBoxConfig.aspectRatio;
      o === 0
        ? ((this.positionProxy.y = this.originalPosition.y - i),
          (this.positionProxy.height = this.originalPosition.height + i))
        : o === 5 ||
          ((this.positionProxy.y = this.originalPosition.y - i / 2),
          (this.positionProxy.height = this.originalPosition.height + i));
    }
    (this.positionProxy.x = this.originalPosition.x + t),
      (this.positionProxy.width = this.originalPosition.width - t);
  }
  borderTopMove(t, o) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const i = -t * this.cropBoxConfig.aspectRatio;
      o === 0
        ? (this.positionProxy.x = this.originalPosition.x - i)
        : o === 2 || (this.positionProxy.x = this.originalPosition.x - i / 2),
        (this.positionProxy.width = this.originalPosition.width + i);
    }
    (this.positionProxy.y = this.originalPosition.y + t),
      (this.positionProxy.height = this.originalPosition.height - t);
  }
  borderRightMove(t, o) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const i = t / this.cropBoxConfig.aspectRatio;
      o === 2
        ? (this.positionProxy.y = this.originalPosition.y - i)
        : o === 7 || (this.positionProxy.y = this.originalPosition.y - i / 2),
        (this.positionProxy.height = this.originalPosition.height + i);
    }
    this.positionProxy.width = this.originalPosition.width + t;
  }
  borderBottomMove(t, o) {
    if (this.cropBoxConfig.aspectRatio !== 0) {
      const i = t * this.cropBoxConfig.aspectRatio;
      o === 5
        ? (this.positionProxy.x = this.originalPosition.x - i)
        : o === 7 || (this.positionProxy.x = this.originalPosition.x - i / 2),
        (this.positionProxy.width = this.originalPosition.width + i);
    }
    this.positionProxy.height = this.originalPosition.height + t;
  }
  // TODO: disengage = true还未实现，等比缩放未实现
  cropboxScale(t, o, i) {
    switch (i) {
      case 0: {
        this.borderLeftMove(t, i), this.borderTopMove(o, i);
        break;
      }
      case 1: {
        this.borderTopMove(o, i);
        break;
      }
      case 2: {
        this.borderTopMove(o, i), this.borderRightMove(t, i);
        break;
      }
      case 3: {
        this.borderLeftMove(t, i);
        break;
      }
      case 4: {
        this.borderRightMove(t, i);
        break;
      }
      case 5: {
        this.borderBottomMove(o, i), this.borderLeftMove(t, i);
        break;
      }
      case 6: {
        this.borderBottomMove(o, i);
        break;
      }
      case 7: {
        this.borderBottomMove(o, i), this.borderRightMove(t, i);
        break;
      }
    }
    this.updateStyle(),
      this.drawCropbox(
        this.position.x,
        this.position.y,
        this.position.width,
        this.position.height
      ),
      this.updateMapPostion(),
      this.cropBoxPositionFunc(
        this.normalizePosition(this.mapPosition),
        this.normalizePosition(this.position)
      );
  }
  updateMapPostion() {
    var t, o, i, e;
    (this.mapPosition.x = Math.round(
      ((this.positionProxy.x * this.videoInfo.renderWidth) /
        ((t = this.constraintBox) == null
          ? void 0
          : t.getConstraintBoxPosition().width)) *
        this.videoInfo.realProportion
    )),
      (this.mapPosition.y = Math.round(
        ((this.positionProxy.y * this.videoInfo.renderHeight) /
          ((o = this.constraintBox) == null
            ? void 0
            : o.getConstraintBoxPosition().height)) *
          this.videoInfo.realProportion
      )),
      (this.mapPosition.width = Math.round(
        ((this.positionProxy.width * this.videoInfo.renderWidth) /
          ((i = this.constraintBox) == null
            ? void 0
            : i.getConstraintBoxPosition().width)) *
          this.videoInfo.realProportion
      )),
      (this.mapPosition.height = Math.round(
        ((this.positionProxy.height * this.videoInfo.renderHeight) /
          ((e = this.constraintBox) == null
            ? void 0
            : e.getConstraintBoxPosition().height)) *
          this.videoInfo.realProportion
      ));
  }
  setPreviewPosition(t) {
    this.previewPosition = t;
  }
  show(t) {
    (this.zIndex = t ? 99 : -1), this.updateStyle();
  }
  getPosition() {
    return this.position;
  }
  setPosition(t) {
    (this.positionProxy.x = t.x),
      (this.positionProxy.y = t.y),
      (this.positionProxy.width = t.width),
      (this.positionProxy.height = t.height);
  }
  getPreviewPosition() {
    return this.mapPosition;
  }
}
class g {
  constructor(t, o, i) {
    (this.constraintBoxElement = null),
      (this.constraintBoxBodyElement = null),
      (this.parent = null),
      (this.x = 0),
      (this.y = 0),
      (this.width = 0),
      (this.height = 0),
      (this.constraintBoxPosition = {
        // 相对父元素的位置
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }),
      (this.videoInfo = null),
      (this.cropbox = null),
      (this.canvas = null),
      (this.video = null),
      (this.videoInfo = o),
      (this.parent = t),
      (this.constraintBoxElement = document.createElement("div")),
      this.constraintBoxElement.setAttribute(
        "class",
        "video-cropper-constraint-box"
      ),
      (this.constraintBoxBodyElement = document.createElement("div")),
      this.constraintBoxBodyElement.setAttribute(
        "class",
        "video-cropper-constraint-box-body"
      ),
      this.constraintBoxElement.appendChild(this.constraintBoxBodyElement),
      (this.width = this.videoInfo.renderWidth),
      (this.height = this.videoInfo.renderHeight),
      i != null && i.position
        ? (this.constraintBoxPosition = i.position)
        : (this.constraintBoxPosition = {
            x: this.videoInfo.renderX,
            y: this.videoInfo.renderY,
            width: this.videoInfo.renderWidth,
            height: this.videoInfo.renderHeight
          }),
      this.updateStyle();
  }
  transform(t) {
    var o, i, e, s, n;
    t.type === "scale"
      ? ((this.constraintBoxPosition.x = t.translateX),
        (this.constraintBoxPosition.y = t.translateY),
        (this.constraintBoxPosition.width =
          ((o = this.videoInfo) == null ? void 0 : o.renderWidth) * t.scale),
        (this.constraintBoxPosition.height =
          ((i = this.videoInfo) == null ? void 0 : i.renderHeight) * t.scale),
        (this.width = this.constraintBoxPosition.width),
        (this.height = this.constraintBoxPosition.height),
        (e = this.canvas) == null || e.updateSize(),
        (s = this.video) == null || s.updateSize(),
        (n = this.cropbox) == null || n.calculateBorderLimit())
      : ((this.constraintBoxPosition.x = t.translateX),
        (this.constraintBoxPosition.y = t.translateY)),
      this.updateStyle();
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
    (this.video = t),
      this.constraintBoxBodyElement.appendChild(this.video.videoElement);
  }
  setCropBox(t) {
    (this.cropbox = t),
      this.constraintBoxBodyElement.appendChild(this.cropbox.cropBoxElement);
  }
  setCanvas(t) {
    (this.canvas = t),
      this.constraintBoxBodyElement.appendChild(this.canvas.canvasElement),
      this.parent.appendChild(this.constraintBoxElement);
  }
  getConstraintBoxPosition() {
    return this.constraintBoxPosition;
  }
  setConstraintBoxPosition(t) {
    this.constraintBoxPosition = t;
  }
}
class f {
  constructor(t, o) {
    (this.parent = null),
      (this.container = null),
      (this.canvas = null),
      (this.cropBox = null),
      (this.constraintBox = null),
      (this.video = null),
      (this.options = void 0),
      (this.videoInfo = {
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
      }),
      (this.transformInfo = {
        scale: 1,
        origin: { x: 0, y: 0 },
        translateX: 0,
        translateY: 0,
        type: "scale"
      }),
      (this.grabInfo = {
        grab: !1,
        grabX: 0,
        grabY: 0,
        originPosition: { x: 0, y: 0 }
      }),
      (this.mouseInfo = {
        type: null,
        mouseX: 0,
        mouseY: 0,
        mouseDown: !1
      }),
      (this.videoElement = t),
      (this.options = o),
      (this.videoInfo = {
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
      });
    const i = this.calculateRenderVideoInfo();
    (this.videoInfo.renderWidth = i.renderWidth),
      (this.videoInfo.renderHeight = i.renderHeight),
      (this.videoInfo.realProportion = i.realProportion),
      (this.videoInfo.displayProportion = i.displayProportion),
      (this.videoInfo.renderX = i.renderX),
      (this.videoInfo.renderY = i.renderY),
      this.init();
  }
  init() {
    var t, o, i, e, s, n;
    (this.parent = document.createElement("div")),
      (this.container = this.videoElement.parentElement),
      this.container.appendChild(this.parent),
      this.parent.setAttribute("class", "video-cropper-parent"),
      this.parent.setAttribute(
        "style",
        `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`
      ),
      (this.video = new l(
        this.videoElement,
        this.videoInfo,
        (t = this.options) == null ? void 0 : t.videoConfig
      )),
      (this.canvas = new x(this.videoInfo)),
      this.canvas.setVideo(this.video),
      (this.cropBox = new v(
        this.videoInfo,
        (o = this.options) == null ? void 0 : o.cropBoxConfig
      )),
      (this.constraintBox = new g(
        this.parent,
        this.videoInfo,
        (i = this.options) == null ? void 0 : i.constraintBoxConfig
      )),
      this.constraintBox.setVideo(this.video),
      this.constraintBox.setCanvas(this.canvas),
      this.constraintBox.setCropBox(this.cropBox),
      this.video.setCropBox(this.cropBox),
      this.canvas.setCropBox(this.cropBox),
      this.canvas.setConstraintBox(this.constraintBox),
      this.cropBox.setConstraintBox(this.constraintBox),
      this.video.setConstraintBox(this.constraintBox),
      (e = this.cropBox) == null ||
        e.setDrawCropBoxFunc((h, r, a, p) => {
          var c;
          (c = this.canvas) == null || c.drawCropbox(h, r, a, p);
        }),
      (this.grabInfo.originPosition = {
        x:
          (s = this.constraintBox) == null
            ? void 0
            : s.getConstraintBoxPosition().x,
        y:
          (n = this.constraintBox) == null
            ? void 0
            : n.getConstraintBoxPosition().y
      }),
      this.registerEvent();
  }
  registerEvent() {
    var t, o, i, e;
    (t = this.parent) == null ||
      t.addEventListener("wheel", (s) => {
        var n, h, r;
        if (s.target.dataset.eventType === "canvas-scale-move") {
          if (
            ((this.transformInfo.origin.x = s.offsetX),
            (this.transformInfo.origin.y = s.offsetY),
            (this.transformInfo.type = "scale"),
            this.transformInfo.scale - 0.1 >= 0 && s.deltaY < 0)
          ) {
            const { width: a, height: p } =
              (n = this.cropBox) == null ? void 0 : n.getPosition();
            ((h = this.videoInfo) == null ? void 0 : h.renderWidth) *
              (this.transformInfo.scale - 0.1) <=
            a
              ? (this.transformInfo.scale = a / this.videoInfo.renderWidth)
              : (this.transformInfo.scale -= 0.1),
              ((r = this.videoInfo) == null ? void 0 : r.renderHeight) *
                (this.transformInfo.scale - 0.1) <=
              p
                ? (this.transformInfo.scale = p / this.videoInfo.renderHeight)
                : (this.transformInfo.scale -= 0.1);
          }
          s.deltaY > 0 && (this.transformInfo.scale += 0.1),
            this.transformScale();
        }
      }),
      (o = this.parent) == null ||
        o.addEventListener("mousedown", (s) => {
          var n, h, r;
          (this.mouseInfo.mouseDown = !0),
            (this.mouseInfo.mouseX = s.clientX),
            (this.mouseInfo.mouseY = s.clientY),
            (this.mouseInfo.type = s.target.dataset.eventType),
            this.cropBox.setOriginalPosition(),
            this.mouseInfo.type === "canvas-scale-move" &&
              ((this.grabInfo.grab = !0),
              (this.grabInfo.grabX = s.clientX),
              (this.grabInfo.grabY = s.clientY),
              (this.grabInfo.originPosition = {
                x:
                  (n = this.constraintBox) == null
                    ? void 0
                    : n.getConstraintBoxPosition().x,
                y:
                  (h = this.constraintBox) == null
                    ? void 0
                    : h.getConstraintBoxPosition().y
              }),
              (r = this.canvas) == null || r.setGrab(this.grabInfo.grab));
        }),
      (i = document.body) == null ||
        i.addEventListener("mouseup", (s) => {
          var h;
          (this.mouseInfo.mouseDown = !1),
            this.mouseInfo.type === "canvas-scale-move" &&
              ((this.grabInfo.grab = !1),
              (h = this.canvas) == null || h.setGrab(this.grabInfo.grab));
          const n = this.cropBox.normalizePosition(this.cropBox.getPosition());
          this.cropBox.setPosition(n);
        }),
      (e = document.body) == null ||
        e.addEventListener("mousemove", (s) => {
          var n, h;
          if (this.mouseInfo.mouseDown) {
            const r = s.clientX - this.mouseInfo.mouseX,
              a = s.clientY - this.mouseInfo.mouseY;
            switch (
              (console.log(r, this.mouseInfo.type), this.mouseInfo.type)
            ) {
              case "border-move-0": {
                this.cropBox.borderMove(r, a, 0);
                break;
              }
              case "border-move-1": {
                this.cropBox.borderMove(r, a, 1);
                break;
              }
              case "border-move-2": {
                this.cropBox.borderMove(r, a, 2);
                break;
              }
              case "border-move-3": {
                this.cropBox.borderMove(r, a, 3);
                break;
              }
              case "pointer-move-0": {
                this.cropBox.pointerMove(r, a, 0);
                break;
              }
              case "pointer-move-1": {
                this.cropBox.pointerMove(r, a, 1);
                break;
              }
              case "pointer-move-2": {
                this.cropBox.pointerMove(r, a, 2);
                break;
              }
              case "pointer-move-3": {
                this.cropBox.pointerMove(r, a, 3);
                break;
              }
              case "pointer-move-4": {
                this.cropBox.pointerMove(r, a, 4);
                break;
              }
              case "pointer-move-5": {
                this.cropBox.pointerMove(r, a, 5);
                break;
              }
              case "pointer-move-6": {
                this.cropBox.pointerMove(r, a, 6);
                break;
              }
              case "pointer-move-7": {
                this.cropBox.pointerMove(r, a, 7);
                break;
              }
              case "grid-move": {
                this.cropBox.cropboxMove(r, a);
                break;
              }
              case "canvas-scale-move":
                this.grabInfo.grab &&
                  ((this.transformInfo.type = "move"),
                  (this.transformInfo.translateX =
                    s.clientX -
                    this.grabInfo.grabX +
                    ((n = this.grabInfo.originPosition) == null
                      ? void 0
                      : n.x)),
                  (this.transformInfo.translateY =
                    s.clientY -
                    this.grabInfo.grabY +
                    ((h = this.grabInfo.originPosition) == null
                      ? void 0
                      : h.y)),
                  this.constraintBox.transform(this.transformInfo));
            }
          }
        });
  }
  transformScale() {
    var e;
    const t =
        (e = this.constraintBox) == null
          ? void 0
          : e.getConstraintBoxPosition(),
      o =
        t.x -
        (this.videoInfo.renderWidth * this.transformInfo.scale - t.width) *
          (this.transformInfo.origin.x / t.width),
      i =
        t.y -
        (this.videoInfo.renderHeight * this.transformInfo.scale - t.height) *
          (this.transformInfo.origin.y / t.height);
    (this.transformInfo.translateX = o),
      (this.transformInfo.translateY = i),
      this.constraintBox.transform(this.transformInfo);
  }
  calculateRenderVideoInfo() {
    const t = this.videoInfo.videoWidth / this.videoInfo.videoHeight,
      o = this.videoInfo.elementWidth / this.videoInfo.elementHeight;
    if (t >= o) {
      const i = this.videoInfo.elementWidth / this.videoInfo.videoWidth,
        e = this.videoInfo.videoWidth / this.videoInfo.elementWidth;
      return {
        renderWidth: this.videoInfo.elementWidth,
        renderHeight: this.videoInfo.videoHeight * i,
        displayProportion: i,
        realProportion: e,
        renderX: 0,
        renderY:
          (this.videoInfo.elementHeight - this.videoInfo.videoHeight * i) / 2
      };
    } else {
      const i = this.videoInfo.elementHeight / this.videoInfo.videoHeight,
        e = this.videoInfo.videoHeight / this.videoInfo.elementHeight;
      return {
        renderWidth: this.videoInfo.videoWidth * i,
        renderHeight: this.videoInfo.elementHeight,
        displayProportion: i,
        realProportion: e,
        renderX:
          (this.videoInfo.elementWidth - this.videoInfo.videoWidth * i) / 2,
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
  scale(t, o, i) {
    (this.transformInfo.origin.x = o || this.videoElement.width / 2),
      (this.transformInfo.origin.y = i || this.videoElement.height / 2),
      (this.transformInfo.scale += t),
      this.transformScale();
  }
  setCropBoxPositionFunc(t) {
    var o;
    (o = this.cropBox) == null || o.setCropBoxPositionFunc(t);
  }
}
export { f as default };
