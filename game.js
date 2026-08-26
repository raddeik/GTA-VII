import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ============================================================
// URBAN CHAOS - PROTOTIPO
// Cámara de tercera persona + movimiento
// ============================================================

const game = document.getElementById("game");
const loading = document.getElementById("loading");

// ============================================================
// ESCENA
// ============================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    80,
    500
);

// ============================================================
// CÁMARA
// ============================================================

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const cameraDistance = 8;
const cameraHeight = 4;

let cameraYaw = 0;
let cameraPitch = -0.25;

const minPitch = -1.0;
const maxPitch = 0.35;

// ============================================================
// RENDERIZADOR
// ============================================================

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

// ============================================================
// LUCES
// ============================================================

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

// ============================================================
// TERRENO
// ============================================================

const groundGeometry = new THREE.PlaneGeometry(
    500,
    500
);

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3d7a3d
    });

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);

// ============================================================
// CIUDAD
// ============================================================

const city = new THREE.Group();

scene.add(city);

// ------------------------------------------------------------
// MATERIALES
// ------------------------------------------------------------

const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x252525
    });

const sidewalkMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x777777
    });

const buildings = [];

const buildingMaterials = [
    new THREE.MeshStandardMaterial({
        color: 0x9b9b9b
    }),

    new THREE.MeshStandardMaterial({
        color: 0xb56b45
    }),

    new THREE.MeshStandardMaterial({
        color: 0x6f7fa3
    }),

    new THREE.MeshStandardMaterial({
        color: 0xc4a35a
    })
];

// ------------------------------------------------------------
// CREAR CUBO
// ------------------------------------------------------------

function createBox(
    width,
    height,
    depth,
    material,
    x,
    y,
    z
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.set(
        x,
        y,
        z
    );

    mesh.castShadow = true;

    mesh.receiveShadow = true;

    city.add(mesh);

    return mesh;
}

// ------------------------------------------------------------
// CARRETERA PRINCIPAL
// ------------------------------------------------------------

createBox(
    500,
    0.1,
    14,
    roadMaterial,
    0,
    0.05,
    0
);

// ------------------------------------------------------------
// CARRETERA CRUZADA
// ------------------------------------------------------------

createBox(
    14,
    0.1,
    500,
    roadMaterial,
    0,
    0.06,
    0
);

// ------------------------------------------------------------
// ACERAS
// ------------------------------------------------------------

createBox(
    500,
    0.15,
    3,
    sidewalkMaterial,
    0,
    0.12,
    9
);

createBox(
    500,
    0.15,
    3,
    sidewalkMaterial,
    0,
    0.12,
    -9
);

createBox(
    3,
    0.15,
    500,
    sidewalkMaterial,
    9,
    0.13,
    0
);

createBox(
    3,
    0.15,
    500,
    sidewalkMaterial,
    -9,
    0.13,
    0
);

// ------------------------------------------------------------
// EDIFICIOS
// ------------------------------------------------------------

function createBuilding(
    x,
    z,
    width,
    depth,
    height
) {

    const material =
        buildingMaterials[
            Math.floor(
                Math.random() *
                buildingMaterials.length
            )
        ];

    const building = createBox(
        width,
        height,
        depth,
        material,
        x,
        height / 2,
        z
    );

    buildings.push(building);
}

// ------------------------------------------------------------
// BLOQUE 1
// ------------------------------------------------------------

create(
    30,
    30,
    15,
    15,
    25
);

create(
    55,
    30,
    18,
    15,
    35
);

createBuilding(
    85,
    30,
    20,
    18,
    45
);

// ------------------------------------------------------------
// BLOQUE 2
// ------------------------------------------------------------

createBuilding(
    30,
    -30,
    15,
    15,
    20
);

createBuilding(
    55,
    -30,
    20,
    15,
    30
);

createBuilding(
    85,
    -30,
    18,
    18,
    40
);

// ------------------------------------------------------------
// BLOQUE 3
// ------------------------------------------------------------

createBuilding(
    -30,
    30,
    18,
    18,
    30
);

createBuilding(
    -60,
    30,
    15,
    15,
    22
);

createBuilding(
    -85,
    30,
    20,
    20,
    38
);

// ------------------------------------------------------------
// BLOQUE 4
// ------------------------------------------------------------

createBuilding(
    -30,
    -30,
    18,
    18,
    25
);

createBuilding(
    -60,
    -30,
    20,
    16,
    35
);

createBuilding(
    -85,
    -30,
    15,
    18,
    28
);

// ============================================================
// JUGADOR
// ============================================================

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

