import * as THREE from 'three';
import './style.css';

const tg = window.Telegram?.WebApp;
tg?.ready?.();
tg?.expand?.();
tg?.setHeaderColor?.('#182235');
tg?.setBackgroundColor?.('#182235');

const app = document.querySelector('#app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8796a3);
scene.fog = new THREE.Fog(0x8796a3, 8, 23);

const camera = new THREE.PerspectiveCamera(72, innerWidth/innerHeight, 0.1, 80);
camera.position.set(0, 1.65, 5.2);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({antialias:false});
renderer.setSize(Math.max(320,Math.floor(innerWidth/2)), Math.max(240,Math.floor(innerHeight/2)), false);
renderer.domElement.style.width='100%';
renderer.domElement.style.height='100%';
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffe8c4,0x4d5b6d,2.0));
const light = new THREE.DirectionalLight(0xffd9a0,2.2); light.position.set(-4,8,5); scene.add(light);

const mat=(color)=>new THREE.MeshLambertMaterial({color});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(16,16),mat(0x9c7957));
floor.rotation.x=-Math.PI/2; floor.position.y=0; scene.add(floor);
const grid = new THREE.GridHelper(16,16,0x6e513c,0x806044); grid.position.y=.012; scene.add(grid);

function wall(x,y,z,w,h,d,color=0xd8c7a4){
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);scene.add(m);return m;
}
// Lobby shell and openings
wall(0,1.5,-4,12,3,.25,0xc8b58f);
wall(-6,1.5,0,.25,3,8,0xb99f78);
wall(6,1.5,0,.25,3,8,0xb99f78);
wall(-3,1.5,4,.25,3,0.25,0xb99f78);
wall(3,1.5,4,.25,3,.25,0xb99f78);
wall(-4.5,1.5,-.3,3,3,.2,0xd8c7a4);
wall(4.5,1.5,-.3,3,3,.2,0xd8c7a4);
// Ceiling beams, lamps, reception desk, plants, posters
for(let x=-5;x<=5;x+=2.5){wall(x,2.95,0,0.08,.08,7,0x80694e)}
wall(0,.55,-2.7,2.8,1.1,.75,0x694c38);
wall(0,1.12,-2.7,3,.12,.9,0xd7b66d);
wall(-4,.6,-2, .65,1.2,.65,0x55765c);
wall(-4,1.45,-2,.95,.5,.95,0x4f8b61);
wall(4,.6,-2,.65,1.2,.65,0x55765c);
wall(4,1.45,-2,.95,.5,.95,0x4f8b61);
wall(-2,2.05,-3.82,1.2,.7,.08,0x41617b);
wall(2,2.05,-3.82,1.2,.7,.08,0x41617b);

function makeNPC(name,role,x,z,shirt,pants){
 const group=new THREE.Group();
 const body=new THREE.Mesh(new THREE.BoxGeometry(.48,.62,.28),mat(shirt));body.position.y=.95;group.add(body);
 const head=new THREE.Mesh(new THREE.BoxGeometry(.4,.4,.38),mat(0xe6b58b));head.position.y=1.48;group.add(head);
 const hair=new THREE.Mesh(new THREE.BoxGeometry(.42,.16,.4),mat(0x513a2c));hair.position.set(0,1.7,-.015);group.add(hair);
 const legs=new THREE.Mesh(new THREE.BoxGeometry(.42,.48,.26),mat(pants));legs.position.y=.4;group.add(legs);
 const badge=new THREE.Mesh(new THREE.BoxGeometry(.16,.1,.03),mat(0xf1d27c));badge.position.set(0,1.03,.15);group.add(badge);
 group.position.set(x,0,z);scene.add(group);
 group.userData={name,role,baseY:0,phase:Math.random()*6};
 return group;
}
const npcs=[
 makeNPC('Bongoy','STAFF KREATIF',-2.1,0.1,0x4d91a8,0x34445a),
 makeNPC('Konek','ADMINISTRASI',2.0,-.2,0xb86b54,0x39465a)
];

