'use strict';

const fs = require('fs');
const cache = new Map();

const FONT_FAMILY = 'VoiceHDK Sans';
const FONT_FALLBACK = '"DejaVu Sans", "Noto Sans", "Liberation Sans", sans-serif';
let fontReady = false;

function setupVietnameseFont(canvasLib) {
  if (fontReady) return;

  const { GlobalFonts } = canvasLib;

  if (!GlobalFonts) {
    fontReady = true;
    return;
  }

  const regular = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',
    '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'
  ].find(fs.existsSync);

  const bold = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf',
    '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf'
  ].find(fs.existsSync);

  try {
    if (regular) GlobalFonts.registerFromPath(regular, FONT_FAMILY);
    if (bold) GlobalFonts.registerFromPath(bold, FONT_FAMILY);
  } catch (error) {
    console.warn(
      '[VoiceHDK] Không đăng ký được font tiếng Việt:',
      error?.message || error
    );
  }

  fontReady = true;
}

function canvasFont(weight, size) {
  return `${weight} ${size}px "${FONT_FAMILY}", ${FONT_FALLBACK}`;
}

const DESIGN_WIDTH = 760;
const DESIGN_HEIGHT = 820;

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
  trusted: '#A98BFF',
  open: '#63C7FF',
  locked: '#A96AFF',
  public: '#789DFF',
  hidden: '#A86CFF',
  region: '#B080FF',
  backgroundStart: '#101522',
  backgroundMiddle: '#141829',
  backgroundEnd: '#181A2D'
};

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
    ctx.font = canvasFont(weight, size);

    if (ctx.measureText(value).width <= maxWidth) {
      break;
    }

    size--;
  }

  ctx.font = canvasFont(weight, size);
  return size;
}

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

