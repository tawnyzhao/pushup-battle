import React, { useEffect } from 'react';
import {
  drawConnectors,
  drawLandmarks,
} from '@mediapipe/drawing_utils/drawing_utils';
import { Camera } from '@mediapipe/camera_utils/camera_utils';
import { Pose } from '@mediapipe/pose/pose';

export default function Cam() {
  useEffect(() => {
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');
    const POSE_CONNECTIONS = [[0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],[9,10],[11,12],[11,13],[13,15],[15,17],[15,19],[15,21],[17,19],[12,14],[14,16],[16,18],[16,20],[16,22],[18,20],[11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28],[27,29],[28,30],[29,31],[30,32],[27,31],[28,32]];
    
    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
          results.image, 0, 0, canvasElement.width, canvasElement.height);
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 4});
      drawLandmarks(canvasCtx, results.poseLandmarks,
                    {color: '#FF0000', lineWidth: 2});
      canvasCtx.restore();
    }
  
    const pose = new Pose({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});

    pose.setOptions({
      upperBodyOnly: false,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    pose.onResults(onResults);
    
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({image: videoElement});
      },
      width: 1280,
      height: 720
    });
    camera.start();

  }, []);



  return (
    <div>
      <video class="input_video"></video>
      <canvas class="output_canvas" width="1280px" height="720px"></canvas>
    </div>
  );
}
