(() => {

if (window.POGI_MODE_ACTIVE) return;
window.POGI_MODE_ACTIVE = true;

// ==========================
// IMAGE
// ==========================

const hero = document.createElement("img");
hero.src = "https://luckyph10.github.io/feeling_pogi_yarn/image.png";

hero.style.position = "fixed";
hero.style.left = "100px";
hero.style.top = "100px";
hero.style.width = "220px";
hero.style.height = "auto";
hero.style.zIndex = "999999999";
hero.style.background = "transparent";
hero.style.pointerEvents = "auto";
hero.style.userSelect = "none";
hero.style.cursor = "pointer";
hero.style.filter = "drop-shadow(0 10px 20px rgba(0,0,0,.35))";

document.body.appendChild(hero);

// ==========================
// CAPE
// ==========================

const cape = document.createElement("div");

cape.style.position = "fixed";
cape.style.width = "90px";
cape.style.height = "140px";
cape.style.background = "linear-gradient(#ff0000,#880000)";
cape.style.clipPath =
"polygon(25% 0%,75% 0%,100% 100%,0% 100%)";

cape.style.pointerEvents = "none";
cape.style.zIndex = "999999998";
cape.style.filter =
"drop-shadow(0 0 12px rgba(255,0,0,.7))";

document.body.appendChild(cape);

// ==========================
// VARIABLES
// ==========================

let x = 100;
let y = 100;

let dx = 14;
let dy = 10;

let speed = 1;

let imageWidth = 220;
let imageHeight = 400;

hero.onload = () => {

    imageHeight =
        (hero.naturalHeight / hero.naturalWidth)
        * imageWidth;
};

// ==========================
// BOOST TEXT
// ==========================

function showText(text, px, py) {

    const t = document.createElement("div");

    t.textContent = text;

    t.style.position = "fixed";
    t.style.left = px + "px";
    t.style.top = py + "px";

    t.style.fontSize = "28px";
    t.style.fontWeight = "900";
    t.style.color = "red";
    t.style.zIndex = "999999999";

    document.body.appendChild(t);

    let opacity = 1;

    const anim = setInterval(() => {

        py -= 2;
        opacity -= 0.03;

        t.style.top = py + "px";
        t.style.opacity = opacity;

        if (opacity <= 0) {
            clearInterval(anim);
            t.remove();
        }

    }, 16);
}

// ==========================
// SPEED TRAIL
// ==========================

function makeTrail() {

    const trail = document.createElement("div");

    trail.innerHTML = "💨";
    trail.style.position = "fixed";
    trail.style.left = (x + 60) + "px";
    trail.style.top = (y + 120) + "px";
    trail.style.fontSize = "30px";
    trail.style.pointerEvents = "none";
    trail.style.zIndex = "999999990";

    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 400);
}

// ==========================
// BOOST ON MOUSE TOUCH
// ==========================

hero.addEventListener("mouseenter", () => {

    speed += 1;

    if (speed > 5)
        speed = 5;

    hero.style.transform += " scale(1.08)";

    showText("🚀 POGI BOOST!", x, y);

    setTimeout(() => {
        hero.style.transform = "";
    }, 200);

});

// ==========================
// TURBO MODE
// ==========================

hero.addEventListener("dblclick", () => {

    speed = 8;

    showText("⚡ TURBO MODE ⚡", x, y);

    setTimeout(() => {
        speed = 1.5;
    }, 3000);

});

// ==========================
// ANIMATION
// ==========================

function fly() {

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

    hero.style.rotate =
        (angle * 0.08) + "deg";

    // cape follows the body

    cape.style.left =
    (x + imageWidth / 2 - 45 - Math.sign(dx) * 30)
    + "px";

    cape.style.top =
    (y + 20)
    + "px";

    cape.style.transform =
    `rotate(${Math.sin(Date.now()/90)*18}deg)`;

    if (Math.random() < 0.15)
        makeTrail();

    requestAnimationFrame(fly);
}

fly();

// ==========================
// ESC TO REMOVE
// ==========================

window.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        hero.remove();
        cape.remove();

        window.POGI_MODE_ACTIVE = false;

        console.log("POGI REMOVED");
    }

});

console.log("🦸 SUPER POGI ACTIVATED");

})();
