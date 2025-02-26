import VideoCropper from "../src";

const videoElement = document.getElementById("video") as HTMLVideoElement;
const playElement = document.getElementById("play") as HTMLButtonElement;
const pauseElement = document.getElementById("pause") as HTMLButtonElement;
const positionElement = document.getElementById("position") as HTMLDivElement;
const rangeElement = document.getElementById("range") as HTMLInputElement;
const previewElement = document.getElementById("preview") as HTMLButtonElement;
const exitPreviewElement = document.getElementById(
  "exit-preview"
) as HTMLButtonElement;
const scaleMax = document.getElementById("scale-max") as HTMLVideoElement;
const scaleMin = document.getElementById("scale-min") as HTMLVideoElement;

const videoCropper = new VideoCropper(videoElement, {
  cropBoxConfig: {
    aspectRatio: 1,
    // position: {
    //   x: 0,
    //   y: 0,
    //   width: 100,
    //   height: 100
    // }
  },
  videoConfig: {
    muted: true
  },
  constraintBoxConfig: {
    // position: {
    //   x: 100,
    //   y: 100,
    //   width: 200,
    //   height: 300
    // }
  }
});
const video = videoCropper.getVideo();

videoCropper.setCropBoxPositionFunc((nativePosition, renderPosition) => {
  positionElement.innerText = `${JSON.stringify(nativePosition)} ${JSON.stringify(renderPosition)}`;
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

scaleMax.addEventListener("click", () => {
  videoCropper.scale(0.1);
});

scaleMin.addEventListener("click", () => {
  videoCropper.scale(-0.1);
});
