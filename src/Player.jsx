import * as THREE from 'three';

export default function createPlayer(scene, { position = new THREE.Vector3(0, 4, 0), size = 1.5, color = 0xffaa00 } = {}) {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  // используем MeshBasicMaterial, чтобы сфера светилась независимо от освещения
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  mesh.position.copy(position);

  scene.add(mesh);

  const dispose = () => {
    try {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    } catch (e) {
    //   ignore disposal errors
    }
  };

  return { mesh, dispose };
}
