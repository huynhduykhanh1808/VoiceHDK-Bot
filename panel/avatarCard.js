'use strict';

const cache = new Map();

/**
 * Thu nhỏ font cho tới khi text vừa maxWidth.
 */
function fitFont(
  ctx,
  text,
  maxWidth,
  startSize = 30,
  minSize = 18,
  weight = 700
) {
  let size = startSize;

  while (size > minSize) {
    ctx.font = `${weight} ${size}px sans-serif`;

    if (ctx.measureText(text).width <= maxWidth) {
      break;
    }

    size -= 1;
  }

  ctx.font = `${weight} ${size}px sans-serif`;
  return size;
}

/**
 * Vẽ icon đơn giản bằng Canvas thay cho emoji Unicode.
 *
 * Lý do:
 * Font trong môi trường Render/Linux có thể không có emoji,
 * khiến Canvas render thành ô vuông □.
 */
function drawIcon(ctx, type, x, y, size = 24) {
  ctx.save();

  ctx.lineWidth = Math.max(2, size * 0.08);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (type) {
    // Loa
    case 'speaker': {
      ctx.fillStyle = '#8fc7ff';

      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.38);
      ctx.lineTo(x + size * 0.28, y + size * 0.38);
      ctx.lineTo(x + size * 0.58, y + size * 0.12);
      ctx.lineTo(x + size * 0.58, y + size * 0.88);
      ctx.lineTo(x + size * 0.28, y + size * 0.62);
      ctx.lineTo(x, y + size * 0.62);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#8fc7ff';

      ctx.beginPath();
      ctx.arc(
        x + size * 0.55,
        y + size * 0.5,
        size * 0.24,
        -Math.PI / 3,
        Math.PI / 3
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        x + size * 0.55,
        y + size * 0.5,
        size * 0.4,
        -Math.PI / 3,
        Math.PI / 3
      );
      ctx.stroke();

      break;
    }

    // Vương miện
    case 'crown': {
      ctx.fillStyle = '#ffd76a';

      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.72);
      ctx.lineTo(x + size * 0.12, y + size * 0.25);
      ctx.lineTo(x + size * 0.34, y + size * 0.5);
      ctx.lineTo(x + size * 0.5, y + size * 0.16);
      ctx.lineTo(x + size * 0.66, y + size * 0.5);
      ctx.lineTo(x + size * 0.88, y + size * 0.25);
      ctx.lineTo(x + size, y + size * 0.72);
      ctx.closePath();
      ctx.fill();

      ctx.fillRect(
        x + size * 0.08,
        y + size * 0.74,
        size * 0.84,
        size * 0.14
      );

      break;
    }

    // Thành viên
    case 'members': {
      ctx.fillStyle = '#9a7cff';

      ctx.beginPath();
      ctx.arc(
        x + size * 0.34,
        y + size * 0.32,
        size * 0.2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        x + size * 0.7,
        y + size * 0.38,
        size * 0.16,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        x + size * 0.34,
        y + size * 0.94,
        size * 0.36,
        Math.PI,
        Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        x + size * 0.72,
        y + size * 0.94,
        size * 0.28,
        Math.PI,
        Math.PI * 2
      );
      ctx.fill();

      break;
    }

    // Khóa / mở
    case 'lock': {
      ctx.strokeStyle = '#ffcf66';
      ctx.fillStyle = '#ffcf66';

      ctx.beginPath();
      ctx.arc(
        x + size * 0.5,
        y + size * 0.38,
        size * 0.25,
        Math.PI,
        Math.PI * 2
      );
      ctx.stroke();

      ctx.fillRect(
        x + size * 0.2,
        y + size * 0.42,
        size * 0.6,
        size * 0.46
      );

      break;
    }

    // Mắt
    case 'eye': {
      ctx.strokeStyle = '#d8def8';

      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.5);

      ctx.bezierCurveTo(
        x + size * 0.22,
        y + size * 0.15,
        x + size * 0.78,
        y + size * 0.15,
        x + size,
        y + size * 0.5
      );

      ctx.bezierCurveTo(
        x + size * 0.78,
        y + size * 0.85,
        x + size * 0.22,
        y + size * 0.85,
        x,
        y + size * 0.5
      );

      ctx.stroke();

      ctx.fillStyle = '#d8def8';

      ctx.beginPath();
      ctx.arc(
        x + size * 0.5,
        y + size * 0.5,
        size * 0.14,
        0,
        Math.PI * 2
      );
      ctx.fill();

      break;
    }

    // Quả địa cầu
    case 'globe': {
      ctx.strokeStyle = '#65cfff';

      ctx.beginPath();
      ctx.arc(
        x + size * 0.5,
        y + size * 0.5,
        size * 0.43,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(
        x + size * 0.5,
        y + size * 0.5,
        size * 0.2,
        size * 0.43,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + size * 0.1, y + size * 0.5);
      ctx.lineTo(x + size * 0.9, y + size * 0.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + size * 0.18, y + size * 0.3);
      ctx.lineTo(x + size * 0.82, y + size * 0.3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + size * 0.18, y + size * 0.7);
      ctx.lineTo(x + size * 0.82, y + size * 0.7);
      ctx.stroke();

      break;
    }

    default:
      break;
  }

  ctx.restore();
}

