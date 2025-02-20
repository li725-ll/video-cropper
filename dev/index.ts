import VideCropper from "../src";

const videoElement = document.getElementById("video") as HTMLVideoElement;
const playElement = document.getElementById("play") as HTMLButtonElement;
const pauseElement = document.getElementById("pause") as HTMLButtonElement;
const positionElement = document.getElementById("position") as HTMLDivElement;
const rangeElement = document.getElementById("range") as HTMLInputElement;
const previewElement = document.getElementById("preview") as HTMLButtonElement;

const videoCropper = new VideCropper(videoElement, {
  cropboxConfig: {
    aspectRatio: 1
  }
});
const video = videoCropper.getVideo();

videoCropper.setCropBoxPositionFunc((position) => {
  positionElement.innerText = (JSON.stringify(position));
});

playElement.addEventListener("click", () => {
  video.play();
});

pauseElement.addEventListener("click", () => {
  video.pause();
});

rangeElement.addEventListener("input", () => {
  const time = parseFloat(rangeElement.value) / 100 * video.duration;
  video.setCurrentTime(time);
});

previewElement.addEventListener("click", () => {
  video.preview();
});
