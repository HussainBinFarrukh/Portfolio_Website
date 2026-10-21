// Orchestrator "brain": a neural network laid out inside a brain silhouette
// (side profile: cerebrum, temporal lobe, cerebellum, stem). Signals hop
// between connected neurons; a scan line sweeps through. Activity (0..1)
// controls how many signals fire. Static when reduced motion is set.
window.Brain = (function () {
  var NS = "http://www.w3.org/2000/svg";
  var LOBES = [
    { cx: 108, cy: 70, rx: 92, ry: 60 },  // cerebrum
    { cx: 98, cy: 106, rx: 58, ry: 30 },  // temporal lobe
    { cx: 166, cy: 122, rx: 30, ry: 19 }, // cerebellum
    { cx: 138, cy: 146, rx: 9, ry: 17 }   // stem
  ];

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function inside(x, y, pad) {
    for (var i = 0; i < LOBES.length; i++) {
      var l = LOBES[i], dx = (x - l.cx) / (l.rx - pad), dy = (y - l.cy) / (l.ry - pad);
      if (dx * dx + dy * dy <= 1) return true;
    }
    return false;
  }
  // Seeded random so the brain looks the same on every load.
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  function outline() {
    // Ray-march from an interior point to trace the union boundary.
    var cx = 112, cy = 92, pts = [];
    for (var a = 0; a < 360; a += 4) {
      var rad = a * Math.PI / 180, r = 0;
      while (r < 140 && (inside(cx + Math.cos(rad) * (r + 1), cy + Math.sin(rad) * (r + 1), 0))) r += 1;
      pts.push([cx + Math.cos(rad) * r, cy + Math.sin(rad) * r]);
    }
    return "M" + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" L") + " Z";
  }

  function build(svg) {
    if (!svg) return null;
    svg.textContent = "";
    var rand = rng(7);
    var defs = el("defs", {}, svg);
    var clip = el("clipPath", { id: "brain-clip" }, defs);
    var shape = outline();
    el("path", { d: shape }, clip);
    var grad = el("linearGradient", { id: "brain-scan", x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
    el("stop", { offset: "0", "stop-color": "#7AA8FF", "stop-opacity": "0" }, grad);
    el("stop", { offset: "0.5", "stop-color": "#9CC0FF", "stop-opacity": "0.5" }, grad);
    el("stop", { offset: "1", "stop-color": "#7AA8FF", "stop-opacity": "0" }, grad);

    el("path", { d: shape, "class": "b-fill" }, svg);

    // Neurons: rejection sampling with a minimum spacing.
    var pts = [], tries = 0;
    while (pts.length < 78 && tries < 6000) {
      tries++;
      var x = 14 + rand() * 192, y = 8 + rand() * 154;
      if (!inside(x, y, 5)) continue;
      var ok = true;
      for (var i = 0; i < pts.length; i++) { var dx = pts[i][0] - x, dy = pts[i][1] - y; if (dx * dx + dy * dy < 120) { ok = false; break; } }
      if (ok) pts.push([x, y]);
    }
    // Synapses: connect each neuron to its nearest few neighbors.
    var adj = pts.map(function () { return []; }), edges = [];
    pts.forEach(function (p, i) {
      var d = [];
      pts.forEach(function (q, j) { if (i !== j) d.push([(p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]), j]); });
      d.sort(function (a, b) { return a[0] - b[0]; });
      for (var k = 0; k < 3; k++) {
        var j = d[k][1];
        if (d[k][0] > 900 || adj[i].indexOf(j) > -1) continue;
        adj[i].push(j); adj[j].push(i); edges.push([i, j]);
      }
    });

    var g = el("g", { "clip-path": "url(#brain-clip)" }, svg);
    edges.forEach(function (e) {
      el("line", { x1: pts[e[0]][0], y1: pts[e[0]][1], x2: pts[e[1]][0], y2: pts[e[1]][1], "class": "b-syn" }, g);
    });
    var neurons = pts.map(function (p, i) { return el("circle", { cx: p[0], cy: p[1], r: i % 9 === 0 ? 2.6 : 1.7, "class": i % 9 === 0 ? "b-node hub" : "b-node" }, g); });
    var scan = el("rect", { x: 0, y: -40, width: 220, height: 34, fill: "url(#brain-scan)", "class": "b-scan" }, g);
    el("path", { d: shape, "class": "b-outline" }, svg);
    // Central fold and a few gyri for a recognizable profile.
    el("path", { d: "M104,14 C98,40 116,58 106,84", "class": "b-fold" }, svg);
    el("path", { d: "M58,40 C72,52 66,70 82,80", "class": "b-fold" }, svg);
    el("path", { d: "M150,30 C140,48 156,62 146,82", "class": "b-fold" }, svg);
    el("path", { d: "M50,100 C80,94 110,100 136,92", "class": "b-fold" }, svg);

    var sigLayer = el("g", { "clip-path": "url(#brain-clip)" }, svg);
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var MAX = 22, sigs = [];
    for (var s = 0; s < MAX; s++) {
      var a = Math.floor(rand() * pts.length), nb = adj[a].length ? adj[a] : [a];
      sigs.push({ a: a, b: nb[Math.floor(rand() * nb.length)], t: rand(), v: 1.2 + rand() * 1.4,
        c: el("circle", { r: 2.2, "class": "b-sig", cx: pts[a][0], cy: pts[a][1] }, sigLayer) });
    }

    var activity = 0.35, scanY = -40, running = false, visible = true, last = 0;
    function apply() {
      var n = Math.round(4 + activity * (MAX - 4));
      sigs.forEach(function (s, i) { s.c.style.display = i < n ? "" : "none"; });
      svg.style.setProperty("--brain-glow", (0.25 + activity * 0.75).toFixed(2));
    }
    function frame(now) {
      if (!visible || document.hidden) { running = false; return; }
      var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      var speed = 0.6 + activity * 1.2;
      sigs.forEach(function (s) {
        if (s.c.style.display === "none") return;
        s.t += dt * s.v * speed;
        if (s.t >= 1) {
          neurons[s.b].classList.add("fire");
          (function (n) { setTimeout(function () { n.classList.remove("fire"); }, 220); })(neurons[s.b]);
          var nb = adj[s.b].filter(function (n) { return n !== s.a; });
          s.a = s.b; s.b = nb.length ? nb[Math.floor(Math.random() * nb.length)] : s.a; s.t = 0;
        }
        var p = pts[s.a], q = pts[s.b];
        s.c.setAttribute("cx", p[0] + (q[0] - p[0]) * s.t);
        s.c.setAttribute("cy", p[1] + (q[1] - p[1]) * s.t);
      });
      scanY += dt * (40 + activity * 70);
      if (scanY > 180) scanY = -40;
      scan.setAttribute("y", scanY.toFixed(1));
      requestAnimationFrame(frame);
    }
    function start() { if (!running && !reduce) { running = true; last = 0; requestAnimationFrame(frame); } }

    apply();
    if (reduce) { scan.style.display = "none"; return { setActivity: function () {} }; }
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(svg);
    document.addEventListener("visibilitychange", function () { if (!document.hidden && visible) start(); });
    start();

    return { setActivity: function (v) { activity = Math.max(0, Math.min(1, v)); apply(); } };
  }

  return { build: build };
})();
