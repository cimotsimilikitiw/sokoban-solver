import * as fs from "node:fs";
const D = [[0, -1, "uU"], [0, 1, "dD"], [-1, 0, "lL"], [1, 0, "rR"]];
const { MAKEFUN_INPUT_DIR: I = "/input", MAKEFUN_OUTPUT_DIR: O = "/output" } = process.env;

function solve(t) {
  const L = t.replace(/\r/g, "").trimEnd().split("\n");
  const h = L.length, w = Math.max(...L.map((l) => l.length)), n = w * h;
  const W = new Uint8Array(n), G = new Uint8Array(n), C = new Uint8Array(n), V = new Uint8Array(n);
  const gs = [], bs = [];
  let P = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = L[y][x] || "#", z = y * w + x;
      if (c === "#") W[z] = C[z] = 1;
      else {
        if (".+*".includes(c)) { G[z] = V[z] = 1; gs.push(z); }
        if ("$*".includes(c)) { C[z] = 1; bs.push(z); }
        if ("@+".includes(c)) P = z;
      }
    }
  for (let i = 0; i < gs.length; i++) {
    const z = gs[i], x = z % w, y = (z / w) | 0;
    for (const [dx, dy] of D) {
      const nx = x + dx, ny = y + dy, px = x + 2 * dx, py = y + 2 * dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && px >= 0 && px < w && py >= 0 && py < h) {
        const nz = ny * w + nx, pz = py * w + px;
        if (!W[nz] && !W[pz] && !V[nz]) { V[nz] = 1; gs.push(nz); }
      }
    }
  }
  const walk = (blk, s, t, al) => {
    if (s === t) return "";
    const sn = new Uint8Array(n), pr = new Array(n), q = [s];
    sn[s] = 1;
    for (let i = 0; i < q.length; i++) {
      const u = q[i];
      if (u === t) break;
      for (const [dx, dy, c] of D) {
        const nx = (u % w) + dx, ny = ((u / w) | 0) + dy, nz = ny * w + nx;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h && !sn[nz] && !blk[nz] && (!al || al[nz])) {
          sn[nz] = 1; pr[nz] = [u, c[0]]; q.push(nz);
        }
      }
    }
    const o = [];
    for (let u = t; u !== s; u = pr[u][0]) o.push(pr[u][1]);
    return o.reverse().join("");
  };
  const hy = (P / w) | 0, rB = [[], [], [], []], rG = [[], [], [], []];
  const rId = (z) => ((z % w) > 7 ? 2 : 0) + (((z / w) | 0) > hy ? 1 : 0);
  for (const b of bs) rB[rId(b)].push(b);
  for (const g of gs) if (G[g]) rG[rId(g)].push(g);
  let ans = "";
  const bm = new Uint8Array(n), cr = new Uint8Array(n), tr = new Uint8Array(n);
  for (let r = 0; r < 4; r++) {
    const rb = rB[r].sort((a, b) => a - b), rg = rG[r].sort((a, b) => a - b);
    if (!rb.length) continue;
    const rt = r & 2, dn = r & 1, x0 = rt ? 8 : 1, x1 = rt ? w - 2 : 6;
    const dy = dn ? hy + 1 : hy - 1, y0 = dn ? hy + 1 : 1, y1 = dn ? h - 2 : hy - 1;
    let dx0 = x0;
    while (W[dy * w + dx0]) dx0++;
    const hc = hy * w + dx0;
    if (!rb.every((b) => G[b])) {
      ans += walk(C, P, hc); P = hc;
      const al = new Uint8Array(n);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (!W[y * w + x]) al[y * w + x] = 1;
      al[dy * w + dx0] = 1;
      const reach = (p, bx, out) => {
        out.fill(0); for (const b of bx) bm[b] = 1;
        const q = [p]; out[p] = 1; let lo = p;
        for (let i = 0; i < q.length; i++) {
          const u = q[i]; if (u < lo) lo = u;
          for (const [dx, dy] of D) {
            const nx = (u % w) + dx, ny = ((u / w) | 0) + dy, nz = ny * w + nx;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && !out[nz] && al[nz] && !bm[nz]) { out[nz] = 1; q.push(nz); }
          }
        }
        for (const b of bx) bm[b] = 0;
        return lo;
      };
      const key = (lo, bx) => bx.reduce((k, b) => k * n + b, lo);
      const vis = new Set([key(reach(P, rb, cr), rb)]), q = [{ p: P, bs: rb, pv: -1, fp: -1, ch: "" }];
      let ok = 0;
      for (let hd = 0; hd < q.length && !ok; hd++) {
        const cur = q[hd]; reach(cur.p, cur.bs, cr);
        for (const b of cur.bs) bm[b] = 1;
        for (let i = 0; i < cur.bs.length && !ok; i++) {
          const b = cur.bs[i], bx = b % w, by = (b / w) | 0;
          for (const [dx, dy, c] of D) {
            const px = bx - dx, py = by - dy, nx = bx + dx, ny = by + dy, pz = py * w + px, nz = ny * w + nx;
            if (px < 0 || px >= w || py < 0 || py >= h || nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            if (!cr[pz] || !al[nz] || !V[nz] || bm[nz]) continue;
            const nbs = cur.bs.slice(); nbs[i] = nz; nbs.sort((a, b) => a - b);
            if (nbs.every((x) => G[x])) {
              for (const x of cur.bs) bm[x] = 0;
              const st = [{ fp: pz, ch: c[1], np: b, pb: cur.bs }];
              for (let k = hd; q[k].pv !== -1; k = q[k].pv) st.push({ fp: q[k].fp, ch: q[k].ch, np: q[k].p, pb: q[q[k].pv].bs });
              for (const s of st.reverse()) {
                for (const x of s.pb) bm[x] = 1;
                ans += walk(bm, P, s.fp, al) + s.ch;
                for (const x of s.pb) bm[x] = 0;
                P = s.np;
              }
              ok = 1; break;
            }
            if (q.length < 250_000) {
              for (const x of cur.bs) bm[x] = 0;
              const k = key(reach(b, nbs, tr), nbs);
              for (const x of cur.bs) bm[x] = 1;
              if (!vis.has(k)) { vis.add(k); q.push({ p: b, bs: nbs, pv: hd, fp: pz, ch: c[1] }); }
            }
          }
        }
        for (const b of cur.bs) bm[b] = 0;
      }
      if (!ok) throw new Error("no solution");
    }
    for (const b of rb) C[b] = 0;
    for (const g of rg) C[g] = 1;
  }
  return ans + "\n";
}

for (const id of fs.readdirSync(I).sort()) {
  fs.mkdirSync(`${O}/${id}`, { recursive: true });
  fs.writeFileSync(`${O}/${id}/solution.txt`, solve(fs.readFileSync(`${I}/${id}/level.txt`, "utf8")));
}
