function drawRearBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#fffaf1");
  gradient.addColorStop(1, "#f7efe1");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#9da8b3";
  ctx.strokeRect(14, 14, width - 28, height - 28);
}

function drawWatermark(ctx, width, height) {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-24 * Math.PI) / 180);
  ctx.font = "bold 96px 'Avenir Next', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(90, 96, 110, 0.17)";
  ctx.fillText("VOID", 0, 0);
  ctx.restore();
}

export function renderRear(ctx, sample) {
  const { width, height } = ctx.canvas;
  drawRearBackground(ctx, width, height);
  drawWatermark(ctx, width, height);

  ctx.strokeStyle = "#68737d";
  ctx.setLineDash([8, 4]);
  ctx.strokeRect(32, 28, width - 64, 95);
  ctx.setLineDash([]);

  ctx.fillStyle = "#2f3f4d";
  ctx.font = "600 18px 'Trebuchet MS', sans-serif";
  ctx.fillText("Endorse Here (Synthetic Test Area)", 44, 58);

  ctx.font = "14px 'Trebuchet MS', sans-serif";
  ctx.fillText("Synthetic Identifier:", 44, 175);
  ctx.fillText(sample.fictionalIdentifier, 220, 175);
  ctx.fillText("Bank Label:", 44, 210);
  ctx.fillText(sample.bankName, 220, 210);
  ctx.fillText("Not negotiable. Fictional-only rendering for testing.", 44, 260);
}
