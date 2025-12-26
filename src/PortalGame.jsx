import React from "react";
import * as THREE from 'three';
import { useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import './PortalGame.css'
import createPlayer from './Player';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function PortalGame() {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 1000);


// После создания scene, добавьте:
const portals = []; // тут будем хранить только СИНИЕ КРУГИ
// Загрузка портала
const loader = new GLTFLoader();
// Функция для создания портала
const createPortal = (x, y, z, scale = 20, rotationY = 0) => {
  loader.load(
    '/textures/magic_portal/scene.gltf',
    (gltf) => {
      const portal = gltf.scene;
      
      // ПОЗИЦИЯ
      portal.position.set(x, y, z);
      
      // РАЗМЕР (увеличиваем!)
      portal.scale.set(scale, scale, scale);
      
      // ПОВОРОТ (опционально)
      portal.rotation.y = rotationY; // повернуть на 90 градусов
      
      scene.add(portal);
      console.log(`Portal created at (${x}, ${y}, ${z})`);

      let blueCore = null;

portal.traverse((child) => {
  if (!child.isMesh || !child.material) return;

  // если материал массив
  const materials = Array.isArray(child.material)
    ? child.material
    : [child.material];

  materials.forEach((mat) => {
    mat.transparent = false;
    mat.opacity = 1;
    mat.color?.multiplyScalar(1.5);

    if (mat.emissive) {
      mat.emissive.set(0x00aaff);
      mat.emissiveIntensity = 6;
      blueCore = child;
    }

    mat.needsUpdate = true;
  });
});

// сохраняем ТОЛЬКО синий круг
if (blueCore) {
  blueCore.userData.rotateSpeed = 0.02;
  portals.push(blueCore);
}
    },
    
    undefined,
    (error) => console.error('Error loading portal:', error)
  );
};
createPortal(90, 20, -200, 20);
createPortal(200, 20, 0, 20, Math.PI/2);
createPortal(0, 20, 100, 20);
createPortal(-200, 20, 0, 20, Math.PI/2);

    // Создаём плоскость с большим числом сегментов и немного смещаем вершины
    const geo = new THREE.PlaneGeometry(4000, 4000, 200, 200); // большое разрешение для текстуры
    geo.computeVertexNormals();

    const ground = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ 
        roughness: 0.9,
        metalness: 0.05,
        side: THREE.DoubleSide,
        
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Освещение (пещера — холодный тон)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x66ccff, 0.8);
    directionalLight.position.set(50, 40, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    scene.add(directionalLight);

    // Добавляем игрока (3D-сферу) — ставим выше максимального подъёма рельефа
    const playerSize = 15; // УВЕЛИЧИЛ размер
    const playerBaseY = 15; // Высота над землёй
    let playerObj = createPlayer(scene, { 
    position: new THREE.Vector3(0, playerBaseY, 0), 
    size: playerSize, 
    color: 0xff00ff // ЯРКИЙ розовый
});


    camera.position.set(0, 200, 160);
    camera.lookAt(0, playerBaseY, 0);

// ОТЛАДОЧНЫЙ КОД - добавьте это:
console.log('=== DEBUG INFO ===');
console.log('Camera position:', camera.position);
console.log('Camera looking at:', new THREE.Vector3(0, 2.5, 0));
console.log('Player position:', playerObj.mesh.position);
console.log('Player size (radius):', playerSize);
console.log('Ground position Y:', ground.position.y);

    // Добавим БОЛЬШОЙ светящийся куб точно в позиции игрока
const debugCube = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 20), // БОЛЬШОЙ
  new THREE.MeshBasicMaterial({ 
    color: 0xff0000, 
    wireframe: false, // НЕ wireframe
    transparent: true,
    opacity: 0.8
  })
);
debugCube.position.copy(playerObj.mesh.position); // ТОЧНО в позиции игрока
// scene.add(debugCube);

// Добавим яркий свет на игрока
const spotLight = new THREE.PointLight(0xffffff, 2, 100);
spotLight.position.set(0, playerBaseY + 20, 0);
scene.add(spotLight);

    // Управление WASD