/**
 * Vẽ dòng trang trí:
 *
 * ╭──── ✦ TÊN PHÒNG ✦ ────╮
 *
 * hoặc:
 *
 * ╰──── ✦ TÊN SERVER ✦ ────╯
 *
 * Độ dài đường kẻ được tính theo pixel thực tế.
 */
function drawCenteredDecoratedLine(
  ctx,
  y,
  text,
  width,
  leftChar,
  rightChar,
  options = {}
) {
  const margin = 44;
  const innerWidth = width - margin * 2;

  const {
    icon = null,
    startSize = 28,
    minSize = 17
  } = options;

  const cleanText = String(text || '').trim();

  /*
   * Không đưa emoji vào chuỗi text.
   * Icon được Canvas tự vẽ riêng.
   */
  const label = `✦ ${cleanText} ✦`;

  fitFont(
    ctx,
    label,
    innerWidth - (icon ? 110 : 54),
    startSize,
    minSize,
    700
  );

  const textWidth = ctx.measureText(label).width;
  const iconSpace = icon ? 38 : 0;

  const totalLabelWidth = textWidth + iconSpace;

  const dashWidth = Math.max(
    0,
    (innerWidth - totalLabelWidth - 34) / 2
  );

  // Đường kẻ trái/phải
  ctx.strokeStyle = '#8b9cf5';
  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(margin + 10, y);
  ctx.lineTo(margin + 10 + dashWidth, y);

  ctx.moveTo(
    width - margin - 10 - dashWidth,
    y
  );

  ctx.lineTo(
    width - margin - 10,
    y
  );

  ctx.stroke();

  /*
   * Tính vị trí icon + chữ để cả cụm nằm giữa.
   */
  const groupStartX =
    width / 2 - totalLabelWidth / 2;

  if (icon) {
    drawIcon(
      ctx,
      icon,
      groupStartX,
      y - 13,
      26
    );
  }

  ctx.fillStyle = '#dce2ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.fillText(
    label,
    groupStartX + iconSpace,
    y
  );

  /*
   * Góc khung.
   *
   * Các ký tự ╭ ╮ ╰ ╯ thường được font Linux hỗ trợ.
   * Nếu môi trường nào vẫn lỗi, phần này có thể chuyển
   * sang Canvas line drawing mà không ảnh hưởng layout.
   */
  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#dce2ff';

  ctx.textAlign = 'left';
  ctx.fillText(
    leftChar,
    margin - 3,
    y + 1
  );

  ctx.textAlign = 'right';
  ctx.fillText(
    rightChar,
    width - margin + 3,
    y + 1
  );
}

/**
 * Vẽ một hàng thông tin.
 */
function drawInfoRow(
  ctx,
  {
    icon,
    label,
    value,
    y,
    iconX = 100,
    labelX = 142,
    valueX = 405
  }
) {
  drawIcon(
    ctx,
    icon,
    iconX,
    y - 13,
    26
  );

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  ctx.fillStyle = '#f0f2ff';
  ctx.font = '600 25px sans-serif';

  ctx.fillText(
    label,
    labelX,
    y
  );

  ctx.fillStyle = '#c8cdea';

  fitFont(
    ctx,
    String(value),
    285,
    25,
    17,
    500
  );

  ctx.fillText(
    String(value),
    valueX,
    y
  );
}

/**
 * Render toàn bộ panel phòng thành 1 ảnh duy nhất.
 */
