export interface IRenderVideoInfo {
    renderWidth: number;
    renderHeight: number;
    displayProportion: number;
    realProportion: number;
    renderX: number;
    renderY: number;
}
export interface IGrabInfo {
    grab: boolean;
    grabX: number;
    grabY: number;
    originPosition?: {
        x: number;
        y: number;
    };
}
export interface IVideoInfo extends IRenderVideoInfo {
    elementWidth: number;
    elementHeight: number;
    duration: number;
    videoWidth: number;
    videoHeight: number;
}
