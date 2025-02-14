import "./css/index.css";

export default class VideCropper {
    private videoElement: HTMLVideoElement;
    private videoInfo: {
        width: number,
        height: number,
        duration: number
        originWidth: number,
        originHeight: number
    } = {
        width: 0,
        height: 0,
        duration: 0,
        originWidth: 0,
        originHeight: 0
    };
    private parent: HTMLDivElement | null = null;
    private container: HTMLElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;

    constructor(root: HTMLVideoElement) {
        this.videoElement = root;
        this.init();
        this.createCanvas();
    }

    init() {
        console.log(this.videoElement);
        this.videoInfo = {
            width: this.videoElement.width,
            height: this.videoElement.height,
            duration: this.videoElement.duration,
            originWidth: this.videoElement.videoWidth,
            originHeight: this.videoElement.videoHeight
        };
        this.parent = document.createElement("div"); // 创建一个父级容器
        this.container = this.videoElement.parentElement!; // 获取video标签的原始父级容器
        this.container.appendChild(this.parent);

        this.parent.setAttribute("class", "video-cropper-parent");
        this.parent.appendChild(this.videoElement);
        this.parent.setAttribute("style", `width: ${this.videoInfo.width}px; height: ${this.videoInfo.height}px;`);
    }

    createCanvas() {
        this.canvas = document.createElement("canvas"); // 创建一个画布
        this.canvas.setAttribute("class", "video-cropper-canvas");
        this.parent!.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");
        this.ctx!.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx?.fillRect(0, 0, this.videoInfo.width, this.videoInfo.height);
    }

    play() {
        this.videoElement.play();
    }

    crop() {
    }
}
