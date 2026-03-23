export function applyPreset(config, presets, presetId) {
  const preset = presets.find((entry) => entry.id === presetId);
  if (!preset) {
    return config;
  }

  return {
    ...config,
    presetId: preset.id,
    effects: {
      ...config.effects,
      ...preset.effects
    },
    visibility: {
      ...config.visibility,
      ...preset.visibility
    },
    amountRange: preset.amountRange
      ? { ...config.amountRange, ...preset.amountRange }
      : config.amountRange
  };
}
