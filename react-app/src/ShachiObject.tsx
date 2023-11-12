import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function ThreeDModel({ animationType }: { animationType: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // シーンの設定
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // カメラの設定
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ライトの設定
    const directionalLight1 = new THREE.DirectionalLight(0xffffff);
    directionalLight1.intensity = 3;
    directionalLight1.position.set(-10, -10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.intensity = 3;
    directionalLight2.position.set(10, 10, 10);
    scene.add(directionalLight2);

    // モデルの読み込み
    const gltfLoader = new GLTFLoader();
    const clock = new THREE.Clock();

    const loadModel = () => {
      gltfLoader.load(
        'shachi-swim-nod.glb',
        function (gltf) {
          if (mixer) {
            mixer.stopAllAction();
          }

          const animations = gltf.animations;
          const newMixer = new THREE.AnimationMixer(gltf.scene);
          setMixer(newMixer);

          const selectedAnimation = animations[animationType];
          const anime = newMixer.clipAction(selectedAnimation);
          anime.play();

          scene.add(gltf.scene);

          function update() {
            if (newMixer) {
              newMixer.update(clock.getDelta());
            }
          }

          renderer.setAnimationLoop(() => {
            update();
            renderer.render(scene, camera);
          });
        },
        undefined,
        function (error) {
          console.error("モデルの読み込み中にエラーが発生しました:", error);
        }
      );
    };

    loadModel();

    // ウィンドウのリサイズ時にCanvasのサイズを調整
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  }, [animationType]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}

export default ThreeDModel;