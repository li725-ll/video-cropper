# video-cropper

This is a simple video editor for framing video areas (no video clips, just a UI selector).

## Install

```bash
npm install video-cropper
```

## Example

```html
<video
	src="https://www.runoob.com/try/demo_source/mov_bbb.mp4"
    id="video"
    width="400"
    height="200"
></video>
```

```js
const videoElement = document.getElementById("video");
const videoCropper = new VideoCropper(videoElement, {
  cropBoxConfig: {
    aspectRatio: 1,
    rate: 0.8,
    disengage: true
  },
  videoConfig: {
    muted: true
  }
});
```

## API

### VideoCropper

+ getVideo
+ getConstraintBox
+ getCropBox
+ scale
+ reset
+ setCropBoxPositionFunc
+ setConstraintBoxPositionFunc

### Video

+ play
+ preview
+ exitPreview
+ pause
+ setUpdateCallback

### ConstraintBox

+ getConstraintBoxPosition

