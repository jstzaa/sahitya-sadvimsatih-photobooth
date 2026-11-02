/**
 * Photobooth Strip Canvas Generator
 * Combines 3 photos into a vertical photo strip ready for printing or digital download.
 */

export async function generateStripCanvas({
  photos,
  theme = 'classic-white',
  title = 'Sahitya Satvimsati',
  subtitle = 'Photobooth Memories',
  dateText = '',
  filterCss = 'none',
  showDate = true,
  sticker = null
}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Strip layout dimensions (High-res 2:3 ratio or classic photobooth strip 600 x 1800)
  const stripWidth = 720;
  const paddingX = 40;
  const paddingTop = 48;
  const photoGap = 32;
  const photoWidth = stripWidth - paddingX * 2; // 640px
  const photoHeight = Math.round(photoWidth * (3 / 4)); // 480px (4:3 aspect ratio)
  const footerHeight = 160;

  const stripHeight = paddingTop + (photoHeight * 3) + (photoGap * 2) + footerHeight;

  canvas.width = stripWidth;
  canvas.height = stripHeight;

  // Theme palette definitions (Blueprint & Pastel Pixel Themes)
  const themes = {
    'blueprint-classic': {
      bg: '#2F6496',
      cardBg: '#245A8C',
      border: '#8FBCDD',
      textColor: '#FFFFFF',
      subTextColor: '#CFEAF2',
      accentColor: '#D3E8D4'
    },
    'mint-dream': {
      bg: '#D3E8D4',
      cardBg: '#CFE3D6',
      border: '#FFFFFF',
      textColor: '#1D3F63',
      subTextColor: '#2F6496',
      accentColor: '#2F6496'
    },
    'lavender-sky': {
      bg: '#B8BDE0',
      cardBg: '#A7ACE0',
      border: '#FFFFFF',
      textColor: '#1D3F63',
      subTextColor: '#245A8C',
      accentColor: '#245A8C'
    },
    'deep-blueprint': {
      bg: '#245A8C',
      cardBg: '#1D3F63',
      border: '#CFEAF2',
      textColor: '#FFFFFF',
      subTextColor: '#8FBCDD',
      accentColor: '#BFE3EE'
    },
    'ice-minimal': {
      bg: '#BFE3EE',
      cardBg: '#A6D5E6',
      border: '#FFFFFF',
      textColor: '#1D3F63',
      subTextColor: '#2F6496',
      accentColor: '#2F6496'
    },
    'ash-retro': {
      bg: '#D9D6D6',
      cardBg: '#C7C2C2',
      border: '#245A8C',
      textColor: '#1D3F63',
      subTextColor: '#2F6496',
      accentColor: '#245A8C'
    },
    'gameboy-dmg': {
      bg: '#8B956D',
      cardBg: '#9BBC0F',
      border: '#0F380F',
      textColor: '#0F380F',
      subTextColor: '#306230',
      accentColor: '#0F380F'
    }
  };

  const currentTheme = themes[theme] || themes['blueprint-classic'];

  // Fill Background
  ctx.fillStyle = currentTheme.bg;
  ctx.fillRect(0, 0, stripWidth, stripHeight);

  // Subtle paper texture / noise or soft border
  ctx.strokeStyle = currentTheme.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, stripWidth - 2, stripHeight - 2);

  // Helper to load image
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Draw 3 Photos
  for (let i = 0; i < 3; i++) {
    const yPos = paddingTop + i * (photoHeight + photoGap);

    // Frame backdrop / border
    ctx.save();
    ctx.fillStyle = currentTheme.cardBg;
    ctx.shadowColor = 'rgba(0,0,0,0.06)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    roundRect(ctx, paddingX, yPos, photoWidth, photoHeight, 16);
    ctx.fill();
    ctx.restore();

    if (photos[i]) {
      try {
        const img = await loadImage(photos[i]);

        ctx.save();
        roundRect(ctx, paddingX, yPos, photoWidth, photoHeight, 16);
        ctx.clip();

        // Apply filter if specified
        if (filterCss && filterCss !== 'none') {
          ctx.filter = filterCss;
        }

        // Draw image object-fit cover
        drawImageCover(ctx, img, paddingX, yPos, photoWidth, photoHeight);
        ctx.restore();

        // Frame inner border
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 3;
        roundRect(ctx, paddingX + 1.5, yPos + 1.5, photoWidth - 3, photoHeight - 3, 15);
        ctx.stroke();
        ctx.restore();
      } catch (err) {
        console.error('Failed to load photo', i, err);
      }
    }
  }

  // Draw Footer Section
  const footerY = stripHeight - footerHeight + 24;

  ctx.textAlign = 'center';

  // Title
  ctx.fillStyle = currentTheme.textColor;
  ctx.font = 'bold 22px "Press Start 2P", "Courier New", monospace';
  ctx.fillText(title || 'SAHITYA PHOTO', stripWidth / 2, footerY + 24);

  // Subtitle / Event note
  ctx.fillStyle = currentTheme.subTextColor;
  ctx.font = '600 16px "Silkscreen", "Courier New", monospace';
  ctx.fillText(subtitle || 'ARCADE STRIP', stripWidth / 2, footerY + 54);

  // Date and decorative icon / hearts
  if (showDate) {
    const displayDate = dateText || new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.');
    ctx.fillStyle = currentTheme.subTextColor;
    ctx.font = '400 14px "Press Start 2P", monospace';
    ctx.fillText(`★ ${displayDate} ★`, stripWidth / 2, footerY + 84);
  }

  // Optional sticker / emoji
  if (sticker) {
    ctx.font = '36px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText(sticker, stripWidth / 2, footerY + 120);
  }

  return canvas;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sWidth, sHeight, sx, sy;

  if (imgRatio > targetRatio) {
    sHeight = img.height;
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.width;
    sHeight = img.width / targetRatio;
    sx = 0;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}
