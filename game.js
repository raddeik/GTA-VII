import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const game = document.getElementById("game");
const loading = document.getElementById("loading");

// --------------------------------------------------
// ESCENA
// --------------------------------------------------

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    80,
    500
);

// --------------------------------------------------
// CÁMARA
// --------------------------------------------------

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    0,
    5,
    10
);

// --------------------------------------------------
// RENDERIZADOR
// --------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

game.appendChild(renderer.domElement);

// --------------------------------------------------
// LUCES
// --------------------------------------------------

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(
    100,
    150,
    100
);

sun.castShadow = true;

scene.add(sun);

const ambientLight = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    1
);

scene.add(ambientLight);

// --------------------------------------------------
// SUELO
// --------------------------------------------------

const groundGeometry =
    new THREE.PlaneGeometry(
        500,
        500
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3d7a3d
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);

// --------------------------------------------------
// JUGADOR
// --------------------------------------------------

const playerGeometry =
    new THREE.CapsuleGeometry(
        0.5,
        1.2,
        8,
        16
    );

const playerMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3366ff
    });

const player =
    new THREE.Mesh(
        playerGeometry,
        playerMaterial
    );

player.position.set(
    0,
    1.1,
    0
);

player.castShadow = true;

scene.add(player);

// --------------------------------------------------
// VARIABLES DEL JUGADOR
// --------------------------------------------------

const keys = {};

const playerSpeed = 8;

let velocityY = 0;

const gravity = 25;

const jumpForce = 10;

let onGround = true;

// --------------------------------------------------
// CONTROLES
// --------------------------------------------------

window.addEventListener(
    "keydown",
    (event) => {

        keys[event.code] = true;

        if (
            event.code === "Space" &&
            onGround
        ) {

            velocityY = jumpForce;

            onGround = false;
        }
    }
);

window.addEventListener(
    "keyup",
    (event) => {

        keys[event.code] = false;
    }
);

// --------------------------------------------------
// MOVIMIENTO
// --------------------------------------------------

function updatePlayer(delta) {

    let forward = 0;
    let right = 0;

    if (keys["KeyW"]) {
        forward += 1;
    }

    if (keys["KeyS"]) {
        forward -= 1;
    }

    if (keys["KeyD"]) {
        right += 1;
    }

    if (keys["KeyA"]) {
        right -= 1;
    }

    const length =
        Math.sqrt(
            forward * forward +
            right * right
        );

    if (length > 0) {

        forward /= length;
        right /= length;
    }

    player.position.z -=
        forward *
        playerSpeed *
        delta;

    player.position.x +=
        right *
        playerSpeed *
        delta;

    // Gravedad

    velocityY -=
        gravity *
        delta;

    player.position.y +=
        velocityY *
        delta;

    // Suelo

    if (player.position.y <= 1.1) {

        player.position.y = 1.1;

        velocityY = 0;

        onGround = true;
    }
}

// --------------------------------------------------
// CÁMARA
// --------------------------------------------------

function updateCamera() {

    const cameraOffset =
        new THREE.Vector3(
            0,
            5,
            9
        );

    const desiredPosition =
        player.position.clone()
        .add(cameraOffset);

    camera.position.lerp(
        desiredPosition,
        0.1
    );

    camera.lookAt(
        player.position.x,
        player.position.y + 1,
        player.position.z
    );
}

// --------------------------------------------------
// RESIZE
// --------------------------------------------------

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);

// --------------------------------------------------
// BUCLE PRINCIPAL
// --------------------------------------------------

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );

    updatePlayer(delta);

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}

// --------------------------------------------------
// INICIAR
// --------------------------------------------------

loading.style.display = "none";

animate();
