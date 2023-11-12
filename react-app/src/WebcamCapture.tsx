import React, { useEffect, useRef, useState } from 'react';
import ThreeDModel from './ShachiObject';

function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState<number>(1);
  const [animationType, setAnimationType] = useState<number>(0);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startWebcam();
  }, []);

  const captureVideoFrame = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
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
    const timer = setInterval(captureVideoFrame, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // アニメーションのタイプが変更されたときにThreeDModelを再描画
  useEffect(() => {
    setAnimationType((prev) => (prev === 0 ? 1 : 0)); // アニメーションをトグルする
  }, [result]);

  return (
    <div>
      <button onClick={captureVideoFrame}>Camera ON</button>
      <video style={{ display: 'none' }} ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <p>もずく: {result === 1 ? '顔が認識されました' : result === 0 ? '顔が認識されませんでした' : '解析中...'}</p>
      <ThreeDModel animationType={animationType} />
    </div>
  );
}

export default WebcamCapture;
