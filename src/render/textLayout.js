export function drawLabelValue(ctx, label, value, x, y, options = {}) {
  const {
    labelColor = "#3f4c57",
    valueColor = "#1e2730",
    labelFont = "12px 'Trebuchet MS', sans-serif",
    valueFont = "18px 'Trebuchet MS', sans-serif"
  } = options;

  ctx.fillStyle = labelColor;
  ctx.font = labelFont;
  ctx.fillText(label, x, y);

  ctx.fillStyle = valueColor;
  ctx.font = valueFont;
  ctx.fillText(value, x, y + 20);
}

export function drawRule(ctx, x, y, width, color = "#b8c2cc") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
}
