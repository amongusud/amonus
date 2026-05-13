import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// player
const player = new THREE.Group();
scene.add(player);
player.add(camera);
player.position.y = 1.6;

// floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200,200),
  new THREE.MeshLambertMaterial({ color:0x3a8f3a })
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// light
scene.add(new THREE.AmbientLight(0xffffff,0.6));

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,20,10);
scene.add(light);

// controls
let keys = {};
let velocity = new THREE.Vector3();
let dir = new THREE.Vector3();
let canJump = false;

document.addEventListener("keydown",e=>keys[e.code]=true);
document.addEventListener("keyup",e=>keys[e.code]=false);

// mouse
let yaw=0,pitch=0;

document.addEventListener("mousemove",e=>{
  if(document.pointerLockElement!==document.body)return;

  yaw -= e.movementX*0.002;
  pitch -= e.movementY*0.002;

  pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,pitch));

  player.rotation.y=yaw;
  camera.rotation.x=pitch;
});

// menu
document.getElementById("menu").onclick=()=>{
  document.body.requestPointerLock();
};

document.addEventListener("pointerlockchange",()=>{
  document.getElementById("menu").style.display =
    document.pointerLockElement?"none":"flex";
});

// loop
let prev=performance.now();

function animate(){
  requestAnimationFrame(animate);

  const now=performance.now();
  const dt=Math.min((now-prev)/1000,0.1);

  velocity.x-=velocity.x*10*dt;
  velocity.z-=velocity.z*10*dt;
  velocity.y-=20*dt;

  dir.z=Number(keys["KeyW"])-Number(keys["KeyS"]);
  dir.x=Number(keys["KeyD"])-Number(keys["KeyA"]);
  dir.normalize();

  const speed=35;

  velocity.x+=dir.x*speed*dt;
  velocity.z+=dir.z*speed*dt;

  if(keys["Space"]&&canJump){
    velocity.y=7;
    canJump=false;
  }

  player.translateX(-velocity.x*dt);
  player.translateZ(-velocity.z*dt);
  player.position.y+=velocity.y*dt;

  if(player.position.y<1.6){
    player.position.y=1.6;
    velocity.y=0;
    canJump=true;
  }

  renderer.render(scene,camera);
  prev=now;
}

animate();

addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
