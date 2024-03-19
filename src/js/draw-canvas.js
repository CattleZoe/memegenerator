export const drawCanvas = (image, canvas, ctx, textboxes = new Map()) => {
  if (image == null) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (typeof image === 'string') { // Assume it's a color
    ctx.fillStyle = image;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  let multiplier = 0;

  textboxes.forEach(textbox => {
    const { data } = textbox;
    multiplier += 1;

    console.log('------');

    ctx.save();

    ctx.font = `${data.fontWeight} ${data.fontSize * canvas.width / 1000}px ${data.font}`;
    ctx.fillStyle = data.fillColor;
    ctx.textAlign = data.textAlign;
    ctx.strokeStyle = data.strokeColor;

    const lineHeight = ctx.measureText('M').width + data.fontSize / 2;
    const xPos = canvas.width / 2;
    const shadowBlur = data.shadowBlur;
    const text = data.allCaps === true ? data.text.toUpperCase() : data.text;
    const textLines = text.split('\n');

    if (shadowBlur !== 0) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowColor = data.strokeColor;
    }

    ctx.translate(xPos + data.offsetX, lineHeight * multiplier + data.offsetY);
    ctx.rotate(data.rotate * Math.PI / 180);
    // first draw each line with shadow
    textLines.forEach((text, index) => ctx.fillText(text, 0, index * lineHeight));
    // since shadows of multiline text may be drawn over letters of neighbour lines
    // (when shadow blur is big enough), re-draw text without shadows.
    ctx.shadowBlur = 0;
    textLines.forEach((text, index) => ctx.fillText(text, 0, index * lineHeight));
    if (data.borderWidth > 0) {
      ctx.lineWidth = data.borderWidth;
      textLines.forEach((text, index) => ctx.strokeText(text, 0, index * lineHeight));
    }

    ctx.restore();
  });
};
