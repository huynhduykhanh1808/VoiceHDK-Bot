'use strict';

const cache = new Map();

/* =========================================================
 * FONT
 * ======================================================= */

function fitFont(
  ctx,
  text,
  maxWidth,
  startSize = 30,
  minSize = 18,
  weight = 700
) {
  const value = String(text ?? '');
  let size = startSize;

  while (size > minSize) {
    ctx.font = `${weight} ${size}px sans-serif`;

    if (ctx.measureText(value).width <= maxWidth) {
      break;
    }

    size--;
  }

  ctx.font = `${weight} ${size}px sans-serif`;

  return size;
}

/* =========================================================
 * CLEAN TEXT
 * ======================================================= */

function cleanCanvasText(text) {
  return String(text ?? '')
    .normalize('NFC')

    // Emoji / pictographic
    .replace(/\p{Extended_Pictographic}/gu, '')

    // Variation selectors
    .replace(/[\uFE0E\uFE0F]/gu, '')

    // Zero-width characters
    .replace(/[\u200B-\u200D\u2060\uFEFF]/gu, '')

    // Unicode replacement character
    .replace(/\uFFFD/gu, '')

    // Các ký tự ô vuông thường gặp
    .replace(/[□■▪▫▢▣▤▥▦▧▨▩]/gu, '')

    // Control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/gu, '')

    // Gộp khoảng trắng
    .replace(/\s+/g, ' ')

    .trim();
}

/* =========================================================
 * ICONS
 * ======================================================= */

