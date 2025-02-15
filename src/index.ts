import "./css/index.css";

import CropBox from "./components/cropbox";
import Canvas from "./components/canvas";

export default class VideCropper {
    private videoElement: HTMLVideoElement;
    private videoInfo: IVideoInfo = {
        elementWidth: 0,
        elementHeight: 0,
        duration: 0,
        videoWidth: 0,
        videoHeight: 0
    };
    private parent: HTMLDivElement | null = null;
    private container: HTMLElement | null = null;
    private canvas: Canvas | null = null;
    private cropBox: CropBox | null = null;

    constructor(root: HTMLVideoElement) {
        this.videoElement = root;
        this.init();
    }

    init() {
        this.videoInfo = {
            elementWidth: this.videoElement.width,
            elementHeight: this.videoElement.height,
            duration: this.videoElement.duration,
            videoWidth: this.videoElement.videoWidth,
            videoHeight: this.videoElement.videoHeight
        };
        this.parent = document.createElement("div"); // 创建一个父级容器
        this.container = this.videoElement.parentElement!; // 获取video标签的原始父级容器
        this.container.appendChild(this.parent);

        this.parent.setAttribute("class", "video-cropper-parent");
        this.parent.appendChild(this.videoElement);
        this.parent.setAttribute("style", `width: ${this.videoInfo.elementWidth}px; height: ${this.videoInfo.elementHeight}px;`);
        this.canvas = new Canvas(this.parent, this.videoInfo);
        this.cropBox = new CropBox(this.parent, this.videoInfo);
        this.cropBox?.setDrawCropBoxFunc((x: number, y: number, width: number, height: number) => {
            this.canvas?.drawCropbox(x, y, width, height);
        });
    }

    play() {
        this.videoElement.play();
    }

    crop() {
    }
}