const player = new THREE.Mesh(
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

// ============================================================
// VEHÍCULO
// ============================================================

const vehicle = new THREE.Group();

scene.add(vehicle);

// ------------------------------------------------------------
// CARROCERÍA
// ------------------------------------------------------------

const carBodyGeometry =
    new THREE.BoxGeometry(
        2.4,
        0.7,
        4.2
    );

const carBodyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xc62828
    });

const carBody =
    new THREE.Mesh(
        carBodyGeometry,
        carBodyMaterial
    );

carBody.position.y = 0.8;

carBody.castShadow = true;

vehicle.add(carBody);

// ------------------------------------------------------------
// PARTE SUPERIOR
// ------------------------------------------------------------

const cabinGeometry =
    new THREE.BoxGeometry(
        1.8,
        0.7,
        2
    );

const cabinMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x222222
    });

const cabin =
    new THREE.Mesh(
        cabinGeometry,
        cabinMaterial
    );

cabin.position.set(
    0,
    1.35,
    -0.1
);

cabin.castShadow = true;

vehicle.add(cabin);

// ------------------------------------------------------------
// RUEDAS
// ------------------------------------------------------------

const wheelGeometry =
    new THREE.CylinderGeometry(
        0.45,
        0.45,
        0.35,
        16
    );

const wheelMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x111111
    });

const wheelPositions = [
    [-1.1, 0.45, 1.35],
    [1.1, 0.45, 1.35],
    [-1.1, 0.45, -1.35],
    [1.1, 0.45, -1.35]
];

for (const position of wheelPositions) {

    const wheel =
        new THREE.Mesh(
            wheelGeometry,
            wheelMaterial
        );

    wheel.rotation.z =
        Math.PI / 2;

    wheel.position.set(
        position[0],
        position[1],
        position[2]
    );

    wheel.castShadow = true;

    vehicle.add(wheel);
}

// ------------------------------------------------------------
// POSICIÓN DEL VEHÍCULO
// ------------------------------------------------------------

vehicle.position.set(
    3,
    0,
    3
);

vehicle.rotation.y =
    Math.PI;

// ============================================================
// ESTADO DEL VEHÍCULO
// ============================================================

let drivingVehicle = false;

let vehicleSpeed = 0;

const vehicleMaxSpeed = 25;

const vehicleAcceleration = 18;

const vehicleBrake = 30;

const vehicleTurnSpeed = 2.2;

// ============================================================
// CONTROLES
// ============================================================

const keys = {};

