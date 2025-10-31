let scene, camera, renderer, mixer, character, controls;
const clock = new THREE.Clock();
const animations = {};
let velocity = new THREE.Vector3();

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
  scene.background = new THREE.Color(0xa0a0a0);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ color: 0x808080 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(1000, 40);
  scene.add(grid);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 80, -120);
  camera.lookAt(0, 50, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  log('renderer 作成完了');

  // OrbitControlsでマウス視点操作
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 50, 0);
  controls.update();

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
    character.scale.set(0.2, 0.2, 0.2);
    character.position.set(0, 0, 0);
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

    switch (event.key.toLowerCase()) {
      case 'q':
        velocity.x = 2; // 右へ
        playAnimation('walk');
        break;
      case 'c':
        velocity.x = -2; // 左へ
        playAnimation('walk');
        break;
      case 's':
        velocity.z = -2; // 前へ
        playAnimation('walk');
        break;
      case 'e':
        velocity.z = 2; // 後ろへ
        playAnimation('run');
        break;
      case ' ':
        playAnimation('jump');
        character.position.y += 50;
        setTimeout(() => {
          character.position.y -= 50;
        }, 500);
        break;
    }
  });

  document.addEventListener('keyup', () => {
    velocity.set(0, 0, 0);
    stopAllAnimations();
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
    const action = mixer.clipAction(anim.animations[0]);
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(1);
    action.setLoop(THREE.LoopRepeat);
    action.clampWhenFinished = true;
    action.enable = true;
    animations[name] = action;
  }, undefined, function (error) {
    log(`${name}.fbx 読み込み失敗: ` + error);
  });
}

function playAnimation(name) {
  stopAllAnimations();
  if (animations[name]) {
    animations[name].play(); // reset() は削除！
  }
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

  if (character) {
    character.position.add(velocity);
    controls.target.copy(character.position.clone().add(new THREE.Vector3(0, 50, 0)));
    controls.update();
  }

  renderer.render(scene, camera);
}
