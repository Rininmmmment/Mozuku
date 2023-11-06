import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';


function ThreeDObject() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // シーンの作成
    const scene = new THREE.Scene();

    // カメラの作成
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // レンダラの作成
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    // 立方体の作成
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // アニメーションの設定
    const animate = () => {
      requestAnimationFrame(animate);

      // 立方体を回転させる
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // レンダリング
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />;
}

export default ThreeDObject;