function drawIcon(ctx, type, x, y, size = 34) {
  ctx.save();

  ctx.lineWidth = Math.max(2, size * 0.075);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (type) {
    /* -------------------------
     * CROWN
     * ----------------------- */
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
        y + size * 0.50
      );

      ctx.lineTo(
        x + size * 0.50,
        y + size * 0.14
      );

      ctx.lineTo(
        x + size * 0.66,
        y + size * 0.50
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

    /* -------------------------
     * MEMBERS
     * ----------------------- */
    case 'members': {
      ctx.fillStyle = '#9878ff';

      ctx.beginPath();

      ctx.arc(
        x + size * 0.34,
        y + size * 0.31,
        size * 0.20,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.beginPath();

      ctx.arc(
        x + size * 0.70,
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

    /* -------------------------
     * LOCK
     * ----------------------- */
    case 'lock': {
      ctx.strokeStyle = '#ffd166';
      ctx.fillStyle = '#ffd166';

      ctx.beginPath();

      ctx.arc(
        x + size * 0.50,
        y + size * 0.38,
        size * 0.25,
        Math.PI,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.fillRect(
        x + size * 0.20,
        y + size * 0.42,
        size * 0.60,
        size * 0.46
      );

      break;
    }

    /* -------------------------
     * EYE
     * ----------------------- */
    case 'eye': {
      ctx.strokeStyle = '#dce2ff';

      ctx.beginPath();

      ctx.moveTo(
        x,
        y + size * 0.50
      );

      ctx.bezierCurveTo(
        x + size * 0.22,
        y + size * 0.15,
        x + size * 0.78,
        y + size * 0.15,
        x + size,
        y + size * 0.50
      );

      ctx.bezierCurveTo(
        x + size * 0.78,
        y + size * 0.85,
        x + size * 0.22,
        y + size * 0.85,
        x,
        y + size * 0.50
      );

      ctx.stroke();

      ctx.fillStyle = '#dce2ff';

      ctx.beginPath();

      ctx.arc(
        x + size * 0.50,
        y + size * 0.50,
        size * 0.14,
        0,
        Math.PI * 2
      );

      ctx.fill();

      break;
    }

    /* -------------------------
     * GLOBE
     * ----------------------- */
    case 'globe': {
      ctx.strokeStyle = '#5ed0ff';

      ctx.beginPath();

      ctx.arc(
        x + size * 0.50,
        y + size * 0.50,
        size * 0.43,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.ellipse(
        x + size * 0.50,
        y + size * 0.50,
        size * 0.20,
        size * 0.43,
        0,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        x + size * 0.10,
        y + size * 0.50
      );

      ctx.lineTo(
        x + size * 0.90,
        y + size * 0.50
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        x + size * 0.18,
        y + size * 0.30
      );

      ctx.lineTo(
        x + size * 0.82,
        y + size * 0.30
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        x + size * 0.18,
        y + size * 0.70
      );

      ctx.lineTo(
        x + size * 0.82,
        y + size * 0.70
      );

      ctx.stroke();

      break;
    }

    default:
      break;
  }

  ctx.restore();
}

/* =========================================================
 * FRAME CORNERS
 * ======================================================= */

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
      ctx.moveTo(
        x,
        y + corner
      );

      ctx.lineTo(
        x,
        y + 4
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

/* =========================================================
 * DECORATED TITLE / SIGNATURE
 *
 * ╭──── ✦ ✦ ✦ ROOM ✦ ✦ ✦ ────╮
 *
 * ╰──── ✦ ✦ ✦ SERVER ✦ ✦ ✦ ───╯
 * ======================================================= */

function drawCenteredDecoratedLine(
  ctx,
  y,
  text,
  width,
  options = {}
) {
  const {
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
   * 3 dấu sao mỗi bên.
   */
  const label =
    `✦ ✦ ✦ ${cleanText} ✦ ✦ ✦`;

  /*
   * Tự giảm font nếu tên quá dài.
   */
  fitFont(
    ctx,
    label,
    innerWidth - 100,
    startSize,
    minSize,
    700
  );

  const textWidth =
    ctx.measureText(label).width;

  /*
   * Canh chính giữa toàn bộ label.
   */
  const textStartX =
    width / 2 - textWidth / 2;

  const textEndX =
    textStartX + textWidth;

  /*
   * Khoảng cách giữa chữ và đường kẻ.
   */
  const gap = 16;

  const leftLineStart =
    leftEdge + 12;

  const leftLineEnd =
    Math.max(
      leftLineStart,
      textStartX - gap
    );

  const rightLineStart =
    Math.min(
      rightEdge - 12,
      textEndX + gap
    );

  const rightLineEnd =
    rightEdge - 12;

  /*
   * Vẽ hai đường ngang.
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
   * Vẽ hai góc.
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
   * Vẽ tiêu đề chính giữa.
   */
  ctx.fillStyle = '#e2e6ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.fillText(
    label,
    textStartX,
    y
  );
}

/* =========================================================
 * INFO ROW
 * ======================================================= */

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
   * Icon lớn hơn bản cũ.
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
   * Label
   */
  ctx.fillStyle = '#f1f3ff';
  ctx.font = '700 30px sans-serif';

  ctx.fillText(
    String(label),
    labelX,
    y
  );

  /*
   * Value
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

/* =========================================================
 * MAIN ROOM CARD
 * ======================================================= */

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

  /* =====================================================
   * TEXT DATA
   * =================================================== */

  const safeOwnerName =
    cleanCanvasText(
      ownerName ||
      owner.displayName ||
      owner.user.username ||
      'Owner'
    );

  /*
   * Tên phòng.
   *
   * Sau cleanCanvasText(), tiếp tục loại mọi ký tự
   * trang trí ở ĐẦU tên phòng.
   *
   * Ví dụ:
   *
   * 🔊・PHÒNG CỦA KHÁNH
   * 🎧 PHÒNG CỦA KHÁNH
   * ♪ PHÒNG CỦA KHÁNH
   *
   * đều trở thành:
   *
   * PHÒNG CỦA KHÁNH
   *
   * Đây chỉ là tên HIỂN THỊ trên card.
   * Không đổi tên voice channel thật.
   */
  let safeRoomName =
    cleanCanvasText(
      roomName ||
      `PHÒNG CỦA ${safeOwnerName}`
    );

  safeRoomName = safeRoomName
    .replace(/^[^\p{L}\p{N}]+/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

  /*
   * Fallback nếu sau khi lọc tên bị rỗng.
   */
  if (!safeRoomName) {
    safeRoomName =
      `PHÒNG CỦA ${safeOwnerName}`
        .toUpperCase();
  }

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
    Number(limit) === 0
      ? '∞'
      : String(limit);

  /* =====================================================
   * AVATAR
   * =================================================== */

  const avatarUrl =
    owner.user.displayAvatarURL({
      extension: 'png',
      size: 256,
      forceStatic: true
    });

  /* =====================================================
   * CACHE
   * =================================================== */

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

  /* =====================================================
   * CANVAS
   * =================================================== */

  const width = 760;
  const height = 700;

  const canvas =
    createCanvas(
      width,
      height
    );

  const ctx =
    canvas.getContext('2d');

  /* =====================================================
   * BACKGROUND
   * =================================================== */

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
   * Viền ngoài.
   */
  ctx.strokeStyle = '#313963';
  ctx.lineWidth = 2;

  ctx.strokeRect(
    9,
    9,
    width - 18,
    height - 18
  );

  /*
   * Viền sáng nhẹ phía trong.
   */
  ctx.strokeStyle =
    'rgba(111, 128, 255, 0.18)';

  ctx.lineWidth = 1;

  ctx.strokeRect(
    14,
    14,
    width - 28,
    height - 28
  );

  /* =====================================================
   * LOAD AVATAR
   * =================================================== */

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

  /* =====================================================
   * AVATAR GLOW
   * =================================================== */

  const glow =
    ctx.createRadialGradient(
      cx,
      cy,
      radius,
      cx,
      cy,
      radius + 28
    );

  glow.addColorStop(
    0,
    'rgba(108, 136, 255, 0.38)'
  );

  glow.addColorStop(
    0.55,
    'rgba(124, 112, 255, 0.18)'
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
    radius + 30,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /* =====================================================
   * AVATAR GRADIENT RING
   * =================================================== */

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
    0.50,
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
   * Viền tối giữa avatar và ring.
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

  /* =====================================================
   * DRAW AVATAR
   * =================================================== */

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

  /* =====================================================
   * TOP TITLE
   *
   * Không còn icon loa.
   *
   * ✦ ✦ ✦ PHÒNG CỦA KHÁNH ✦ ✦ ✦
   * =================================================== */

  drawCenteredDecoratedLine(
    ctx,
    250,
    safeRoomName,
    width,
    {
      top: true,
      startSize: 34,
      minSize: 21
    }
  );

  /* =====================================================
   * ROOM INFO
   * =================================================== */

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
        safeRegion ||
        'Tự động'
    }
  ];

  /*
   * Khoảng cách các dòng được tăng nhẹ
   * để chữ/icon lớn vẫn thoáng.
   */
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

  /* =====================================================
   * BOTTOM SIGNATURE
   *
   * ✦ ✦ ✦ SERVER NAME ✦ ✦ ✦
   * =================================================== */

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

  /* =====================================================
   * OUTPUT
   * =================================================== */

  const buffer =
    canvas.toBuffer(
      'image/png'
    );

  /*
   * Không để cache tăng vô hạn.
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

/* =========================================================
 * COMPATIBILITY
 *
 * Giữ hàm này nếu index.js cũ vẫn đang gọi
 * renderOwnerAvatarCard().
 * ======================================================= */

async function renderOwnerAvatarCard(owner) {
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
      0,

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

/* =========================================================
 * EXPORT
 * ======================================================= */

module.exports = {
  renderRoomCard,
  renderOwnerAvatarCard
};
