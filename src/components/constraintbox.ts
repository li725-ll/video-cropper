import Canvas from "./canvas";
import CropBox from "./cropbox";
import Video from "./video";

class ConstraintBox {
  public constraintBoxElement: HTMLDivElement | null = null;
  private constraintBoxBodyElement: HTMLDivElement | null = null;
  private parent: HTMLElement | null = null;
  public x = 0;
  public y = 0;
  public width = 0;
  public height = 0;
  private constraintBoxPosition: IPosition = {
    // 相对父元素的位置
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  private videoInfo: IVideoInfo | null = null;
  private cropbox: CropBox | null = null;
  private canvas: Canvas | null = null;
  private video: Video | null = null;

  constructor(parent: HTMLElement, videoInfo: IVideoInfo) {
    this.videoInfo = videoInfo;
    this.parent = parent;
    this.constraintBoxElement = document.createElement("div");
    this.constraintBoxElement.setAttribute(
      "class",
      "video-cropper-constraint-box"
    );
    this.constraintBoxBodyElement = document.createElement("div");
    this.constraintBoxBodyElement.setAttribute(
      "class",
      "video-cropper-constraint-box-body"
    );

    this.constraintBoxElement.appendChild(this.constraintBoxBodyElement);
    this.width = this.videoInfo.renderWidth;
    this.height = this.videoInfo.renderHeight;
    this.constraintBoxPosition = {
      x: this.videoInfo.renderX,
      y: this.videoInfo.renderY,
      width: this.videoInfo.renderWidth,
      height: this.videoInfo.renderHeight
    };

    this.updateStyle();
  }

  public transform(transformInfo: ITransformInfo) {
    if (transformInfo.type === "scale") {
      this.constraintBoxPosition.width =
        this.videoInfo?.renderWidth! * transformInfo.scale;
      this.constraintBoxPosition.height =
        this.videoInfo?.renderHeight! * transformInfo.scale;
      this.width = this.constraintBoxPosition.width;
      this.height = this.constraintBoxPosition.height;
      this.canvas?.updateSize();
      this.video?.updateSize();
      this.cropbox?.calculateBorderLimit();
    } else {
      this.constraintBoxPosition.x = transformInfo.translateX;
      this.constraintBoxPosition.y = transformInfo.translateY;
    }

    this.updateStyle();
  }

  public updateStyle() {
    const style = `
      --video-cropper-constraint-box-left: ${this.constraintBoxPosition.x}px;
      --video-cropper-constraint-box-top: ${this.constraintBoxPosition.y}px;
      --video-cropper-constraint-box-width: ${this.constraintBoxPosition.width}px;
      --video-cropper-constraint-box-height: ${this.constraintBoxPosition.height}px;`;
    this.constraintBoxElement!.setAttribute("style", style);
  }

  public setVideo(video: Video) {
    this.video = video;
    this.constraintBoxBodyElement!.appendChild(this.video!.videoElement!);
  }

  public setCropBox(cropbox: CropBox) {
    this.cropbox = cropbox;
    this.constraintBoxBodyElement!.appendChild(this.cropbox!.cropBoxElement!);
  }

  public setCanvas(canvas: Canvas) {
    this.canvas = canvas;
    this.constraintBoxBodyElement!.appendChild(this.canvas!.canvasElement!);
    this.parent!.appendChild(this.constraintBoxElement!);
  }

  public getConstraintBoxPosition() {
    return this.constraintBoxPosition;
  }

  public setConstraintBoxPosition(constraintBoxPosition: IPosition) {
    this.constraintBoxPosition = constraintBoxPosition;
  }
}

export default ConstraintBox;
