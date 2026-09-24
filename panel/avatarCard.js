'use strict';

const cache = new Map();

/* =========================================================
 * THEME
 * ======================================================= */

const THEME = {
  blue: '#3D8DFF',
  cyanBlue: '#58B8FF',
  indigo: '#5965FF',
  purple: '#8558FF',
  violet: '#A83DFF',

  text: '#F1F3FF',
  textSoft: '#D8DDF4',
  textMuted: '#AEB7D5',

  owner: '#A88AFF',
  members: '#8495FF',
  open: '#63C7FF',
  locked: '#A96AFF',
  public: '#789DFF',
  hidden: '#A86CFF',
  region: '#B080FF',

  frame: '#AAB8FF',

  backgroundStart: '#101522',
  backgroundMiddle: '#141829',
  backgroundEnd: '#181A2D'
};

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

    .replace(/\p{Extended_Pictographic}/gu, '')

    .replace(/[\uFE0E\uFE0F]/gu, '')

    .replace(/[\u200B-\u200D\u2060\uFEFF]/gu, '')

    .replace(/\uFFFD/gu, '')

    .replace(/[□■▪▫▢▣▤▥▦▧▨▩]/gu, '')

    .replace(/[\u0000-\u001F\u007F-\u009F]/gu, '')

    .replace(/\s+/g, ' ')

    .trim();
}

/* =========================================================
 * GRADIENT TEXT
 * ======================================================= */

function createTextGradient(
  ctx,
  x1,
  x2
) {
  const gradient =
    ctx.createLinearGradient(
      x1,
      0,
      x2,
      0
    );

  gradient.addColorStop(
    0,
    THEME.blue
  );

  gradient.addColorStop(
    0.38,
    THEME.indigo
  );

  gradient.addColorStop(
    0.72,
    THEME.purple
  );

  gradient.addColorStop(
    1,
    THEME.violet
  );

  return gradient;
}

/* =========================================================
 * ICONS
 * ======================================================= */

