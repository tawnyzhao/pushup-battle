import React, { useEffect, useState } from "react";
import {
  drawConnectors,
  drawLandmarks,
} from "@mediapipe/drawing_utils/drawing_utils";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import { Pose } from "@mediapipe/pose/pose";
import "./Cam.css";

import { STATES, Counter } from "../util/fsm";

let devMode = false;

const POSE_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 7],
  [0, 4],
  [4, 5],
  [5, 6],
  [6, 8],
  [9, 10],
  [11, 12],
  [11, 13],
  [13, 15],
  [15, 17],
  [15, 19],
  [15, 21],
  [17, 19],
  [12, 14],
  [14, 16],
  [16, 18],
  [16, 20],
  [16, 22],
  [18, 20],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [24, 26],
  [25, 27],
  [26, 28],
  [27, 29],
  [28, 30],
  [29, 31],
  [30, 32],
  [27, 31],
  [28, 32],
];

function getState(p1y, p1x, p2y, p2x, p3y, p3x) {
  let downAngle = 2.1;
  let upAngle = 2.4;
  let state = STATES["NONE"];
  let angle = Math.abs(
    Math.atan2(p3y - p1y, p3x - p1x) - Math.atan2(p2y - p1y, p2x - p1x)
  );
  if (angle > upAngle) {
    state = STATES["UP"];
  } else if (angle < downAngle) {
    state = STATES["DOWN"];
  } else {
    state = STATES["NONE"];
  }
  return state;
}

export default function Cam(props) {
  useEffect(() => {
    const videoElement = document.getElementsByClassName("input_video")[0];
    const canvasElement = document.getElementsByClassName("output_canvas")[0];
    const canvasCtx = canvasElement.getContext("2d");

    function onResults(results) {
      let currentState = STATES.NONE;

      if (results.poseLandmarks !== undefined) {
        let leftVisibility =
          (results.poseLandmarks[11].visibility +
            results.poseLandmarks[13].visibility +
            results.poseLandmarks[15].visibility) /
          3;
        let rightVisibility =
          (results.poseLandmarks[12].visibility +
            results.poseLandmarks[14].visibility +
            results.poseLandmarks[16].visibility) /
          3;
        if (leftVisibility > rightVisibility) {
          currentState = getState(
            results.poseLandmarks[13].y,
            results.poseLandmarks[13].x,
            results.poseLandmarks[15].y,
            results.poseLandmarks[15].x,
            results.poseLandmarks[11].y,
            results.poseLandmarks[11].x
          );
        } else {
          currentState = getState(
            results.poseLandmarks[14].y,
            results.poseLandmarks[14].x,
            results.poseLandmarks[16].y,
            results.poseLandmarks[16].x,
            results.poseLandmarks[12].y,
            results.poseLandmarks[12].x
          );
        }

        if (devMode == true) {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
          drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 4,
          });
          drawLandmarks(canvasCtx, results.poseLandmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
          canvasCtx.font = 60 + "px " + "Arial";
          canvasCtx.textAlign = "left";
          canvasCtx.textBaseline = "top";

          canvasCtx.stroke();
          // display state on canvas
          if (results.poseLandmarks[14].visibility < 0.6) {
            canvasCtx.fillText("None", 0, 0);
            canvasCtx.stroke();
          } else if (currentState === STATES.UP) {
            canvasCtx.fillText("Up", 0, 0);
            canvasCtx.stroke();
          } else if (currentState === STATES.DOWN) {
            canvasCtx.fillText("Down", 0, 0);
            canvasCtx.stroke();
          } else {
            canvasCtx.fillText("None", 0, 0);
            canvasCtx.stroke();
          }
        }
      }
      props.onResult(currentState);
      canvasCtx.restore();
    }

    // p1 is axis of angle, p2 and p3 are the arms

    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      upperBodyOnly: true,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.9,
    });
    pose.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  }, [props.onResult]);

  return (
    <div className="container">
      <video className="input_video"></video>
      <canvas className="output_canvas" width="1280px" height="720px"></canvas>
    </div>
  );
}
