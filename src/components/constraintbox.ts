import Canvas from "./canvas";
import CropBox from "./cropbox";

class ConstraintBox {
  public constraintBoxElement: HTMLDivElement | null = null;
  private constraintBoxBodyElement: HTMLDivElement | null = null;
  private parent: HTMLElement | null = null;
  public x = 0;
  public y = 0;
  public width = 0;
  public height = 0;
  private constraintBoxPosition: IPosition = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  private videoInfo: IVideoInfo | null = null;
  private cropbox: CropBox | null = null;
  private canvas: Canvas | null = null;

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

  private updateStyle() {
    const style = `
      --video-cropper-constraint-box-left: ${this.constraintBoxPosition.x}px;
      --video-cropper-constraint-box-top: ${this.constraintBoxPosition.y}px;
      --video-cropper-constraint-box-width: ${this.constraintBoxPosition.width}px;
      --video-cropper-constraint-box-height: ${this.constraintBoxPosition.height}px;`;
    this.constraintBoxElement!.setAttribute("style", style);
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
}

export default ConstraintBox;