const keys={forward:0,side:0};let yaw=0,pitch=0,started=false,nearby=null;
const clock=new THREE.Clock();
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function update(dt){
 if(!started)return;
 const speed=2.5;
 const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
 const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
 const move=forward.multiplyScalar(keys.forward).add(right.multiplyScalar(keys.side));
 if(move.length()>1)move.normalize();
 camera.position.addScaledVector(move,speed*dt);
 camera.position.x=clamp(camera.position.x,-5.3,5.3);
 camera.position.z=clamp(camera.position.z,-3.4,3.4);
 camera.position.y=1.65;
 camera.rotation.set(pitch,yaw,0,'YXZ');
 let min=99;nearby=null;
 for(const npc of npcs){const d=npc.position.distanceTo(camera.position);if(d<min){min=d;nearby=npc}}
 document.querySelector('#interactBtn').style.opacity=min<2.5?'1':'.55';
 document.querySelector('#hint').textContent=min<2.5?`Tekan INTERAKSI untuk menyapa ${nearby.userData.name}`:'Gunakan joystick untuk berjalan';
 npcs.forEach(n=>{n.position.y=Math.sin(clock.elapsedTime*2+n.userData.phase)*.025});
}
function loop(){requestAnimationFrame(loop);update(Math.min(clock.getDelta(),.05));renderer.render(scene,camera)}loop();

document.querySelector('#enterBtn').onclick=()=>{started=true;document.querySelector('#startScreen').classList.add('hidden');tg?.HapticFeedback?.impactOccurred?.('light')};
function openNPC(){
 if(!nearby || nearby.position.distanceTo(camera.position)>2.5)return;
 const u=nearby.userData;
 document.querySelector('#npcName').textContent=u.name;
 document.querySelector('#npcRole').textContent=u.role;
 document.querySelector('#npcLine').textContent=u.name==='Bongoy'?'Wah, akhirnya direktur datang! Ada kabar apa hari ini?':'Pagi! Gue lagi santai sebentar. Mau ngobrol?';
 document.querySelector('#dialog').classList.remove('hidden');
}
document.querySelector('#interactBtn').onclick=openNPC;
document.querySelector('#closeDialog').onclick=()=>document.querySelector('#dialog').classList.add('hidden');
document.querySelector('#byeBtn').onclick=()=>document.querySelector('#dialog').classList.add('hidden');
document.querySelector('#talkBtn').onclick=()=>{document.querySelector('#npcLine').textContent='Asyik, ayo ngobrol! Fitur percakapan AI akan ditambahkan pada tahap berikutnya.'};
document.querySelector('#mapBtn').onclick=()=>document.querySelector('#mapPanel').classList.remove('hidden');
document.querySelector('#closeMap').onclick=()=>document.querySelector('#mapPanel').classList.add('hidden');

// Touch joystick
const joy=document.querySelector('#joystick'),stick=document.querySelector('#stick');
let joyId=null;
function joyMove(e){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=35,l=Math.hypot(dx,dy);if(l>max){dx=dx/l*max;dy=dy/l*max}stick.style.transform=`translate(${dx}px,${dy}px)`;keys.side=dx/max;keys.forward=-dy/max}
joy.addEventListener('pointerdown',e=>{joyId=e.pointerId;joy.setPointerCapture(joyId);joyMove(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId)joyMove(e)});
function joyEnd(){joyId=null;keys.side=keys.forward=0;stick.style.transform='translate(0,0)'}
joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);

// Drag right side to look around; desktop mouse drag also works
let lookId=null,lastX=0,lastY=0;
renderer.domElement.addEventListener('pointerdown',e=>{if(e.clientX>innerWidth*.42){lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(lookId)}});
renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerId===lookId){const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*.005;pitch=clamp(pitch-dy*.004,-.65,.65)}});
renderer.domElement.addEventListener('pointerup',()=>lookId=null);renderer.domElement.addEventListener('pointercancel',()=>lookId=null);
addEventListener('keydown',e=>{if(e.key==='w'||e.key==='ArrowUp')keys.forward=1;if(e.key==='s'||e.key==='ArrowDown')keys.forward=-1;if(e.key==='a'||e.key==='ArrowLeft')keys.side=-1;if(e.key==='d'||e.key==='ArrowRight')keys.side=1;if(e.key==='e')openNPC()});
addEventListener('keyup',e=>{if(['w','s','ArrowUp','ArrowDown'].includes(e.key))keys.forward=0;if(['a','d','ArrowLeft','ArrowRight'].includes(e.key))keys.side=0});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(Math.max(320,Math.floor(innerWidth/2)),Math.max(240,Math.floor(innerHeight/2)),false)});

// Prevent accidental page gestures inside the game
document.addEventListener('contextmenu',e=>e.preventDefault());
