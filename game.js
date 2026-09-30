const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 30,
  height: 60,
  angle: 0
};

const arrows = [];
const targets = [];
let score = 0;
let gameOver = false;

const keys = {
  left: false,
  right: false
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === " ") {
    e.preventDefault();
    shootArrow();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

function shootArrow() {
  if (gameOver) return;

  const arrow = {
    x: player.x,
    y: player.y - 10,
    speed: 8,
    angle: player.angle
  };
  arrows.push(arrow);
}

function createTarget() {
  const target = {
    x: Math.random() * (canvas.width - 60),
    y: -30,
    radius: 20,
    speed: 2 + Math.random() * 2
  };
  targets.push(target);
}

function updatePlayer() {
  if (keys.left) player.angle -= 0.08;
  if (keys.right) player.angle += 0.08;

  // clamp angle
  player.angle = Math.max(-1.3, Math.min(1.3, player.angle));
}

function updateArrows() {
  for (let i = arrows.length - 1; i >= 0; i--) {
    const arrow = arrows[i];
    arrow.x += Math.sin(arrow.angle) * arrow.speed;
    arrow.y -= Math.cos(arrow.angle) * arrow.speed;

    if (arrow.y < -20 || arrow.x < -20 || arrow.x > canvas.width + 20) {
      arrows.splice(i, 1);
    }
  }
}

function updateTargets() {
  for (let i = targets.length - 1; i >= 0; i--) {
    const target = targets[i];
    target.y += target.speed;

    if (target.y > canvas.height + 30) {
      targets.splice(i, 1);
      gameOver = true;
    }
  }
}

function checkCollisions() {
  for (let i = arrows.length - 1; i >= 0; i--) {
    for (let j = targets.length - 1; j >= 0; j--) {
      const arrow = arrows[i];
      const target = targets[j];
      const dx = arrow.x - target.x;
      const dy = arrow.y - target.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < target.radius + 6) {
        arrows.splice(i, 1);
        targets.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);
  ctx.fillStyle = "#374151";
  ctx.fillRect(-4, -player.height / 2, 8, player.height);
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.moveTo(0, -player.height / 2);
  ctx.lineTo(12, -player.height / 2 - 20);
  ctx.lineTo(-12, -player.height / 2 - 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawArrows() {
  arrows.forEach((arrow) => {
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(arrow.angle);
    ctx.fillStyle = "#111827";
    ctx.fillRect(-2, -10, 4, 20);
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(5, 0);
    ctx.lineTo(-5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawTargets() {
  targets.forEach((target) => {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#fca5a5";
    ctx.fill();
  });
}

function drawScore() {
  ctx.fillStyle = "#111827";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

function drawGameOver() {
  if (!gameOver) return;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "42px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
  ctx.font = "24px Arial";
  ctx.fillText("Press F5 to restart", canvas.width / 2 - 110, canvas.height / 2 + 40);
}

setInterval(createTarget, 900);

function loop() {
  if (!gameOver) {
    updatePlayer();
    updateArrows();
    updateTargets();
    checkCollisions();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawArrows();
  drawTargets();
  drawScore();
  drawGameOver();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);