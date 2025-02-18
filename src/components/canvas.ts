import CropBox from "./cropbox";
import Video from "./video";

class Canvas {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private parent: HTMLElement | null = null;
  private cropbox: CropBox | null = null;
  private video: Video | null = null;
  private grabInfo: IGrabInfo = {
    grab: false,
    grabX: 0,
    grabY: 0
  };
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

  constructor(parent: HTMLElement | null, videoInfo: any) {
    this.parent = parent;
    this.videoInfo = videoInfo;

    this.canvas = document.createElement("canvas"); // 创建一个画布
    this.canvas.width = this.videoInfo.elementWidth;
    this.canvas.height = this.videoInfo.elementHeight;
    this.canvas.setAttribute("class", "video-cropper-canvas");
    this.parent!.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.updateStyle();
    this.registerEvent();
    // this.drawCropbox( this.videoInfo.elementWidth * 0.5 / 2,
    //     this.videoInfo.elementWidth * 0.5 / 2,
    //     this.videoInfo.elementWidth * 0.5,
    //     this.videoInfo.elementHeight * 0.5
    // );
  }

  registerEvent() {
    this.canvas!.addEventListener("mousedown", (e: MouseEvent) => {
      this.grabInfo.grab = true;
      this.grabInfo.grabX = e.clientX;
      this.grabInfo.grabY = e.clientY;
      this.video?.videoTransfromDown();
      this.cropbox?.show(false);
      this.updateStyle();
    });

    this.canvas!.addEventListener("mousemove", (e: MouseEvent) => {
      this.video?.videoTransfromMove(e, this.grabInfo);
    });

    this.canvas!.addEventListener("mouseup", (e: MouseEvent) => {
      this.grabInfo.grab = false;
      this.cropbox?.show(true);
      this.updateStyle();
    });
  }

  private updateStyle() {
    const style = `--video-cropper-canvas-grab: ${this.grabInfo.grab ? "grabbing" : "grab"}`;
    this.canvas!.setAttribute("style", style);
  }

  public drawCropbox(x: number, y: number, width: number, height: number) {
    this.ctx!.fillStyle = "rgba(0, 0, 0, 0.32)";
    this.ctx!.clearRect(
      0,
      0,
      this.videoInfo.elementWidth,
      this.videoInfo.elementHeight
    );
    this.ctx!.fillRect(
      0,
      0,
      this.videoInfo.elementWidth,
      this.videoInfo.elementHeight
    );
    this.ctx!.clearRect(x, y, width, height);
  }

  public setVideo(video: Video) {
    this.video = video;
  }

  public setCropBox(cropbox: CropBox) {
    this.cropbox = cropbox;
  }
}

export default Canvas;