function hexToRgba(hex, alpha) {
  const value = parseInt(hex.slice(1), 16);

  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createGradient(
  ctx,
  x1,
  y1,
  x2,
  y2,
  alpha = 1
) {
  const gradient = ctx.createLinearGradient(
    x1,
    y1,
    x2,
    y2
  );

  gradient.addColorStop(
    0,
    hexToRgba(THEME.blue, alpha)
  );

  gradient.addColorStop(
    0.36,
    hexToRgba(THEME.indigo, alpha)
  );

  gradient.addColorStop(
    0.70,
    hexToRgba(THEME.purple, alpha)
  );

  gradient.addColorStop(
    1,
    hexToRgba(THEME.violet, alpha)
  );

  return gradient;
}

function drawHeart(
  ctx,
  x,
  y,
  size,
  fillStyle,
  flip = false,
  glow = 0
) {
  ctx.save();
  ctx.translate(x, y);

  if (flip) {
    ctx.scale(-1, 1);
  }

  ctx.fillStyle = fillStyle;

  if (glow > 0) {
    ctx.shadowColor = 'rgba(112, 91, 255, 0.30)';
    ctx.shadowBlur = glow;
  }

  ctx.beginPath();

  ctx.moveTo(
    0,
    size * 0.72
  );

  ctx.bezierCurveTo(
    -size * 1.10,
    0,
    -size * 0.70,
    -size * 0.88,
    0,
    -size * 0.30
  );

  ctx.bezierCurveTo(
    size * 0.70,
    -size * 0.88,
    size * 1.10,
    0,
    0,
    size * 0.72
  );

  ctx.fill();
  ctx.restore();
}

function drawTinyDiamond(
  ctx,
  x,
  y,
  size,
  fillStyle
) {
  ctx.save();
  ctx.fillStyle = fillStyle;

  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawSoftOrnament(
  ctx,
  centerX,
  y,
  scale = 1,
  flipVertical = false
) {
  const span = 150 * scale;

  const gradient = createGradient(
    ctx,
    centerX - span,
    y,
    centerX + span,
    y,
    0.64
  );

  ctx.save();

  if (flipVertical) {
    ctx.translate(0, y * 2);
    ctx.scale(1, -1);
  }

  ctx.strokeStyle = gradient;
  ctx.fillStyle = gradient;
  ctx.lineWidth = 2 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const s = scale;

  for (const direction of [-1, 1]) {
    const plusX =
      centerX +
      direction * 140 * s;

    ctx.beginPath();

    ctx.moveTo(
      plusX - 5 * s,
      y
    );

    ctx.lineTo(
      plusX + 5 * s,
      y
    );

    ctx.moveTo(
      plusX,
      y - 5 * s
    );

    ctx.lineTo(
      plusX,
      y + 5 * s
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
      centerX +
        direction * 120 * s,
      y - 5 * s,
      2.2 * s,
      0,
      Math.PI * 2
    );

    ctx.fill();

    drawTinyDiamond(
      ctx,
      centerX +
        direction * 103 * s,
      y + s,
      4 * s,
      gradient
    );
  }

  ctx.beginPath();

  ctx.moveTo(
    centerX - 92 * s,
    y
  );

  ctx.bezierCurveTo(
    centerX - 77 * s,
    y - 11 * s,
    centerX - 65 * s,
    y - 11 * s,
    centerX - 53 * s,
    y
  );

  ctx.bezierCurveTo(
    centerX - 42 * s,
    y + 10 * s,
    centerX - 31 * s,
    y + 10 * s,
    centerX - 22 * s,
    y
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    centerX + 22 * s,
    y
  );

  ctx.bezierCurveTo(
    centerX + 31 * s,
    y + 10 * s,
    centerX + 42 * s,
    y + 10 * s,
    centerX + 53 * s,
    y
  );

  ctx.bezierCurveTo(
    centerX + 65 * s,
    y - 11 * s,
    centerX + 77 * s,
    y - 11 * s,
    centerX + 92 * s,
    y
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    centerX - 17 * s,
    y - 8 * s
  );

  ctx.quadraticCurveTo(
    centerX - 24 * s,
    y,
    centerX - 17 * s,
    y + 8 * s
  );

  ctx.moveTo(
    centerX + 17 * s,
    y - 8 * s
  );

  ctx.quadraticCurveTo(
    centerX + 24 * s,
    y,
    centerX + 17 * s,
    y + 8 * s
  );

  ctx.stroke();

  drawHeart(
    ctx,
    centerX,
    y + s,
    10.5 * s,
    gradient,
    false,
    4 * s
  );

  ctx.restore();
}

function drawHeartbeatOrnament(
  ctx,
  centerX,
  y
) {
  const gradient = createGradient(
    ctx,
    centerX - 125,
    y,
    centerX + 125,
    y,
    0.58
  );

  ctx.save();

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2.1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const left = centerX - 122;
  const right = centerX + 122;

  ctx.beginPath();

  ctx.moveTo(left, y);

  ctx.bezierCurveTo(
    left + 16,
    y - 7,
    left + 26,
    y + 7,
    left + 40,
    y
  );

  ctx.lineTo(
    centerX - 78,
    y
  );

  ctx.lineTo(
    centerX - 66,
    y - 10
  );

  ctx.lineTo(
    centerX - 54,
    y + 10
  );

  ctx.lineTo(
    centerX - 42,
    y
  );

  ctx.lineTo(
    centerX - 18,
    y
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    centerX + 18,
    y
  );

  ctx.lineTo(
    centerX + 42,
    y
  );

  ctx.lineTo(
    centerX + 54,
    y + 10
  );

  ctx.lineTo(
    centerX + 66,
    y - 10
  );

  ctx.lineTo(
    centerX + 78,
    y
  );

  ctx.bezierCurveTo(
    right - 26,
    y + 7,
    right - 16,
    y - 7,
    right,
    y
  );

  ctx.stroke();

  ctx.translate(
    centerX,
    y - 1
  );

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, 9);

  ctx.bezierCurveTo(
    -13,
    1,
    -9,
    -10,
    0,
    -4
  );

  ctx.bezierCurveTo(
    9,
    -10,
    13,
    1,
    0,
    9
  );

  ctx.stroke();
  ctx.restore();
}

function drawInwardLoveMark(
  ctx,
  x,
  y,
  side,
  fillStyle
) {
  ctx.save();

  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = fillStyle;

  const inward =
    side === 'left'
      ? 1
      : -1;

  ctx.beginPath();

  ctx.arc(
    x - inward * 23,
    y,
    2.8,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.arc(
    x + inward * 23,
    y,
    2.8,
    0,
    Math.PI * 2
  );

  ctx.fill();

  drawHeart(
    ctx,
    x,
    y - 1,
    7.2,
    fillStyle,
    side === 'right',
    3
  );

  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  ctx.beginPath();

  ctx.moveTo(
    x + inward * 5,
    y + 2
  );

  ctx.quadraticCurveTo(
    x + inward * 13,
    y + 5,
    x + inward * 17,
    y + 10
  );

  ctx.stroke();
  ctx.restore();
}

function drawTitleWithLoveMarks(
  ctx,
  y,
  text,
  width,
  {
    startSize = 34,
    minSize = 20,
    footer = false
  } = {}
) {
  const safe = cleanCanvasText(text);
  const maxTextWidth = width - 260;

  fitFont(
    ctx,
    safe,
    maxTextWidth,
    startSize,
    minSize,
    footer ? 600 : 700
  );

  const textWidth =
    ctx.measureText(safe).width;

  const textX =
    (width - textWidth) / 2;

  const gradient =
    createGradient(
      ctx,
      textX,
      y,
      textX + textWidth,
      y,
      1
    );

  ctx.save();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = gradient;
  ctx.shadowColor = 'rgba(92, 91, 255, 0.22)';
  ctx.shadowBlur = footer ? 3 : 5;

  ctx.fillText(
    safe,
    textX,
    y
  );

  ctx.restore();

  const gap = 43;

  drawInwardLoveMark(
    ctx,
    textX - gap,
    y,
    'left',
    gradient
  );

  drawInwardLoveMark(
    ctx,
    textX + textWidth + gap,
    y,
    'right',
    gradient
  );

  const lineGradient =
    createGradient(
      ctx,
      44,
      y,
      width - 44,
      y,
      0.42
    );

  ctx.save();

  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';

  ctx.beginPath();

  ctx.moveTo(
    48,
    y
  );

  ctx.lineTo(
    Math.max(
      48,
      textX - 78
    ),
    y
  );

  ctx.moveTo(
    Math.min(
      width - 48,
      textX + textWidth + 78
    ),
    y
  );

  ctx.lineTo(
    width - 48,
    y
  );

  ctx.stroke();
  ctx.restore();
}

function drawIcon(
  ctx,
  type,
  x,
  y,
  size = 40
) {
  ctx.save();

  ctx.lineWidth =
    Math.max(
      2,
      size * 0.075
    );

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const gradient =
    createGradient(
      ctx,
      x,
      y,
      x + size,
      y + size,
      0.95
    );

  ctx.strokeStyle = gradient;
  ctx.fillStyle = gradient;

  if (type === 'crown') {
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
  } else if (type === 'members') {
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
  } else if (type === 'trusted') {
    drawHeart(
      ctx,
      x + size * 0.50,
      y + size * 0.46,
      size * 0.48,
      gradient,
      false,
      5
    );
  } else if (type === 'lock') {
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
  } else if (type === 'eye') {
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

    ctx.beginPath();

    ctx.arc(
      x + size * 0.50,
      y + size * 0.50,
      size * 0.14,
      0,
      Math.PI * 2
    );

    ctx.fill();
  } else if (type === 'globe') {
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
  }

  ctx.restore();
}

function drawInfoRow(
  ctx,
  {
    icon,
    label,
    value,
    valueColor,
    y,
    iconX = 68,
    labelX = 122,
    valueX = 390
  }
) {
  drawIcon(
    ctx,
    icon,
    iconX,
    y - 20,
    40
  );

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = THEME.text;
  ctx.font = canvasFont(700, 36);

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
    310,
    36,
    24,
    600
  );

  ctx.fillText(
    String(value),
    valueX,
    y
  );
}

async function renderRoomCard({
  owner,
  ownerName,
  memberCount,
  trustedCount = 0,
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

  setupVietnameseFont(canvasLib);

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
    )
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

  const safeTrustedCount =
    Math.max(
      0,
      Number(trustedCount) || 0
    );

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
      safeTrustedCount,
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

  const canvas =
    createCanvas(
      DESIGN_WIDTH,
      DESIGN_HEIGHT
    );

  const ctx =
    canvas.getContext('2d');

  const width = DESIGN_WIDTH;
  const height = DESIGN_HEIGHT;

  const background =
    ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );

  background.addColorStop(
    0,
    THEME.backgroundStart
  );

  background.addColorStop(
    0.55,
    THEME.backgroundMiddle
  );

  background.addColorStop(
    1,
    THEME.backgroundEnd
  );

  ctx.fillStyle = background;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  const outerBorder =
    createGradient(
      ctx,
      0,
      0,
      width,
      height,
      1
    );

  ctx.save();

  ctx.strokeStyle = outerBorder;
  ctx.lineWidth = 3;
  ctx.shadowColor =
    'rgba(91, 91, 255, 0.28)';
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

  ctx.save();

  ctx.strokeStyle = outerBorder;
  ctx.lineWidth = 2;
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

  ctx.strokeStyle = innerBorder;
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

  drawSoftOrnament(
    ctx,
    width / 2,
    48,
    0.90,
    false
  );

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

  const cx = width / 2;
  const cy = 145;
  const radius = 76;

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

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    radius + 1,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle = '#0D1220';
  ctx.lineWidth = 5;
  ctx.stroke();

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

  drawSoftOrnament(
    ctx,
    width / 2,
    250,
    0.92,
    true
  );

  drawTitleWithLoveMarks(
    ctx,
    300,
    safeRoomName,
    width,
    {
      startSize: 40,
      minSize: 25
    }
  );

  drawHeartbeatOrnament(
    ctx,
    width / 2,
    342
  );

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
      icon: 'trusted',
      label: 'Tin cậy',
      value: String(safeTrustedCount),
      valueColor: THEME.trusted
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
      valueColor: THEME.region
    }
  ];

  let y = 398;

  for (const row of rows) {
    drawInfoRow(
      ctx,
      {
        ...row,
        y
      }
    );

    y += 54;
  }

  drawTitleWithLoveMarks(
    ctx,
    755,
    safeSignature,
    width,
    {
      startSize: 36,
      minSize: 24,
      footer: true
    }
  );

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
    ownerName: name,
    memberCount: 1,
    trustedCount: 0,
    limit: 0,
    locked: false,
    hidden: false,
    region: 'Tự động',
    roomName: `PHÒNG CỦA ${name}`,
    signature: 'VoiceHDK Bot'
  });
}

module.exports = {
  renderRoomCard,
  renderOwnerAvatarCard
};
