'use strict';

const cache = new Map();

async function renderOwnerAvatarCard(owner) {
  if (!owner?.user) return null;
  let canvasLib;
  try {
    canvasLib = require('@napi-rs/canvas');
  } catch {
    return null;
  }
  const avatarUrl = owner.user.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true });
  const key = `${owner.id}:${avatarUrl}`;
  if (cache.has(key)) return cache.get(key);

  const { createCanvas, loadImage } = canvasLib;
  const canvas = createCanvas(640, 230);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const image = await loadImage(avatarUrl);
  const cx = 320, cy = 112, radius = 82;

  ctx.beginPath();
  ctx.arc(cx, cy, radius + 7, 0, Math.PI * 2);
  ctx.strokeStyle = '#8899E8';
  ctx.lineWidth = 7;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  const buffer = canvas.toBuffer('image/png');
  cache.clear(); // rooms refresh often; keep memory bounded and only latest avatar render
  cache.set(key, buffer);
  return buffer;
}

module.exports = { renderOwnerAvatarCard };
