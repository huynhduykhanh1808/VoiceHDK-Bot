'use strict';

const cache = new Map();

function fitFont(ctx, text, maxWidth, startSize = 30, minSize = 18, weight = 700) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1;
  }
  ctx.font = `${weight} ${size}px sans-serif`;
  return size;
}

function drawCenteredDecoratedLine(ctx, y, text, width, leftChar, rightChar) {
  const margin = 44;
  const innerWidth = width - margin * 2;
  const label = `✦ ${text} ✦`;
  fitFont(ctx, label, innerWidth - 54, 28, 17, 700);
  const labelWidth = ctx.measureText(label).width;
  const dashWidth = Math.max(0, (innerWidth - labelWidth - 34) / 2);

  ctx.strokeStyle = '#8b9cf5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margin + 10, y);
  ctx.lineTo(margin + 10 + dashWidth, y);
  ctx.moveTo(width - margin - 10 - dashWidth, y);
  ctx.lineTo(width - margin - 10, y);
  ctx.stroke();

  ctx.fillStyle = '#dce2ff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, width / 2, y);

  ctx.font = '28px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(leftChar, margin - 3, y + 1);
  ctx.textAlign = 'right';
  ctx.fillText(rightChar, width - margin + 3, y + 1);
}

async function renderRoomCard({ owner, ownerName, memberCount, limit, locked, hidden, region, roomName, signature }) {
  if (!owner?.user) return null;
  let canvasLib;
  try {
    canvasLib = require('@napi-rs/canvas');
  } catch {
    return null;
  }

  const avatarUrl = owner.user.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true });
  const cacheKey = JSON.stringify({ avatarUrl, ownerName, memberCount, limit, locked, hidden, region, roomName, signature });
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const { createCanvas, loadImage } = canvasLib;
  const canvas = createCanvas(760, 690);
  const ctx = canvas.getContext('2d');

  // One unified card: avatar + room information + server signature.
  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, '#111522');
  bg.addColorStop(1, '#181b2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle outer border.
  ctx.strokeStyle = '#343b67';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  const image = await loadImage(avatarUrl);
  const cx = canvas.width / 2, cy = 126, radius = 72;

  // Permanent blue/purple glow; intentionally not tied to speaking events.
  for (let i = 18; i >= 2; i -= 4) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(112, 132, 255, ${0.035 + (18 - i) * 0.004})`;
    ctx.lineWidth = i;
    ctx.stroke();
  }
  const ring = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  ring.addColorStop(0, '#6ea8ff');
  ring.addColorStop(1, '#a879ff');
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 7, 0, Math.PI * 2);
  ctx.strokeStyle = ring;
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  const title = `🔊 ${String(roomName || `PHÒNG CỦA ${ownerName}`).toUpperCase()}`;
  drawCenteredDecoratedLine(ctx, 255, title, canvas.width, '╭', '╮');

  const rows = [
    ['👑 Chủ phòng', `@${ownerName}`],
    ['👥 Thành viên', `${memberCount} / ${limit}`],
    ['🔓 Phòng', locked ? 'Đang khóa' : 'Đang mở'],
    ['👁 Hiển thị', hidden ? 'Đang ẩn' : 'Công khai'],
    ['🌐 Khu vực', region]
  ];

  let y = 326;
  for (const [label, value] of rows) {
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f0f2ff';
    ctx.font = '600 25px sans-serif';
    ctx.fillText(label, 100, y);
    ctx.fillStyle = '#c8cdea';
    fitFont(ctx, String(value), 315, 25, 17, 500);
    ctx.fillText(String(value), 405, y);
    y += 58;
  }

  drawCenteredDecoratedLine(ctx, 625, String(signature || 'VoiceHDK Bot'), canvas.width, '╰', '╯');

  const buffer = canvas.toBuffer('image/png');
  // Keep memory bounded while still avoiding repeated renders for the current state.
  if (cache.size >= 24) cache.clear();
  cache.set(cacheKey, buffer);
  return buffer;
}

// Kept for compatibility with any old import/call site.
async function renderOwnerAvatarCard(owner) {
  return renderRoomCard({
    owner,
    ownerName: owner?.displayName || owner?.user?.username || 'Owner',
    memberCount: 1,
    limit: '∞',
    locked: false,
    hidden: false,
    region: 'Tự động',
    roomName: `PHÒNG CỦA ${owner?.displayName || owner?.user?.username || 'OWNER'}`,
    signature: 'VoiceHDK Bot'
  });
}

module.exports = { renderRoomCard, renderOwnerAvatarCard };
