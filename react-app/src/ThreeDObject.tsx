import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ThreeDObject({ color }: { color: number }) { // colorの型アノテーションを追加
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

    // 平行光源を作成
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 10;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 立方体の作成
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: getColorFromValue(color) });
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
  }, [color]);

  const getColorFromValue = (value: number) => { // valueの型アノテーションを追加
    switch (value) {
      case 0:
        return 0xff00ff; // ピンク
      case 1:
        return 0x00ff00; // 緑
      case 2:
        return 0x0000ff; // 青
      default:
        return 0x00ff00; // デフォルトは緑
    }
  };

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />;
}

export default ThreeDObject;
