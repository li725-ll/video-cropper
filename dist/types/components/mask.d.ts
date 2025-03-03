import { IVideoInfo } from "../types";
declare class Mask {
    private parent;
    private videoInfo;
    private maskElement;
    private maskComponents;
    private zIndex;
    constructor(parent: HTMLElement, videoInfo: IVideoInfo);
    private init;
    show(zIndex?: number): void;
    hide(): void;
    topComponent(height: number): void;
    rightComponent(width: number): void;
    bottomComponent(height: number): void;
    leftComponent(width: number): void;
    private updateStyle;
}
export default Mask;
