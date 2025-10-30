let scene, camera, renderer, mixer, character;
const clock = new THREE.Clock();
const animations = {};

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 150, 300);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 200, 100);
  scene.add(light);

  const loader = new THREE.FBXLoader();

  // モデル読み込み
  loader.load('model/character.fbx', function(object) {
    character = object;
    character.scale.set(0.1, 0.1, 0.1); // サイズ調整
    scene.add(character);
    mixer = new THREE.AnimationMixer(character);

    // モーション読み込み
    loadAnimation('walk', 'model/walk.fbx');
    loadAnimation('run', 'model/run.fbx');
    loadAnimation('jump', 'model/jump.fbx');
  });

  // キー操作
  document.addEventListener('keydown', (event) => {
    if (!character) return;
    stopAllAnimations();

    switch (event.key.toLowerCase()) {
      case 'q': // 左
        character.position.x -= 10;
        if (animations.walk) animations.walk.play();
        break;
      case 'c': // 右
        character.position.x += 10;
        if (animations.walk) animations.walk.play();
        break;
      case 'e': // 前
        character.position.z -= 10;
        if (animations.run) animations.run.play();
        break;
      case 's': // 後ろ
        character.position.z += 10;
        if (animations.walk) animations.walk.play();
        break;
      case ' ': // ジャンプ
        if (animations.jump) animations.jump.play();
        break;
    }
  });
}

function loadAnimation(name, path) {
  const loader = new THREE.FBXLoader();
  loader.load(path, function(anim) {
    animations[name] = mixer.clipAction(anim.animations[0]);
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
