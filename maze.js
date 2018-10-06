var Handlers = require("./utils/handlers");

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("canvasEl");
  canvasEl.width = 820;
  canvasEl.height = 820;
  const ctx = canvasEl.getContext("2d");
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 800, 800);

  Handlers.buildMaze(ctx);
})
