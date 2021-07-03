import "./style.css";
import * as THREE from "three";
import backgroundURL from "./black-background.jpg";
import profileURL from "./profile-image.jpg";

let camera, scene, renderer;

let sphere;

let mouseX = 0,
  mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let scrolled = false;
let headerelement = document.getElementById("header");
headerelement.style.margin = "0px";
let rect = headerelement.getBoundingClientRect();
let maxheader = rect.bottom - document.body.getBoundingClientRect().top;
if (window.innerWidth >= 1280) {
  headerelement.style.margin = `${
    (window.innerHeight - rect.bottom + 5) / 2
  }px 0px`;
} else {
  headerelement.style.margin = `${window.innerHeight}px 0px 120px 0px`;
}

document.addEventListener("mousemove", onDocumentMouseMove);
document.addEventListener("scroll", onDocumentScroll);

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    15000
  );
  camera.position.z = 500;
  camera.position.x = 0;
  camera.position.y = 0;

  const backgroundTexture = new THREE.TextureLoader().load(backgroundURL);

  scene = new THREE.Scene();
  scene.background = backgroundTexture;

  const profileTexture = new THREE.TextureLoader().load(profileURL);

  sphere = new THREE.Mesh(
    new THREE.BoxGeometry(100, 100, 100),
    new THREE.MeshBasicMaterial({ map: profileTexture })
  );
  sphere.position.x += (100 * window.innerWidth) / 1920;
  sphere.position.y = 0;
  sphere.position.z = 0;
  scene.add(sphere);

  const geometry = new THREE.CylinderGeometry(0, 10, 75, 100);
  geometry.rotateX(Math.PI / 2);

  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 50,
  });

  for (let i = 0; i < 1000; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 4000 - 2015;
    mesh.position.y = Math.random() * 4000 - 2015;
    mesh.position.z = Math.random() * 4000 - 2015;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 4 + 2.015;
    scene.add(mesh);
  }

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, -1, 0).normalize();
  dirLight.color.setHSL(0.1, 0.7, 0.5);
  scene.add(dirLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
  dirLight1.position.set(0, 1, 0).normalize();
  dirLight1.color.setHSL(0.1, 0.7, 0.5);
  scene.add(dirLight1);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  headerelement = document.getElementById("header");
  headerelement.style.margin = "0px";
  rect = headerelement.getBoundingClientRect();
  maxheader = rect.bottom - document.body.getBoundingClientRect().top;

  if (window.innerWidth >= 1280) {
    headerelement.style.margin = `${
      (window.innerHeight - rect.bottom + 5) / 2
    }px 0px`;
  } else {
    headerelement.style.margin = `${window.innerHeight}px 0px 120px 0px`;
  }

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

function onDocumentScroll(event) {
  if (!isScrolledIntoView(headerelement)) {
    scrolled = true;
  } else {
    scrolled = false;
  }
}

function isScrolledIntoView(el) {
  let rect = el.getBoundingClientRect();
  let elemBottom = rect.bottom;
  console.log(elemBottom);
  maxheader = Math.max(maxheader, elemBottom);
  let isVisible = false;
  if (elemBottom >= 0) {
    camera.position.z = scaleBetween(elemBottom, 500, 3200, maxheader, 0);
    camera.position.x = scaleBetween(
      elemBottom,
      0,
      camera.position.x,
      maxheader,
      0
    );
    camera.position.y = scaleBetween(
      elemBottom,
      0,
      camera.position.y,
      maxheader,
      0
    );
    isVisible = true;
    const time = Date.now() * 0.0005;
    let sx = Math.sin(time * 0.7) * 2000;
    let sy = Math.cos(time * 0.5) * 2000;
    let sz = Math.cos(time * 0.3) * 2000;
    sphere.position.x =
      scaleBetween(elemBottom, 0, sx, maxheader, 0) +
      (100 * window.innerWidth) / 1920;
    sphere.position.y = scaleBetween(elemBottom, 0, sy, maxheader, 0);
    sphere.position.z = scaleBetween(elemBottom, 0, sz, maxheader, 0);
  } else {
    camera.position.z = 3200;
  }
  return isVisible;
}

function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
  return (
    ((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) + minAllowed
  );
}

//

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.005;
  sphere.rotation.z += 0.01;

  render();
}

function render() {
  const time = Date.now() * 0.0005;

  if (scrolled) {
    sphere.position.x = Math.sin(time * 0.7) * 2000;
    sphere.position.y = Math.cos(time * 0.5) * 2000;
    sphere.position.z = Math.cos(time * 0.3) * 2000;
    camera.position.x += (mouseX - camera.position.x) * 0.005;
    camera.position.y += (-mouseY - camera.position.y) * 0.005;
  } else {
    camera.position.x += (mouseX - camera.position.x) * 0.00005;
    camera.position.y += (-mouseY - camera.position.y) * 0.00005;
  }

  for (let i = 1, l = scene.children.length; i < l; i++) {
    scene.children[i].lookAt(sphere.position);
  }

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
