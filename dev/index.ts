import VideCropper from "../src";

const videoElement = document.getElementById("video") as HTMLVideoElement;
const playElement = document.getElementById("play") as HTMLButtonElement;
const positionElement = document.getElementById("position") as HTMLDivElement;
const rangeElement = document.getElementById("range") as HTMLInputElement;

const videoCropper = new VideCropper(videoElement);
const video = videoCropper.getVideo();

videoCropper.setCropBoxPositionFunc((position) => {
  positionElement.innerText = (JSON.stringify(position));
});

playElement.addEventListener("click", () => {
  video.play();
});

rangeElement.addEventListener("input", () => {
  const time = parseFloat(rangeElement.value) / 100 * video.duration;
  video.setCurrentTime(time);
});
