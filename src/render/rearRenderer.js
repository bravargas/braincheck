function hexToRgba(hex, alpha) {
  const value = String(hex || "").replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return `rgba(44, 74, 94, ${alpha})`;
  }

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawRearBackground(ctx, sample, width, height) {
  const base = sample.template.background || "#f8fafc";
  const accent = sample.template.accent || "#2c4a5e";
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, base);
  gradient.addColorStop(1, "#ffffff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = hexToRgba(accent, 0.7);
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, width - 28, height - 28);
}

function drawWatermark(ctx, sample, width, height) {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  // Rear rendering rotates the whole canvas 90deg, so use -110deg here
  // to preserve the same final on-screen watermark angle as the front.
  ctx.rotate((-110 * Math.PI) / 180);
  ctx.font = "bold 42px 'Avenir Next', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(162, 59, 42, 0.08)";
  ctx.fillText(sample.watermark, 0, 0);
  ctx.restore();
}

export function renderRear(ctx, sample) {
  const { width, height } = ctx.canvas;
  const vis = sample.scenario.visibility;

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((90 * Math.PI) / 180);
  ctx.translate(-height / 2, -width / 2);

  drawRearBackground(ctx, sample, height, width);
  if (vis.showWatermark) {
    drawWatermark(ctx, sample, height, width);
  }

  ctx.strokeStyle = hexToRgba(sample.template.accent || "#2c4a5e", 0.55);
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  ctx.strokeRect(32, 28, height - 64, 95);
  ctx.setLineDash([]);

  ctx.fillStyle = "#2a3945";
  ctx.font = "600 18px 'Trebuchet MS', sans-serif";
  ctx.fillText("Endorse Here", 44, 58);

  if (vis.showEndorsementSignature !== false) {
    const signatureFontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--signature-font-family").trim() ||
      "'Brush Script MT', cursive";
    ctx.fillStyle = "#0047AB";
    ctx.font = `24px ${signatureFontFamily}`;
    ctx.fillText(sample.payee, 50, 96);
  }

  ctx.fillStyle = "#2a3945";
  ctx.font = "14px 'Trebuchet MS', sans-serif";
  ctx.fillText("Synthetic Identifier:", 44, 175);
  ctx.fillText(sample.checkIdentifier, 220, 175);
  ctx.fillText("Bank Label:", 44, 210);
  ctx.fillText(sample.bankName, 220, 210);
  ctx.fillText("Not negotiable. Synthetic-only rendering for testing.", 44, 260);

  ctx.restore();
}
