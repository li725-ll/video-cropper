export interface IRenderVideoInfo {
  renderWidth: number;
  renderHeight: number;
  displayProportion: number; // 视频比例，渲染/真实
  realProportion: number; // 真实比例，真实/渲染
  renderX: number;
  renderY: number;
}

export interface IGrabInfo {
  grab: boolean;
  grabX: number;
  grabY: number;
  originPosition?: { x: number; y: number };
}

export interface IVideoInfo extends IRenderVideoInfo {
  elementWidth: number;
  elementHeight: number;
  duration: number;
  videoWidth: number;
  videoHeight: number;
}
