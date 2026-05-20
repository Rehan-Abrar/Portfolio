import { useEffect, useRef, useState, useCallback } from "react";

// ---------- Base design resolution ----------
const BASE_W = 512;
const BASE_H = 384;

// ---------- Game constants ----------
const BIRD_X_BASE = 75;
const BIRD_SIZE_BASE = 6; // 8x8 square (half-size)
const GRAVITY_BASE = 0.32;
const FLAP_BASE = -6.2;
const PIPE_W_BASE = 36;
const PIPE_SPEED_BASE = 2.0;
const PIPE_INTERVAL = 115; // frames between pipes

const MONO = "'Courier New', 'Lucida Console', monospace";

// Difficulty: gap shrinks smoothly, floors at ~80px
function getGap(score, scale) {
  return (112 - Math.min(score * 2, 32)) * scale;
}

// ---------- Web Audio (zero deps, generated tones) ----------
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freq, type = "square", duration = 0.08, vol = 0.12, endFreq = null) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(
        endFreq,
        ctx.currentTime + duration,
      );
    }
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (_) {}
}
function sfxFlap(enabled) {
  if (!enabled) return;
  playTone(320, "square", 0.07, 0.1);
}
function sfxScore(enabled) {
  if (!enabled) return;
  playTone(660, "square", 0.06, 0.12);
  setTimeout(() => playTone(880, "square", 0.07, 0.1), 60);
}
function sfxDeath(enabled) {
  if (!enabled) return;
  playTone(220, "sawtooth", 0.28, 0.14, 90);
}

// ---------- localStorage best score ----------
const LS_KEY = "flappy_best";
function loadBest() {
  try { return parseInt(localStorage.getItem(LS_KEY) || "0", 10) || 0; }
  catch (_) { return 0; }
}
function saveBest(score) {
  try { localStorage.setItem(LS_KEY, String(score)); } catch (_) {}
}

// ---------- Grid background (drawn once to offscreen canvas) ----------
function makeGridCanvas(w, h) {
  const gc = document.createElement("canvas");
  gc.width = w;
  gc.height = h;
  const gx = gc.getContext("2d");
  gx.fillStyle = "#0d0d0d";
  gx.fillRect(0, 0, w, h);
  gx.strokeStyle = "rgba(255,255,255,0.04)";
  gx.lineWidth = 1;
  const step = 24;
  for (let x = 0; x <= w; x += step) {
    gx.beginPath(); gx.moveTo(x, 0); gx.lineTo(x, h); gx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    gx.beginPath(); gx.moveTo(0, y); gx.lineTo(w, y); gx.stroke();
  }
  return gc;
}

