let scene, camera, renderer, mixer, character;
const clock = new THREE.Clock();
const animations = {};

log('main.js 読み込まれた');

init();
animate();

function log(message) {
  const logBox = document.getElementById('log-box');
  if (logBox) {
    const p = document.createElement('p');
    p.textContent = message;
    logBox.appendChild(p);
  }
}

function init() {
  log('init 開始');

  log('FBXLoaderの型: ' + typeof THREE.FBXLoader);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 150, 300);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  log('renderer 作成完了');

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 200, 100);
  scene.add(light);
  log('ライト追加');

  const loader = new THREE.FBXLoader();
  log('character.fbx 読み込み開始');

  loader.load('model/character.fbx', function (object) {
    if (!object) {
      log('character.fbx 読み込み失敗: 読み込まれたオブジェクトがnullです');
      return;
    }

    log('character.fbx 読み込み成功');
    character = object;
    character.scale.set(0.1, 0.1, 0.1);
    scene.add(character);
    mixer = new THREE.AnimationMixer(character);

    loadAnimation('walk', 'model/walk.fbx');
    loadAnimation('run', 'model/run.fbx');
    loadAnimation('jump', 'model/jump.fbx');
  }, undefined, function (error) {
    log('character.fbx 読み込み失敗: ' + error);
  });

  document.addEventListener('keydown', (event) => {
    if (!character) return;
    stopAllAnimations();

    switch (event.key.toLowerCase()) {
      case 'q':
        character.position.x -= 10;
        if (animations.walk) animations.walk.play();
        break;
      case 'c':
        character.position.x += 10;
        if (animations.walk) animations.walk.play();
        break;
      case 'e':
        character.position.z -= 10;
        if (animations.run) animations.run.play();
        break;
      case 's':
        character.position.z += 10;
        if (animations.walk) animations.walk.play();
        break;
      case ' ':
        if (animations.jump) animations.jump.play();
        break;
    }
  });
}

function loadAnimation(name, path) {
  log(`${name}.fbx 読み込み開始`);
  const loader = new THREE.FBXLoader();
  loader.load(path, function (anim) {
    if (!anim || !anim.animations || anim.animations.length === 0) {
      log(`${name}.fbx 読み込み失敗: アニメーションが見つかりません`);
      return;
    }

    log(`${name}.fbx 読み込み成功`);
    animations[name] = mixer.clipAction(anim.animations[0]);
  }, undefined, function (error) {
    log(`${name}.fbx 読み込み失敗: ` + error);
  });
}

function stopAllAnimations() {
  for (let key in animations) {
    animations[key].stop();
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