function drawIcon(
  ctx,
  type,
  x,
  y,
  size = 34
) {
  ctx.save();

  ctx.lineWidth =
    Math.max(
      2,
      size * 0.075
    );

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (type) {
    case 'crown': {
      const gradient =
        ctx.createLinearGradient(
          x,
          y,
          x + size,
          y + size
        );

      gradient.addColorStop(
        0,
        '#8FB4FF'
      );

      gradient.addColorStop(
        0.5,
        '#8A72FF'
      );

      gradient.addColorStop(
        1,
        '#B16CFF'
      );

      ctx.fillStyle = gradient;

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

    case 'members': {
      const gradient =
        ctx.createLinearGradient(
          x,
          y,
          x + size,
          y + size
        );

      gradient.addColorStop(
        0,
        '#6EA8FF'
      );

      gradient.addColorStop(
        1,
        '#9C70FF'
      );

      ctx.fillStyle = gradient;

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

    case 'lock': {
      const gradient =
        ctx.createLinearGradient(
          x,
          y,
          x + size,
          y + size
        );

      gradient.addColorStop(
        0,
        '#62BFFF'
      );

      gradient.addColorStop(
        1,
        '#7D72FF'
      );

      ctx.strokeStyle = gradient;
      ctx.fillStyle = gradient;

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

    case 'eye': {
      const gradient =
        ctx.createLinearGradient(
          x,
          y,
          x + size,
          y
        );

      gradient.addColorStop(
        0,
        '#69B8FF'
      );

      gradient.addColorStop(
        1,
        '#8A76FF'
      );

      ctx.strokeStyle = gradient;

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

      ctx.fillStyle = THEME.indigo;

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

    case 'globe': {
      const gradient =
        ctx.createLinearGradient(
          x,
          y,
          x + size,
          y + size
        );

      gradient.addColorStop(
        0,
        '#55C5FF'
      );

      gradient.addColorStop(
        1,
        '#8C70FF'
      );

      ctx.strokeStyle = gradient;

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

  const gradient =
    ctx.createLinearGradient(
      40,
      0,
      720,
      0
    );

  gradient.addColorStop(
    0,
    '#789FFF'
  );

  gradient.addColorStop(
    0.5,
    '#7C7AFF'
  );

  gradient.addColorStop(
    1,
    '#A36CFF'
  );

  ctx.strokeStyle = gradient;
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

  const leftEdge =
    margin;

  const rightEdge =
    width - margin;

  const innerWidth =
    rightEdge - leftEdge;

  const cleanText =
    cleanCanvasText(text);

  const label =
    `✦ ✦ ✦ ${cleanText} ✦ ✦ ✦`;

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

  const textStartX =
    width / 2 -
    textWidth / 2;

  const textEndX =
    textStartX +
    textWidth;

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

  const lineGradient =
    ctx.createLinearGradient(
      leftEdge,
      0,
      rightEdge,
      0
    );

  lineGradient.addColorStop(
    0,
    '#5B9CFF'
  );

  lineGradient.addColorStop(
    0.5,
    '#6D6EFF'
  );

  lineGradient.addColorStop(
    1,
    '#A15BFF'
  );

  ctx.save();

  ctx.strokeStyle =
    lineGradient;

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

  ctx.save();

  ctx.fillStyle =
    createTextGradient(
      ctx,
      textStartX,
      textEndX
    );

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  ctx.shadowColor =
    'rgba(92, 91, 255, 0.25)';

  ctx.shadowBlur = 5;

  ctx.fillText(
    label,
    textStartX,
    y
  );

  ctx.restore();
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
    valueColor,
    y,
    iconX = 86,
    labelX = 136,
    valueX = 395
  }
) {
  drawIcon(
    ctx,
    icon,
    iconX,
    y - 17,
    34
  );

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  ctx.fillStyle =
    THEME.text;

  ctx.font =
    '700 30px sans-serif';

  ctx.fillText(
    String(label),
    labelX,
    y
  );

  ctx.fillStyle =
    valueColor ||
    THEME.textSoft;

  fitFont(
    ctx,
    String(value),
    300,
    30,
    20,
    600
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

  let safeRoomName =
    cleanCanvasText(
      roomName ||
      `PHÒNG CỦA ${safeOwnerName}`
    );

  safeRoomName =
    safeRoomName
      .replace(
        /^[^\p{L}\p{N}]+/gu,
        ''
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim()
      .toUpperCase();

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
   * AVATAR URL
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
    THEME.backgroundStart
  );

  bg.addColorStop(
    0.55,
    THEME.backgroundMiddle
  );

  bg.addColorStop(
    1,
    THEME.backgroundEnd
  );

  ctx.fillStyle = bg;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  /* =====================================================
   * OUTER BORDER GRADIENT
   * =================================================== */

  const outerBorder =
    ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );

  outerBorder.addColorStop(
    0,
    THEME.blue
  );

  outerBorder.addColorStop(
    0.35,
    THEME.indigo
  );

  outerBorder.addColorStop(
    0.70,
    THEME.purple
  );

  outerBorder.addColorStop(
    1,
    THEME.violet
  );

  /* =====================================================
   * VIỀN NGOÀI - GLOW
   *
   * ĐÃ GIẢM ~50%
   * =================================================== */

  ctx.save();

  ctx.strokeStyle =
    outerBorder;

  // Bản trước: 6
  ctx.lineWidth = 3;

  // Bản trước: alpha 0.55
  ctx.shadowColor =
    'rgba(91, 91, 255, 0.28)';

  // Bản trước: 11
  ctx.shadowBlur = 6;

  ctx.beginPath();

  ctx.roundRect(
    8,
    8,
    width - 16,
    height - 16,
    14
  );

  ctx.stroke();

  ctx.restore();

  /* =====================================================
   * VIỀN NGOÀI CHÍNH
   *
   * ĐÃ GIẢM ~50%
   * =================================================== */

  ctx.save();

  ctx.strokeStyle =
    outerBorder;

  // Bản trước: 4
  ctx.lineWidth = 2;

  // Làm dịu màu nhưng vẫn giữ gradient.
  ctx.globalAlpha = 0.65;

  ctx.beginPath();

  ctx.roundRect(
    8,
    8,
    width - 16,
    height - 16,
    14
  );

  ctx.stroke();

  ctx.restore();

  /* =====================================================
   * VIỀN THỨ 2 PHÍA TRONG
   *
   * ĐÃ GIẢM ~50%
   * =================================================== */

  const innerBorder =
    ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );

  innerBorder.addColorStop(
    0,
    'rgba(91, 157, 255, 0.36)'
  );

  innerBorder.addColorStop(
    0.5,
    'rgba(111, 111, 255, 0.30)'
  );

  innerBorder.addColorStop(
    1,
    'rgba(174, 83, 255, 0.34)'
  );

  ctx.save();

  ctx.strokeStyle =
    innerBorder;

  // Bản trước: 1.5
  ctx.lineWidth = 1;

  ctx.beginPath();

  ctx.roundRect(
    15,
    15,
    width - 30,
    height - 30,
    11
  );

  ctx.stroke();

  ctx.restore();

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
   * AVATAR OUTER GLOW
   *
   * GIỮ NGUYÊN
   * =================================================== */

  const glow =
    ctx.createRadialGradient(
      cx,
      cy,
      radius,
      cx,
      cy,
      radius + 34
    );

  glow.addColorStop(
    0,
    'rgba(62, 126, 255, 0.60)'
  );

  glow.addColorStop(
    0.40,
    'rgba(85, 79, 255, 0.34)'
  );

  glow.addColorStop(
    0.70,
    'rgba(154, 58, 255, 0.18)'
  );

  glow.addColorStop(
    1,
    'rgba(154, 58, 255, 0)'
  );

  ctx.fillStyle = glow;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius + 34,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /* =====================================================
   * AVATAR GRADIENT RING
   *
   * GIỮ NGUYÊN
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
    '#2580FF'
  );

  ring.addColorStop(
    0.42,
    '#484DFF'
  );

  ring.addColorStop(
    0.72,
    '#733DFF'
  );

  ring.addColorStop(
    1,
    '#AA2FFF'
  );

  /* -------------------------
   * Glow vòng avatar
   * ----------------------- */

  ctx.save();

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius + 7,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle = ring;

  ctx.lineWidth = 10;

  ctx.shadowColor =
    'rgba(89, 68, 255, 0.82)';

  ctx.shadowBlur = 16;

  ctx.stroke();

  ctx.restore();

  /* -------------------------
   * Ring chính
   * ----------------------- */

  ctx.save();

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

  ctx.restore();

  /* -------------------------
   * Viền tối sát avatar
   * ----------------------- */

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius + 1,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle =
    '#0D1220';

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
   * TITLE
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
      value: `@${safeOwnerName}`,
      valueColor: THEME.owner
    },

    {
      icon: 'members',
      label: 'Thành viên',
      value:
        `${Number(memberCount) || 0} / ${safeLimit}`,
      valueColor: THEME.members
    },

    {
      icon: 'lock',
      label: 'Phòng',

      value:
        locked
          ? 'Đang khóa'
          : 'Đang mở',

      valueColor:
        locked
          ? THEME.locked
          : THEME.open
    },

    {
      icon: 'eye',
      label: 'Hiển thị',

      value:
        hidden
          ? 'Đang ẩn'
          : 'Công khai',

      valueColor:
        hidden
          ? THEME.hidden
          : THEME.public
    },

    {
      icon: 'globe',
      label: 'Khu vực',

      value:
        safeRegion ||
        'Tự động',

      valueColor:
        THEME.region
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

  /* =====================================================
   * BOTTOM SIGNATURE
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