async function renderRoomCard({
  owner,
  ownerName,
  memberCount,
  limit,
  locked,
  hidden,
  region,
  roomName,
  signature
}) {
  if (!owner?.user) {
    return null;
  }

  let canvasLib;

  try {
    canvasLib = require('@napi-rs/canvas');
  } catch {
    return null;
  }

  const avatarUrl = owner.user.displayAvatarURL({
    extension: 'png',
    size: 256,
    forceStatic: true
  });

  const cacheKey = JSON.stringify({
    avatarUrl,
    ownerName,
    memberCount,
    limit,
    locked,
    hidden,
    region,
    roomName,
    signature
  });

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const {
    createCanvas,
    loadImage
  } = canvasLib;

  const canvas = createCanvas(
    760,
    690
  );

  const ctx = canvas.getContext('2d');

  /*
   * ============================
   * BACKGROUND
   * ============================
   */

  const bg = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );

  bg.addColorStop(
    0,
    '#111522'
  );

  bg.addColorStop(
    1,
    '#181b2d'
  );

  ctx.fillStyle = bg;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /*
   * Viền ngoài.
   */
  ctx.strokeStyle = '#343b67';
  ctx.lineWidth = 2;

  ctx.strokeRect(
    10,
    10,
    canvas.width - 20,
    canvas.height - 20
  );

  /*
   * ============================
   * AVATAR OWNER
   * ============================
   */

  const image = await loadImage(
    avatarUrl
  );

  const cx = canvas.width / 2;
  const cy = 126;
  const radius = 72;

  /*
   * Glow xanh/tím cố định.
   *
   * Không cập nhật theo speaking để tránh spam
   * Discord API và render ảnh liên tục.
   */
  for (
    let i = 18;
    i >= 2;
    i -= 4
  ) {
    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      radius + 8,
      0,
      Math.PI * 2
    );

    ctx.strokeStyle =
      `rgba(112, 132, 255, ${
        0.035 + (18 - i) * 0.004
      })`;

    ctx.lineWidth = i;
    ctx.stroke();
  }

  /*
   * Vòng gradient xanh/tím.
   */
  const ring =
    ctx.createLinearGradient(
      cx - radius,
      cy - radius,
      cx + radius,
      cy + radius
    );

  ring.addColorStop(
    0,
    '#6ea8ff'
  );

  ring.addColorStop(
    1,
    '#a879ff'
  );

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius + 7,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle = ring;
  ctx.lineWidth = 6;
  ctx.stroke();

  /*
   * Avatar tròn.
   */
  ctx.save();

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius,
    0,
    Math.PI * 2
  );

  ctx.clip();

  ctx.drawImage(
    image,
    cx - radius,
    cy - radius,
    radius * 2,
    radius * 2
  );

  ctx.restore();

  /*
   * ============================
   * TÊN PHÒNG
   * ============================
   */

  let displayRoomName =
    String(
      roomName ||
      `PHÒNG CỦA ${ownerName}`
    )
      .trim()
      .toUpperCase();

  /*
   * Nếu code cũ đã truyền emoji loa trong roomName,
   * bỏ nó đi để không bị □.
   */
  displayRoomName =
    displayRoomName
      .replace(/🔊/gu, '')
      .trim();

  drawCenteredDecoratedLine(
    ctx,
    255,
    displayRoomName,
    canvas.width,
    '╭',
    '╮',
    {
      icon: 'speaker',
      startSize: 28,
      minSize: 17
    }
  );

  /*
   * ============================
   * THÔNG TIN PHÒNG
   * ============================
   */

  const safeOwnerName =
    String(
      ownerName ||
      owner.displayName ||
      owner.user.username ||
      'Owner'
    );

  const rows = [
    {
      icon: 'crown',
      label: 'Chủ phòng',
      value: `@${safeOwnerName}`
    },

    {
      icon: 'members',
      label: 'Thành viên',
      value: `${memberCount} / ${limit}`
    },

    {
      icon: 'lock',
      label: 'Phòng',
      value: locked
        ? 'Đang khóa'
        : 'Đang mở'
    },

    {
      icon: 'eye',
      label: 'Hiển thị',
      value: hidden
        ? 'Đang ẩn'
        : 'Công khai'
    },

    {
      icon: 'globe',
      label: 'Khu vực',
      value:
        String(region || 'Tự động')
    }
  ];

  let y = 326;

  for (const row of rows) {
    drawInfoRow(
      ctx,
      {
        ...row,
        y
      }
    );

    y += 58;
  }

  /*
   * ============================
   * TÊN SERVER / CHỮ KÝ
   * ============================
   */

  let safeSignature =
    String(
      signature ||
      'VoiceHDK Bot'
    ).trim();

  /*
   * Loại emoji Unicode phổ biến có thể gây ô vuông
   * trong renderer Linux.
   *
   * Không ảnh hưởng emoji của Discord button.
   */
  safeSignature =
    safeSignature
      .replace(/🦖/gu, '')
      .replace(/🔊/gu, '')
      .trim();

  drawCenteredDecoratedLine(
    ctx,
    625,
    safeSignature,
    canvas.width,
    '╰',
    '╯',
    {
      startSize: 28,
      minSize: 17
    }
  );

  /*
   * ============================
   * OUTPUT + CACHE
   * ============================
   */

  const buffer =
    canvas.toBuffer(
      'image/png'
    );

  /*
   * Giới hạn cache để bot chạy lâu
   * không tăng RAM vô hạn.
   */
  if (cache.size >= 24) {
    cache.clear();
  }

  cache.set(
    cacheKey,
    buffer
  );

  return buffer;
}

/**
 * Giữ tương thích với code cũ nếu index.js
 * vẫn import renderOwnerAvatarCard().
 */
async function renderOwnerAvatarCard(
  owner
) {
  const name =
    owner?.displayName ||
    owner?.user?.username ||
    'Owner';

  return renderRoomCard({
    owner,

    ownerName:
      name,

    memberCount:
      1,

    limit:
      '∞',

    locked:
      false,

    hidden:
      false,

    region:
      'Tự động',

    roomName:
      `PHÒNG CỦA ${name}`,

    signature:
      'VoiceHDK Bot'
  });
}

module.exports = {
  renderRoomCard,
  renderOwnerAvatarCard
};
