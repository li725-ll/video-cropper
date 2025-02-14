import VideCropper from "../src";

const videoElement = document.getElementById("video") as HTMLVideoElement;
const playElement = document.getElementById("play") as HTMLButtonElement;

const videoCropper = new VideCropper(videoElement);
// videoCropper.play();
playElement.addEventListener("click", () => {
    videoCropper.play();
});
