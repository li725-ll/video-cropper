declare interface IRenderVideoInfo {
  renderWidth: number;
  renderHeight: number;
  displayProportion: number;
  realProportion: number;
  displayProportion: number; // 视频比例，渲染/真实
  realProportion: numbe; // 真实比例，真实/渲染
  renderX: number;
  renderY: number;
  renderWidth: number;
  renderHeight: number;
}

declare interface IGrabInfo {
  grab: boolean;
  grabX: number;
  grabY: number;
}

declare interface IVideoInfo extends IRenderVideoInfo {
  elementWidth: number;
  elementHeight: number;
  duration: number;
  videoWidth: number;
  videoHeight: number;
}
