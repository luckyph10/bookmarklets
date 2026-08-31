(() => {

if (window.POGI_MODE_ACTIVE) return;
window.POGI_MODE_ACTIVE = true;

const hero = document.createElement("img");

hero.src =
"https://luckyph10.github.io/feeling_pogi_yarn/image.png";

hero.style.position = "fixed";
hero.style.width = "280px";
hero.style.height = "auto";
hero.style.left = "100px";
hero.style.top = "100px";
hero.style.zIndex = "999999999";
hero.style.pointerEvents = "auto";
hero.style.userSelect = "none";
hero.style.transition = "filter .2s";

document.body.appendChild(hero);

// CAPE

const cape = document.createElement("div");

cape.style.position = "fixed";
cape.style.width = "90px";
cape.style.height = "150px";
cape.style.background =
"linear-gradient(to bottom,#ff0000,#880000)";
cape.style.clipPath =
"polygon(20% 0%,80% 0%,100% 100%,0% 100%)";
cape.style.zIndex = "999999998";
cape.style.pointerEvents = "none";

document.body.appendChild(cape);

// VARIABLES

let x = 100;
let y = 120;

let dx = 15;
let dy = 10;

let speed = 1;

const imageWidth = 280;
const imageHeight = 380;

// BOOST TEXT

function showText(msg, px, py) {

    const div = document.createElement("div");

    div.innerHTML = msg;

    div.style.position = "fixed";
    div.style.left = px + "px";
    div.style.top = py + "px";
    div.style.fontSize = "28px";
    div.style.fontWeight = "bold";
    div.style.color = "red";
    div.style.zIndex = "999999999";

    document.body.appendChild(div);

    let opacity = 1;

    const anim = setInterval(() => {

        py -= 2;
        opacity -= 0.03;

        div.style.top = py + "px";
        div.style.opacity = opacity;

        if (opacity <= 0) {
            clearInterval(anim);
            div.remove();
        }

    },16);
}

// SPEED TRAILS

function trail() {

    const smoke =
        document.createElement("div");

    smoke.innerHTML = "💨";

    smoke.style.position = "fixed";
    smoke.style.left = (x + 100) + "px";
    smoke.style.top = (y + 120) + "px";
    smoke.style.fontSize = "30px";
    smoke.style.pointerEvents = "none";
    smoke.style.zIndex = "999999990";

    document.body.appendChild(smoke);

    setTimeout(() => {
        smoke.remove();
    },500);
}

// BOOST

hero.addEventListener("mouseenter", () => {

    speed += 1;

    if(speed > 6) speed = 6;

    hero.style.filter =
    "drop-shadow(0 0 25px gold)";

    showText("🚀 POGI BOOST!",x,y);

    setTimeout(() => {

        hero.style.filter =
        "drop-shadow(0 10px 20px rgba(0,0,0,.4))";

    },500);

});

// TURBO

hero.addEventListener("dblclick", () => {

    speed = 10;

    showText("⚡ TURBO POGI ⚡",x,y);

    setTimeout(() => {
        speed = 2;
    },3000);

});

// FLYING

function animate() {

    x += dx * speed;
    y += dy * speed;

    if(x <= 0){

        dx = Math.abs(dx);

        showText("💥",x,y);
    }

    if(x + imageWidth >= innerWidth){

        dx = -Math.abs(dx);

        showText("💥",x,y);
    }

    if(y <= 0){

        dy = Math.abs(dy);

        showText("💥",x,y);
    }

    if(y + imageHeight >= innerHeight){

        dy = -Math.abs(dy);

        showText("💥",x,y);
    }

    hero.style.left = x + "px";
    hero.style.top = y + "px";

    // SUPERMAN FLYING ANGLE

    const angle =
    Math.atan2(dy,dx) * 180 / Math.PI;

    hero.style.transform =
    `rotate(${angle}deg)`;

    // CAPE POSITION

    const capeX =
    x + imageWidth/2 -
    Math.cos(angle * Math.PI/180) * 90;

    const capeY =
    y + imageHeight/2 -
    Math.sin(angle * Math.PI/180) * 90;

    cape.style.left = capeX + "px";
    cape.style.top = capeY + "px";

    cape.style.transform =
    `rotate(${angle + 180}deg)
     skewX(${Math.sin(Date.now()/100)*10}deg)`;

    if(Math.random() < 0.15){
        trail();
    }

    requestAnimationFrame(animate);
}

animate();

// ESC REMOVE

window.addEventListener("keydown", e => {

    if(e.key === "Escape"){

        hero.remove();
        cape.remove();

        window.POGI_MODE_ACTIVE = false;
    }
});

console.log("🦸 SUPER POGI MODE ACTIVATED");

})();