window.addEventListener(
    "keydown",
    (event) => {
        keys[event.code] = true;

        if (event.code === "KeyF") {

    const distance =
        player.position.distanceTo(
            vehicle.position
        );

    if (distance < 4) {

        drivingVehicle =
            !drivingVehicle;

        if (drivingVehicle) {

            player.visible = false;

            player.position.copy(
                vehicle.position
            );

            player.position.y += 1;

        } else {

            player.visible = true;

            player.position.copy(
                vehicle.position
            );

            player.position.x += 3;

        }
    }
}

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

// ============================================================
// RATÓN
// ============================================================

let mouseLocked = false;

renderer.domElement.addEventListener(
    "click",
    () => {

        renderer.domElement.requestPointerLock();

    }
);

document.addEventListener(
    "pointerlockchange",
    () => {

        mouseLocked =
            document.pointerLockElement ===
            renderer.domElement;

    }
);

document.addEventListener(
    "mousemove",
    (event) => {

        if (!mouseLocked) {
            return;
        }

        const sensitivity = 0.0025;

        cameraYaw -=
            event.movementX *
            sensitivity;

        cameraPitch -=
            event.movementY *
            sensitivity;

        cameraPitch = THREE.MathUtils.clamp(
            cameraPitch,
            minPitch,
            maxPitch
        );
    }
);

// ============================================================
// FÍSICA DEL JUGADOR
// ============================================================

const playerSpeed = 8;

const sprintSpeed = 13;

const gravity = 25;

const jumpForce = 10;

let velocityY = 0;

let onGround = true;

// ============================================================
// MOVIMIENTO
// ============================================================

// ============================================================
// MOVIMIENTO DEL JUGADOR
// ============================================================

function updatePlayer(delta) {

    let forward = 0;
    let right = 0;

    if (keys["KeyW"]) forward -= 1;
    if (keys["KeyS"]) forward += 1;
    if (keys["KeyD"]) right -= 1;
    if (keys["KeyA"]) right += 1;

    const movementLength = Math.sqrt(
        forward * forward +
        right * right
    );

    if (movementLength > 0) {

        forward /= movementLength;
        right /= movementLength;

    }

    // Dirección según la cámara

    const forwardDirection = new THREE.Vector3(
        -Math.sin(cameraYaw),
        0,
        -Math.cos(cameraYaw)
    );

    const rightDirection = new THREE.Vector3(
        Math.cos(cameraYaw),
        0,
        -Math.sin(cameraYaw)
    );

    const movement = new THREE.Vector3();

    movement.addScaledVector(
        forwardDirection,
        forward
    );

    movement.addScaledVector(
        rightDirection,
        right
    );

    if (movement.lengthSq() > 0) {

        movement.normalize();

        let speed = playerSpeed;

        if (
            keys["ShiftLeft"] ||
            keys["ShiftRight"]
        ) {
            speed = sprintSpeed;
        }

        player.position.x +=
            movement.x * speed * delta;

        player.position.z +=
            movement.z * speed * delta;

        const targetRotation =
            Math.atan2(
                movement.x,
                movement.z
            );

        player.rotation.y =
            THREE.MathUtils.lerp(
                player.rotation.y,
                targetRotation,
                0.2
            );
    }

    // Gravedad

    velocityY -= gravity * delta;

    player.position.y +=
        velocityY * delta;

    // Suelo

    if (player.position.y <= 1.1) {

        player.position.y = 1.1;

        velocityY = 0;

        onGround = true;

    }
}

// ============================================================
// COLISIONES
//=============================================================

// ============================================================
// CONDUCCIÓN
// ============================================================

function updateVehicle(delta) {

    if (!drivingVehicle) {

        vehicleSpeed *= 0.95;

        return;

    }

    // Acelerar

    if (keys["KeyW"]) {

        vehicleSpeed +=
            vehicleAcceleration * delta;

    }

    // Frenar / marcha atrás

    if (keys["KeyS"]) {

        vehicleSpeed -=
            vehicleBrake * delta;

    }

    // Límite de velocidad

    vehicleSpeed =
        THREE.MathUtils.clamp(
            vehicleSpeed,
            -10,
            vehicleMaxSpeed
        );

    // Frenado automático

    if (
        !keys["KeyW"] &&
        !keys["KeyS"]
    ) {

        vehicleSpeed *=
            Math.pow(0.15, delta);

    }

    // Dirección

    if (
        Math.abs(vehicleSpeed) > 0.1
    ) {

        let steering = 0;

        if (keys["KeyA"]) {
            steering += 1;
        }

        if (keys["KeyD"]) {
            steering -= 1;
        }

        const speedFactor =
            Math.min(
                Math.abs(vehicleSpeed) / 10,
                1
            );

        vehicle.rotation.y +=
            steering *
            vehicleTurnSpeed *
            speedFactor *
            delta *
            Math.sign(vehicleSpeed);

    }

    // Movimiento del coche

    const forward =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    forward.applyQuaternion(
        vehicle.quaternion
    );
    
    vehicle.position.addScaledVector(
        forward,
        vehicleSpeed * delta
    );
    
    vehicle.position.y = 0;

    // Jugador dentro del vehículo

    player.position.copy(
        vehicle.position
    );

    player.position.y += 1;
}

// ============================================================
// CÁMARA
// ============================================================

function updateCamera() {

    const horizontalDistance =
        cameraDistance *
        Math.cos(cameraPitch);

    const verticalDistance =
        cameraDistance *
        Math.sin(cameraPitch);

    const cameraPosition =
        new THREE.Vector3();

    cameraPosition.x =
        player.position.x -
        Math.sin(cameraYaw) *
        horizontalDistance;

    cameraPosition.z =
        player.position.z -
        Math.cos(cameraYaw) *
        horizontalDistance;

    cameraPosition.y =
        player.position.y +
        cameraHeight -
        verticalDistance;

    // Seguimiento suave

    camera.position.lerp(
        cameraPosition,
        0.12
    );

    // Mirar al jugador

    const target =
        new THREE.Vector3(
            player.position.x,
            player.position.y + 1,
            player.position.z
        );

    camera.lookAt(target);
}

// ============================================================
// RESIZE
// ============================================================

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

// ============================================================
// BUCLE PRINCIPAL
// ============================================================

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

if (drivingVehicle) {

    updateVehicle(delta);

} else {

    updatePlayer(delta);

}

updateCamera();

    renderer.render(
        scene,
        camera
    );
}

// ============================================================
// INICIO
// ============================================================

loading.style.display = "none";

animate();
