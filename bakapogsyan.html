<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Flying Super Lucky</title>

<style>
body {
    margin: 0;
    overflow: hidden;
    background: linear-gradient(135deg, #87ceeb, #dff6ff);
    cursor: crosshair;
}

#hero {
    position: absolute;
    width: 180px;
    height: auto;
    user-select: none;
    pointer-events: auto;
    z-index: 2;
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
}

/* Superman Cape */
#cape {
    position: absolute;
    width: 90px;
    height: 120px;
    background: red;
    clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
    transform-origin: top center;
    z-index: 1;
    filter: drop-shadow(0 5px 8px rgba(0,0,0,0.3));
}

.speedText {
    position: absolute;
    font-family: Arial, sans-serif;
    font-weight: bold;
    color: red;
    font-size: 20px;
    pointer-events: none;
    animation: pop 0.8s forwards;
}

@keyframes pop {
    from {
        opacity: 1;
        transform: scale(0.5);
    }
    to {
        opacity: 0;
        transform: scale(2);
    }
}
</style>
</head>
<body>

<div id="cape"></div>
image.png

<script>
const hero = document.getElementById("hero");
const cape = document.getElementById("cape");

let x = 100;
let y = 100;

let dx = 8;
let dy = 6;

let speedMultiplier = 1;

function createBoostText(x, y) {
    const text = document.createElement("div");
    text.className = "speedText";
    text.innerText = "🚀 SPEED BOOST!";
    text.style.left = x + "px";
    text.style.top = y + "px";
    document.body.appendChild(text);

    setTimeout(() => text.remove(), 800);
}

function animate() {

    const w = hero.offsetWidth;
    const h = hero.offsetHeight;

    x += dx * speedMultiplier;
    y += dy * speedMultiplier;

    if (x <= 0 || x + w >= window.innerWidth) {
        dx *= -1;
    }

    if (y <= 0 || y + h >= window.innerHeight) {
        dy *= -1;
    }

    hero.style.left = x + "px";
    hero.style.top = y + "px";

    /* Cape follows behind */
    cape.style.left = (x + w/2 - 45 - Math.sign(dx)*20) + "px";
    cape.style.top = (y + 20) + "px";

    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    hero.style.transform = `rotate(${angle * 0.08}deg)`;
    cape.style.transform =
      `rotate(${angle * 0.08 - 20}deg) skewX(${Math.sin(Date.now()/100)*10}deg)`;

    requestAnimationFrame(animate);
}

hero.addEventListener("mouseenter", () => {

    speedMultiplier += 1.5;

    createBoostText(x, y);

    hero.style.transform += " scale(1.1)";

    setTimeout(() => {
        speedMultiplier *= 0.9;
    }, 1000);

    setTimeout(() => {
        speedMultiplier *= 0.9;
    }, 2000);
});

window.addEventListener("resize", () => {
    x = Math.min(x, window.innerWidth - hero.offsetWidth);
    y = Math.min(y, window.innerHeight - hero.offsetHeight);
});

animate();
</script>

</body>
</html>
