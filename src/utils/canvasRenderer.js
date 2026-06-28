/**
 * HTML5 Canvas Compositing Engine for Dynamic Birthday Supplies
 */

// Helper to draw background patterns on a specific path or context
export function drawPattern(ctx, type, primary, secondary, accent, w, h) {
  ctx.save();
  if (type === 'stripes') {
    // Fill background with secondary color
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, w, h);

    // Draw primary color diagonal stripes
    ctx.strokeStyle = primary;
    ctx.lineWidth = 16;
    ctx.beginPath();
    for (let i = -w; i < w + h; i += 40) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
    }
    ctx.stroke();
  } else if (type === 'dots') {
    ctx.fillStyle = primary;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = secondary;
    const size = 6;
    const spacing = 28;
    for (let x = 10; x < w; x += spacing) {
      for (let y = 10; y < h; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (type === 'stars') {
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = accent;
    const spacing = 45;
    for (let x = 15; x < w; x += spacing) {
      for (let y = 15; y < h; y += spacing) {
        const cx = x + (y % 2 === 0 ? 15 : 0);
        const cy = y;
        drawStarShape(ctx, cx, cy, 5, 8, 4);
      }
    }
  } else {
    // Confetti / Default
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, w, h);

    const colors = [primary, accent, '#38bdf8', '#f472b6', '#ffffff'];
    // Deterministic random placement based on grid
    for (let x = 20; x < w; x += 40) {
      for (let y = 20; y < h; y += 45) {
        ctx.fillStyle = colors[(x + y) % colors.length];
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(((x * y) % 360) * Math.PI / 180);
        if ((x + y) % 3 === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, 3 + (x % 3), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-3, -6, 6, 12);
        }
        ctx.restore();
      }
    }
  }
  ctx.restore();
}

function drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

// Remove solid white background from an image
export function applyWhiteChromaKey(ctx, x, y, width, height) {
  try {
    const imgData = ctx.getImageData(x, y, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If color is very close to white, make it transparent
      // Handles both absolute white and slightly off-white
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0; // alpha
      }
    }
    ctx.putImageData(imgData, x, y);
  } catch (e) {
    // CORS issue might trigger this on external images, fail gracefully
    console.warn("Chroma key bypassed due to image origin restictions.", e);
  }
}

