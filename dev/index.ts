import VideCropper from "../src";

const videoElement = document.getElementById("video") as HTMLVideoElement;
const playElement = document.getElementById("play") as HTMLButtonElement;
const positionElement = document.getElementById("position") as HTMLDivElement;

const videoCropper = new VideCropper(videoElement);
videoCropper.setCropBoxPositionFunc((position) => {
  positionElement.innerText = (JSON.stringify(position));
});
playElement.addEventListener("click", () => {
  videoCropper.play();
});
