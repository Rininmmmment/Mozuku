import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';

import ThreeDModel from './ThreeDModel';
import './styles/web-cam-capture.css';

function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState<number>(1);
  const [animationType, setAnimationType] = useState<number>(0);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        if (isCameraOn) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          // カメラがオフの場合、srcObjectをnullに設定して切断
          if (videoRef.current) {
            const currentStream = videoRef.current.srcObject as MediaStream;
            if (currentStream) {
              const tracks = currentStream.getTracks();
              tracks.forEach((track) => track.stop());
            }
            videoRef.current.srcObject = null;
          }
        }
      } catch (error) {
        console.error('Webカメラにアクセスできませんでした:', error);
      }
    };

    startWebcam();
  }, [isCameraOn]);

  const captureVideoFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video && isCameraOn) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataURL = canvas.toDataURL('image/jpeg');

        const response = await fetch('http://localhost:8000/face-detection', {
          method: 'POST',
          body: JSON.stringify({ image: imageDataURL }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.result === 'Yes') {
            setResult(1);
          } else {
            setResult(0);
          }
        } else {
          console.error('Error sending image for analysis');
        }
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(captureVideoFrame, 15000);

    return () => {
      clearInterval(timer);
    };
  }, [isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  useEffect(() => {
    setAnimationType((prev) => (prev === 0 ? 1 : 0));
  }, [result]);

  return (
    <div className="webcam-container">
      <button className="camera-toggle-btn" onClick={toggleCamera}>
        {isCameraOn ? (
          <FontAwesomeIcon icon={faVideoSlash} style={{ color: "#35566A" }} />
        ) : (
          <FontAwesomeIcon icon={faVideo} style={{ color: "#35566A" }} />
        )}
      </button>
      <video className="webcam-video" ref={videoRef} autoPlay style={{ display: 'none' }} />
      <canvas className="webcam-canvas" ref={canvasRef} style={{ display: 'none' }} />
      <ThreeDModel
          className="3d-model"
          animationType={animationType}
          style={{ visibility: 'visible' }}
        />
      {isCameraOn ? null : (
        <div className="camera-off-container">
          <p className="camera-off-text">Your camera is off.</p>
          <p className="camera-off-text">Mozuku responds correctly only when the camera is on.</p>
        </div>
      )}
    </div>
  );
}

export default WebcamCapture;
