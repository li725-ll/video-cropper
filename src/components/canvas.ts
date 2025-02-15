class Canvas {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private parent: HTMLElement | null = null;
    private videoInfo: IVideoInfo = {
        elementWidth: 0,
        elementHeight: 0,
        duration: 0,
        videoWidth: 0,
        videoHeight: 0
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
        this.drawCropbox( this.videoInfo.elementWidth * 0.5 / 2,
            this.videoInfo.elementWidth * 0.5 / 2,
            this.videoInfo.elementWidth * 0.5,
            this.videoInfo.elementHeight * 0.5
        );
    }

    drawCropbox(x = 0, y = 0, width = 100, height = 100) {
        this.ctx!.fillStyle = "rgba(0, 0, 0, 0.32)";
        this.ctx!.clearRect(0, 0, this.videoInfo.elementWidth, this.videoInfo.elementHeight);
        this.ctx!.fillRect(0, 0, this.videoInfo.elementWidth, this.videoInfo.elementHeight);
        this.ctx!.clearRect(x, y, width, height);   
    }
}

export default Canvas;
