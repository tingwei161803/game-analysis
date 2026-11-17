/* Arcade hall · three.js scene.
   One procedurally modelled cabinet per project, placed on an arc that closes
   into a ring as the list grows. Data → scene:
     marquee      project title (canvas texture, follows language)
     screen       live pixel readout: one chunked bar per scoring dimension,
                  seven-segment weighted total, rank and lines of code
     side panels  author colour (+ a neon bar on the wall behind, per author)
     cabinet size log(lines of code)
   The DOM side (arcade-ui.js) owns the headline and caption card; if anything
   here fails the hall stays a plain headline above the rest of the home page. */
import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const H = window.HALL;
const root = document.documentElement;
const canvas = document.getElementById("gl");
const hall = document.getElementById("hall");
const stage = document.getElementById("stage");

function boot() {
  if (!H || !H.projects.length || !canvas) return;
  const items = H.projects;
  const DIMS = H.dims;
  const N = items.length;
  const D = DIMS.length;

  /* three r170 needs WebGL2; probe first so a missing context stays quiet */
  let probe = null;
  try { probe = document.createElement("canvas").getContext("webgl2"); } catch (e) {}
  if (!probe) return;
  const lose = probe.getExtension("WEBGL_lose_context"); if (lose) lose.loseContext();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    return; /* no WebGL: the rest of the home page already lists every project */
  }
  renderer.toneMapping = THREE.NeutralToneMapping;

  const reduceMq = matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reduceMq.matches;

  /* ------------------------------------------------------------ layout */
  const SPACING = 1.55;            /* metres between cabinet centres */
  const R_MIN = 11;
  const ringR = (N * SPACING) / (Math.PI * 2);
  const R = Math.max(R_MIN, ringR);
  const dTheta = ringR >= R_MIN ? (Math.PI * 2) / N : SPACING / R;
  const WALL_R = R + 1.5;
  const WALL_H = 4.3;
  const STEP = 170;                /* px of page scroll per cabinet */

  root.classList.add("gl");
  hall.style.height = `calc(100svh - var(--ah-top) + ${(N - 1) * STEP}px)`;

  /* ------------------------------------------------------------ scene */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.03);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
  const hubLight = new THREE.PointLight(0xffffff, 1, 0, 0);   /* from the room centre: lights every front */
  hubLight.position.set(0, 6.5, 0);
  const camLight = new THREE.PointLight(0xffe6c8, 30, 16, 2);
  const glowLight = new THREE.PointLight(0xffffff, 6, 4.5, 2); /* CRT spill of the focused cabinet */
  scene.add(hemi, hubLight, camLight, glowLight);

  /* ----- cabinet geometry (local: +z is the player side, y up) ----- */
  const PROFILE = [
    [-0.45, 0], [0.30, 0], [0.30, 0.86], [0.46, 0.93], [0.46, 1.0],
    [0.19, 1.08], [0.06, 1.62], [0.36, 1.67], [0.36, 1.96], [-0.45, 2.0]
  ];
  const shape = new THREE.Shape();
  PROFILE.forEach((p, i) => (i ? shape.lineTo(p[0], p[1]) : shape.moveTo(p[0], p[1])));

  const bodyGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.92, bevelEnabled: false });
  bodyGeo.translate(0, 0, -0.46);
  bodyGeo.rotateY(-Math.PI / 2);

  const sideA = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
  sideA.scale(1.035, 1.012, 1);
  const sideB = sideA.clone();
  sideA.translate(0, 0, 0.46);
  sideB.translate(0, 0, -0.51);
  const sideGeo = mergeGeometries([sideA, sideB]);
  sideGeo.rotateY(-Math.PI / 2);

  /* joystick + three buttons on the control deck */
  const ctlParts = [];
  const stick = new THREE.CylinderGeometry(0.011, 0.011, 0.07, 6); stick.translate(-0.24, 1.06, 0.37);
  const ball = new THREE.SphereGeometry(0.03, 10, 8); ball.translate(-0.24, 1.105, 0.37);
  ctlParts.push(stick, ball);
  for (let b = 0; b < 3; b++) {
    const g = new THREE.CylinderGeometry(0.028, 0.028, 0.03, 10);
    g.translate(0.04 + b * 0.12, 1.03 + (b % 2) * 0.008, 0.39 - (b % 2) * 0.04);
    ctlParts.push(g);
  }
  const ctlGeo = mergeGeometries(ctlParts.map((g) => g.toNonIndexed()));

  const doorGeo = new THREE.BoxGeometry(0.3, 0.36, 0.02); doorGeo.translate(0, 0.5, 0.305);
  const slotGeo = new THREE.BoxGeometry(0.03, 0.1, 0.012); slotGeo.translate(0.06, 0.56, 0.318);
  const SLOT_LOCAL = new THREE.Vector3(0.06, 0.56, 0.33);
  const shadowGeo = new THREE.PlaneGeometry(1.9, 1.7); shadowGeo.rotateX(-Math.PI / 2); shadowGeo.translate(0, 0.012, 0.05);
  const neonGeo = new THREE.BoxGeometry(SPACING * 0.7, 0.04, 0.04);
  const postGeo = new THREE.CylinderGeometry(0.022, 0.022, 2.3, 6); postGeo.translate(0, 1.45, 0);

  const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.15 });
  const sideMat = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.1 });
  const ctlMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.1 });
  const doorMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.6 });
  const slotMat = new THREE.MeshBasicMaterial({ toneMapped: false });
  const neonMat = new THREE.MeshBasicMaterial({ toneMapped: false });
  const shadowMat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0x000000 });

  const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, N);
  const sides = new THREE.InstancedMesh(sideGeo, sideMat, N);
  const ctls = new THREE.InstancedMesh(ctlGeo, ctlMat, N);
  const doors = new THREE.InstancedMesh(doorGeo, doorMat, N);
  const slots = new THREE.InstancedMesh(slotGeo, slotMat, N);
  const shadows = new THREE.InstancedMesh(shadowGeo, shadowMat, N);
  const neons = new THREE.InstancedMesh(neonGeo, neonMat, N);
  const postMat = new THREE.MeshBasicMaterial({ toneMapped: false });
  const posts = new THREE.InstancedMesh(postGeo, postMat, N + 1);
  shadows.renderOrder = 2;
  scene.add(bodies, sides, ctls, doors, slots, shadows, neons, posts);

  /* blob shadow texture */
  {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(32, 32, 4, 32, 32, 32);
    grd.addColorStop(0, "#fff"); grd.addColorStop(0.55, "#888"); grd.addColorStop(1, "#000");
    g.fillStyle = "#000"; g.fillRect(0, 0, 64, 64);
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    shadowMat.alphaMap = new THREE.CanvasTexture(c);
  }

  /* cabinet scale from lines of code (log scale across the data) */
  let locMin = Infinity, locMax = 0;
  for (const it of items) { const l = Number(it.p.loc) || 0; if (l > 0) { locMin = Math.min(locMin, l); locMax = Math.max(locMax, l); } }
  const scaleOf = (it) => {
    const l = Number(it.p.loc) || 0;
    if (!(l > 0) || locMax <= locMin) return 1;
    return 0.9 + 0.2 * (Math.log(l) - Math.log(locMin)) / (Math.log(locMax) - Math.log(locMin));
  };

  /* ----- per-cabinet screen + marquee (unique canvas textures) ----- */
  const SW = 128, SH = 96, MW = 512, MH = 144;
  const screenGeo = new THREE.PlaneGeometry(0.74, 0.5);
  const marqueeGeo = new THREE.PlaneGeometry(0.9, 0.255);
  const SCREEN_TILT = -Math.atan2(0.13, 0.54);
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const cabs = [];
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  const WHITE = new THREE.Color(0xffffff);
  const BLACK = new THREE.Color(0x000000);

  for (let i = 0; i < N; i++) {
    const it = items[i];
    const th = i * dTheta;
    const s = scaleOf(it);
    const group = new THREE.Group();
    group.position.set(R * Math.sin(th), 0, -R * Math.cos(th));
    group.rotation.y = -th;
    group.scale.setScalar(s);

    const sc = document.createElement("canvas"); sc.width = SW; sc.height = SH;
    const sTex = new THREE.CanvasTexture(sc);
    sTex.colorSpace = THREE.SRGBColorSpace; sTex.magFilter = THREE.NearestFilter; sTex.minFilter = THREE.LinearFilter; sTex.generateMipmaps = false;
    const sMat = new THREE.MeshBasicMaterial({ map: sTex, toneMapped: false });
    const screen = new THREE.Mesh(screenGeo, sMat);
    screen.position.set(0, 1.352, 0.132); screen.rotation.x = SCREEN_TILT;

    const mc = document.createElement("canvas"); mc.width = MW; mc.height = MH;
    const mTex = new THREE.CanvasTexture(mc);
    mTex.colorSpace = THREE.SRGBColorSpace; mTex.anisotropy = maxAniso;
    const mMat = new THREE.MeshBasicMaterial({ map: mTex, toneMapped: false });
    const marquee = new THREE.Mesh(marqueeGeo, mMat);
    marquee.position.set(0, 1.815, 0.366);

    group.add(screen, marquee);
    scene.add(group);
    group.updateMatrixWorld(true);
    group.matrixAutoUpdate = false; screen.matrixAutoUpdate = false; marquee.matrixAutoUpdate = false;

    for (const im of [bodies, sides, ctls, doors, slots]) im.setMatrixAt(i, group.matrix);
    dummy.position.copy(group.position); dummy.rotation.set(0, -th, 0); dummy.scale.setScalar(1); dummy.updateMatrix();
    shadows.setMatrixAt(i, dummy.matrix);
    dummy.position.set((WALL_R - 0.12) * Math.sin(th), 2.62, -(WALL_R - 0.12) * Math.cos(th)); dummy.updateMatrix();
    neons.setMatrixAt(i, dummy.matrix);

    const scores = new Float32Array(D);
    for (let k = 0; k < D; k++) scores[k] = Number(it.p.scores && it.p.scores[DIMS[k].key]) || 0;
    const loc = Number(it.p.loc) || 0;

    cabs.push({
      it, th, group, sc, sctx: sc.getContext("2d"), sTex, sMat, mc, mctx: mc.getContext("2d"), mTex,
      scores, total: it.totalStr,
      top: "#" + (it.rank < 10 ? "0" : "") + it.rank,
      loc: loc ? "LOC " + (loc > 99999 ? Math.round(loc / 1000) + "K" : loc) : "",
      color: new THREE.Color(), css: "", cssDim: "", cssHi: "",
      bright: 0.6, bootAt: -1, dirty: true, slot: new THREE.Vector3()
    });
    cabs[i].slot.copy(SLOT_LOCAL).applyMatrix4(group.matrixWorld);
  }
  for (let i = 0; i <= N; i++) {
    const th = (i - 0.5) * dTheta;
    dummy.position.set((WALL_R - 0.1) * Math.sin(th), 0, -(WALL_R - 0.1) * Math.cos(th)); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix();
    posts.setMatrixAt(i, dummy.matrix);
  }
  bodies.computeBoundingSphere();

  /* ----- room ----- */
  const wallCanvas = document.createElement("canvas"); wallCanvas.width = 128; wallCanvas.height = 256;
  const wallTex = new THREE.CanvasTexture(wallCanvas);
  wallTex.colorSpace = THREE.SRGBColorSpace; wallTex.wrapS = THREE.RepeatWrapping; wallTex.anisotropy = maxAniso;
  wallTex.repeat.set(Math.round((Math.PI * 2 * WALL_R) / 1.55), 1);
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(WALL_R, WALL_R, WALL_H, 96, 1, true),
    new THREE.MeshBasicMaterial({ map: wallTex, side: THREE.BackSide })
  );
  wall.position.y = WALL_H / 2;
  const ceilMat = new THREE.MeshBasicMaterial();
  const ceiling = new THREE.Mesh(new THREE.CircleGeometry(WALL_R, 64), ceilMat);
  ceiling.rotation.x = Math.PI / 2; ceiling.position.y = WALL_H;

  const ringMatA = new THREE.MeshBasicMaterial({ toneMapped: false });
  const ringMatB = new THREE.MeshBasicMaterial({ toneMapped: false });
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(WALL_R - 0.1, 0.028, 6, 128), ringMatA);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(WALL_R - 0.1, 0.028, 6, 128), ringMatB);
  ringA.rotation.x = ringB.rotation.x = Math.PI / 2;
  ringA.position.y = 3.42; ringB.position.y = 3.62;
  /* ceiling strip light over the walking line */
  const stripMat = new THREE.MeshBasicMaterial({ toneMapped: false });
  const strip = new THREE.Mesh(new THREE.TorusGeometry(R - 2.6, 0.05, 6, 128), stripMat);
  strip.rotation.x = Math.PI / 2; strip.position.y = WALL_H - 0.06;
  scene.add(wall, ceiling, ringA, ringB, strip);

  const floorGeo = new THREE.CircleGeometry(WALL_R, 72);
  const mirror = new Reflector(floorGeo, { textureWidth: 512, textureHeight: 512, clipBias: 0.003, color: 0x999999 });
  mirror.rotation.x = -Math.PI / 2;
  const tileCanvas = document.createElement("canvas"); tileCanvas.width = tileCanvas.height = 64;
  const tileTex = new THREE.CanvasTexture(tileCanvas);
  tileTex.colorSpace = THREE.SRGBColorSpace; tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping; tileTex.anisotropy = maxAniso;
  tileTex.repeat.set((WALL_R * 2) / 1.6, (WALL_R * 2) / 1.6);
  const floorMat = new THREE.MeshBasicMaterial({ map: tileTex, transparent: true, opacity: 0.8, depthWrite: false });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.004; floor.renderOrder = 1;
  scene.add(mirror, floor);

  /* coin */
  const coinMat = new THREE.MeshStandardMaterial({ color: 0xf2b632, metalness: 0.7, roughness: 0.3, emissive: 0x5a3c00 });
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.008, 20), coinMat);
  coin.visible = false; scene.add(coin);

  /* ------------------------------------------------------------ post */
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 }));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.62, 0.6, 0.62);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ------------------------------------------------------------ pixel type */
  const FONT = {
    A: "010101111101101", B: "110101110101110", C: "011100100100011", D: "110101101101110", E: "111100110100111",
    F: "111100110100100", G: "011100101101011", H: "101101111101101", I: "111010010010111", J: "001001001101010",
    K: "101101110101101", L: "100100100100111", M: "101111111101101", N: "110101101101101", O: "010101101101010",
    P: "110101110100100", Q: "010101101110011", R: "110101110101101", S: "011100010001110", T: "111010010010010",
    U: "101101101101111", V: "101101101101010", W: "101101111111101", X: "101101010101101", Y: "101101010010010",
    Z: "111001010100111", 0: "111101101101111", 1: "010110010010111", 2: "111001111100111", 3: "111001111001111",
    4: "101101111001001", 5: "111100111001111", 6: "111100111101111", 7: "111001001001001", 8: "111101111101111",
    9: "111101111001111", ".": "000000000000010", "/": "001001010100100", "-": "000000111000000", "#": "101111101111101"
  };
  function ptext(g, str, x, y) {
    for (let c = 0; c < str.length; c++) {
      const bits = FONT[str[c]];
      if (bits) for (let b = 0; b < 15; b++) if (bits.charCodeAt(b) === 49) g.fillRect(x + (b % 3), y + ((b / 3) | 0), 1, 1);
      x += 4;
    }
  }
  const SEG = [0x7e, 0x30, 0x6d, 0x79, 0x33, 0x5b, 0x5f, 0x70, 0x7f, 0x7b]; /* abcdefg */
  function seg7(g, x, y, w, h, t, mask) {
    const hh = ((h - t) / 2) | 0;
    if (mask & 0x40) g.fillRect(x, y, w, t);
    if (mask & 0x20) g.fillRect(x + w - t, y, t, hh + t);
    if (mask & 0x10) g.fillRect(x + w - t, y + hh, t, h - hh);
    if (mask & 0x08) g.fillRect(x, y + h - t, w, t);
    if (mask & 0x04) g.fillRect(x, y + hh, t, h - hh);
    if (mask & 0x02) g.fillRect(x, y, t, hh + t);
    if (mask & 0x01) g.fillRect(x, y + hh, w, t);
  }
  const DIM_ABBR = DIMS.map((d) => String(d.key).slice(0, 3).toUpperCase());
  const BAR_GAP = D > 9 ? 2 : 4;
  const BAR_W = Math.max(3, Math.floor((116 - (D - 1) * BAR_GAP) / D));
  const BAR_X0 = Math.round((SW - (D * BAR_W + (D - 1) * BAR_GAP)) / 2);
  const BAR_BOTTOM = 83;

  const PAL = { bg: "#05060a", ghost: "#16181f", ink: "#ffe9b8", dim: "#7d7a70", cell: "#14161d" };
  let coinFlash = -1; /* index of cabinet showing CREDIT */

  function drawScreen(i, time, focused) {
    const c = cabs[i], g = c.sctx;
    g.fillStyle = PAL.bg; g.fillRect(0, 0, SW, SH);

    /* top line */
    const blink = focused && !reduced && ((time * 1.6) | 0) % 2 === 0;
    if (coinFlash === i) {
      g.fillStyle = PAL.ink; ptext(g, "CREDIT 01", 46, 5);
    } else if (blink) {
      g.fillStyle = c.cssHi; ptext(g, "INSERT COIN", 42, 5);
    } else {
      g.fillStyle = PAL.dim; ptext(g, "RANK", 7, 5);
      g.fillStyle = PAL.ink; ptext(g, c.top, 25, 5);
      g.fillStyle = PAL.dim; ptext(g, c.loc, SW - 7 - c.loc.length * 4 + 1, 5);
    }
    g.fillStyle = PAL.ghost; g.fillRect(7, 12, SW - 14, 1);

    /* weighted total, seven-segment */
    g.fillStyle = PAL.dim; ptext(g, "TOTAL", 7, 18);
    g.fillStyle = c.cssDim; ptext(g, "/10", 7, 26);
    const str = c.total;
    let w = 0;
    for (let k = 0; k < str.length; k++) w += str[k] === "." ? 6 : 16;
    let x = SW - 7 - w + 3;
    for (let k = 0; k < str.length; k++) {
      if (str[k] === ".") { g.fillStyle = PAL.ink; g.fillRect(x, 36, 3, 3); x += 6; continue; }
      g.fillStyle = PAL.ghost; seg7(g, x, 17, 13, 22, 3, 0x7f);
      g.fillStyle = PAL.ink; seg7(g, x, 17, 13, 22, 3, SEG[str.charCodeAt(k) - 48] || 0);
      x += 16;
    }

    /* one chunked bar per dimension */
    const age = reduced || c.bootAt < 0 ? 9 : time - c.bootAt;
    for (let k = 0; k < D; k++) {
      const bx = BAR_X0 + k * (BAR_W + BAR_GAP);
      const reveal = Math.min(1, Math.max(0, age * 1.6 - k * 0.12));
      const v = c.scores[k] * reveal;
      const full = Math.floor(v + 0.001);
      const half = v - full >= 0.25;
      const sweep = reduced ? -1 : (((time * 7 + k * 2.3 + i) % 26) | 0);
      for (let r = 0; r < 10; r++) {
        const by = BAR_BOTTOM - 4 - r * 4;
        if (r < full) g.fillStyle = r === sweep ? PAL.ink : (r >= 7 ? c.cssHi : c.css);
        else if (r === full && half) g.fillStyle = c.cssDim;
        else g.fillStyle = PAL.cell;
        g.fillRect(bx, by, BAR_W, 3);
      }
      g.fillStyle = PAL.dim;
      if (BAR_W >= 11) ptext(g, DIM_ABBR[k], bx + ((BAR_W - 11) >> 1), 87);
      else ptext(g, DIM_ABBR[k][0], bx + ((BAR_W - 3) >> 1), 87);
    }

    /* scanlines */
    g.fillStyle = "rgba(0,0,0,.22)";
    for (let y = 0; y < SH; y += 2) g.fillRect(0, y, SW, 1);
    c.sTex.needsUpdate = true;
    c.dirty = false;
  }

  function drawMarquee(i) {
    const c = cabs[i], g = c.mctx;
    const dark = H.theme === "dark";
    const lum = 0.2126 * c.color.r + 0.7152 * c.color.g + 0.0722 * c.color.b; /* linear */
    const base = "#" + c.color.getHexString();
    let ink;
    if (dark) {
      const grd = g.createLinearGradient(0, 0, 0, MH);
      grd.addColorStop(0, base); grd.addColorStop(1, "#" + col.copy(c.color).lerp(BLACK, 0.45).getHexString());
      g.fillStyle = grd; g.fillRect(0, 0, MW, MH);
      ink = lum > 0.32 ? "#14120c" : "#fff6de";
    } else {
      g.fillStyle = "#fffaf0"; g.fillRect(0, 0, MW, MH);
      g.fillStyle = base; g.fillRect(0, 0, MW, 16); g.fillRect(0, MH - 16, MW, 16);
      ink = "#12110e";
    }
    g.strokeStyle = ink; g.globalAlpha = 0.35; g.lineWidth = 2;
    g.strokeRect(10, dark ? 10 : 24, MW - 20, dark ? MH - 20 : MH - 48);
    g.globalAlpha = 1;

    const title = H.title(i);
    let size = 66;
    const fam = '"Newsreader", "Noto Serif TC", Georgia, serif';
    do { g.font = `600 ${size}px ${fam}`; size -= 3; } while (g.measureText(title).width > MW - 56 && size > 22);
    g.fillStyle = ink; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(title, MW / 2, MH / 2 + 3, MW - 44);
    c.mTex.needsUpdate = true;
  }

  function drawWall(dark) {
    const g = wallCanvas.getContext("2d");
    const w = wallCanvas.width, h = wallCanvas.height;
    if (dark) {
      const grd = g.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "#0d0c18"); grd.addColorStop(0.45, "#221d36"); grd.addColorStop(1, "#12101e");
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(0, 0, 2, h);
      g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(w - 2, 0, 2, h);
      g.fillStyle = "#0c0b14"; g.fillRect(0, h * 0.8, w, h * 0.2);
      g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(0, h * 0.8, w, 1);
    } else {
      /* candy-stripe wallpaper over a painted dado */
      g.fillStyle = "#fbf3e6"; g.fillRect(0, 0, w, h);
      g.fillStyle = "#f6e3da"; g.fillRect(0, 0, w / 2, h);
      g.fillStyle = "#bfe0d6"; g.fillRect(0, h * 0.72, w, h * 0.28);
      g.fillStyle = "#fffaf2"; g.fillRect(0, h * 0.72 - 5, w, 5);
      g.fillStyle = "rgba(60,40,20,.07)"; g.fillRect(0, h * 0.72, w, 2);
    }
    wallTex.needsUpdate = true;
  }
  function drawTiles(dark) {
    const g = tileCanvas.getContext("2d");
    g.fillStyle = dark ? "#0b0b11" : "#fdf8ee"; g.fillRect(0, 0, 64, 64);
    g.fillStyle = dark ? "#23223a" : "#f4cfd0";
    g.fillRect(0, 0, 32, 32); g.fillRect(32, 32, 32, 32);
    tileTex.needsUpdate = true;
  }

  /* ------------------------------------------------------------ theme */
  function applyTheme() {
    const dark = H.theme === "dark";
    const bg = new THREE.Color(dark ? 0x07070c : 0xf4ece0);
    scene.background = bg; scene.fog.color.copy(bg); scene.fog.density = dark ? 0.034 : 0.016;

    bodyMat.color.set(dark ? 0x2a2a3a : 0xfbf6ec);
    bodyMat.roughness = dark ? 0.45 : 0.7;
    ctlMat.color.set(dark ? 0x6f6a5e : 0x34302a);
    doorMat.color.set(dark ? 0x30303a : 0xd9d2c4); doorMat.metalness = dark ? 0.6 : 0.2;
    ceilMat.color.set(dark ? 0x050508 : 0xfffaf2);
    shadowMat.opacity = dark ? 0.75 : 0.22;
    shadowMat.color.set(dark ? 0x000000 : 0x4a3520);
    floorMat.opacity = dark ? 0.52 : 0.86;

    hemi.color.set(dark ? 0x7f95ff : 0xffffff); hemi.groundColor.set(dark ? 0x1a0f1c : 0xead9c6);
    hemi.intensity = dark ? 1.1 : 2.1;
    hubLight.color.set(dark ? 0x9db0ff : 0xfff4e2); hubLight.intensity = dark ? 1.3 : 1.7;
    camLight.intensity = dark ? 48 : 6;
    glowLight.intensity = dark ? 7 : 0;
    renderer.toneMappingExposure = dark ? 1.05 : 1.0;

    const accent = H.token("--accent") || "#3987e5";
    const pink = H.token("--s3") || "#d55181";
    ringMatA.color.set(pink); ringMatB.color.set(accent);
    if (dark) { ringMatA.color.multiplyScalar(1.5); ringMatB.color.multiplyScalar(1.5); stripMat.color.setRGB(1.5, 1.42, 1.25); neonMat.color.setScalar(1.45); }
    else { ringMatA.color.lerp(WHITE, 0.35); ringMatB.color.lerp(WHITE, 0.35); stripMat.color.set(0xffffff); neonMat.color.setScalar(1); }

    for (let i = 0; i < N; i++) {
      const c = cabs[i];
      c.color.set(H.color(i));
      col.copy(c.color); if (!dark) col.lerp(WHITE, 0.12);
      sides.setColorAt(i, col);
      col.copy(c.color); if (!dark) col.lerp(WHITE, 0.2);
      neons.setColorAt(i, col);
      /* screen palette: phosphor-bright versions of the author colour */
      c.css = "#" + col.copy(c.color).lerp(WHITE, 0.18).getHexString();
      c.cssHi = "#" + col.copy(c.color).lerp(WHITE, 0.55).getHexString();
      c.cssDim = "#" + col.copy(c.color).lerp(BLACK, 0.55).getHexString();
      c.dirty = true;
      drawMarquee(i);
    }
    for (let i = 0; i <= N; i++) {
      col.set(i % 2 ? accent : pink);
      if (dark) col.multiplyScalar(1.5); else col.lerp(WHITE, 0.55);
      posts.setColorAt(i, col);
    }
    posts.instanceColor.needsUpdate = true;
    sides.instanceColor.needsUpdate = true; neons.instanceColor.needsUpdate = true;
    paintSlots(-1);
    drawWall(dark); drawTiles(dark);
  }

  const SLOT_OFF = new THREE.Color(0x3a2a08), SLOT_ON = new THREE.Color(0xffc23a);
  function paintSlots(on) {
    for (let i = 0; i < N; i++) slots.setColorAt(i, i === on ? SLOT_ON : SLOT_OFF);
    slots.instanceColor.needsUpdate = true;
  }

  /* ------------------------------------------------------------ sizing */
  let vw = 1, vh = 1, camDist = 6, camY = 1.5, lookY = 1.2, pxPerCab = 300;
  function resize() {
    vw = stage.clientWidth; vh = stage.clientHeight;
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr); renderer.setSize(vw, vh, false);
    composer.setPixelRatio(pr); composer.setSize(vw, vh);
    const ms = Math.min(1024, Math.max(256, Math.round(Math.max(vw, vh) * pr * 0.5)));
    mirror.getRenderTarget().setSize(ms, ms);

    const aspect = vw / vh;
    camera.aspect = aspect;
    if (aspect >= 1.15) {
      camera.fov = 38; camDist = 5.5; camY = 1.42; lookY = 1.2;
      camera.setViewOffset(vw, vh, -Math.round(vw * 0.17), 0, vw, vh);   /* cabinet sits right of the copy */
    } else {
      camera.fov = 50; camDist = 5.0; camY = 1.5; lookY = 1.12;
      camera.setViewOffset(vw, vh, 0, Math.round(vh * 0.035), vw, vh);
    }
    camera.updateProjectionMatrix();
    const visW = 2 * camDist * Math.tan((camera.fov * Math.PI) / 360) * aspect;
    pxPerCab = (SPACING / visW) * vw;
    needsFrame = true;
  }

  /* ------------------------------------------------------------ input */
  let scrollPos = 0, camPos = 0, focus = 0, hovered = -1, needsFrame = true;
  let ptrX = 0, ptrY = 0, ptrDirty = false, parX = 0, parTarget = 0;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hits = [];

  /* The stage sticks below the site's own sticky chrome, not at the viewport top. */
  const chromeH = () => parseFloat(getComputedStyle(stage).top) || 0;
  function readScroll() {
    const top = hall.getBoundingClientRect().top - chromeH();
    scrollPos = Math.min(N - 1, Math.max(0, -top / STEP));
    needsFrame = true;
  }
  function walkTo(i) {
    i = Math.min(N - 1, Math.max(0, i));
    const top = window.scrollY + hall.getBoundingClientRect().top - chromeH() + i * STEP;
    window.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
  }
  function pick(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    hits.length = 0;
    ray.intersectObject(bodies, false, hits);
    return hits.length ? hits[0].instanceId : -1;
  }

  /* coin → navigate */
  let coinT0 = -1, coinTarget = -1, navTimer = 0;
  const coinFrom = new THREE.Vector3();
  function go(i) {
    if (coinTarget >= 0) return;
    if (reduced) { location.href = H.href(i); return; }
    coinTarget = i; coinT0 = performance.now();
    if (i !== focus) walkTo(i);
    needsFrame = true;
  }
  window.addEventListener("pageshow", () => { coinTarget = -1; coinT0 = -1; coinFlash = -1; coin.visible = false; clearTimeout(navTimer); needsFrame = true; });

  let downX = 0, downY = 0, lastX = 0, dragging = false, moved = false, downType = "mouse";
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true; moved = false; downX = lastX = e.clientX; downY = e.clientY; downType = e.pointerType;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging) {
      if (!moved && Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) { moved = true; canvas.classList.add("is-drag"); }
      if (moved) {
        const dx = e.clientX - lastX;
        window.scrollBy({ top: (-dx * STEP) / pxPerCab, behavior: "instant" });
      }
      lastX = e.clientX;
    }
    if (e.pointerType === "mouse") {
      ptrX = e.clientX; ptrY = e.clientY; ptrDirty = true;
      parTarget = (e.clientX / vw) * 2 - 1;
      needsFrame = true;
    }
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false; canvas.classList.remove("is-drag");
    if (!moved && e.type === "pointerup") {
      const hit = pick(e.clientX, e.clientY);
      if (hit >= 0) {
        if (downType === "mouse" || hit === focus) go(hit);
        else walkTo(hit);
      }
    }
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", () => { if (hovered !== -1) { hovered = -1; canvas.classList.remove("is-hit"); H.show(focus); needsFrame = true; } });

  window.addEventListener("keydown", (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    const inHall = hall.getBoundingClientRect().bottom > vh * 0.5;
    if (!inHall) return;
    if (e.key === "ArrowRight") { e.preventDefault(); walkTo(focus + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); walkTo(focus - 1); }
    else if (e.key === "Enter" && (e.target === canvas || e.target === document.body)) { e.preventDefault(); go(focus); }
  });
  document.getElementById("prevBtn").addEventListener("click", () => walkTo(focus - 1));
  document.getElementById("nextBtn").addEventListener("click", () => walkTo(focus + 1));
  document.getElementById("cCoin").addEventListener("click", (e) => {
    if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (hovered >= 0 && hovered !== focus) return; /* card is describing another cabinet: plain link */
    e.preventDefault(); go(focus);
  });

  window.addEventListener("scroll", readScroll, { passive: true });
  window.addEventListener("resize", () => { resize(); readScroll(); });
  reduceMq.addEventListener("change", (e) => { reduced = e.matches; for (const c of cabs) c.dirty = true; needsFrame = true; });

  /* ------------------------------------------------------------ loop */
  let running = false, rafId = 0, last = 0, frame = 0, onStage = true, rr = 0;
  let focusInit = false;
  const clock0 = performance.now();
  const v3 = new THREE.Vector3();

  function setFocus(i) {
    if (i === focus && focusInit) return;
    focus = i; focusInit = true;
    H.setCount(i);
    if (hovered < 0) H.show(i);
    paintSlots(i);
    glowLight.color.copy(cabs[i].color).lerp(WHITE, 0.5);
    cabs[i].dirty = true;
  }

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    const time = (now - clock0) / 1000;
    const dark = H.theme === "dark";

    /* reduced motion: draw only when something changed, camera cuts between cabinets */
    if (reduced) {
      const target = Math.round(scrollPos);
      if (!needsFrame && target === camPos) return;
      camPos = target; parX = 0;
    } else {
      /* soft magnet towards whole cabinets, then critically damped follow */
      const base = Math.round(scrollPos), f = scrollPos - base;
      const mag = base + Math.sign(f) * Math.pow(Math.abs(f) * 2, 1.7) * 0.5;
      camPos += (mag - camPos) * (1 - Math.exp(-dt * 7));
      parX += (parTarget - parX) * (1 - Math.exp(-dt * 4));
    }
    needsFrame = false;
    frame++;

    const fi = Math.min(N - 1, Math.max(0, Math.round(camPos)));
    if (fi !== focus || !focusInit) setFocus(fi);

    const th = camPos * dTheta, sn = Math.sin(th), cs = Math.cos(th);
    const rad = R - camDist, side = parX * 0.22;
    camera.position.set(rad * sn + cs * side, camY, -rad * cs + sn * side);
    camera.lookAt(R * sn, lookY, -R * cs);
    camLight.position.set((rad + 1.2) * sn, 2.6, -(rad + 1.2) * cs);
    glowLight.position.set((R - 0.95) * sn, 1.25, -(R - 0.95) * cs);

    /* hover */
    if (ptrDirty && !dragging) {
      ptrDirty = false;
      const h = pick(ptrX, ptrY);
      if (h !== hovered) {
        hovered = h;
        canvas.classList.toggle("is-hit", h >= 0);
        H.show(h >= 0 ? h : focus);
        if (h >= 0) cabs[h].dirty = true;
      }
    }

    /* screens: brightness every frame, canvas redraws on a budget */
    const lo = Math.max(0, fi - 4), hi = Math.min(N - 1, fi + 4);
    const maxB = dark ? 1.3 : 1.0, minB = dark ? 0.5 : 0.72;
    for (let i = 0; i < N; i++) {
      const c = cabs[i];
      const a = Math.max(0, 1 - Math.abs(i - camPos));
      const tgt = minB + (maxB - minB) * Math.max(a, i === hovered ? 0.7 : 0) + (coinFlash === i ? 0.5 : 0);
      c.bright = reduced ? tgt : c.bright + (tgt - c.bright) * (1 - Math.exp(-dt * 9));
      c.sMat.color.setScalar(c.bright);
      if (i >= lo && i <= hi && c.bootAt < 0) { c.bootAt = time + Math.abs(i - fi) * 0.12; c.dirty = true; }
    }
    let budget = 3;
    if (!reduced && (frame & 1) === 0) { drawScreen(fi, time, true); budget--; }
    if (!reduced && hovered >= 0 && hovered !== fi && (frame & 1) === 1) { drawScreen(hovered, time, false); budget--; }
    if (!reduced) { /* one neighbour per frame, round robin */
      rr = rr + 1 > hi - lo ? 0 : rr + 1;
      const j = lo + rr;
      if (j !== fi && j !== hovered && j <= hi) { drawScreen(j, time, false); budget--; }
    }
    for (let i = 0; i < N && budget > 0; i++) if (cabs[i].dirty) { drawScreen(i, time, i === fi); budget--; if (reduced) needsFrame = true; }

    /* coin slot blink on the focused cabinet */
    if (!reduced) {
      col.copy(SLOT_ON).multiplyScalar(0.55 + 0.45 * Math.sin(time * 6));
      slots.setColorAt(fi, col); slots.instanceColor.needsUpdate = true;
    }

    /* coin flight */
    if (coinTarget >= 0) {
      const k = Math.min(1, (now - coinT0) / 620);
      const e = k * k * (3 - 2 * k);
      const target = cabs[coinTarget].slot;
      coinFrom.set(0.55, -0.5, -1.4).applyMatrix4(camera.matrixWorld);
      v3.lerpVectors(coinFrom, target, e);
      v3.y += Math.sin(k * Math.PI) * 0.55;
      coin.position.copy(v3);
      coin.rotation.set(k * 14, th, Math.PI / 2 + k * 3);
      coin.scale.setScalar(1 - 0.35 * e);
      coin.visible = k < 1;
      if (k >= 1 && coinFlash !== coinTarget) {
        coinFlash = coinTarget; cabs[coinTarget].dirty = true;
        const dest = H.href(coinTarget);
        navTimer = setTimeout(() => { location.href = dest; }, 260);
      }
      needsFrame = true;
    }

    if (dark) composer.render(dt); else renderer.render(scene, camera);
  }

  function start() { if (running || document.hidden || !onStage) return; running = true; last = performance.now(); needsFrame = true; rafId = requestAnimationFrame(tick); }
  function stop() { running = false; cancelAnimationFrame(rafId); }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  new IntersectionObserver((en) => { onStage = en[0].isIntersecting; onStage ? start() : stop(); }).observe(stage);

  H.onChange((what) => {
    if (what === "theme") applyTheme();
    else loadFontsThenMarquees();
    for (const c of cabs) c.dirty = true;
    needsFrame = true;
  });

  function loadFontsThenMarquees() {
    for (let i = 0; i < N; i++) drawMarquee(i);
    if (!document.fonts || !document.fonts.load) return;
    const jobs = [];
    for (let i = 0; i < N; i++) jobs.push(document.fonts.load('600 60px "Newsreader", "Noto Serif TC"', H.title(i)).catch(() => {}));
    Promise.all(jobs).then(() => { for (let i = 0; i < N; i++) drawMarquee(i); needsFrame = true; });
  }

  applyTheme();
  loadFontsThenMarquees();
  resize(); readScroll();
  camPos = scrollPos;
  window.__hall = { cabs: N, get focus() { return focus; }, get hovered() { return hovered; }, renderer };
  start();
}

try { boot(); } catch (err) {
  /* fall back to the plain HTML page */
  root.classList.remove("gl");
  if (hall) hall.style.height = "";
  console.warn("Arcade hall disabled:", err);
}