// Main rendering engine
export function drawProductMockup(canvas, product, theme, config) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Use configured colors or theme default
  const primary = config.customColors?.primaryColor || theme.primaryColor;
  const secondary = config.customColors?.secondaryColor || theme.secondaryColor;
  const accent = config.customColors?.accentColor || theme.accentColor;
  const textCol = config.customColors?.textColor || theme.textColor;
  
  const nameText = (config.customName || "HAPPY").toUpperCase();
  const ageText = config.customAge ? `${config.customAge}th` : "BIRTHDAY";

  // Pre-load default or custom image
  const artworkImg = config.loadedImage;

  // Let's draw according to product type
  const type = product.type;

  ctx.save();

  // Draw elegant soft drop-shadow background for the mockup
  ctx.fillStyle = '#05070c';
  ctx.fillRect(0, 0, w, h);

  // Add a nice subtle grid or circular gradient in background to present the product
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 20, w/2, h/2, w/1.2);
  bgGrad.addColorStop(0, 'rgba(31, 41, 55, 0.4)');
  bgGrad.addColorStop(1, 'rgba(5, 7, 12, 1)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Setup shadow configurations for product mockups
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;

  if (type === 'bag') {
    // RETURN GIFT BAG
    // 1. Draw bag base shadow
    ctx.beginPath();
    ctx.ellipse(200, 360, 110, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();
    ctx.shadowColor = 'transparent'; // Reset shadow

    // 2. Draw Bag Handles (Loops at the top)
    ctx.strokeStyle = primary;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    
    // Left handle
    ctx.beginPath();
    ctx.arc(160, 110, 30, Math.PI, 0, false);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(160, 110, 30, Math.PI, 0, false);
    ctx.stroke();

    // Right handle
    ctx.strokeStyle = primary;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(240, 110, 30, Math.PI, 0, false);
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(240, 110, 30, Math.PI, 0, false);
    ctx.stroke();

    // 3. Draw Bag Body (Trapezoidal box)
    ctx.beginPath();
    ctx.moveTo(90, 110);
    ctx.lineTo(310, 110);
    ctx.lineTo(325, 340);
    ctx.lineTo(75, 340);
    ctx.closePath();
    
    // Fill Bag Body with Secondary Theme Color or Gradient
    const bagGrad = ctx.createLinearGradient(90, 110, 325, 340);
    bagGrad.addColorStop(0, secondary);
    bagGrad.addColorStop(1, adjustColorBrightness(secondary, -20));
    ctx.fillStyle = bagGrad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.stroke();

    // 4. Central Printable Pattern Area
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(110, 130);
    ctx.lineTo(290, 130);
    ctx.lineTo(300, 320);
    ctx.lineTo(100, 320);
    ctx.closePath();
    ctx.clip();

    // Draw Theme Pattern inside Printable Area
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    // Draw Character Artwork
    if (artworkImg) {
      const artW = 120;
      const artH = 120;
      const artX = 200 - artW / 2;
      const artY = 220 - artH / 2;
      
      // Draw image in canvas
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    // Typography Overlay inside Bag
    drawTextWithOutline(ctx, "HAPPY BIRTHDAY", 200, 160, `bold 16px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, `${nameText} IS ${ageText}`, 200, 300, `extrabold 18px var(--font-heading)`, accent, '#000000', 4);

    ctx.restore();

    // 5. 3D Folds and Shading Overlays
    // Left side panel fold shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.moveTo(90, 110);
    ctx.lineTo(110, 110);
    ctx.lineTo(100, 340);
    ctx.lineTo(75, 340);
    ctx.fill();

    // Right fold shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.moveTo(310, 110);
    ctx.lineTo(290, 110);
    ctx.lineTo(300, 340);
    ctx.lineTo(325, 340);
    ctx.fill();

    // Soft highlight on edge
    const shine = ctx.createLinearGradient(90, 110, 310, 110);
    shine.addColorStop(0, 'rgba(255,255,255,0.15)');
    shine.addColorStop(0.1, 'rgba(255,255,255,0)');
    shine.addColorStop(0.9, 'rgba(0,0,0,0)');
    shine.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.moveTo(90, 110);
    ctx.lineTo(310, 110);
    ctx.lineTo(325, 340);
    ctx.lineTo(75, 340);
    ctx.fill();

  } else if (type === 'wrapper') {
    // CHOCOLATE WRAPPER
    // 1. Crimped foil ends (left and right)
    ctx.fillStyle = '#cbd5e1';
    
    // Left crimped end
    ctx.beginPath();
    ctx.moveTo(50, 130);
    for (let y = 130; y <= 270; y += 10) {
      ctx.lineTo(50 + (y % 20 === 0 ? 8 : 0), y);
    }
    ctx.lineTo(70, 270);
    ctx.lineTo(70, 130);
    ctx.closePath();
    ctx.fill();

    // Right crimped end
    ctx.beginPath();
    ctx.moveTo(350, 130);
    for (let y = 130; y <= 270; y += 10) {
      ctx.lineTo(350 - (y % 20 === 0 ? 8 : 0), y);
    }
    ctx.lineTo(330, 270);
    ctx.lineTo(330, 130);
    ctx.closePath();
    ctx.fill();

    // 2. Main Chocolate Wrapper Body
    ctx.save();
    ctx.beginPath();
    ctx.rect(68, 130, 264, 140);
    ctx.clip();

    // Draw Pattern
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    // Draw Character Artwork
    if (artworkImg) {
      const artW = 100;
      const artH = 100;
      const artX = 200 - artW / 2;
      const artY = 200 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    // Texts
    drawTextWithOutline(ctx, "MILK CHOCOLATE", 200, 155, `bold 13px var(--font-body)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, `${nameText} IS ${ageText}`, 200, 255, `extrabold 16px var(--font-heading)`, accent, '#000000', 4);
    ctx.restore();

    // 3. Shading & Reflections
    // Gloss reflection
    const gloss = ctx.createLinearGradient(0, 130, 0, 270);
    gloss.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    gloss.addColorStop(0.15, 'rgba(255, 255, 255, 0.05)');
    gloss.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    gloss.addColorStop(0.85, 'rgba(0, 0, 0, 0.25)');
    gloss.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = gloss;
    ctx.fillRect(68, 130, 264, 140);

    // Wrap outline
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(68, 130, 264, 140);

  } else if (type === 'label') {
    // WATER BOTTLE LABEL (Overlayed on a 3D transparent water bottle mockup)
    // Draw bottle silhouette
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;

    // Cap
    ctx.beginPath();
    ctx.roundRect(175, 40, 50, 20, 4);
    ctx.fillStyle = primary;
    ctx.fill();
    ctx.stroke();

    // Neck
    ctx.beginPath();
    ctx.moveTo(180, 60);
    ctx.lineTo(180, 90);
    ctx.quadraticCurveTo(180, 130, 130, 150);
    ctx.lineTo(130, 360);
    ctx.quadraticCurveTo(130, 380, 150, 380);
    ctx.lineTo(250, 380);
    ctx.quadraticCurveTo(270, 380, 270, 360);
    ctx.lineTo(270, 150);
    ctx.quadraticCurveTo(220, 130, 220, 90);
    ctx.lineTo(220, 60);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();
    ctx.stroke();

    // Label area on bottle (y: 180 to y: 290)
    ctx.save();
    ctx.beginPath();
    ctx.rect(130, 180, 140, 110);
    ctx.clip();

    // Draw Pattern
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    // Artwork
    if (artworkImg) {
      const artW = 75;
      const artH = 75;
      const artX = 200 - artW / 2;
      const artY = 235 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    // Texts
    drawTextWithOutline(ctx, "PARTY WATER", 200, 200, `bold 10px var(--font-body)`, textCol, '#000000', 2);
    drawTextWithOutline(ctx, `${nameText}`, 200, 280, `extrabold 12px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

    // 3D cylindrical lighting overlay on label
    const labelShine = ctx.createLinearGradient(130, 0, 270, 0);
    labelShine.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    labelShine.addColorStop(0.2, 'rgba(0, 0, 0, 0.1)');
    labelShine.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    labelShine.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
    labelShine.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = labelShine;
    ctx.fillRect(130, 180, 140, 110);

  } else if (type === 'plate') {
    // PAPER PLATE (Circular rim and inside dish)
    const cx = 200, cy = 200;
    const outerR = 150, innerR = 105;

    // 1. Shadow background for Plate
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 24;

    // 2. Draw Outer Rim Circle
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fillStyle = primary;
    ctx.fill();
    ctx.shadowColor = 'transparent'; // Reset shadow

    // 3. Draw Fluted Paper Ridges on Rim
    ctx.strokeStyle = adjustColorBrightness(primary, -30);
    ctx.lineWidth = 1.5;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 36) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.stroke();
    }

    // 4. Inner dish area
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.clip();

    // Pattern
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    // Character image
    if (artworkImg) {
      const artW = 110;
      const artH = 110;
      const artX = cx - artW / 2;
      const artY = cy - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    // Plate details text
    drawTextWithOutline(ctx, "HAPPY BIRTHDAY", cx, cy - 70, `bold 13px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, `${nameText} IS ${ageText}`, cx, cy + 80, `extrabold 15px var(--font-heading)`, accent, '#000000', 4);

    ctx.restore();

    // Inner rim shadow for depth (concave look)
    const plateDepth = ctx.createRadialGradient(cx, cy, innerR - 10, cx, cy, innerR + 5);
    plateDepth.addColorStop(0, 'rgba(0,0,0,0)');
    plateDepth.addColorStop(0.8, 'rgba(0,0,0,0.3)');
    plateDepth.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = plateDepth;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR + 5, 0, Math.PI * 2);
    ctx.fill();

    // White rim reflection
    const plateReflect = ctx.createLinearGradient(0, 50, 0, 350);
    plateReflect.addColorStop(0, 'rgba(255,255,255,0.15)');
    plateReflect.addColorStop(0.5, 'rgba(255,255,255,0)');
    plateReflect.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = plateReflect;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'cup') {
    // PAPER CUP (Tapered cup shape)
    // 1. Draw Cup Body path
    ctx.beginPath();
    ctx.moveTo(135, 100);
    ctx.lineTo(265, 100);
    ctx.lineTo(235, 320);
    ctx.lineTo(165, 320);
    ctx.closePath();

    // Fill with pattern
    ctx.save();
    ctx.clip();
    
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    // Character artwork
    if (artworkImg) {
      const artW = 90;
      const artH = 90;
      const artX = 200 - artW / 2;
      const artY = 210 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    // Texts
    drawTextWithOutline(ctx, "HAPPY BIRTHDAY", 200, 150, `bold 12px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, nameText, 200, 280, `extrabold 15px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

    // 2. Cup rim lip (White rolled top ring)
    ctx.beginPath();
    ctx.roundRect(130, 90, 140, 12, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#d1d5db';
    ctx.stroke();

    // 3. 3D Cylindrical shading
    const cupShading = ctx.createLinearGradient(135, 0, 265, 0);
    cupShading.addColorStop(0, 'rgba(0,0,0,0.45)');
    cupShading.addColorStop(0.2, 'rgba(0,0,0,0.1)');
    cupShading.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    cupShading.addColorStop(0.8, 'rgba(0,0,0,0.15)');
    cupShading.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = cupShading;
    ctx.beginPath();
    ctx.moveTo(135, 100);
    ctx.lineTo(265, 100);
    ctx.lineTo(235, 320);
    ctx.lineTo(165, 320);
    ctx.closePath();
    ctx.fill();

  } else if (type === 'card' || type === 'thankyou') {
    // INVITATION / THANK YOU CARDS
    const cardW = 260, cardH = 340;
    const cardX = 200 - cardW / 2, cardY = 200 - cardH / 2;

    // Card background & borders
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 16);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = accent;
    ctx.stroke();

    // Pattern inside border
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX + 8, cardY + 8, cardW - 16, cardH - 16, 12);
    ctx.clip();
    
    // Draw pattern with reduced opacity for readability
    ctx.globalAlpha = 0.5;
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);
    ctx.globalAlpha = 1.0;

    // Inside frame card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.roundRect(cardX + 16, cardY + 16, cardW - 32, cardH - 32, 8);
    ctx.fill();

    // Artwork
    if (artworkImg) {
      const artW = 100;
      const artH = 100;
      const artX = 200 - artW / 2;
      const artY = 205 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    if (type === 'card') {
      drawTextWithOutline(ctx, "YOU'RE INVITED!", 200, 75, `bold 16px var(--font-heading)`, accent, '#000000', 3);
      drawTextWithOutline(ctx, `Celebrate With Us!`, 200, 95, `italic 11px var(--font-body)`, '#ffffff', '#000000', 2);
      drawTextWithOutline(ctx, `${nameText}'S`, 200, 135, `extrabold 18px var(--font-heading)`, primary, '#000000', 3);
      drawTextWithOutline(ctx, `${ageText} Birthday Party`, 200, 275, `bold 14px var(--font-heading)`, textCol, '#000000', 3);
      
      // Date and details
      ctx.fillStyle = '#ffffff';
      ctx.font = '500 9px var(--font-body)';
      ctx.textAlign = 'center';
      ctx.fillText('SATURDAY, OCTOBER 17TH AT 4:00 PM', 200, 305);
      ctx.fillText('123 PARTY AVE, CONFETTI CITY', 200, 320);
    } else {
      // THANK YOU CARD
      drawTextWithOutline(ctx, "THANK YOU!", 200, 80, `bold 18px var(--font-heading)`, accent, '#000000', 3);
      drawTextWithOutline(ctx, `FOR MAKING MY PARTY SPECIAL`, 200, 105, `bold 9px var(--font-body)`, '#ffffff', '#000000', 2);
      drawTextWithOutline(ctx, `${nameText}'S`, 200, 135, `extrabold 18px var(--font-heading)`, primary, '#000000', 3);
      drawTextWithOutline(ctx, `CELEBRATION`, 200, 270, `bold 13px var(--font-heading)`, textCol, '#000000', 3);
      
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'italic 10px var(--font-body)';
      ctx.textAlign = 'center';
      ctx.fillText('"Thanks for joining the fun and', 200, 300);
      ctx.fillText('sharing my special day with me!"', 200, 315);
    }

    ctx.restore();

  } else if (type === 'box') {
    // POPCORN BOX
    // 1. Draw box shape (scalloped top edge, tapered body)
    ctx.beginPath();
    ctx.moveTo(130, 100);
    
    // Scallops at the top
    ctx.quadraticCurveTo(150, 90, 170, 100);
    ctx.quadraticCurveTo(190, 90, 210, 100);
    ctx.quadraticCurveTo(230, 90, 250, 100);
    ctx.quadraticCurveTo(270, 90, 270, 100);
    
    ctx.lineTo(240, 330);
    ctx.lineTo(160, 330);
    ctx.closePath();

    ctx.save();
    ctx.clip();

    // Alternating vertical stripes pattern manually drawn inside box clip
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = primary;
    const stripeW = 20;
    for (let x = 100; x < 300; x += stripeW * 2) {
      ctx.fillRect(x, 70, stripeW, 280);
    }

    // Emblem circle in center
    ctx.beginPath();
    ctx.arc(200, 210, 48, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // Artwork inside emblem
    if (artworkImg) {
      const artW = 60;
      const artH = 60;
      const artX = 200 - artW / 2;
      const artY = 200 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, nameText, 200, 250, `extrabold 12px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

    // 3D fold shade
    const boxShine = ctx.createLinearGradient(130, 0, 270, 0);
    boxShine.addColorStop(0, 'rgba(0,0,0,0.4)');
    boxShine.addColorStop(0.3, 'rgba(0,0,0,0)');
    boxShine.addColorStop(0.7, 'rgba(255,255,255,0.15)');
    boxShine.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = boxShine;
    ctx.beginPath();
    ctx.moveTo(130, 100);
    ctx.lineTo(270, 100);
    ctx.lineTo(240, 330);
    ctx.lineTo(160, 330);
    ctx.closePath();
    ctx.fill();

  } else if (type === 'hat') {
    // PARTY HAT CONE
    // Apex: 200, 70. Left: 110, 310. Right: 290, 310.
    const ax = 200, ay = 70;
    const lx = 110, ly = 315;
    const rx = 290, ry = 315;

    // Draw Cone
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(rx, ry);
    ctx.quadraticCurveTo(200, 340, lx, ly);
    ctx.closePath();

    ctx.save();
    ctx.clip();

    // Pattern inside cone
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    // Character image
    if (artworkImg) {
      const artW = 90;
      const artH = 90;
      const artX = 200 - artW / 2;
      const artY = 220 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    // Texts
    drawTextWithOutline(ctx, nameText, 200, 290, `extrabold 14px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

    // 3D lighting on cone
    const coneShine = ctx.createLinearGradient(lx, 0, rx, 0);
    coneShine.addColorStop(0, 'rgba(0,0,0,0.4)');
    coneShine.addColorStop(0.3, 'rgba(0,0,0,0)');
    coneShine.addColorStop(0.7, 'rgba(255,255,255,0.2)');
    coneShine.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = coneShine;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(rx, ry);
    ctx.quadraticCurveTo(200, 340, lx, ly);
    ctx.closePath();
    ctx.fill();

    // Pom pom at top
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(ax, ay - 6, 15, 0, Math.PI*2);
    ctx.fillStyle = accent;
    ctx.fill();
    // Fuzzy lines on pom pom
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(ax, ay - 6);
      ctx.lineTo(ax + Math.cos(a) * 16, ay - 6 + Math.sin(a) * 16);
      ctx.stroke();
    }
    ctx.shadowColor = 'transparent';

  } else if (type === 'sticker') {
    // Personalized Sticker
    const cx = 200, cy = 200, r = 130;

    // White backing sticker boundary
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Dashed cutline
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, r - 5, 0, Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Inner pattern area
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 10, 0, Math.PI*2);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    if (artworkImg) {
      const artW = 100;
      const artH = 100;
      const artX = cx - artW / 2;
      const artY = cy - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "STICKER PACK", cx, cy - 65, `bold 12px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, `${nameText} IS ${ageText}`, cx, cy + 75, `extrabold 14px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

  } else if (type === 'banner') {
    // BANNER FLAG (Pennant pointing down)
    ctx.beginPath();
    ctx.moveTo(110, 80);
    ctx.lineTo(290, 80);
    ctx.lineTo(200, 320);
    ctx.closePath();

    ctx.save();
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    // Emblem in center
    ctx.beginPath();
    ctx.arc(200, 175, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    // Large letter or age in center
    drawTextWithOutline(ctx, ageText.slice(0,1), 200, 205, `extrabold 52px var(--font-heading)`, secondary, '#ffffff', 2);

    // Mini character icon above the letter
    if (artworkImg) {
      const artW = 40;
      const artH = 40;
      const artX = 200 - artW / 2;
      const artY = 110;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, nameText, 200, 270, `bold 13px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

    // Yellow string loops at top corners
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(80, 80);
    ctx.lineTo(115, 80);
    ctx.moveTo(285, 80);
    ctx.lineTo(320, 80);
    ctx.stroke();

  } else if (type === 'board') {
    // WELCOME BOARD (Resting on easel)
    // 1. Draw Wooden Easel legs
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    // Back leg
    ctx.beginPath();
    ctx.moveTo(200, 40);
    ctx.lineTo(200, 360);
    ctx.stroke();
    // Left leg
    ctx.beginPath();
    ctx.moveTo(200, 40);
    ctx.lineTo(110, 370);
    ctx.stroke();
    // Right leg
    ctx.beginPath();
    ctx.moveTo(200, 40);
    ctx.lineTo(290, 370);
    ctx.stroke();

    // Board rest bar
    ctx.beginPath();
    ctx.moveTo(100, 300);
    ctx.lineTo(300, 300);
    ctx.stroke();

    // 2. Welcome board poster (y: 60 to 280)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(110, 60, 180, 230, 8);
    ctx.fillStyle = primary;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.clip();

    // Board pattern
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    // Dark backdrop overlay for readability
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(110, 60, 180, 230);

    // Artwork
    if (artworkImg) {
      const artW = 75;
      const artH = 75;
      const artX = 200 - artW / 2;
      const artY = 175 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "WELCOME TO THE PARTY!", 200, 95, `bold 11px var(--font-heading)`, accent, '#000000', 2.5);
    drawTextWithOutline(ctx, `${nameText}'S`, 200, 125, `extrabold 18px var(--font-heading)`, textCol, '#000000', 3.5);
    drawTextWithOutline(ctx, `${ageText} BIRTHDAY!`, 200, 245, `extrabold 12px var(--font-heading)`, primary, '#000000', 3);

    ctx.restore();

  } else if (type === 'tablecover') {
    // CAKE TABLECOVER
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    // Table legs
    ctx.beginPath();
    ctx.moveTo(90, 240); ctx.lineTo(90, 360);
    ctx.moveTo(110, 240); ctx.lineTo(110, 320);
    ctx.moveTo(290, 240); ctx.lineTo(290, 320);
    ctx.moveTo(310, 240); ctx.lineTo(310, 360);
    ctx.stroke();

    // Tablecloth hanging polygon
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.moveTo(60, 200);
    ctx.lineTo(340, 200);
    ctx.lineTo(320, 280);
    ctx.lineTo(80, 280);
    ctx.closePath();
    ctx.fill();

    // Checkered flag border at bottom of tablecloth
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(80, 270, 240, 10);
    ctx.fillStyle = '#000000';
    const checkW = 10;
    for (let x = 80; x < 320; x += checkW * 2) {
      ctx.fillRect(x, 270, checkW, 5);
      ctx.fillRect(x + checkW, 275, checkW, 5);
    }

    // Main cover top
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.moveTo(80, 150);
    ctx.lineTo(320, 150);
    ctx.lineTo(340, 200);
    ctx.lineTo(60, 200);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Custom text and emblem on front hanging panel
    ctx.beginPath();
    ctx.arc(200, 235, 28, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    if (artworkImg) {
      const artW = 40;
      const artH = 40;
      const artX = 200 - artW / 2;
      const artY = 235 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }
    drawTextWithOutline(ctx, nameText, 200, 275, `bold 10px var(--font-heading)`, textCol, '#000000', 2);

  } else if (type === 'glasses') {
    // PARTY GLASSES
    ctx.strokeStyle = primary;
    ctx.lineWidth = 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(140, 200, 42, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(260, 200, 42, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();

    // Nose Bridge
    ctx.strokeStyle = primary;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(200, 195, 20, Math.PI, 0, false);
    ctx.stroke();

    // Temples / Sides
    ctx.strokeStyle = secondary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(98, 200); ctx.lineTo(60, 220);
    ctx.moveTo(302, 200); ctx.lineTo(340, 220);
    ctx.stroke();

    // Checkered or star wings on glasses corners
    ctx.fillStyle = accent;
    drawStarShape(ctx, 90, 160, 5, 12, 6);
    drawStarShape(ctx, 310, 160, 5, 12, 6);

    // Dynamic mascot sitting on top of the bridge
    if (artworkImg) {
      const artW = 60;
      const artH = 60;
      const artX = 200 - artW / 2;
      const artY = 145 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "COOL", 140, 200, `bold 12px var(--font-heading)`, accent, '#000000', 3);
    drawTextWithOutline(ctx, nameText.slice(0, 5), 260, 200, `bold 12px var(--font-heading)`, textCol, '#000000', 3);

  } else if (type === 'photobanner') {
    // 12 MONTHS PHOTO GARLAND
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 120);
    ctx.quadraticCurveTo(200, 180, 360, 120);
    ctx.stroke();

    const pWidth = 65, pHeight = 85;
    const drawPolaroid = (x, y, label) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x, y, pWidth, pHeight, 4);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      ctx.fillStyle = secondary;
      ctx.fillRect(x + 6, y + 6, pWidth - 12, pHeight - 22);

      ctx.fillStyle = accent;
      ctx.fillRect(x + pWidth/2 - 4, y - 8, 8, 14);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px var(--font-body)';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + pWidth/2, y + pHeight - 8);
    };

    drawPolaroid(75, 145, "1 MONTH");
    drawPolaroid(167, 160, `${nameText}`);
    drawPolaroid(260, 145, `12 MONTHS`);

    if (artworkImg) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(167 + 6, 160 + 6, pWidth - 12, pHeight - 22);
      ctx.clip();
      ctx.drawImage(artworkImg, 167 + 6, 160 + 6, pWidth - 12, pHeight - 22);
      applyWhiteChromaKey(ctx, 167 + 6, 160 + 6, pWidth - 12, pHeight - 22);
      ctx.restore();
    }

  } else if (type === 'arch') {
    // THEME BACKDROP ARCH
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(200, 360, 90, 10, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(110, 60, 180, 300, [90, 90, 10, 10]);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 4;
    ctx.stroke();

    if (artworkImg) {
      const artW = 120;
      const artH = 120;
      const artX = 200 - artW/2;
      const artY = 240 - artH/2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "HAPPY BIRTHDAY", 200, 120, `bold 14px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, `${nameText} IS ${ageText}`, 200, 320, `extrabold 16px var(--font-heading)`, accent, '#000000', 4);
    ctx.restore();

    const drawBalloon = (bx, by, col) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(bx, by, 14, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(bx, by+14); ctx.lineTo(bx-3, by+17); ctx.lineTo(bx+3, by+17);
      ctx.closePath();
      ctx.fill();
    };
    drawBalloon(95, 280, primary);
    drawBalloon(90, 310, accent);
    drawBalloon(305, 280, secondary);
    drawBalloon(310, 310, primary);

  } else if (type === 'paperfan') {
    // PAPER PINWHEEL FANS
    const drawFan = (cx, cy, r, rotation, col1, col2) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      
      const slices = 24;
      const angle = (Math.PI * 2) / slices;
      for (let i = 0; i < slices; i++) {
        ctx.fillStyle = i % 2 === 0 ? col1 : col2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, i * angle, (i + 1) * angle);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      if (artworkImg) {
        const aSz = r * 0.5;
        ctx.drawImage(artworkImg, -aSz/2, -aSz/2, aSz, aSz);
        applyWhiteChromaKey(ctx, -aSz/2, -aSz/2, aSz, aSz);
      }
      ctx.restore();
    };

    drawFan(200, 150, 70, 0, primary, secondary);
    drawFan(135, 240, 50, 0.2, secondary, accent);
    drawFan(265, 240, 50, -0.2, accent, primary);

    drawTextWithOutline(ctx, nameText, 200, 315, `extrabold 16px var(--font-heading)`, textCol, '#000000', 3);

  } else if (type === 'video') {
    // E-VIDEO INVITATION (Smartphone display)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(125, 50, 150, 300, 18);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(131, 56, 138, 288, 12);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(131, 56, 138, 288);

    if (artworkImg) {
      const artW = 70;
      const artH = 70;
      const artX = 200 - artW / 2;
      const artY = 180 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "YOU'RE INVITED!", 200, 90, `bold 10px var(--font-heading)`, accent, '#000000', 2);
    drawTextWithOutline(ctx, `${nameText}'S`, 200, 120, `extrabold 15px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, `PARTY VIDEO`, 200, 240, `bold 9px var(--font-body)`, primary, '#000000', 2);

    // Play Overlay Icon
    ctx.beginPath();
    ctx.arc(200, 180, 24, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(193, 168);
    ctx.lineTo(213, 180);
    ctx.lineTo(193, 192);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();

  } else if (type === 'photobooth') {
    // PHOTOBOOTH SELFIE FRAME
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.roundRect(80, 80, 240, 240, 12);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.rect(115, 115, 170, 170);
    ctx.clip();
    ctx.clearRect(115, 115, 170, 170);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(115, 115, 170, 170);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(200, 210, 25, 0, Math.PI*2);
    ctx.arc(170, 230, 20, 0, Math.PI*2);
    ctx.arc(230, 230, 20, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(80, 80, 240, 240, 12);
    ctx.rect(285, 115, -170, 170);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    drawTextWithOutline(ctx, "PHOTOBOOTH", 200, 98, `bold 13px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, `${nameText} IS ${ageText}!`, 200, 302, `extrabold 14px var(--font-heading)`, accent, '#000000', 3.5);
    ctx.restore();

    if (artworkImg) {
      const artW = 60;
      const artH = 60;
      const artX = 265 - artW / 2;
      const artY = 265 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

  } else if (type === 'mask') {
    // EYE MASK
    ctx.beginPath();
    ctx.moveTo(80, 200);
    ctx.bezierCurveTo(90, 140, 190, 150, 200, 185);
    ctx.bezierCurveTo(210, 150, 310, 140, 320, 200);
    ctx.bezierCurveTo(310, 260, 230, 260, 200, 220);
    ctx.bezierCurveTo(170, 260, 90, 260, 80, 200);
    ctx.closePath();

    ctx.save();
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    if (artworkImg) {
      const artW = 60;
      const artH = 60;
      const artX = 200 - artW / 2;
      const artY = 200 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    ctx.restore();

    ctx.fillStyle = '#05070c';
    ctx.beginPath();
    ctx.ellipse(140, 195, 18, 12, Math.PI / 12, 0, Math.PI * 2);
    ctx.ellipse(260, 195, 18, 12, -Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 200);
    ctx.bezierCurveTo(90, 140, 190, 150, 200, 185);
    ctx.bezierCurveTo(210, 150, 310, 140, 320, 200);
    ctx.bezierCurveTo(310, 260, 230, 260, 200, 220);
    ctx.bezierCurveTo(170, 260, 90, 260, 80, 200);
    ctx.closePath();
    ctx.stroke();

    drawTextWithOutline(ctx, nameText, 200, 150, `bold 12px var(--font-heading)`, textCol, '#000000', 3);

  } else if (type === 'handband') {
    // WRISTBAND / HAND BAND
    const drawBand = (y, col, label) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(340, y + 10);
      ctx.lineTo(335, y + 34);
      ctx.lineTo(55, y + 24);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(80, y+4, 80, 16);
      ctx.fillRect(240, y+8, 60, 16);

      ctx.beginPath();
      ctx.arc(200, y + 17, 18, 0, Math.PI*2);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      if (artworkImg) {
        ctx.drawImage(artworkImg, 188, y+5, 24, 24);
        applyWhiteChromaKey(ctx, 188, y+5, 24, 24);
      }

      drawTextWithOutline(ctx, label, 130, y + 16, `bold 9px var(--font-heading)`, '#ffffff', '#000000', 2);
    };

    drawBand(160, primary, nameText);
    drawBand(220, secondary, `${ageText} GUEST`);

  } else if (type === 'badge') {
    // PRIZE PIN BADGE
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.moveTo(180, 220); ctx.lineTo(160, 330); ctx.lineTo(180, 310); ctx.lineTo(195, 330); ctx.lineTo(190, 220);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(210, 220); ctx.lineTo(205, 330); ctx.lineTo(220, 310); ctx.lineTo(240, 330); ctx.lineTo(220, 220);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = primary;
    const cx = 200, cy = 170, outerR = 64, innerR = 48;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a - 0.1) * outerR, cy + Math.sin(a - 0.1) * outerR);
      ctx.lineTo(cx + Math.cos(a + 0.1) * outerR, cy + Math.sin(a + 0.1) * outerR);
      ctx.closePath();
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    if (artworkImg) {
      const artW = 55;
      const artH = 55;
      const artX = cx - artW / 2;
      const artY = cy - artH / 2 - 8;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }
    drawTextWithOutline(ctx, nameText, cx, cy + 28, `bold 10px var(--font-heading)`, secondary, '#000000', 2);

  } else if (type === 'doorposter') {
    // VERTICAL DOOR POSTER
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(130, 70);
    ctx.lineTo(200, 35);
    ctx.lineTo(270, 70);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(130, 70, 140, 290, 8);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);
    
    ctx.fillStyle = 'rgba(15,23,42,0.7)';
    ctx.fillRect(130, 70, 140, 290);

    if (artworkImg) {
      const artW = 85;
      const artH = 85;
      const artX = 200 - artW / 2;
      const artY = 210 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "WELCOME TO", 200, 95, `bold 11px var(--font-heading)`, accent, '#000000', 2.5);
    drawTextWithOutline(ctx, nameText, 200, 125, `extrabold 18px var(--font-heading)`, textCol, '#000000', 3.5);
    drawTextWithOutline(ctx, `PARTY HALL`, 200, 280, `bold 10px var(--font-body)`, primary, '#000000', 2.5);
    drawTextWithOutline(ctx, `AGE: ${ageText}`, 200, 315, `extrabold 13px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

    ctx.fillStyle = '#78350f';
    ctx.fillRect(120, 64, 160, 8);
    ctx.fillRect(120, 358, 160, 8);

  } else if (type === 'cutout') {
    // THEMED WALL CUTOUT
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 12;

    const cx = 200, cy = 180, r = 90;
    
    ctx.beginPath();
    ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    
    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    if (artworkImg) {
      const artW = 120;
      const artH = 120;
      const artX = cx - artW / 2;
      const artY = cy - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(120, 275, 160, 16);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(120, 275, 160, 16);
    ctx.fillStyle = '#000000';
    for (let ox = 120; ox < 280; ox += 16) {
      ctx.fillRect(ox, 275, 8, 8);
      ctx.fillRect(ox + 8, 283, 8, 8);
    }

    drawTextWithOutline(ctx, nameText, 200, 325, `extrabold 18px var(--font-heading)`, accent, '#000000', 4);

  } else if (type === 'juicelabel') {
    // JUICE BOTTLE/BOX LABEL
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(140, 90, 120, 230, 6);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(160, 90);
    ctx.lineTo(150, 70);
    ctx.lineTo(135, 60);
    ctx.stroke();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(159, 88);
    ctx.lineTo(149, 68);
    ctx.lineTo(134, 58);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.rect(140, 160, 120, 110);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    if (artworkImg) {
      const artW = 70;
      const artH = 70;
      const artX = 200 - artW / 2;
      const artY = 215 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "JUICE PACK", 200, 178, `bold 9px var(--font-heading)`, textCol, '#000000', 2);
    drawTextWithOutline(ctx, nameText, 200, 255, `extrabold 11px var(--font-heading)`, accent, '#000000', 2.5);

    ctx.restore();

    const boxShade = ctx.createLinearGradient(140, 0, 260, 0);
    boxShade.addColorStop(0, 'rgba(0,0,0,0.3)');
    boxShade.addColorStop(0.2, 'rgba(0,0,0,0)');
    boxShade.addColorStop(0.8, 'rgba(255,255,255,0.08)');
    boxShade.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = boxShade;
    ctx.beginPath();
    ctx.roundRect(140, 90, 120, 230, 6);
    ctx.fill();

  } else if (type === 'boxcover') {
    // CHOCOLATE BOX COVER (Sleeve overlay)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(110, 110, 180, 180, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(290, 118);
    ctx.lineTo(298, 126);
    ctx.lineTo(298, 298);
    ctx.lineTo(290, 290);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(118, 290);
    ctx.lineTo(126, 298);
    ctx.lineTo(298, 298);
    ctx.lineTo(290, 290);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.rect(125, 110, 150, 180);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    ctx.fillStyle = accent;
    ctx.fillRect(125, 180, 150, 24);

    if (artworkImg) {
      const artW = 75;
      const artH = 75;
      const artX = 200 - artW / 2;
      const artY = 192 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "CHOCOLATES", 200, 135, `bold 11px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, nameText, 200, 260, `extrabold 12px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

    const gloss = ctx.createLinearGradient(0, 110, 0, 290);
    gloss.addColorStop(0, 'rgba(255,255,255,0.15)');
    gloss.addColorStop(0.5, 'rgba(255,255,255,0)');
    gloss.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = gloss;
    ctx.fillRect(125, 110, 150, 180);

  } else if (type === 'topper') {
    // CAKE TOPPER
    ctx.strokeStyle = '#d6d3d1';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(200, 220);
    ctx.lineTo(200, 360);
    ctx.stroke();

    ctx.save();
    const cx = 200, cy = 150, r = 70;
    
    ctx.beginPath();
    const spikes = 10;
    let rot = Math.PI/2*3;
    let x = cx;
    let y = cy;
    const step = Math.PI/spikes;
    
    ctx.moveTo(cx, cy - r);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * r;
      y = cy + Math.sin(rot) * r;
      ctx.lineTo(x, y);
      rot += step;
      
      x = cx + Math.cos(rot) * (r - 12);
      y = cy + Math.sin(rot) * (r - 12);
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.closePath();
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    if (artworkImg) {
      const artW = 75;
      const artH = 75;
      const artX = cx - artW / 2;
      const artY = cy - artH / 2 - 4;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, nameText, cx, cy + 40, `extrabold 12px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

  } else if (type === 'cupcaketopper') {
    // CUPCAKE TOPPER IN CUPCAKE
    ctx.fillStyle = secondary;
    ctx.beginPath();
    ctx.moveTo(150, 280);
    ctx.lineTo(250, 280);
    ctx.lineTo(235, 340);
    ctx.lineTo(165, 340);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 2;
    for (let lx = 165; lx <= 235; lx += 14) {
      const topX = 150 + (lx - 165) * 1.4;
      ctx.beginPath();
      ctx.moveTo(topX, 280);
      ctx.lineTo(lx, 340);
      ctx.stroke();
    }

    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.arc(170, 260, 24, 0, Math.PI*2);
    ctx.arc(230, 260, 24, 0, Math.PI*2);
    ctx.arc(200, 250, 30, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(200, 235, 18, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(200, 140);
    ctx.lineTo(200, 220);
    ctx.stroke();

    const cx = 200, cy = 120, r = 40;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    if (artworkImg) {
      const artW = 40;
      const artH = 40;
      const artX = cx - artW / 2;
      const artY = cy - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }
    ctx.restore();

  } else if (type === 'tag') {
    // RETURN GIFT TAG
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(-Math.PI / 12);

    const tx = -55, ty = -100, tw = 110, th = 190;
    
    ctx.beginPath();
    ctx.moveTo(tx + 20, ty);
    ctx.lineTo(tx + tw - 20, ty);
    ctx.lineTo(tx + tw, ty + 20);
    ctx.lineTo(tx + tw, ty + th);
    ctx.lineTo(tx, ty + th);
    ctx.lineTo(tx, ty + 20);
    ctx.closePath();
    
    ctx.fillStyle = secondary;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    ctx.fillStyle = '#05070c';
    ctx.beginPath();
    ctx.arc(0, ty + 20, 7, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, ty + 13);
    ctx.quadraticCurveTo(-15, ty - 40, 0, ty - 60);
    ctx.quadraticCurveTo(15, ty - 40, 0, ty + 13);
    ctx.stroke();

    if (artworkImg) {
      const artW = 60;
      const artH = 60;
      const artX = -artW / 2;
      const artY = 5 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "THANK YOU!", 0, -45, `bold 10px var(--font-heading)`, textCol, '#000000', 2);
    drawTextWithOutline(ctx, nameText, 0, 60, `extrabold 12px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();

  } else if (type === 'prop') {
    // PHOTO PROP
    ctx.strokeStyle = '#f5e0c3';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(200, 220);
    ctx.lineTo(200, 360);
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(100, 80, 200, 140, 18);
    ctx.moveTo(180, 220);
    ctx.lineTo(200, 240);
    ctx.lineTo(210, 220);
    ctx.closePath();
    
    ctx.fillStyle = secondary;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    if (artworkImg) {
      const artW = 65;
      const artH = 65;
      const artX = 145 - artW / 2;
      const artY = 150 - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, "ITS", 230, 115, `extrabold 18px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, "PARTY", 230, 145, `extrabold 22px var(--font-heading)`, accent, '#000000', 4);
    drawTextWithOutline(ctx, "TIME!", 230, 175, `extrabold 18px var(--font-heading)`, textCol, '#000000', 3);

    ctx.restore();

  } else {
    // Draw circular emblem badge
    const cx = 200, cy = 200, r = 110;
    
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = secondary;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = accent;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
    ctx.clip();

    drawPattern(ctx, theme.pattern, primary, secondary, accent, w, h);

    if (artworkImg) {
      const artW = 90;
      const artH = 90;
      const artX = cx - artW / 2;
      const artY = cy - artH / 2;
      ctx.drawImage(artworkImg, artX, artY, artW, artH);
      applyWhiteChromaKey(ctx, artX, artY, artW, artH);
    }

    drawTextWithOutline(ctx, product.name.toUpperCase(), cx, cy - 55, `bold 11px var(--font-heading)`, textCol, '#000000', 3);
    drawTextWithOutline(ctx, nameText, cx, cy + 65, `extrabold 14px var(--font-heading)`, accent, '#000000', 3);

    ctx.restore();
  }

  ctx.restore();
}

// Utility to draw outlined text for maximum contrast on colorful background
function drawTextWithOutline(ctx, text, x, y, font, fillStyle, strokeStyle, strokeWidth) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = strokeWidth;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);
  
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Helper to modify hex color brightness
function adjustColorBrightness(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = R > 0 ? R : 0;
  G = G > 0 ? G : 0;
  B = B > 0 ? B : 0;

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}
