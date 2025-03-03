import { IVideoInfo } from "../types";

class Mask {
  private parent: HTMLElement;
  private videoInfo: IVideoInfo;
  private maskElement: HTMLDivElement | null = null;
  private maskComponents: HTMLDivElement[] | null = null;
  private zIndex = 0;

  constructor(parent: HTMLElement, videoInfo: IVideoInfo) {
    this.parent = parent;
    this.videoInfo = videoInfo;
    this.init();
  }

  private init() {
    this.maskElement = document.createElement("div");
    this.maskElement.setAttribute("class", "video-cropper-mask");

    const container = document.createElement("div");
    container.setAttribute("class", "video-cropper-mask-container");
    this.maskComponents = Array.from({ length: 4 }, () =>
      document.createElement("div")
    );
    this.maskComponents.forEach((maskComponent, index) => {
      maskComponent.setAttribute(
        "class",
        `video-cropper-mask-component-${index}`
      );
      container.appendChild(maskComponent);
    });
    this.maskElement.appendChild(container);
    this.parent.appendChild(this.maskElement);
    this.updateStyle();
    this.leftComponent(0);
    this.rightComponent(0);
    this.bottomComponent(0);
    this.topComponent(0);
  }

  public show(zIndex = 1) {
    this.zIndex = zIndex;
    this.updateStyle();
  }

  public hide() {
    this.zIndex = 0;
    this.leftComponent(0);
    this.rightComponent(0);
    this.bottomComponent(0);
    this.topComponent(0);
    this.updateStyle();
  }

  public topComponent(height: number) {
    const style = `
      --height: ${height}px;
    `;
    this.maskComponents![0].setAttribute("style", style);
  }

  public rightComponent(width: number) {
    const style = `
      --width: ${width}px;
    `;
    this.maskComponents![1].setAttribute("style", style);
  }

  public bottomComponent(height: number) {
    const style = `
      --height: ${height}px;
    `;
    this.maskComponents![2].setAttribute("style", style);
  }

  public leftComponent(width: number) {
    const style = `
      --width: ${width}px;
    `;
    this.maskComponents![3].setAttribute("style", style);
  }

  private updateStyle() {
    const style = `
      --color: rgba(0, 0, 0, 1);
      --video-cropper-mask-z-index: ${this.zIndex};
      --video-cropper-mask-width: ${this.videoInfo.renderWidth}px;
      --video-cropper-mask-height: ${this.videoInfo.renderHeight}px;
      --video-cropper-mask-x: ${this.videoInfo.renderX}px;
      --video-cropper-mask-y: ${this.videoInfo.renderY}px;
    `;

    this.maskElement!.setAttribute("style", style);
  }
}

export default Mask;
