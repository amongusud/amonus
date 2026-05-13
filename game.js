import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// =========================
// LUZ
// =========================

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// =========================
// CHÃO
// =========================

const floorGeo = new THREE.PlaneGeometry(200, 200);
const floorMat = new THREE.MeshLambertMaterial({
  color: 0x3c9d3c
});

const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// =========================
// BLOCOS
// =========================

const blocks = [];

function createBlock(x, y, z, color = 0x888888) {
  const block = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color })
  );

  block.position.set(x, y, z);

  scene.add(block);
  blocks.push(block);
}

for (let x = -10; x <= 10; x += 2) {
  for (let z = -10; z <= 10; z += 2) {
    createBlock(x, 0.5, z, 0x777777);
  }
}

createBlock(0, 2, -5, 0xff0000);
createBlock(2, 2, -8, 0x0000ff);
createBlock(-3, 2, -6, 0xffff00);

// =========================
// PLAYER
// =========================

const player = {
  height: 1.8,
  speed: 0.12,
  velocityY: 0,
  jumpForce: 0.22,
  gravity: 0.012,
  canJump: true
};

camera.position.set(0, player.height, 5);

// =========================
// CONTROLES
// =========================

const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;

  if (e.code === 'Space' && player.canJump) {
    player.velocityY = player.jumpForce;
    player.canJump = false;
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// =========================
// POINTER LOCK
// =========================

const menu = document.getElementById('menu');

menu.addEventListener('click', () => {
  document.body.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === document.body) {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
  }
});

// =========================
// MOUSE LOOK
// =========================

let pitch = 0;

document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== document.body) return;

  camera.rotation.y -= e.movementX * 0.002;

  pitch -= e.movementY * 0.002;

  pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

  camera.rotation.x = pitch;
});

// =========================
// MOVIMENTO
// =========================

function movePlayer() {
  const direction = new THREE.Vector3();

  if (keys['KeyW']) direction.z -= 1;
  if (keys['KeyS']) direction.z += 1;
  if (keys['KeyA']) direction.x -= 1;
  if (keys['KeyD']) direction.x += 1;

  direction.normalize();

  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);

  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

  camera.position.add(forward.multiplyScalar(direction.z * player.speed));
  camera.position.add(right.multiplyScalar(direction.x * player.speed));

  // gravidade
  player.velocityY -= player.gravity;
  camera.position.y += player.velocityY;

  // chão
  if (camera.position.y < player.height) {
    camera.position.y = player.height;
    player.velocityY = 0;
    player.canJump = true;
  }
}

// =========================
// ANIMAÇÃO
// =========================

function animate() {
  requestAnimationFrame(animate);

  movePlayer();

  renderer.render(scene, camera);
}

animate();

// =========================
// RESIZE
// =========================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
