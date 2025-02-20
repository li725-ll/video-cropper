import VideoCropper from "../dist/video-cropper-index.es.js";

const videoElement = document.getElementById("video");
const playElement = document.getElementById("play");
const pauseElement = document.getElementById("pause");
const positionElement = document.getElementById("position");
const rangeElement = document.getElementById("range");
const previewElement = document.getElementById("preview");

const videoCropper = new VideoCropper(videoElement, {
  cropboxConfig: {
    aspectRatio: 1
  }
});
const video = videoCropper.getVideo();

videoCropper.setCropBoxPositionFunc((position) => {
  positionElement.innerText = JSON.stringify(position);
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
