import VideoCropper from "../dist/video-cropper-index.es.js";
var videoElement = document.getElementById("video");
var playElement = document.getElementById("play");
var pauseElement = document.getElementById("pause");
var positionElement = document.getElementById("position");
var rangeElement = document.getElementById("range");
var previewElement = document.getElementById("preview");
var exitPreviewElement = document.getElementById("exit-preview");
var scaleMax = document.getElementById("scale-max");
var scaleMin = document.getElementById("scale-min");
var videoCropper = new VideoCropper(videoElement, {
    cropBoxConfig: {
        aspectRatio: 1
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
var video = videoCropper.getVideo();
videoCropper.setCropBoxPositionFunc(function (nativePosition, renderPosition) {
    positionElement.innerText = "".concat(JSON.stringify(nativePosition), " ").concat(JSON.stringify(renderPosition));
});
playElement.addEventListener("click", function () {
    video.play();
});
pauseElement.addEventListener("click", function () {
    video.pause();
});
rangeElement.addEventListener("input", function () {
    var time = (parseFloat(rangeElement.value) / 100) * video.duration;
    video.setCurrentTime(time);
});
previewElement.addEventListener("click", function () {
    video.preview();
});
exitPreviewElement.addEventListener("click", function () {
    video.exitPreview();
});
videoCropper.getVideo().setUpdateCallback(function (e) {
    console.log(e);
});
scaleMax.addEventListener("click", function () {
    videoCropper.scale(0.1);
});
scaleMin.addEventListener("click", function () {
    videoCropper.scale(-0.1);
});
