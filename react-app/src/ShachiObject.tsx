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
    camera.position.z = 12;
    camera.position.y = -4;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ライトの設定
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 5;
    directionalLight.position.set(5, -5, 10);
    scene.add(directionalLight);

    // モデルの読み込み
    const gltfLoader = new GLTFLoader();
    const clock = new THREE.Clock();
    gltfLoader.load(
      'shachi-animation.glb',
      function (gltf) {     
        // アニメーションを読み込む
        let mixer = new THREE.AnimationMixer(gltf.scene); 
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });

        scene.add(gltf.scene);

        // アニメーションを更新する関数を定義する
        function update() {
          if (mixer) {
              mixer.update(clock.getDelta());
          }
        }

        // アニメーションを再生するイベントを設定する
        renderer.setAnimationLoop(() => {
          update();
          renderer.render(scene, camera);
        });        
      },
      undefined,
      function (error) {
        console.error("モデルの読み込み中にエラーが発生しました:", error);
    });

    // アニメーションの設定
    function animate() {
      requestAnimationFrame(animate);
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
