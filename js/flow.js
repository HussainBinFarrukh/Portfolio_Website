// Integration diagram builder. Draws ERP sources, the PartnerLinQ hub, and
// partner/fulfillment targets as SVG, horizontally or (on narrow screens)
// vertically. Returns element references so main.js can animate them.
window.FlowDiagram = (function () {
  var NS = "http://www.w3.org/2000/svg";

  var sources = [
    { long: "SAP S/4HANA", short: "SAP", sub: "ERP" },
    { long: "Dynamics 365 F&O", short: "D365 F&O", sub: "ERP" },
    { long: "NetSuite", short: "NetSuite", sub: "ERP" }
  ];
  var targets = [
    { long: "Trading partners", short: "Partners", sub: "EDI X12, EDIFACT", subShort: "EDI" },
    { long: "3PL and WMS", short: "3PL / WMS", sub: "Redstone, DSV, Maersk", subShort: "Warehouses" },
    { long: "Carriers", short: "Carriers", sub: "UPS, FedEx, DHL", subShort: "Parcel" }
  ];
  // source index to target index; reverse = inbound to the ERP
  var packets = [
    { s: 1, t: 0, label: "856" },
    { s: 2, t: 1, label: "940" },
    { s: 0, t: 2, label: "Label" },
    { s: 1, t: 0, label: "850", reverse: true },
    { s: 0, t: 1, label: "945", reverse: true }
  ];

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, cls) {
    var t = el("text", { x: x, y: y, "text-anchor": "middle" }, parent);
    if (cls) t.setAttribute("class", cls);
    t.textContent = str;
    return t;
  }
  function curve(p) { return "M" + p[0] + "," + p[1] + " C" + p[2] + "," + p[3] + " " + p[4] + "," + p[5] + " " + p[6] + "," + p[7]; }
  function tail(p) { return "C" + p[2] + "," + p[3] + " " + p[4] + "," + p[5] + " " + p[6] + "," + p[7]; }
  function rev(p) { return [p[6], p[7], p[4], p[5], p[2], p[3], p[0], p[1]]; }

  function layout(vertical) {
    if (!vertical) {
      var ys = [60, 184, 308];
      return {
        w: 640, h: 380,
        src: ys.map(function (y) { return { x: 0, y: y, w: 150, h: 52 }; }),
        tgt: ys.map(function (y) { return { x: 490, y: y, w: 150, h: 52 }; }),
        hub: { x: 245, y: 150, w: 150, h: 124 },
        groups: [{ x: 75, y: 36, t: "Systems of record" }, { x: 565, y: 36, t: "Partners and fulfillment" }],
        inP: function (n, h) { var y = n.y + n.h / 2, hy = h.y + h.h / 2, a = n.x + n.w, b = h.x; return [a, y, a + 48, y, b - 48, hy, b, hy]; },
        outP: function (h, n) { var y = n.y + n.h / 2, hy = h.y + h.h / 2, a = h.x + h.w, b = n.x; return [a, hy, a + 48, hy, b - 48, y, b, y]; },
        across: function (h, back) { var hy = h.y + h.h / 2; return "L" + (back ? h.x : h.x + h.w) + "," + hy; },
        lk: "long", sk: "sub"
      };
    }
    var xs = [0, 126, 252];
    return {
      w: 360, h: 610,
      src: xs.map(function (x) { return { x: x, y: 26, w: 108, h: 56 }; }),
      tgt: xs.map(function (x) { return { x: x, y: 528, w: 108, h: 56 }; }),
      hub: { x: 80, y: 246, w: 200, h: 112 },
      groups: [{ x: 180, y: 14, t: "Systems of record" }, { x: 180, y: 604, t: "Partners and fulfillment" }],
      inP: function (n, h) { var x = n.x + n.w / 2, hx = h.x + h.w / 2, a = n.y + n.h, b = h.y; return [x, a, x, a + 70, hx, b - 70, hx, b]; },
      outP: function (h, n) { var x = n.x + n.w / 2, hx = h.x + h.w / 2, a = h.y + h.h, b = n.y; return [hx, a, hx, a + 70, x, b - 70, x, b]; },
      across: function (h, back) { var hx = h.x + h.w / 2; return "L" + hx + "," + (back ? h.y : h.y + h.h); },
      lk: "short", sk: "subShort"
    };
  }

  function node(svg, box, label, sub) {
    var g = el("g", { "class": "f-node" }, svg);
    el("rect", { x: box.x + 0.75, y: box.y + 0.75, width: box.w - 1.5, height: box.h - 1.5, rx: 8 }, g);
    var cx = box.x + box.w / 2;
    text(g, cx, box.y + box.h / 2 - 3, label);
    text(g, cx, box.y + box.h / 2 + 14, sub, "sub");
    return g;
  }

  function build(host, vertical) {
    host.textContent = "";
    var L = layout(vertical);
    var svg = el("svg", { viewBox: "0 0 " + L.w + " " + L.h, "aria-hidden": "true", focusable: "false" }, host);
    var refs = { svg: svg, groups: [], inPaths: [], outPaths: [], sources: [], targets: [], hub: null, packets: [] };

    L.groups.forEach(function (g) { refs.groups.push(text(svg, g.x, g.y, g.t, "f-group")); });

    var ins = L.src.map(function (n) { return L.inP(n, L.hub); });
    var outs = L.tgt.map(function (n) { return L.outP(L.hub, n); });
    ins.forEach(function (p) { refs.inPaths.push(el("path", { d: curve(p), "class": "f-path" }, svg)); });
    outs.forEach(function (p) { refs.outPaths.push(el("path", { d: curve(p), "class": "f-path" }, svg)); });

    L.src.forEach(function (b, i) { refs.sources.push(node(svg, b, sources[i][L.lk], sources[i].sub)); });
    L.tgt.forEach(function (b, i) { refs.targets.push(node(svg, b, targets[i][L.lk], targets[i][L.sk])); });

    // Packets travel under the hub so they read as "processed" while inside it.
    packets.forEach(function (pk) {
      var d = pk.reverse
        ? curve(rev(outs[pk.t])) + " " + L.across(L.hub, true) + " " + tail(rev(ins[pk.s]))
        : curve(ins[pk.s]) + " " + L.across(L.hub, false) + " " + tail(outs[pk.t]);
      var route = el("path", { d: d, fill: "none", stroke: "none" }, svg);
      var w = pk.label.length > 3 ? 46 : 36;
      var g = el("g", { "class": "f-packet", opacity: "0" }, svg);
      el("rect", { x: -w / 2, y: -10, width: w, height: 20, rx: 5 }, g);
      text(g, 0, 4, pk.label);
      refs.packets.push({ g: g, route: route });
    });

    var h = L.hub, hx = h.x + h.w / 2, hub = el("g", { "class": "f-hub" }, svg);
    el("rect", { x: h.x - 6, y: h.y - 6, width: h.w + 12, height: h.h + 12, rx: 14, "class": "glow" }, hub);
    el("rect", { x: h.x, y: h.y, width: h.w, height: h.h, rx: 10, "class": "body" }, hub);
    text(hub, hx, h.y + 34, "PartnerLinQ");
    text(hub, hx, h.y + 54, "Mapping, validation,", "sub");
    text(hub, hx, h.y + 69, "monitoring", "sub");
    el("rect", { x: hx - 52, y: h.y + 84, width: 104, height: 22, rx: 11, "class": "tag" }, hub);
    text(hub, hx, h.y + 99, "LinQ.IQ agents", "tag-text");
    refs.hub = hub;
    refs.hubGlow = hub.querySelector(".glow");
    return refs;
  }

  return { build: build };
})();
