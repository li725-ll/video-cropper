import VideoCropper from "../src";

const videoElement = document.getElementById("video") as HTMLVideoElement;
const playElement = document.getElementById("play") as HTMLButtonElement;
const pauseElement = document.getElementById("pause") as HTMLButtonElement;
const containerPositionElement = document.getElementById(
  "container-position"
) as HTMLDivElement;
const cropperPositionElement = document.getElementById(
  "cropper-position"
) as HTMLDivElement;
const rangeElement = document.getElementById("range") as HTMLInputElement;
const previewElement = document.getElementById("preview") as HTMLButtonElement;
const exitPreviewElement = document.getElementById(
  "exit-preview"
) as HTMLButtonElement;
const resetElement = document.getElementById("reset") as HTMLButtonElement;
const scaleMax = document.getElementById("scale-max") as HTMLVideoElement;
const scaleMin = document.getElementById("scale-min") as HTMLVideoElement;
const getMapPosition = document.getElementById("get-map-position") as HTMLButtonElement;

const videoCropper = new VideoCropper(videoElement, {
  cropBoxConfig: {
    aspectRatio: 2,
    rate: 0.8,
    disengage: true,
    // position: {
    //   x: 0,
    //   y: 0,
    //   width: 100,
    //   height: 200
    // }
  },
  videoConfig: {
    muted: true
  },
  constraintBoxConfig: {
    // position: {
    //   x: 0,
    //   y: 0,
    //   width: 800, // 800
    //   height: 440 // 440
    // }
  }
});
const video = videoCropper.getVideo();

videoCropper.setCropBoxPositionFunc((nativePosition, renderPosition) => {
  cropperPositionElement.innerText = `${JSON.stringify(nativePosition)} ${JSON.stringify(renderPosition)}`;
});

videoCropper.setConstraintBoxPositionFunc((positon) => {
  containerPositionElement.innerText = `${JSON.stringify(positon)}`;
});

playElement.addEventListener("click", () => {
  video.play();
});

pauseElement.addEventListener("click", () => {
  video.pause();
});

rangeElement.addEventListener("input", () => {
  const time = (parseFloat(rangeElement.value) / 100) * video.duration;
  video.setCurrentTime(time);
});

previewElement.addEventListener("click", () => {
  video.preview();
});

exitPreviewElement.addEventListener("click", () => {
  video.exitPreview();
});

videoCropper.getVideo().setUpdateCallback((e) => {
  console.log(e);
});

resetElement.addEventListener("click", () => {
  videoCropper.reset();
});

scaleMax.addEventListener("click", () => {
  videoCropper.scale(0.1);
});

scaleMin.addEventListener("click", () => {
  videoCropper.scale(-0.1);
});

getMapPosition.addEventListener("click", () => {
  const nativePosition = videoCropper.getCropBox().getMapPosition();
  const renderPosition = videoCropper.getCropBox().getPosition();
  cropperPositionElement.innerText = `${JSON.stringify(nativePosition)} ${JSON.stringify(renderPosition)}`;
});
