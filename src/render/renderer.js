import { withCanvasEffects, withRotation } from "./effects.js";
import { renderFront } from "./frontRenderer.js";
import { renderRear } from "./rearRenderer.js";

export function renderSample(frontCtx, rearCtx, sample, effects) {
  const frontDraw = () => {
    frontCtx.clearRect(0, 0, frontCtx.canvas.width, frontCtx.canvas.height);
    renderFront(frontCtx, sample);
  };

  const rearDraw = () => {
    rearCtx.clearRect(0, 0, rearCtx.canvas.width, rearCtx.canvas.height);
    renderRear(rearCtx, sample);
  };

  withRotation(frontCtx, frontCtx.canvas.width, frontCtx.canvas.height, effects.rotation, () => {
    withCanvasEffects(frontCtx, effects, frontDraw);
  });

  withRotation(rearCtx, rearCtx.canvas.width, rearCtx.canvas.height, effects.rotation, () => {
    withCanvasEffects(rearCtx, effects, rearDraw);
  });
}
