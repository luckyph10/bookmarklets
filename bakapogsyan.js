(() => {

if (window.POGI_MODE_ACTIVE) {
    console.log("🦸 POGI already flying!");
    return;
}

window.POGI_MODE_ACTIVE = true;

// ---------- CREATE HERO ----------

const hero = document.createElement("img");
hero.src = "https://luckyph10.github.io/feeling_pogi_yarn/image.png";

hero.style.position = "fixed";
hero.style.width = "180px";
hero.style.zIndex = "999999999";
hero.style.pointerEvents = "auto";
hero.style.userSelect = "none";
hero.style.left = "100px";
hero.style.top = "100px";

document.body.appendChild(hero);

// ---------- CAPE ----------

const cape = document.createElement("div");

cape.style.position = "fixed";
cape.style.width = "90px";
cape.style.height = "130px";
cape.style.background = "linear-gradient(to bottom,#ff0000,#990000)";
cape.style.clipPath = "polygon(25% 0%,75% 0%,100% 100%,0% 100%)";
cape.style.zIndex = "999999998";
cape.style.pointerEvents = "none";
cape.style.filter =
    "drop-shadow(0 0 10px rgba(255,0,0,.6))";

document.body.appendChild(cape);

// ---------- VARIABLES ----------

let x = 100;
let y = 100;

let dx = 14;
let dy = 10;

let speedMultiplier = 1;

let imageWidth = 180;
let imageHeight = 320;

// ---------- BOOST EFFECT ----------

function boostText(text, px, py) {

    const msg = document.createElement("div");

    msg.textContent = text;

    msg.style.position = "fixed";
    msg.style.left = px + "px";
    msg.style.top = py + "px";

    msg.style.color = "red";
    msg.style.fontWeight = "900";
    msg.style.fontSize = "24px";
    msg.style.fontFamily = "Arial";
    msg.style.zIndex = "999999999";

    document.body.appendChild(msg);

    let opacity = 1;
    let yy = py;

    const anim = setInterval(() => {

        yy -= 2;
        opacity -= 0.03;

        msg.style.top = yy + "px";
        msg.style.opacity = opacity;

        if (opacity <= 0) {
            clearInterval(anim);
            msg.remove();
        }

    }, 16);
}

// ---------- SPEED TRAIL ----------

function createTrail() {

    const t = document.createElement("div");

    t.textContent = "💨";

    t.style.position = "fixed";
    t.style.left = x + 50 + "px";
    t.style.top = y + 100 + "px";
    t.style.fontSize = "28px";
    t.style.zIndex = "999999990";
    t.style.pointerEvents = "none";

    document.body.appendChild(t);

    setTimeout(() => {
        t.remove();
    }, 500);
}

// ---------- BOOST ON TOUCH ----------

hero.addEventListener("mouseenter", () => {

    speedMultiplier += 0.8;

    if (speedMultiplier > 5) {
        speedMultiplier = 5;
    }

    boostText("🚀 POGI BOOST!", x, y);

    hero.style.filter =
        "drop-shadow(0 0 20px gold)";

    setTimeout(() => {

        hero.style.filter =
            "drop-shadow(0 10px 15px rgba(0,0,0,.4))";

    }, 500);

});

// ---------- DOUBLE CLICK TURBO ----------

hero.addEventListener("dblclick", () => {

    speedMultiplier = 8;

    boostText("⚡ TURBO POGI MODE ⚡", x, y);

    setTimeout(() => {
        speedMultiplier = 1.5;
    }, 3000);

});

// ---------- ANIMATION ----------

function animate() {

    x += dx * speedMultiplier;
    y += dy * speedMultiplier;

    if (x <= 0) {
        dx = Math.abs(dx);
        boostText("💥", x, y);
    }

    if (x + imageWidth >= window.innerWidth) {
        dx = -Math.abs(dx);
        boostText("💥", x, y);
    }

    if (y <= 0) {
        dy = Math.abs(dy);
        boostText("💥", x, y);
    }

    if (y + imageHeight >= window.innerHeight) {
        dy = -Math.abs(dy);
        boostText("💥", x, y);
    }

    hero.style.left = x + "px";
    hero.style.top = y + "px";

    const angle =
        Math.atan2(dy, dx) * 180 / Math.PI;

    hero.style.transform =
        `rotate(${angle * 0.08}deg)`;

    // Cape follows behind
    cape.style.left =
        (x + imageWidth / 2 - 45 - Math.sign(dx) * 25) + "px";

    cape.style.top =
        (y + 15) + "px";

    cape.style.transform =
        `rotate(${Math.sin(Date.now()/100)*15}deg)`;

    if (Math.random() < 0.1) {
        createTrail();
    }

    requestAnimationFrame(animate);
}

animate();

// ---------- ESC TO REMOVE ----------

window.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        hero.remove();
        cape.remove();

        window.POGI_MODE_ACTIVE = false;

        boostText("🫡 POGI OUT", 200, 200);
    }

});

console.log("🦸 SUPER POGI MODE ACTIVATED");

})();
