import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function ThreeDModel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // シーンの設定
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x4682b4 );

    // カメラの設定
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = -1;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ライトの設定
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 5;
    directionalLight.position.set(5, -5, 10);
    scene.add(directionalLight);

    // モデルの読み込み
    const objLoader = new GLTFLoader();
    objLoader.load('shachi.glb', function (obj) {      
      modelRef.current = obj.scene;
      scene.add(obj.scene);
      animate();
    },
    undefined,
    function (error) {
      console.error("モデルの読み込み中にエラーが発生しました:", error);
    });

    // アニメーションの設定
    function animate() {
      requestAnimationFrame(animate);

      if (modelRef.current) {
        modelRef.current.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      // ウィンドウのリサイズ時にCanvasのサイズを調整
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}

export default ThreeDModel;
