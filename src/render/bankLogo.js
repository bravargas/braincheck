function hashStringToUint32(text) {
  let hash = 2166136261;
  const input = String(text || "");
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededNext(state) {
  let x = state >>> 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

function colorFromSeed(seed, minLightness, maxLightness) {
  const hue = seed % 360;
  const sat = 58 + (seed % 20);
  const light = minLightness + (seed % (maxLightness - minLightness + 1));
  return `hsl(${hue} ${sat}% ${light}%)`;
}

function drawCellShape(ctx, x, y, size, shapeType) {
  const right = x + size;
  const bottom = y + size;
  const midX = x + size / 2;
  const midY = y + size / 2;

  ctx.beginPath();
  if (shapeType === 0) {
    ctx.rect(x, y, size, size);
  } else if (shapeType === 1) {
    ctx.moveTo(x, y);
    ctx.lineTo(right, y);
    ctx.lineTo(x, bottom);
    ctx.closePath();
  } else if (shapeType === 2) {
    ctx.moveTo(right, y);
    ctx.lineTo(right, bottom);
    ctx.lineTo(x, bottom);
    ctx.closePath();
  } else {
    ctx.moveTo(midX, y);
    ctx.lineTo(right, midY);
    ctx.lineTo(midX, bottom);
    ctx.lineTo(x, midY);
    ctx.closePath();
  }
  ctx.fill();
}

export function drawBankLogo(ctx, rtn, x, y, size) {
  const seedBase = hashStringToUint32(rtn || "000000000");
  let seed = seedBase;

  const bgColor = colorFromSeed(seedBase + 11, 90, 95);
  const primaryColor = colorFromSeed(seedBase + 23, 28, 38);
  const secondaryColor = colorFromSeed(seedBase + 47, 45, 55);

  ctx.save();

  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, size, size);

  const inset = Math.max(2, Math.round(size * 0.06));
  const inner = size - inset * 2;
  const grid = 4;
  const cell = inner / grid;
  const halfCols = Math.ceil(grid / 2);

  for (let row = 0; row < grid; row += 1) {
    for (let col = 0; col < halfCols; col += 1) {
      seed = seededNext(seed);
      const drawFilled = (seed & 3) !== 0;
      if (!drawFilled) {
        continue;
      }

      seed = seededNext(seed);
      const shapeType = seed % 4;

      seed = seededNext(seed);
      ctx.fillStyle = (seed & 1) === 0 ? primaryColor : secondaryColor;

      const leftX = x + inset + col * cell;
      const rightCol = grid - 1 - col;
      const rightX = x + inset + rightCol * cell;
      const cellY = y + inset + row * cell;

      drawCellShape(ctx, leftX, cellY, cell, shapeType);
      if (rightCol !== col) {
        drawCellShape(ctx, rightX, cellY, cell, shapeType);
      }
    }
  }

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
  ctx.restore();
}