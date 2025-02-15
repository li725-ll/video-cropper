class CropBox {
    private anchors: HTMLElement[] = [];
    private cropBox: HTMLElement;
    private parent: HTMLElement | null;
    private mouseDown: boolean = false;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private cropBoxStyle: string = "";
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

    constructor(parent: HTMLElement | null) {
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
        this.updateStyle();
        this.parent?.appendChild(this.cropBox);

        this.cropBox.addEventListener("mousedown", (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.mouseDown = true;
            this.originalPosition.x = this.position.x;
            this.originalPosition.y = this.position.y;
        });

        this.cropBox.addEventListener("mouseup", (e) => {
            this.mouseDown = false;
        });

        this.cropBox.addEventListener("mouseleave", (e) => {
            this.mouseDown = false;
        });

        this.cropBox.addEventListener("mousemove", (e) => {
            if (this.mouseDown) {
                this.position.x = this.originalPosition.x + (e.clientX - this.mouseX);
                this.position.y = this.originalPosition.y + (e.clientY - this.mouseY);
                this.updateStyle();
            }
        });
    }

    updateStyle() {
        this.cropBoxStyle = `
            --crop-box-left: ${this.position.x}px;
            --crop-box-top: ${this.position.y}px;
        `;
        this.cropBox.setAttribute("style", this.cropBoxStyle);
    }
};

export default CropBox;