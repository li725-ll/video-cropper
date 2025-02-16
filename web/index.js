import VideoCropper from "../dist/video-cropper-index.es.js";

const videoElement = document.getElementById("video");
const playElement = document.getElementById("play");
const positionElement = document.getElementById("position");

const videoCropper = new VideoCropper(videoElement);
playElement.addEventListener("click", () => {
  videoCropper.play();
});

videoCropper.setCropBoxPositionFunc((position) => {
  positionElement.innerText = (JSON.stringify(position));
});
