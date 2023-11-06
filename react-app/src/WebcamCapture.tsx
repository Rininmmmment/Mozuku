import React, { useEffect, useRef, useState } from 'react';

function WebcamCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [result, setResult] = useState<string>('');

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

        // Canvasから画像データを取得
        const imageDataURL = canvas.toDataURL('image/jpeg');

        // 画像データを送信
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
            setResult('会いに来てくれたんだね！嬉しいにゃ〜');
          } else {
            setResult('遊んでくれなくて悲しいにゃ...');
          }
        } else {
          console.error('Error sending image for analysis');
        }
      }
    }
  };

  useEffect(() => {
    // 10秒ごとにcaptureVideoFrameを呼び出すタイマーを設定
    const timer = setInterval(captureVideoFrame, 10000);

    // コンポーネントがアンマウントされたときにタイマーをクリア
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <button onClick={captureVideoFrame}>Capture and Analyze</button>
      <video style={{ display: 'none' }} ref={videoRef} autoPlay />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <p>もずく: {result}</p>
    </div>
  );
}

export default WebcamCapture;