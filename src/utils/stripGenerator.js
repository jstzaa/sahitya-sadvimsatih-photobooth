import defaultFrameSrc from '../assets/frame.png'

export async function generateStripCanvas({
  photos,
  filterCss = 'none',
  frameSrc = defaultFrameSrc
}) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const stripWidth = 600
  const stripHeight = 1800

  canvas.width = stripWidth
  canvas.height = stripHeight

  ctx.fillStyle = '#1D3F63'
  ctx.fillRect(0, 0, stripWidth, stripHeight)

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const slots = [
    { x: 52, y: 321, width: 496, height: 376 },
    { x: 52, y: 746, width: 496, height: 368 },
    { x: 52, y: 1170, width: 496, height: 368 }
  ]

  for (let i = 0; i < 3; i++) {
    const slot = slots[i]
    if (photos && photos[i]) {
      try {
        const img = await loadImage(photos[i])

        ctx.save()
        ctx.beginPath()
        ctx.rect(slot.x - 2, slot.y - 2, slot.width + 4, slot.height + 4)
        ctx.clip()

        if (filterCss && filterCss !== 'none') {
          ctx.filter = filterCss
        }

        drawImageCover(ctx, img, slot.x - 2, slot.y - 2, slot.width + 4, slot.height + 4)
        ctx.restore()
      } catch (err) {
        console.error('Failed to load photo', i, err)
      }
    }
  }

  try {
    const frameImg = await loadImage(frameSrc || defaultFrameSrc)
    ctx.drawImage(frameImg, 0, 0, stripWidth, stripHeight)
  } catch (err) {
    console.error('Failed to load frame image:', err)
  }

  return canvas
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height
  const targetRatio = w / h
  let sWidth, sHeight, sx, sy

  if (imgRatio > targetRatio) {
    sHeight = img.height
    sWidth = img.height * targetRatio
    sx = (img.width - sWidth) / 2
    sy = 0
  } else {
    sWidth = img.width
    sHeight = img.width / targetRatio
    sx = 0
    sy = (img.height - sHeight) / 2
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h)
}
