import { drawLabelValue, drawRule } from "./textLayout.js";
import { drawBankLogo } from "./bankLogo.js";

function formatDateMMDDYYYY(dateStr) {
  if (!dateStr || dateStr.length < 10) return dateStr;
  const [year, month, day] = dateStr.split('-');
  return `${month}/${day}/${year}`;
}

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
  ctx.font = "bold 42px 'Avenir Next', sans-serif";
  ctx.fillStyle = "rgba(162, 59, 42, 0.08)";
  ctx.textAlign = "center";
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function renderFront(ctx, sample) {
  const { width, height } = ctx.canvas;
  const vis = sample.scenario.visibility;

  drawBackground(ctx, sample, width, height);
  if (vis.showWatermark) {
    drawWatermark(ctx, width, height, sample.watermark);
  }

  ctx.fillStyle = "#2a3945";
  ctx.font = "700 26px 'Avenir Next', sans-serif";
  ctx.fillText(sample.payor, 32, 56);

  ctx.font = "14px 'Trebuchet MS', sans-serif";
  ctx.fillStyle = "#3f4c57";
  ctx.fillText(sample.payorAddress || "", 34, 78);
  ctx.font = "500 24px 'Trebuchet MS', sans-serif";
  ctx.fillStyle = "#2a3945";
  ctx.fillText(sample.checkNumber, width - 160, 64);

  if (vis.showDate) {
    const dateLineX = width - 390;
    const dateLineY = 122;
    const dateLineWidth = 220;

    ctx.fillStyle = "#1e2730";
    ctx.font = "400 22px 'Trebuchet MS', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(formatDateMMDDYYYY(sample.date), dateLineX + dateLineWidth / 2, 116);
    ctx.textAlign = "left";

    drawRule(ctx, dateLineX, dateLineY, dateLineWidth, "#1e2730");
    ctx.font = "400 16px 'Trebuchet MS', sans-serif";
    ctx.fillText("Date", dateLineX + dateLineWidth - 36, 152);
  }

  drawLabelValue(ctx, "Pay to the Order of", vis.showPayee ? sample.payee : "", 36, 146, {
    valueFont: "700 20px 'Trebuchet MS', sans-serif"
  });
  drawRule(ctx, 36, 171, width - 290);

  const amountValue = vis.showAmount ? `$${sample.amount.toFixed(2)}` : "";
  drawLabelValue(ctx, "Amount", amountValue, width - 220, 178, {
    valueFont: "700 22px 'Trebuchet MS', sans-serif"
  });
  drawRule(ctx, width - 230, 202, 180);

  drawLabelValue(ctx, "Amount in Words", vis.showAmount ? sample.amountWords : "", 36, 224, {
    valueFont: "600 18px 'Trebuchet MS', sans-serif"
  });
  drawRule(ctx, 36, 248, width - 72);

  const bankLogoX = 36;
  const bankLogoY = 264;
  const bankLogoSize = 44;
  const bankTextX = bankLogoX + bankLogoSize + 16;

  drawBankLogo(ctx, sample.bankRtn, bankLogoX, bankLogoY, bankLogoSize);

  // Bank name sin label, fuente más grande
  ctx.fillStyle = "#1e2730";
  ctx.font = "18px 'Trebuchet MS', sans-serif";
  ctx.fillText(sample.bankName, bankTextX, 284);

  ctx.fillStyle = "#3f4c57";
  ctx.font = "14px 'Trebuchet MS', sans-serif";
  ctx.fillText(`${sample.bankCity}, ${sample.bankState}`, bankTextX, 308);
  drawLabelValue(ctx, "For", sample.memo, 36, 332);

  if (vis.showSignature) {
    const signatureFontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--signature-font-family").trim() ||
      "'Brush Script MT', cursive";
    const signatureX = width - 300;
    const signatureLabelY = 285;
    const signatureValueY = 326;
    const signatureRuleY = 330;
    const signatureRuleWidth = 240;
    const signatureMaxWidth = signatureRuleWidth - 8;

    let signatureFontSize = 34;
    ctx.font = `${signatureFontSize}px ${signatureFontFamily}`;
    let signatureWidth = ctx.measureText(sample.signature).width;

    while (signatureWidth > signatureMaxWidth && signatureFontSize > 16) {
      signatureFontSize -= 1;
      ctx.font = `${signatureFontSize}px ${signatureFontFamily}`;
      signatureWidth = ctx.measureText(sample.signature).width;
    }

    ctx.fillStyle = "#3f4c57";
    ctx.font = "12px 'Trebuchet MS', sans-serif";
    ctx.fillText("Signature", signatureX, signatureLabelY);

    ctx.fillStyle = "#0047AB";
    ctx.font = `${signatureFontSize}px ${signatureFontFamily}`;
    ctx.fillText(sample.signature, signatureX, signatureValueY);

    drawRule(ctx, signatureX, signatureRuleY, signatureRuleWidth);
  }

  if (vis.showMicr) {
    const micrFontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--micr-font-family").trim() ||
      "'Consolas', monospace";

    // Scale MICR size to use around 3/4 of the check width.
    let micrFontSize = Math.max(22, Math.round(height * 0.072));
    const micrX = 34;
    const micrBaselineY = height - 30;
    const targetMicrWidth = width * 0.65;

    ctx.font = `${micrFontSize}px ${micrFontFamily}`;
    let micrTextWidth = ctx.measureText(sample.micrLine).width;

    if (micrTextWidth > 0) {
      const scaleToTarget = targetMicrWidth / micrTextWidth;
      const maxFontSize = Math.max(36, Math.round(height * 0.14));
      micrFontSize = Math.max(12, Math.min(maxFontSize, Math.round(micrFontSize * scaleToTarget)));
      ctx.font = `${micrFontSize}px ${micrFontFamily}`;
      micrTextWidth = ctx.measureText(sample.micrLine).width;
    }

    ctx.fillStyle = "#1d2a36";
    ctx.fillText(sample.micrLine, micrX, micrBaselineY);
  }
}
