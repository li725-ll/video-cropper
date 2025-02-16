class Canvas {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private parent: HTMLElement | null = null;
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
    }
    constructor(parent: HTMLElement | null, videoInfo: any) {
        this.parent = parent;
        this.videoInfo = videoInfo;

        this.canvas = document.createElement("canvas"); // 创建一个画布
        this.canvas.width = this.videoInfo.elementWidth;
        this.canvas.height = this.videoInfo.elementHeight;
        this.canvas.setAttribute("class", "video-cropper-canvas");
        this.parent!.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        // this.drawCropbox( this.videoInfo.elementWidth * 0.5 / 2,
        //     this.videoInfo.elementWidth * 0.5 / 2,
        //     this.videoInfo.elementWidth * 0.5,
        //     this.videoInfo.elementHeight * 0.5
        // );
    }

    drawCropbox(x: number, y: number, width: number, height: number) {
        this.ctx!.fillStyle = "rgba(0, 0, 0, 0.32)";
        this.ctx!.clearRect(0, 0, this.videoInfo.elementWidth, this.videoInfo.elementHeight);
        this.ctx!.fillRect(0, 0, this.videoInfo.elementWidth, this.videoInfo.elementHeight);
        this.ctx!.clearRect(x, y, width, height);   
    }
}

export default Canvas;
