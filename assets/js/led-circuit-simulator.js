(function () {
  const root = document.getElementById('led-circuit-simulator');
  if (!root) return;

  const canvas = root.querySelector('#led-circuit-viz');
  const switchButtons = root.querySelectorAll('[data-led-switch]');
  const resistance = root.querySelector('#led-circuit-resistance');
  const resistanceValue = root.querySelector('#led-circuit-resistance-value');
  const currentValue = root.querySelector('#led-circuit-current');
  const statusValue = root.querySelector('#led-circuit-status');
  const brightnessValue = root.querySelector('#led-circuit-brightness');
  const playButton = root.querySelector('#led-circuit-play');
  const resetButton = root.querySelector('#led-circuit-reset');
  const ctx = canvas.getContext('2d');

  const state = {
    switchOn: 'On',
    resistance: 220,
    play: true,
    voltage: 3.3,
    ledBurnedOut: false
  };

  let currentOffset = 0;
  let lastTime = performance.now();
  let dpr = 1;
  let cssWidth = 1;
  let cssHeight = 1;

  const colors = {
    wire: '#22252a',
    current: '#00a8ff',
    currentCore: '#ffffff',
    activeWire: '#0088cc',
    resistor: '#f4f4f4',
    resistorStroke: '#22252a',
    text: '#202124',
    muted: '#5f6368',
    success: '#137333',
    error: '#b3261e',
    ledOff: '#d8dadd',
    ledOn: '#ffd21a',
    ledStroke: '#9a7800',
    battery: '#202124'
  };

  const smokeParticles = [];
  for (let i = 0; i < 18; i++) {
    smokeParticles.push({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 24 - 12,
      size: Math.random() * 5 + 3,
      alpha: Math.random()
    });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getCurrentA() {
    if (state.switchOn !== 'On' || state.ledBurnedOut) return 0;
    const vLED = 2.0;
    return Math.max(0, (state.voltage - vLED) / state.resistance);
  }

  function updateHUD() {
    const currentA = getCurrentA();
    const currentMA = currentA * 1000;
    const maxSafeCurrent = (state.voltage - 2.0) / 100;
    const brightness = state.ledBurnedOut
      ? 0
      : state.switchOn === 'On'
        ? clamp(Math.round((currentA / maxSafeCurrent) * 100), 5, 100)
        : 0;

    currentValue.textContent = `${currentMA.toFixed(1)} mA`;
    resistanceValue.textContent = `${state.resistance} Ω`;
    brightnessValue.textContent = `${brightness}%`;

    if (state.ledBurnedOut) {
      statusValue.textContent = 'BURNED OUT';
    } else if (state.switchOn === 'On') {
      statusValue.textContent = 'Active';
    } else {
      statusValue.textContent = 'Off';
    }

    statusValue.classList.toggle('is-error', state.ledBurnedOut);
    statusValue.classList.toggle(
      'is-active',
      !state.ledBurnedOut && state.switchOn === 'On'
    );

    switchButtons.forEach(button => {
      const selected = button.dataset.ledSwitch === state.switchOn;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    playButton.textContent = state.play ? '⏸ Pause' : '▶ Play';
    playButton.setAttribute('aria-pressed', state.play ? 'true' : 'false');
  }

  function checkBurnout() {
    if (
      state.switchOn === 'On' &&
      state.resistance < 100 &&
      !state.ledBurnedOut
    ) {
      state.ledBurnedOut = true;
      updateHUD();
    }
  }

  function drawWire(x1, y1, x2, y2, active) {
    ctx.strokeStyle = active ? colors.activeWire : colors.wire;
    ctx.lineWidth = active ? 4 : 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function drawResistor(x, y1, y2) {
    const bodyTop = y1 + 5;
    const bodyBottom = y2 - 5;
    const amplitude = 14;
    const steps = 6;
    const stepHeight = (bodyBottom - bodyTop) / steps;

    ctx.strokeStyle = colors.resistorStroke;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, bodyTop);

    for (let i = 0; i < steps; i++) {
      const yy = bodyTop + i * stepHeight;
      const nextY = yy + stepHeight;
      const direction = i % 2 === 0 ? -1 : 1;
      ctx.lineTo(x + direction * amplitude, yy + stepHeight / 2);
      ctx.lineTo(x, nextY);
    }

    ctx.lineTo(x, y2);
    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${state.resistance} Ω`, x - 28, (y1 + y2) / 2);
  }

  function drawSwitch(centerX, y) {
    const gap = 42;
    const left = centerX - gap / 2;
    const right = centerX + gap / 2;
    const isOn = state.switchOn === 'On';

    ctx.fillStyle = colors.wire;
    ctx.beginPath();
    ctx.arc(left, y, 5, 0, Math.PI * 2);
    ctx.arc(right, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isOn ? colors.activeWire : colors.error;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(left, y);

    if (isOn) {
      ctx.lineTo(right, y);
    } else {
      ctx.lineTo(right - 2, y - 18);
    }

    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Switch', centerX, y - 26);
  }

  function drawLED(x, y, active, burned, currentNorm) {
    ctx.save();
    ctx.translate(x, y);

    if (active && !burned) {
      const glowRadius = 32 + currentNorm * 28;
      const glowAlpha = 0.35 + currentNorm * 0.45;
      const gradient = ctx.createRadialGradient(0, 0, 4, 0, 0, glowRadius);
      gradient.addColorStop(0, `rgba(255, 210, 20, ${glowAlpha})`);
      gradient.addColorStop(0.55, `rgba(255, 180, 0, ${glowAlpha * 0.45})`);
      gradient.addColorStop(1, 'rgba(255, 180, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // LED diode symbol, vertical to match the reference circuit.
    ctx.strokeStyle = burned ? '#555' : colors.wire;
    ctx.fillStyle = burned ? '#333' : active ? colors.ledOn : colors.ledOff;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(-18, -13);
    ctx.lineTo(18, -13);
    ctx.lineTo(0, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-20, 16);
    ctx.lineTo(20, 16);
    ctx.stroke();

    // Internal leads.
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(0, -13);
    ctx.moveTo(0, 16);
    ctx.lineTo(0, 30);
    ctx.stroke();

    // Light rays.
    if (active && !burned) {
      ctx.strokeStyle = '#e6a100';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      const rayAlpha = 0.55 + currentNorm * 0.45;
      ctx.globalAlpha = rayAlpha;
      ctx.beginPath();
      ctx.moveTo(23, -15); ctx.lineTo(35, -24);
      ctx.moveTo(27, -2); ctx.lineTo(40, -2);
      ctx.moveTo(23, 11); ctx.lineTo(35, 20);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (burned) {
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-9, 7);
      ctx.lineTo(-2, -5);
      ctx.lineTo(4, 5);
      ctx.lineTo(10, -8);
      ctx.stroke();

      for (const p of smokeParticles) {
        p.y += p.vy * 0.016;
        p.x += p.vx * 0.016;
        p.alpha -= 0.006;
        if (p.alpha <= 0) {
          p.x = (Math.random() - 0.5) * 10;
          p.y = 0;
          p.alpha = 0.8 + Math.random() * 0.2;
        }
        ctx.fillStyle = `rgba(100, 100, 100, ${Math.max(0, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    ctx.fillStyle = colors.text;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('LED', x + 30, y);
  }

  function drawBattery(centerX, y) {
    const plateGap = 12;
    const longH = 38;
    const shortH = 24;

    ctx.strokeStyle = colors.battery;
    ctx.lineWidth = 4;

    // Positive long plate.
    ctx.beginPath();
    ctx.moveTo(centerX - plateGap, y - longH / 2);
    ctx.lineTo(centerX - plateGap, y + longH / 2);
    ctx.stroke();

    // Negative short plate.
    ctx.beginPath();
    ctx.moveTo(centerX + plateGap, y - shortH / 2);
    ctx.lineTo(centerX + plateGap, y + shortH / 2);
    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('+3.3V', centerX, y - 28);

    ctx.font = 'bold 13px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('+', centerX - plateGap, y + longH / 2 + 5);
    ctx.fillText('−', centerX + plateGap, y + shortH / 2 + 5);
  }

  function getCircuitGeometry(w, h) {
    const centerX = w / 2;
    const leftX = Math.max(85, w * 0.22);
    const rightX = Math.min(w - 85, w * 0.78);
    const topY = Math.max(58, h * 0.14);
    const bottomY = h - Math.max(58, h * 0.14);
    const midY = (topY + bottomY) / 2;

    return {
      centerX,
      leftX,
      rightX,
      topY,
      bottomY,
      midY,
      resistorTop: midY - 55,
      resistorBottom: midY + 55,
      ledY: midY,
      batteryY: bottomY
    };
  }

  function drawCurrentParticles(g, perimeter) {
    if (state.switchOn !== 'On' || state.ledBurnedOut) return;

    const currentA = getCurrentA();
    const currentNorm = clamp(currentA / ((3.3 - 2.0) / 100), 0, 1);
    const particleCount = 20;

    ctx.save();
    ctx.shadowColor = colors.current;
    ctx.shadowBlur = 12;

    for (let i = 0; i < particleCount; i++) {
      const distance = (i / particleCount * perimeter + currentOffset) % perimeter;
      let x;
      let y;

      // Conventional current direction:
      // battery positive -> resistor -> switch -> LED -> battery negative.
      const leftVertical = g.bottomY - g.topY;
      const topHorizontal = g.rightX - g.leftX;
      const rightVertical = leftVertical;
      const bottomHorizontal = topHorizontal;

      if (distance < leftVertical) {
        x = g.leftX;
        y = g.bottomY - distance;
      } else if (distance < leftVertical + topHorizontal) {
        x = g.leftX + (distance - leftVertical);
        y = g.topY;
      } else if (distance < leftVertical + topHorizontal + rightVertical) {
        x = g.rightX;
        y = g.topY + (distance - leftVertical - topHorizontal);
      } else {
        x = g.rightX - (distance - leftVertical - topHorizontal - rightVertical);
        y = g.bottomY;
      }

      const radius = 3.2 + currentNorm * 1.5;
      ctx.fillStyle = colors.current;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = colors.currentCore;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1.2, radius * 0.38), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 12;
    }

    ctx.restore();
  }

  function drawCircuit(dt) {
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const g = getCircuitGeometry(cssWidth, cssHeight);
    const isOn = state.switchOn === 'On';
    const burned = state.ledBurnedOut;
    const currentA = getCurrentA();
    const currentNorm = clamp(currentA / ((3.3 - 2.0) / 100), 0, 1);

    checkBurnout();

    // Base circuit wires.
    drawWire(g.leftX, g.topY, g.leftX, g.resistorTop, isOn && !burned);
    drawWire(g.leftX, g.resistorBottom, g.leftX, g.bottomY, isOn && !burned);
    drawWire(g.leftX, g.topY, g.centerX - 21, g.topY, isOn && !burned);
    drawWire(g.centerX + 21, g.topY, g.rightX, g.topY, isOn && !burned);
    drawWire(g.rightX, g.topY, g.rightX, g.ledY - 30, isOn && !burned);
    drawWire(g.rightX, g.ledY + 30, g.rightX, g.bottomY, isOn && !burned);
    drawWire(g.leftX, g.bottomY, g.centerX - 12, g.bottomY, isOn && !burned);
    drawWire(g.centerX + 12, g.bottomY, g.rightX, g.bottomY, isOn && !burned);

    drawResistor(g.leftX, g.resistorTop, g.resistorBottom);
    drawSwitch(g.centerX, g.topY);
    drawLED(g.rightX, g.ledY, isOn, burned, currentNorm);
    drawBattery(g.centerX, g.bottomY);

    if (burned) {
      ctx.fillStyle = colors.error;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('⚠ LED burnout: resistance below 100 Ω', g.centerX, g.topY + 32);
    } else if (isOn) {
      drawCurrentParticles(g, 2 * (g.rightX - g.leftX) + 2 * (g.bottomY - g.topY));
    }

    if (state.play && isOn && !burned) {
      // Keep the motion continuous. Do not restart or reset the animation clock.
      currentOffset = (currentOffset + dt * (42 + currentNorm * 95)) %
        (2 * (g.rightX - g.leftX) + 2 * (g.bottomY - g.topY));
    }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssWidth = Math.max(1, rect.width);
    cssHeight = Math.max(1, rect.height);

    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawCircuit(0);
  }

  function frame(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    drawCircuit(dt);
    requestAnimationFrame(frame);
  }

  switchButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.switchOn = button.dataset.ledSwitch;
      updateHUD();
    });
  });

  resistance.addEventListener('input', () => {
    state.resistance = Number(resistance.value);
    if (state.resistance >= 100) {
      state.ledBurnedOut = false;
    }
    updateHUD();
  });

  playButton.addEventListener('click', () => {
    state.play = !state.play;
    updateHUD();
  });

  resetButton.addEventListener('click', () => {
    state.ledBurnedOut = false;
    state.resistance = 220;
    state.switchOn = 'On';
    state.play = true;
    currentOffset = 0;
    resistance.value = '220';
    updateHUD();
  });

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(canvas);

  updateHUD();
  resizeCanvas();
  requestAnimationFrame(frame);
})();
