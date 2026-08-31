(() => {

if (window.POGI_MODE_ACTIVE) return;
window.POGI_MODE_ACTIVE = true;

// ======================================
// CREATE HERO IMAGE
// ======================================

const hero = document.createElement("img");

hero.style.position = "fixed";
hero.style.left = "100px";
hero.style.top = "100px";
hero.style.width = "220px";
hero.style.height = "auto";
hero.style.zIndex = "999999999";
hero.style.pointerEvents = "auto";
hero.style.userSelect = "none";
hero.style.cursor = "pointer";

document.body.appendChild(hero);

// ======================================
// CREATE CAPE
// ======================================

const cape = document.createElement("div");

cape.style.position = "fixed";
cape.style.width = "90px";
cape.style.height = "140px";
cape.style.background = "linear-gradient(#ff0000,#880000)";
cape.style.clipPath =
  "polygon(25% 0%,75% 0%,100% 100%,0% 100%)";

cape.style.zIndex = "999999998";
cape.style.pointerEvents = "none";

document.body.appendChild(cape);

// ======================================
// REMOVE BACKGROUND
// ======================================

const sourceImage = new Image();
sourceImage.crossOrigin = "anonymous";

sourceImage.src =
"https://luckyph10.github.io/feeling_pogi_yarn/image.png";

let imageWidth = 220;
let imageHeight = 400;

sourceImage.onload = () => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;

    ctx.drawImage(sourceImage, 0, 0);

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Remove white & checkerboard

        if (
            r > 180 &&
            g > 180 &&
            b > 180
        ) {
            data[i + 3] = 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    hero.src = canvas.toDataURL("image/png");

    imageHeight =
        (sourceImage.height /
        sourceImage.width)
        * imageWidth;
};

// ======================================
// MOVEMENT
// ======================================

let x = 100;
let y = 100;

let dx = 15;
let dy = 12;

let speed = 1;

// ======================================
// BOOST TEXT
// ======================================

function showText(msg, px, py) {

    const div = document.createElement("div");

    div.textContent = msg;

    div.style.position = "fixed";
    div.style.left = px + "px";
    div.style.top = py + "px";
    div.style.color = "red";
    div.style.fontWeight = "bold";
    div.style.fontSize = "28px";
    div.style.zIndex = "999999999";

    document.body.appendChild(div);

    let opacity = 1;

    const id = setInterval(() => {

        py -= 2;
        opacity -= 0.03;

        div.style.top = py + "px";
        div.style.opacity = opacity;

        if (opacity <= 0) {

            clearInterval(id);
            div.remove();
        }

    }, 16);
}

// ======================================
// SPEED TRAIL
// ======================================

function createTrail() {

    const t = document.createElement("div");

    t.innerHTML = "💨";

    t.style.position = "fixed";
    t.style.left = (x + 50) + "px";
    t.style.top = (y + 100) + "px";
    t.style.fontSize = "28px";
    t.style.pointerEvents = "none";
    t.style.zIndex = "999999990";

    document.body.appendChild(t);

    setTimeout(() => t.remove(), 500);
}

// ======================================
// MOUSE BOOST
// ======================================

hero.addEventListener("mouseenter", () => {

    speed += 1;

    if (speed > 6)
        speed = 6;

    showText("🚀 POGI BOOST!", x, y);

});

// ======================================
// TURBO MODE
// ======================================

hero.addEventListener("dblclick", () => {

    speed = 10;

    showText("⚡ TURBO POGI ⚡", x, y);

    setTimeout(() => {
        speed = 2;
    }, 3000);

});

// ======================================
// MAIN ANIMATION
// ======================================

function animate() {

    x += dx * speed;
    y += dy * speed;

    if (x <= 0) {
        dx = Math.abs(dx);
        showText("💥", x, y);
    }

    if (x + imageWidth >= innerWidth) {
        dx = -Math.abs(dx);
        showText("💥", x, y);
    }

    if (y <= 0) {
        dy = Math.abs(dy);
        showText("💥", x, y);
    }

    if (y + imageHeight >= innerHeight) {
        dy = -Math.abs(dy);
        showText("💥", x, y);
    }

    hero.style.left = x + "px";
    hero.style.top = y + "px";

    const angle =
      Math.atan2(dy, dx) * 180 / Math.PI;

    hero.style.transform =
      `rotate(${angle * 0.08}deg)`;

    cape.style.left =
      (x + imageWidth / 2 - 45 - Math.sign(dx) * 25)
      + "px";

    cape.style.top =
      (y + 20)
      + "px";

    cape.style.transform =
      `rotate(${Math.sin(Date.now()/100)*15}deg)`;

    if (Math.random() < 0.15)
        createTrail();

    requestAnimationFrame(animate);
}

animate();

// ======================================
// ESC TO REMOVE
// ======================================

window.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        hero.remove();
        cape.remove();

        window.POGI_MODE_ACTIVE = false;
    }

});

console.log("🦸 SUPER POGI MODE ACTIVATED");

})();








