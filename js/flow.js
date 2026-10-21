// Integration landscape diagram. Ten systems connect through an integration
// layer; a looping lifecycle moves documents between them:
// catalog (832) -> order (850) -> pick ticket (940) -> ship confirm (945)
// -> ASN (856) -> invoice (810). Wide layout is 1000x600; narrow is 360x720.
window.FlowDiagram = (function () {
  var NS = "http://www.w3.org/2000/svg";

  var NODES = {
    retail:  { label: "Retail partners", sub: "EDI X12", proto: "AS2 / VAN" },
    market:  { label: "Marketplaces",    sub: "Channel APIs", proto: "REST API" },
    ecom:    { label: "eCommerce",       sub: "Storefront", proto: "Webhooks" },
    pim:     { label: "PLM / PIM",       sub: "Product data", proto: "Product feed" },
    oms:     { label: "OMS",             sub: "Order orchestration", proto: "Order API" },
    erp:     { label: "ERP",             sub: "Finance, inventory", proto: "IDoc / OData" },
    wms:     { label: "WMS",             sub: "Warehouse execution", proto: "REST API" },
    tpl:     { label: "3PLs",            sub: "Outsourced fulfillment", proto: "SFTP / X12" },
    tms:     { label: "TMS",             sub: "Freight planning", proto: "X12 204, 214" },
    carrier: { label: "Carriers",        sub: "Parcel and LTL", proto: "Rate, label, track" }
  };
  var SHORT = { retail: "Retail EDI", market: "Marketplace", ecom: "eCommerce", pim: "PLM / PIM", oms: "OMS", erp: "ERP", wms: "WMS", tpl: "3PLs", tms: "TMS", carrier: "Carriers" };

  // Each step: hops [from, to, label, delay]; console lines in / map / out.
  var STEPS = [
    { hops: [["pim", "ecom", "832", 0], ["pim", "market", "832", 0.3]],
      log: ["IN   832 catalog from PLM/PIM", "VAL  GTIN, price, size scale", "MAP  item master to listings", "OUT  storefront, marketplaces"],
      status: "status: catalog synced to 2 channels" },
    { hops: [["retail", "oms", "850 PO", 0], ["market", "oms", "Order", 0.25], ["ecom", "oms", "Order", 0.5], ["oms", "erp", "Sales order", 1.7]],
      log: ["IN   850 PO, channel orders", "VAL  ship-to, items, price, dates", "MAP  PO to sales order", "OUT  OMS, then ERP"],
      status: "status: 997 sent, 855 queued" },
    { hops: [["erp", "wms", "940", 0], ["erp", "tpl", "940", 0.3]],
      log: ["IN   released sales order", "VAL  inventory, ship window", "MAP  order to 940 pick ticket", "OUT  WMS, 3PL"],
      status: "status: released to 2 warehouses" },
    { hops: [["wms", "erp", "945", 0], ["tpl", "erp", "945", 0.3], ["erp", "carrier", "Label", 1.5], ["erp", "tms", "204", 1.7]],
      log: ["IN   945 ship confirmations", "VAL  cartons, SSCC-18, weights", "MAP  945 to shipment", "OUT  ERP, carrier label, TMS"],
      status: "status: labels issued, load tendered" },
    { hops: [["erp", "retail", "856 ASN", 0], ["carrier", "ecom", "Tracking", 0.3], ["carrier", "market", "Tracking", 0.5]],
      log: ["IN   shipment from ERP", "VAL  ASN against PO lines", "MAP  shipment to 856 ASN", "OUT  retailer, tracking to channels"],
      status: "status: 856 accepted, 997 received" },
    { hops: [["erp", "retail", "810", 0], ["erp", "market", "Invoice", 0.3], ["retail", "erp", "997 Ack", 1.6]],
      log: ["IN   invoice from ERP", "VAL  totals, terms, allowances", "MAP  invoice to 810", "OUT  retailer, marketplace"],
      status: "status: invoiced, awaiting 820 remittance" }
  ];

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, cls, anchor) {
    var t = el("text", { x: x, y: y, "text-anchor": anchor || "middle" }, parent);
    if (cls) t.setAttribute("class", cls);
    t.textContent = str;
    return t;
  }
  function cubic(p) { return "M" + p[0] + "," + p[1] + " C" + p[2] + "," + p[3] + " " + p[4] + "," + p[5] + " " + p[6] + "," + p[7]; }

  function wideLayout() {
    var L = { w: 1000, h: 600, nodeH: 64, boxes: {}, edges: {}, labels: {}, hub: { x: 355, y: 170, w: 290, h: 260 }, narrow: false };
    var left = ["retail", "market", "ecom", "pim"], right = ["wms", "tpl", "tms", "carrier"], ys = [70, 200, 330, 460], hy = [222, 272, 330, 380];
    // Labels sit on the side of the line away from where the edge bends.
    left.forEach(function (k, i) {
      L.boxes[k] = { x: 0, y: ys[i], w: 190, h: 64 };
      var cy = ys[i] + 32;
      L.edges[k] = [190, cy, 272, cy, 273, hy[i], 355, hy[i]];
      L.labels[k] = { x: 200, y: hy[i] < cy ? cy + 18 : cy - 9, a: "start" };
    });
    right.forEach(function (k, i) {
      L.boxes[k] = { x: 810, y: ys[i], w: 190, h: 64 };
      var cy = ys[i] + 32;
      L.edges[k] = [810, cy, 728, cy, 727, hy[i], 645, hy[i]];
      L.labels[k] = { x: 800, y: hy[i] < cy ? cy + 18 : cy - 9, a: "end" };
    });
    L.boxes.oms = { x: 405, y: 0, w: 190, h: 64 };
    L.edges.oms = [500, 64, 500, 110, 500, 124, 500, 170];
    L.labels.oms = { x: 510, y: 122, a: "start" };
    L.boxes.erp = { x: 405, y: 536, w: 190, h: 64 };
    L.edges.erp = [500, 536, 500, 490, 500, 476, 500, 430];
    L.labels.erp = { x: 510, y: 488, a: "start" };
    return L;
  }

  function narrowLayout() {
    var L = { w: 360, h: 720, nodeH: 54, boxes: {}, edges: {}, labels: {}, hub: { x: 14, y: 236, w: 332, h: 248 }, narrow: true };
    var W = 108, H = 54;
    var place = function (k, x, y) { L.boxes[k] = { x: x, y: y, w: W, h: H }; };
    place("retail", 0, 0); place("market", 126, 0); place("ecom", 252, 0);
    place("pim", 63, 80); place("oms", 189, 80);
    place("erp", 63, 586); place("wms", 189, 586);
    place("tpl", 0, 666); place("tms", 126, 666); place("carrier", 252, 666);
    var hubX = function (cx) { return Math.round(L.hub.x + 30 + (cx / 360) * (L.hub.w - 60)); };
    Object.keys(L.boxes).forEach(function (k) {
      var b = L.boxes[k], cx = b.x + W / 2, top = b.y < L.hub.y;
      var y0 = top ? b.y + H : b.y, y1 = top ? L.hub.y : L.hub.y + L.hub.h, hx = hubX(cx), my = (y0 + y1) / 2;
      L.edges[k] = [cx, y0, cx, my, hx, my, hx, y1];
    });
    return L;
  }

  function node(svg, key, b, narrow) {
    var g = el("g", { "class": "f-node", "data-node": key }, svg);
    el("rect", { x: b.x + 0.75, y: b.y + 0.75, width: b.w - 1.5, height: b.h - 1.5, rx: 8 }, g);
    var cx = b.x + b.w / 2;
    text(g, cx, b.y + b.h / 2 - (narrow ? 2 : 3), narrow ? SHORT[key] : NODES[key].label);
    text(g, cx, b.y + b.h / 2 + (narrow ? 13 : 15), narrow ? NODES[key].proto : NODES[key].sub, "sub");
    return g;
  }

  function build(host, narrow) {
    host.textContent = "";
    var L = narrow ? narrowLayout() : wideLayout();
    var svg = el("svg", { viewBox: "0 0 " + L.w + " " + L.h, "aria-hidden": "true", focusable: "false" }, host);
    var refs = { svg: svg, L: L, nodes: {}, edges: {}, edgeLabels: [], packetLayer: null, hub: null, lines: [], status: null };

    Object.keys(L.edges).forEach(function (k) {
      refs.edges[k] = el("path", { d: cubic(L.edges[k]), "class": "f-path" }, svg);
    });
    if (!narrow) Object.keys(L.labels).forEach(function (k) {
      var l = L.labels[k];
      refs.edgeLabels.push(text(svg, l.x, l.y, NODES[k].proto, "f-proto", l.a));
    });
    Object.keys(L.boxes).forEach(function (k) { refs.nodes[k] = node(svg, k, L.boxes[k], narrow); });

    refs.packetLayer = el("g", {}, svg);

    var h = L.hub, hx = h.x + h.w / 2, hub = el("g", { "class": "f-hub" }, svg);
    el("rect", { x: h.x - 6, y: h.y - 6, width: h.w + 12, height: h.h + 12, rx: 16, "class": "glow" }, hub);
    el("rect", { x: h.x, y: h.y, width: h.w, height: h.h, rx: 12, "class": "body" }, hub);
    text(hub, hx, h.y + 32, "Integration layer", "title");
    text(hub, hx, h.y + 51, "Map, validate, route, monitor", "sub");
    var cx = h.x + 16, cw = h.w - 32, cy = h.y + 70, ch = h.h - 86;
    el("rect", { x: cx, y: cy, width: cw, height: ch, rx: 8, "class": "console" }, hub);
    var gap = narrow ? 24 : 25;
    for (var i = 0; i < 4; i++) refs.lines.push(text(hub, cx + 12, cy + 26 + i * gap, STEPS[1].log[i], "line", "start"));
    refs.status = text(hub, cx + 12, cy + ch - 16, STEPS[1].status, "status", "start");
    refs.hub = hub;
    refs.hubGlow = hub.querySelector(".glow");
    return refs;
  }

  function hopPath(L, a, b) {
    var A = L.edges[a], B = L.edges[b];
    return cubic(A) + " L" + B[6] + "," + B[7] + " C" + B[4] + "," + B[5] + " " + B[2] + "," + B[3] + " " + B[0] + "," + B[1];
  }

  // Looping lifecycle. Requires gsap + MotionPathPlugin. onStep(i) fires as each step starts.
  function lifecycle(refs, opts) {
    var gsap = window.gsap, L = refs.L;
    var tl = gsap.timeline({ repeat: -1, paused: true });
    var stepLen = 3.9;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    STEPS.forEach(function (step, si) {
      var t0 = si * stepLen;
      tl.call(function () { if (opts.onStep) opts.onStep(si); }, null, t0);
      step.log.forEach(function (line, li) {
        if (opts.scramble) tl.to(refs.lines[li], { duration: 0.7, scrambleText: { text: line, chars: chars, speed: 0.7 }, ease: "none" }, t0 + li * 0.12);
        else tl.call(function () { refs.lines[li].textContent = line; }, null, t0);
      });
      if (opts.scramble) tl.to(refs.status, { duration: 0.8, scrambleText: { text: step.status, chars: chars, speed: 0.7 }, ease: "none" }, t0 + 1.4);
      else tl.call(function () { refs.status.textContent = step.status; }, null, t0 + 1.4);
      tl.fromTo(refs.hubGlow, { opacity: 0.85 }, { opacity: 0.3, duration: 1.2, ease: "power2.out" }, t0);

      step.hops.forEach(function (hop) {
        var from = hop[0], to = hop[1], label = hop[2], at = t0 + hop[3];
        var w = Math.max(30, label.length * 6.6 + 16);
        var g = el("g", { "class": "f-packet", opacity: "0" }, refs.packetLayer);
        el("rect", { x: -w / 2, y: -10, width: w, height: 20, rx: 5 }, g);
        text(g, 0, 4, label);
        var route = el("path", { d: hopPath(L, from, to), fill: "none", stroke: "none" }, refs.packetLayer);
        var eA = refs.edges[from], eB = refs.edges[to], nA = refs.nodes[from], nB = refs.nodes[to];
        tl.set([eA, eB], { attr: { "class": "f-path on" } }, at)
          .set(nA, { attr: { "class": "f-node send" } }, at)
          .set(g, { opacity: 1 }, at)
          .to(g, { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5] }, duration: 2, ease: "power1.inOut" }, at)
          .set(nA, { attr: { "class": "f-node" } }, at + 0.6)
          .set(g, { opacity: 0 }, at + 2)
          .set(nB, { attr: { "class": "f-node hit" } }, at + 1.95)
          .set(nB, { attr: { "class": "f-node" } }, at + 2.7)
          .set([eA, eB], { attr: { "class": "f-path" } }, at + 2.4);
      });
    });
    tl.to({}, { duration: 0.3 }, STEPS.length * stepLen - 0.3);
    return tl;
  }

  return { build: build, lifecycle: lifecycle, steps: STEPS };
})();
