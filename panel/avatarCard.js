'use strict';

const cache = new Map();

/**
 * Tự giảm font nếu nội dung quá dài.
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
  const value = String(text ?? '');

  while (size > minSize) {
    ctx.font = `${weight} ${size}px sans-serif`;

    if (ctx.measureText(value).width <= maxWidth) {
      break;
    }

    size -= 1;
  }

  ctx.font = `${weight} ${size}px sans-serif`;

  return size;
}

/**
 * Làm sạch chuỗi trước khi Canvas render.
 *
 * Emoji Unicode trong font Linux/Render có thể hiện thành □.
 * Icon của panel được vẽ bằng Canvas riêng nên không cần emoji
 * nằm trong chuỗi.
 */
function cleanCanvasText(text) {
  return String(text ?? '')
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[\u2600-\u27BF]/gu, '')
    .replace(/\uFE0F/gu, '')
    .replace(/\u200D/gu, '')
    .replace(/[□■▪▫]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Vẽ icon trực tiếp bằng Canvas.
 *
 * Không dùng emoji Unicode để tránh lỗi ô vuông □
 * trên Render/Linux.
 */
function drawIcon(ctx, type, x, y, size = 34) {
  ctx.save();

  ctx.lineWidth = Math.max(2, size * 0.075);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (type) {
    /**
     * LOA
     */
    case 'speaker': {
      ctx.fillStyle = '#7fc8ff';
      ctx.strokeStyle = '#7fc8ff';

      ctx.beginPath();

      ctx.moveTo(
        x,
        y + size * 0.38
      );

      ctx.lineTo(
        x + size * 0.27,
        y + size * 0.38
      );

      ctx.lineTo(
        x + size * 0.58,
        y + size * 0.12
      );

      ctx.lineTo(
        x + size * 0.58,
        y + size * 0.88
      );

      ctx.lineTo(
        x + size * 0.27,
        y + size * 0.62
      );

      ctx.lineTo(
        x,
        y + size * 0.62
      );

      ctx.closePath();
      ctx.fill();

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

    /**
     * VƯƠNG MIỆN
     */
    case 'crown': {
      ctx.fillStyle = '#ffd766';

      ctx.beginPath();

      ctx.moveTo(
        x,
        y + size * 0.72
      );

      ctx.lineTo(
        x + size * 0.12,
        y + size * 0.25
      );

      ctx.lineTo(
        x + size * 0.34,
        y + size * 0.5
      );

      ctx.lineTo(
        x + size * 0.5,
        y + size * 0.14
      );

      ctx.lineTo(
        x + size * 0.66,
        y + size * 0.5
      );

      ctx.lineTo(
        x + size * 0.88,
        y + size * 0.25
      );

      ctx.lineTo(
        x + size,
        y + size * 0.72
      );

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

    /**
     * THÀNH VIÊN
     */
    case 'members': {
      ctx.fillStyle = '#9878ff';

      ctx.beginPath();

      ctx.arc(
        x + size * 0.34,
        y + size * 0.31,
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

    /**
     * KHÓA
     */
    case 'lock': {
      ctx.strokeStyle = '#ffd166';
      ctx.fillStyle = '#ffd166';

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

    /**
     * MẮT
     */
    case 'eye': {
      ctx.strokeStyle = '#dce2ff';

      ctx.beginPath();

      ctx.moveTo(
        x,
        y + size * 0.5
      );

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

      ctx.fillStyle = '#dce2ff';

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

    /**
     * QUẢ ĐỊA CẦU
     */
    case 'globe': {
      ctx.strokeStyle = '#5ed0ff';

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

      ctx.moveTo(
        x + size * 0.1,
        y + size * 0.5
      );

      ctx.lineTo(
        x + size * 0.9,
        y + size * 0.5
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        x + size * 0.18,
        y + size * 0.3
      );

      ctx.lineTo(
        x + size * 0.82,
        y + size * 0.3
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        x + size * 0.18,
        y + size * 0.7
      );

      ctx.lineTo(
        x + size * 0.82,
        y + size * 0.7
      );

      ctx.stroke();

      break;
    }

    default:
      break;
  }

  ctx.restore();
}

/**
 * Vẽ góc khung bằng đường Canvas thay vì ký tự Unicode.
 *
 * Như vậy ╭ ╮ ╰ ╯ cũng không phụ thuộc font.
 */
function drawFrameCorner(
  ctx,
  x,
  y,
  side,
  top = true
) {
  const corner = 12;

  ctx.save();

  ctx.strokeStyle = '#aab8ff';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';

  ctx.beginPath();

  if (top) {
    if (side === 'left') {
      ctx.moveTo(x, y + corner);
      ctx.lineTo(x, y + 4);

      ctx.quadraticCurveTo(
        x,
        y,
        x + 4,
        y
      );

      ctx.lineTo(
        x + corner,
        y
      );
    } else {
      ctx.moveTo(
        x - corner,
        y
      );

      ctx.lineTo(
        x - 4,
        y
      );

      ctx.quadraticCurveTo(
        x,
        y,
        x,
        y + 4
      );

      ctx.lineTo(
        x,
        y + corner
      );
    }
  } else {
    if (side === 'left') {
      ctx.moveTo(
        x,
        y - corner
      );

      ctx.lineTo(
        x,
        y - 4
      );

      ctx.quadraticCurveTo(
        x,
        y,
        x + 4,
        y
      );

      ctx.lineTo(
        x + corner,
        y
      );
    } else {
      ctx.moveTo(
        x - corner,
        y
      );

      ctx.lineTo(
        x - 4,
        y
      );

      ctx.quadraticCurveTo(
        x,
        y,
        x,
        y - 4
      );

      ctx.lineTo(
        x,
        y - corner
      );
    }
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * Vẽ thanh trang trí tự cân:
 *
 * TOP:
 * ╭──── ✦ [ICON] PHÒNG CỦA KHÁNH ✦ ────╮
 *
 * BOTTOM:
 * ╰──── ✦ Khủng Long Con ✦ ─────────────╯
 *
 * Đường kẻ được tính bằng pixel thực tế,
 * không đếm số ký tự.
 */
function drawCenteredDecoratedLine(
  ctx,
  y,
  text,
  width,
  options = {}
) {
  const {
    icon = null,
    top = true,
    startSize = 34,
    minSize = 20
  } = options;

  const margin = 40;

  const leftEdge = margin;
  const rightEdge = width - margin;

  const innerWidth =
    rightEdge - leftEdge;

  const cleanText =
    cleanCanvasText(text);

  /*
   * Dùng dấu ✦ vì ký tự này đang render tốt.
   * Nếu môi trường nào không hỗ trợ, có thể vẽ diamond bằng Canvas.
   */
  const label =
    `✦ ${cleanText} ✦`;

  /*
   * Khoảng dành cho icon loa.
   */
  const iconSpace =
    icon ? 48 : 0;

  fitFont(
    ctx,
    label,
    innerWidth - iconSpace - 100,
    startSize,
    minSize,
    700
  );

  const textWidth =
    ctx.measureText(label).width;

  const groupWidth =
    textWidth + iconSpace;

  const groupStartX =
    width / 2 - groupWidth / 2;

  const groupEndX =
    groupStartX + groupWidth;

  /*
   * Khoảng cách giữa đường kẻ và chữ.
   */
  const gap = 14;

  const leftLineStart =
    leftEdge + 12;

  const leftLineEnd =
    Math.max(
      leftLineStart,
      groupStartX - gap
    );

  const rightLineStart =
    Math.min(
      rightEdge - 12,
      groupEndX + gap
    );

  const rightLineEnd =
    rightEdge - 12;

  /*
   * Vẽ đường kẻ.
   */
  ctx.save();

  ctx.strokeStyle = '#aab8ff';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';

  ctx.beginPath();

  ctx.moveTo(
    leftLineStart,
    y
  );

  ctx.lineTo(
    leftLineEnd,
    y
  );

  ctx.moveTo(
    rightLineStart,
    y
  );

  ctx.lineTo(
    rightLineEnd,
    y
  );

  ctx.stroke();

  ctx.restore();

  /*
   * Vẽ góc trái/phải.
   */
  drawFrameCorner(
    ctx,
    leftEdge,
    y,
    'left',
    top
  );

  drawFrameCorner(
    ctx,
    rightEdge,
    y,
    'right',
    top
  );

  /*
   * Icon loa được vẽ riêng.
   */
  if (icon) {
    drawIcon(
      ctx,
      icon,
      groupStartX,
      y - 18,
      36
    );
  }

  /*
   * Vẽ chữ.
   */
  ctx.fillStyle = '#e2e6ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.fillText(
    label,
    groupStartX + iconSpace,
    y
  );
}

/**
 * Một dòng thông tin phòng.
 */
function drawInfoRow(
  ctx,
  {
    icon,
    label,
    value,
    y,
    iconX = 86,
    labelX = 136,
    valueX = 395
  }
) {
  /*
   * Icon tăng lên 34px để cân với chữ.
   */
  drawIcon(
    ctx,
    icon,
    iconX,
    y - 17,
    34
  );

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  /*
   * Label bên trái.
   */
  ctx.fillStyle = '#f1f3ff';

  ctx.font =
    '700 30px sans-serif';

  ctx.fillText(
    String(label),
    labelX,
    y
  );

  /*
   * Value bên phải.
   */
  ctx.fillStyle = '#cbd1ed';

  fitFont(
    ctx,
    String(value),
    300,
    30,
    20,
    500
  );

  ctx.fillText(
    String(value),
    valueX,
    y
  );
}

/**
 * Render toàn bộ Message 1 thành một card.
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
    canvasLib =
      require('@napi-rs/canvas');
  } catch (error) {
    console.error(
      '[VoiceHDK] Không tải được @napi-rs/canvas:',
      error
    );

    return null;
  }

  const {
    createCanvas,
    loadImage
  } = canvasLib;

  const safeOwnerName =
    cleanCanvasText(
      ownerName ||
      owner.displayName ||
      owner.user.username ||
      'Owner'
    );

  const safeRoomName =
    cleanCanvasText(
      roomName ||
      `PHÒNG CỦA ${safeOwnerName}`
    )
      .toUpperCase();

  const safeSignature =
    cleanCanvasText(
      signature ||
      'VoiceHDK Bot'
    );

  const safeRegion =
    cleanCanvasText(
      region ||
      'Tự động'
    );

  const safeLimit =
    limit === null ||
    limit === undefined ||
    limit === 0
      ? '∞'
      : String(limit);

  const avatarUrl =
    owner.user.displayAvatarURL({
      extension: 'png',
      size: 256,
      forceStatic: true
    });

  const cacheKey =
    JSON.stringify({
      avatarUrl,
      safeOwnerName,
      memberCount,
      safeLimit,
      locked,
      hidden,
      safeRegion,
      safeRoomName,
      safeSignature
    });

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  /*
   * Card lớn hơn một chút để chữ/icon lớn
   * vẫn có khoảng thở.
   */
  const width = 760;
  const height = 700;

  const canvas =
    createCanvas(
      width,
      height
    );

  const ctx =
    canvas.getContext('2d');

  /*
   * =============================
   * BACKGROUND
   * =============================
   */

  const bg =
    ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );

  bg.addColorStop(
    0,
    '#101522'
  );

  bg.addColorStop(
    0.55,
    '#141829'
  );

  bg.addColorStop(
    1,
    '#181a2d'
  );

  ctx.fillStyle = bg;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  /*
   * Viền card ngoài.
   */
  ctx.strokeStyle = '#313963';
  ctx.lineWidth = 2;

  ctx.strokeRect(
    9,
    9,
    width - 18,
    height - 18
  );

  ctx.strokeStyle =
    'rgba(111, 128, 255, 0.18)';

  ctx.lineWidth = 1;

  ctx.strokeRect(
    14,
    14,
    width - 28,
    height - 28
  );

  /*
   * =============================
   * AVATAR OWNER
   * =============================
   */

  let avatar;

  try {
    avatar =
      await loadImage(
        avatarUrl
      );
  } catch (error) {
    console.error(
      '[VoiceHDK] Không tải được avatar owner:',
      error
    );

    return null;
  }

  const cx =
    width / 2;

  const cy = 126;

  const radius = 76;

  /*
   * Glow xanh/tím cố định.
   *
   * Không đổi theo speaking để tránh render/edit
   * message liên tục.
   */
  const glow =
    ctx.createRadialGradient(
      cx,
      cy,
      radius,
      cx,
      cy,
      radius + 26
    );

  glow.addColorStop(
    0,
    'rgba(108, 136, 255, 0.34)'
  );

  glow.addColorStop(
    0.55,
    'rgba(124, 112, 255, 0.16)'
  );

  glow.addColorStop(
    1,
    'rgba(159, 103, 255, 0)'
  );

  ctx.fillStyle = glow;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius + 28,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /*
   * Vòng gradient.
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
    '#63a7ff'
  );

  ring.addColorStop(
    0.5,
    '#7183ff'
  );

  ring.addColorStop(
    1,
    '#b06cff'
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
  ctx.lineWidth = 7;
  ctx.stroke();

  /*
   * Viền tối giữa avatar và glow.
   */
  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius + 1,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle = '#0d1220';
  ctx.lineWidth = 5;
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
    avatar,
    cx - radius,
    cy - radius,
    radius * 2,
    radius * 2
  );

  ctx.restore();

  /*
   * =============================
   * KHUNG TRÊN + TÊN PHÒNG
   * =============================
   */

  drawCenteredDecoratedLine(
    ctx,
    250,
    safeRoomName,
    width,
    {
      icon: 'speaker',
      top: true,
      startSize: 34,
      minSize: 21
    }
  );

  /*
   * =============================
   * THÔNG TIN PHÒNG
   * =============================
   */

  const rows = [
    {
      icon: 'crown',
      label: 'Chủ phòng',
      value: `@${safeOwnerName}`
    },

    {
      icon: 'members',
      label: 'Thành viên',
      value:
        `${Number(memberCount) || 0} / ${safeLimit}`
    },

    {
      icon: 'lock',
      label: 'Phòng',
      value:
        locked
          ? 'Đang khóa'
          : 'Đang mở'
    },

    {
      icon: 'eye',
      label: 'Hiển thị',
      value:
        hidden
          ? 'Đang ẩn'
          : 'Công khai'
    },

    {
      icon: 'globe',
      label: 'Khu vực',
      value:
        safeRegion || 'Tự động'
    }
  ];

  let y = 320;

  for (const row of rows) {
    drawInfoRow(
      ctx,
      {
        ...row,
        y
      }
    );

    y += 61;
  }

  /*
   * =============================
   * KHUNG DƯỚI + TÊN SERVER
   * =============================
   */

  drawCenteredDecoratedLine(
    ctx,
    635,
    safeSignature,
    width,
    {
      top: false,
      startSize: 32,
      minSize: 20
    }
  );

  /*
   * =============================
   * OUTPUT
   * =============================
   */

  const buffer =
    canvas.toBuffer(
      'image/png'
    );

  /*
   * Cache có giới hạn.
   *
   * Tránh bot chạy lâu rồi giữ vô hạn ảnh panel
   * trong RAM.
   */
  if (cache.size >= 32) {
    cache.clear();
  }

  cache.set(
    cacheKey,
    buffer
  );

  return buffer;
}

/**
 * Giữ tương thích với index.js cũ nếu vẫn gọi
 * renderOwnerAvatarCard().
 */
async function renderOwnerAvatarCard(
  owner
) {
  if (!owner?.user) {
    return null;
  }

  const name =
    owner.displayName ||
    owner.user.username ||
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
