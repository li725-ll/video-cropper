import Video from "./video";
import CropBox from "./cropbox";
import ConstraintBox from "./constraintbox";
import { IVideoInfo } from "../types";

class Canvas {
  public canvasElement: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private cropbox: CropBox | null = null;
  private video: Video | null = null;
  private constraintbox: ConstraintBox | null = null;
  private grab: boolean = false;

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

  constructor(videoInfo: any) {
    this.videoInfo = videoInfo;
    this.canvasElement = document.createElement("canvas"); // 创建一个画布
    this.canvasElement.dataset.eventType = "canvas-scale-move";
    this.canvasElement.setAttribute("class", "video-cropper-canvas");
    this.ctx = this.canvasElement.getContext("2d");
    this.updateStyle();
  }

  public updateSize() {
    this.canvasElement!.width = this.constraintbox?.width!;
    this.canvasElement!.height = this.constraintbox?.height!;
  }

  public setGrab(grab: boolean) {
    this.grab = grab;
    this.cropbox?.show(!grab);
    this.updateStyle();
  }

  private updateStyle() {
    const style = `--video-cropper-canvas-grab: ${this.grab ? "grabbing" : "grab"}`;
    this.canvasElement!.setAttribute("style", style);
  }

  public drawCropbox(x: number, y: number, width: number, height: number) {
    this.ctx!.fillStyle = "rgba(0, 0, 0, 0.32)";
    this.ctx!.clearRect(
      0,
      0,
      this.canvasElement?.width!,
      this.canvasElement?.height!
    );
    this.ctx!.fillRect(
      0,
      0,
      this.canvasElement?.width!,
      this.canvasElement?.height!
    );
    this.ctx!.clearRect(x, y, width, height);
  }

  public setVideo(video: Video) {
    this.video = video;
  }

  public setCropBox(cropbox: CropBox) {
    this.cropbox = cropbox;
  }

  public setConstraintBox(constraintbox: ConstraintBox) {
    this.constraintbox = constraintbox;
    this.updateSize();
  }
}

export default Canvas;
