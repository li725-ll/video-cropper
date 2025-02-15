class CropBox {
    private anchors: HTMLElement[] = [];
    private cropBox: HTMLElement;
    private parent: HTMLElement | null;
    private mouseDown: boolean = false;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private cropBoxStyle: string = "";
    private drawCropbox: IDrawCropBoxFunc = () =>{};
    private originalPosition: IPosition = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    private position: IPosition = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    private videoInfo: IVideoInfo = {
        elementWidth: 0,
        elementHeight: 0,
        duration: 0,
        videoWidth: 0,
        videoHeight: 0
    }
    private borderLimit: IBorderLimit = {
        startX: 0,
        endX: 0,
        startY: 0,
        endY: 0
    };

    constructor(parent: HTMLElement | null, videoInfo: IVideoInfo) {
        this.parent = parent;
        this.cropBox = document.createElement("div");
        this.cropBox.setAttribute("class", "video-cropper-crop-box");
        this.anchors = Array(8).fill(null);
        this.anchors = this.anchors.map((_, index) => {
            const anchor = document.createElement("div")
            anchor.setAttribute("class", `video-cropper-anchor-${index} video-cropper-anchor`);
            this.cropBox.appendChild(anchor);
            return anchor;
        });
        this.videoInfo = videoInfo;
        this.position = {
            x: this.videoInfo.elementWidth * 0.5 / 2,
            y: this.videoInfo.elementWidth * 0.5 / 2,
            width: this.videoInfo.elementWidth * 0.5,
            height: this.videoInfo.elementHeight * 0.5
        };
        this.borderLimit = {
            startX: 0,
            endX: this.videoInfo.elementWidth - this.position.width,
            startY: 0,
            endY: this.videoInfo.elementHeight - this.position.height,
        };
        this.updateStyle();
        this.parent?.appendChild(this.cropBox);
        this.registerEvent();
    }

    registerEvent() {
        this.cropBox.addEventListener("mousedown", (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.mouseDown = true;
            this.originalPosition.x = this.position.x;
            this.originalPosition.y = this.position.y;
            this.originalPosition.width = this.position.width;
            this.originalPosition.height = this.position.height;
        });

        this.cropBox.addEventListener("mouseup", (e) => {
            this.mouseDown = false;
        });

        this.cropBox.addEventListener("mouseleave", (e) => {
            this.mouseDown = false;
        });

        this.cropBox.addEventListener("mousemove", (e) => {
            if (this.mouseDown) {
                const x = this.originalPosition.x + (e.clientX - this.mouseX);
                const y = this.originalPosition.y + (e.clientY - this.mouseY);
                if (
                    (x >= this.borderLimit.startX && x <= this.borderLimit.endX) &&
                    (y >= this.borderLimit.startY && y <= this.borderLimit.endY)
                ) {
                    this.position.x = x;
                    this.position.y = y;
                    this.updateStyle();
                    this.drawCropbox(this.position.x, this.position.y, this.position.width, this.position.height);
                }
            }
        });
    }

    updateStyle() {
        this.cropBoxStyle = `
            --crop-box-left: ${this.position.x}px;
            --crop-box-top: ${this.position.y}px;
            --crop-box-width: ${this.position.width}px;
            --crop-box-height: ${this.position.height}px;
        `;
        this.cropBox.setAttribute("style", this.cropBoxStyle);
    }

    setDrawCropBoxFunc(drawCropbox: IDrawCropBoxFunc){
        this.drawCropbox = drawCropbox;
    };
};

export default CropBox;