// ---------- Component ----------
export default function GamesPage() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const gridRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, scale: 1 });
  const soundRef = useRef(false); // muted by default
  const [phase, setPhase] = useState("idle"); // idle | playing | dead
  const [soundOn, setSoundOn] = useState(false);
  const [surfaceSize, setSurfaceSize] = useState({ w: 0, h: 0 });

  // Keep soundRef in sync without re-creating game loop
  useEffect(() => { soundRef.current = soundOn; }, [soundOn]);

  // Track surface size for 1:1 pixel mapping
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      const w = Math.max(1, Math.floor(el.clientWidth));
      const h = Math.max(1, Math.floor(el.clientHeight));
      const scale = Math.min(w / BASE_W, h / BASE_H);
      sizeRef.current = { w, h, scale };
      setSurfaceSize({ w, h });
      gridRef.current = makeGridCanvas(w, h);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---------- init game state ----------
  const resetState = useCallback(() => {
    const { h, scale } = sizeRef.current;
    stateRef.current = {
      bird: { y: h / 2, vy: 0, flapFlash: 0 },
      waiting: true,
      pipes: [],
      frameCount: 0,
      score: 0,
      bestScore: loadBest(),
      scoreFlash: 0,
      scale,
    };
  }, []);

  // ---------- flap ----------
  const flap = useCallback(() => {
    if (!stateRef.current) return;
    stateRef.current.waiting = false;
    stateRef.current.bird.vy = FLAP;
    stateRef.current.bird.flapFlash = 6;
    sfxFlap(soundRef.current);
  }, []);

  // ---------- start ----------
  const startGame = useCallback(() => {
    resetState();
    setPhase("playing");
  }, [resetState]);

  // ---------- keyboard (capture phase — beats OrbitControls) ----------
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" || e.key === " " || e.key === "ArrowUp" || e.code === "ArrowUp") {
        e.stopPropagation();
        e.preventDefault();
        if (phase === "playing") flap();
        else startGame();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [phase, flap, startGame]);

  // ---------- DRAW helpers ----------
  const drawGrid = useCallback((ctx) => {
    if (gridRef.current) ctx.drawImage(gridRef.current, 0, 0);
    else {
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, W, H);
    }
  }, []);

  const drawScanlines = useCallback((ctx) => {
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = "rgba(0,0,0,0.13)";
      ctx.fillRect(0, y, W, 1);
    }
  }, []);

  const drawText = useCallback((ctx, text, x, y, size, color = "#e5e5e5", align = "center") => {
    ctx.font = `bold ${size}px ${MONO}`;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }, []);

  // ---------- GAME LOOP ----------
  useEffect(() => {
    if (phase !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      const s = stateRef.current;
      if (!s) return;

      const { w, h, scale } = sizeRef.current;
      if (!w || !h) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const BIRD_X = BIRD_X_BASE * scale;
      const BIRD_SIZE = BIRD_SIZE_BASE * scale;
      const GRAVITY = GRAVITY_BASE * scale;
      const FLAP = FLAP_BASE * scale;
      const PIPE_W = PIPE_W_BASE * scale;
      const PIPE_SPEED = PIPE_SPEED_BASE * scale;

      if (!s.waiting) {
        s.frameCount++;

        // Physics
        s.bird.vy += GRAVITY;
        s.bird.y += s.bird.vy;
        if (s.bird.flapFlash > 0) s.bird.flapFlash--;

        // Spawn pipes
        if (s.frameCount % PIPE_INTERVAL === 0) {
          const gap = getGap(s.score, scale);
          const gapY = 44 * scale + Math.random() * (h - gap - 88 * scale);
          s.pipes.push({ x: w + 4 * scale, gapY, gap, passed: false });
        }

        // Move pipes + score
        for (const p of s.pipes) {
          p.x -= PIPE_SPEED;
          if (!p.passed && p.x + PIPE_W < BIRD_X) {
            p.passed = true;
            s.score++;
            s.scoreFlash = 12;
            if (s.score > s.bestScore) {
              s.bestScore = s.score;
              saveBest(s.bestScore);
            }
            sfxScore(soundRef.current);
          }
        }
        s.pipes = s.pipes.filter((p) => p.x + PIPE_W > 0);

        // Decay flash
        if (s.scoreFlash > 0) s.scoreFlash--;

        // Collision
        const bx1 = BIRD_X - BIRD_SIZE, bx2 = BIRD_X + BIRD_SIZE;
        const by1 = s.bird.y - BIRD_SIZE, by2 = s.bird.y + BIRD_SIZE;
        const dead =
          by1 < 0 ||
          by2 > h - 18 * scale ||
          s.pipes.some(
            (p) =>
              bx2 > p.x &&
              bx1 < p.x + PIPE_W &&
              (by1 < p.gapY || by2 > p.gapY + p.gap)
          );

        if (dead) {
          sfxDeath(soundRef.current);
          const newBest = Math.max(s.bestScore, s.score);
          s.bestScore = newBest;
          saveBest(newBest);
          setPhase("dead");
          return;
        }
      } else if (s.bird.flapFlash > 0) {
        s.bird.flapFlash--;
      }

      // ── DRAW ──

      // Background grid
      drawGrid(ctx);

      // Ground line
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h - 18 * scale);
      ctx.lineTo(w, h - 18 * scale);
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.fillRect(0, h - 17 * scale, w, 17 * scale);

      // Pipes — dark rect + lighter outline
      for (const p of s.pipes) {
        // top
        ctx.fillStyle = "#1c1c1c";
        ctx.fillRect(p.x, 0, PIPE_W, p.gapY);
        ctx.strokeStyle = "#3a3a3a";
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x + 0.5, 0.5, PIPE_W - 1, p.gapY - 1);
        // top cap
        ctx.fillStyle = "#252525";
        ctx.fillRect(p.x - 3, p.gapY - 9, PIPE_W + 6, 9);
        ctx.strokeStyle = "#444";
        ctx.strokeRect(p.x - 2.5, p.gapY - 8.5, PIPE_W + 5, 8);

        // bottom
        const botY = p.gapY + p.gap;
        ctx.fillStyle = "#1c1c1c";
        ctx.fillRect(p.x, botY + 9 * scale, PIPE_W, h - botY - 9 * scale - 18 * scale);
        ctx.strokeStyle = "#3a3a3a";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          p.x + 0.5,
          botY + 9.5 * scale,
          PIPE_W - 1,
          h - botY - 9 * scale - 18 * scale - 1,
        );
        // bottom cap
        ctx.fillStyle = "#252525";
        ctx.fillRect(p.x - 3 * scale, botY, PIPE_W + 6 * scale, 9 * scale);
        ctx.strokeStyle = "#444";
        ctx.strokeRect(p.x - 2.5 * scale, botY + 0.5 * scale, PIPE_W + 5 * scale, 8 * scale);
      }

      // Bird — white square with tilt, green tint on flap
      const tilt = Math.max(-0.45, Math.min(0.65, s.bird.vy * 0.07));
      const isFlapping = s.bird.flapFlash > 0;
      ctx.save();
      ctx.translate(BIRD_X, s.bird.y);
      ctx.rotate(tilt);
      ctx.fillStyle = isFlapping ? "#a3f0be" : "#e5e5e5";
      ctx.fillRect(-BIRD_SIZE, -BIRD_SIZE, BIRD_SIZE * 2, BIRD_SIZE * 2);
      // inner dark dot (eye feel)
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(BIRD_SIZE - 5 * scale, -BIRD_SIZE + 2 * scale, 3 * scale, 3 * scale);
      ctx.restore();

      // Score HUD
      const scoreColor = s.scoreFlash > 0 ? "#4ade80" : "#e5e5e5";
      drawText(ctx, String(s.score), w / 2, 38 * scale, 26 * scale, scoreColor);
      drawText(ctx, `BEST ${s.bestScore}`, w / 2, 56 * scale, 10 * scale, "#555");

      if (s.waiting) {
        drawText(ctx, "TAP TO FLAP", w / 2, h / 2 + 74 * scale, 11 * scale, "#666");
      }

      // Scanlines
      drawScanlines(ctx);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, drawGrid, drawScanlines, drawText]);

  // ---------- STATIC SCREENS (idle / dead) ----------
  useEffect(() => {
    if (phase === "playing") return;
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    const ctx = canvas.getContext("2d");
    const { w, h, scale } = sizeRef.current;
    if (!w || !h) return;

    drawGrid(ctx);

    // Subtle center line
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    if (phase === "idle") {
      // ASCII bird deco
      drawText(ctx, "[ FLAPPY.EXE ]", w / 2, 90 * scale, 15 * scale, "#e5e5e5");
      drawText(ctx, "ARCADE", w / 2, 118 * scale, 28 * scale, "#e5e5e5");

      // Blink hint (drawn statically — blink handled by CSS on overlay div)
      drawText(ctx, "INSERT COIN", w / 2, 168 * scale, 13 * scale, "#888");
      drawText(ctx, "SPACE / TAP TO START", w / 2, 188 * scale, 11 * scale, "#555");

      const best = loadBest();
      if (best > 0) drawText(ctx, `HI-SCORE  ${best}`, w / 2, 232 * scale, 11 * scale, "#777");

      drawText(ctx, "v1.0  REHAN.DEV", w / 2, h - 28 * scale, 9 * scale, "#2a2a2a");
    } else {
      // dead
      const s = stateRef.current;
      const last = s?.score ?? 0;
      const best = s?.bestScore ?? loadBest();
      const isNewBest = last > 0 && last >= best;

      drawText(ctx, "GAME OVER", w / 2, 88 * scale, 20 * scale, "#e5e5e5");

      // Score box
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 1;
      ctx.strokeRect(w / 2 - 80 * scale, 100 * scale, 160 * scale, 68 * scale);

      drawText(ctx, "SCORE", w / 2 - 30 * scale, 122 * scale, 10 * scale, "#555", "right");
      drawText(ctx, String(last), w / 2 - 24 * scale, 122 * scale, 13 * scale, "#e5e5e5", "left");
      drawText(ctx, "BEST", w / 2 - 30 * scale, 142 * scale, 10 * scale, "#555", "right");
      drawText(ctx, String(best), w / 2 - 24 * scale, 142 * scale, 13 * scale, "#e5e5e5", "left");

      if (isNewBest) drawText(ctx, "◀ NEW RECORD", w / 2 + 28 * scale, 142 * scale, 9 * scale, "#777", "left");

      drawText(ctx, "RETRY?  SPACE / TAP", w / 2, 206 * scale, 11 * scale, "#666");
      drawText(ctx, "[ REHAN.DEV ]", w / 2, 242 * scale, 9 * scale, "#2a2a2a");
    }

    drawScanlines(ctx);
  }, [phase, drawGrid, drawScanlines, drawText]);

  // ---------- pointer: stop ALL propagation, tap = flap ----------
  const onPointerDown = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (phase === "playing") flap();
    else startGame();
  }, [phase, flap, startGame]);
  const stopProp = useCallback((e) => {
    e.stopPropagation();
  }, []);
  const stopAndPrevent = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const toggleSound = useCallback((e) => {
    e.stopPropagation();
    const ctx = getAudioCtx();
    if (ctx && ctx.state === "suspended") ctx.resume();
    setSoundOn((v) => !v);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#080808",
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
        fontFamily: MONO,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={stopProp}
      onPointerUp={stopProp}
      onPointerCancel={stopProp}
      onClick={stopProp}
      onContextMenu={stopAndPrevent}
      onWheel={stopAndPrevent}
    >
      <canvas
        ref={canvasRef}
        width={surfaceSize.w}
        height={surfaceSize.h}
        style={{
          position: "absolute",
          inset: 0,
          width: `${surfaceSize.w}px`,
          height: `${surfaceSize.h}px`,
          display: "block",
          imageRendering: "pixelated",
          border: "1px solid #1e1e1e",
          outline: "1px solid #111",
        }}
      />

      {/* Controls bar — below canvas */}
      <div
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: 9, color: "#2e2e2e", letterSpacing: 2 }}>
          SPC · ↑ · TAP
        </span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={toggleSound}
          style={{
            background: "none",
            border: "1px solid #222",
            color: soundOn ? "#e5e5e5" : "#333",
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: 1,
            padding: "2px 7px",
            cursor: "pointer",
            lineHeight: 1.4,
          }}
        >
          {soundOn ? "SFX ON" : "SFX OFF"}
        </button>
      </div>
    </div>
  );
}