const keys = { w: false, a: false, s: false, d: false };
const moveSpeed = 1.5; // скорость движения

// Слушатели клавиатуры
const handleKeyDown = (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'ц') keys.w = true;
  if (key === 'a' || key === 'ф') keys.a = true;
  if (key === 's' || key === 'ы') keys.s = true;
  if (key === 'd' || key === 'в') keys.d = true;
};

const handleKeyUp = (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'ц') keys.w = false;
  if (key === 'a' || key === 'ф') keys.a = false;
  if (key === 's' || key === 'ы') keys.s = false;
  if (key === 'd' || key === 'в') keys.d = false;
};

// Обновление позиции игрока в анимационном цикле
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);


    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    // выставим размер рендера в текущий контейнер (защита если clientWidth пустой)
    const setRendererSizeToMount = () => {
      const w = mountRef.current.clientWidth || window.innerWidth;
      const h = mountRef.current.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
    };
    setRendererSizeToMount();

    // Загружаем текстуру земли через ImageLoader и создаём Texture вручную.
    // Это позволяет задать параметры до загрузки в GPU и избежать ошибок
    // WebGL2 про immutable textures (glTexStorage2D).
    const imgLoader = new THREE.ImageLoader();
    imgLoader.load(
      '/textures/ground.jpg',
      (image) => {
        const tex = new THREE.Texture(image);
        tex.encoding = THREE.sRGBEncoding;

        const isPowerOfTwo = (v) => (v & (v - 1)) === 0;
        if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(4, 4);
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
        } else {
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.repeat.set(1, 1);
          tex.generateMipmaps = false;
          tex.minFilter = THREE.LinearFilter;
        }

        try {
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        } catch (e) { /* ignore if not available */ }

        tex.needsUpdate = true;
        if (ground && ground.material) {
          ground.material.map = tex;
          ground.material.needsUpdate = true;
        }
      },
      undefined,
      (err) => console.error('Ошибка загрузки текстуры ground.jpg', err)
    );

    const animate = () => {
      requestAnimationFrame(animate);
      // Анимируем синие круги порталов
      portals.forEach((blueCore) => {
    blueCore.rotation.z += blueCore.userData.rotateSpeed;
  });

  // ДВИЖЕНИЕ ИГРОКА
  if (playerObj && playerObj.mesh) {
    if (keys.w) playerObj.mesh.position.z -= moveSpeed; // вперёд
    if (keys.s) playerObj.mesh.position.z += moveSpeed; // назад
    if (keys.a) playerObj.mesh.position.x -= moveSpeed; // влево
    if (keys.d) playerObj.mesh.position.x += moveSpeed; // вправо

    // Ограничение границ карты
    const limit = 1900; // граница 4000/2 - отступ
    playerObj.mesh.position.x = Math.max(-limit, Math.min(limit, playerObj.mesh.position.x));
    playerObj.mesh.position.z = Math.max(-limit, Math.min(limit, playerObj.mesh.position.z));
    
    // Камера следует за игроком
    camera.position.x = playerObj.mesh.position.x;
    camera.position.z = playerObj.mesh.position.z + 160;
    camera.lookAt(playerObj.mesh.position);
  }
      // простая анимация — покачивание игрока относительно базовой высоты
      if (playerObj && playerObj.mesh) {
        playerObj.mesh.position.y = playerBaseY + Math.sin(Date.now() * 0.002) * 0.6;
      }
      renderer.render(scene, camera);
    };
    animate();
     
// Обработчик изменения размера окна
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => { 
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) { 
        mountRef.current.removeChild(renderer.domElement); 
      } 
      // очистка игрока
      // try { if (playerObj && playerObj.dispose) playerObj.dispose(); } catch (e) {console.log("error disposing player:", e);}
      renderer.dispose(); 
    }; 
  }, []);
  
  return (
    <>
      <div ref={mountRef} className="portal-game"/>
    </>
  )
}