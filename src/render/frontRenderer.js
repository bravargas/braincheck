import { drawLabelValue, drawRule } from "./textLayout.js";

function drawBackground(ctx, sample, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, sample.template.background || "#f8fafc");
  gradient.addColorStop(1, "#ffffff");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = sample.template.accent || "#2c4a5e";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, width - 32, height - 32);
}

function drawWatermark(ctx, width, height, text) {
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-20 * Math.PI) / 180);
  ctx.font = "bold 84px 'Avenir Next', sans-serif";
  ctx.fillStyle = "rgba(162, 59, 42, 0.22)";
  ctx.textAlign = "center";
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function renderFront(ctx, sample) {
  const { width, height } = ctx.canvas;
  const vis = sample.scenario.visibility;

  drawBackground(ctx, sample, width, height);
  drawWatermark(ctx, width, height, sample.watermark);

  ctx.fillStyle = "#2a3945";
  ctx.font = "700 26px 'Avenir Next', sans-serif";
  ctx.fillText(sample.bankName, 32, 56);

  ctx.font = "14px 'Trebuchet MS', sans-serif";
  ctx.fillText(`Template: ${sample.template.name}`, 34, 78);
  ctx.fillText(`Check No: ${sample.checkNumber}`, width - 180, 54);

  if (vis.showDate) {
    drawLabelValue(ctx, "Date", sample.date, width - 220, 92);
    drawRule(ctx, width - 230, 120, 180);
  }

  drawLabelValue(ctx, "Pay to the Order of", vis.showPayee ? sample.payee : "", 36, 116);
  drawRule(ctx, 36, 145, width - 290);

  const amountValue = vis.showAmount ? `$${sample.amount.toFixed(2)}` : "";
  drawLabelValue(ctx, "Amount", amountValue, width - 220, 146);
  drawRule(ctx, width - 230, 176, 180);

  drawLabelValue(ctx, "Amount in Words", vis.showAmount ? sample.amountWords : "", 36, 190, {
    valueFont: "16px 'Trebuchet MS', sans-serif"
  });
  drawRule(ctx, 36, 220, width - 72);

  drawLabelValue(ctx, "Payor", sample.payor, 36, 262);
  drawLabelValue(ctx, "Memo", sample.memo, 36, 320);

  if (vis.showSignature) {
    drawLabelValue(ctx, "Signature", sample.signature, width - 300, 320);
    drawRule(ctx, width - 300, 350, 240);
  }

  if (vis.showMicr) {
    ctx.font = "16px 'Consolas', monospace";
    ctx.fillStyle = "#1d2a36";
    ctx.fillText(sample.micrDemoLine, 36, height - 24);
  }
}
