export function withCanvasEffects(ctx, effects, drawFn) {
  ctx.save();
  ctx.filter = `blur(${effects.blur}px) brightness(${effects.brightness})`;
  drawFn();
  ctx.restore();
}

export function withRotation(ctx, width, height, rotationDegrees, drawFn) {
  const radians = (rotationDegrees * Math.PI) / 180;
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(radians);
  ctx.translate(-width / 2, -height / 2);
  drawFn();
  ctx.restore();
}
