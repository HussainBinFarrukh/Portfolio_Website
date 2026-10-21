// Hero diagram: orders moving from ERP systems through PartnerLinQ to
// trading partners, 3PLs, and carriers. Drawn as SVG; a vertical layout
// is used on narrow screens. Packets are skipped when reduced motion is set.
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var host = document.getElementById("flow");
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  if (!host) return;

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
  // from source index to target index; reverse = inbound to the ERP
  var packets = [
    { s: 1, t: 0, label: "856" },
    { s: 2, t: 1, label: "940" },
    { s: 0, t: 2, label: "Label" },
    { s: 1, t: 0, label: "850", reverse: true }
  ];

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mode = null;

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

  function layout(vertical) {
    if (!vertical) {
      var nodeW = 150, nodeH = 52, ys = [60, 184, 308];
      return {
        w: 640, h: 390,
        src: ys.map(function (y) { return { x: 0, y: y, w: nodeW, h: nodeH }; }),
        tgt: ys.map(function (y) { return { x: 490, y: y, w: nodeW, h: nodeH }; }),
        hub: { x: 245, y: 150, w: 150, h: 124 },
        groups: [{ x: 75, y: 36, t: "Systems of record" }, { x: 565, y: 36, t: "Partners and fulfillment" }],
        inPath: function (n, hub) {
          var y = n.y + n.h / 2, hy = hub.y + hub.h / 2, x0 = n.x + n.w, x1 = hub.x;
          return [x0, y, x0 + 48, y, x1 - 48, hy, x1, hy];
        },
        outPath: function (hub, n) {
          var y = n.y + n.h / 2, hy = hub.y + hub.h / 2, x0 = hub.x + hub.w, x1 = n.x;
          return [x0, hy, x0 + 48, hy, x1 - 48, y, x1, y];
        },
        through: function (hub) { var hy = hub.y + hub.h / 2; return "L" + (hub.x + hub.w) + "," + hy; },
        labelKey: "long", subKey: "sub"
      };
    }
    var vw = 108, vh = 56, xs = [0, 126, 252];
    return {
      w: 360, h: 610,
      src: xs.map(function (x) { return { x: x, y: 26, w: vw, h: vh }; }),
      tgt: xs.map(function (x) { return { x: x, y: 528, w: vw, h: vh }; }),
      hub: { x: 80, y: 246, w: 200, h: 112 },
      groups: [{ x: 180, y: 14, t: "Systems of record" }, { x: 180, y: 604, t: "Partners and fulfillment" }],
      inPath: function (n, hub) {
        var x = n.x + n.w / 2, hx = hub.x + hub.w / 2, y0 = n.y + n.h, y1 = hub.y;
        return [x, y0, x, y0 + 70, hx, y1 - 70, hx, y1];
      },
      outPath: function (hub, n) {
        var x = n.x + n.w / 2, hx = hub.x + hub.w / 2, y0 = hub.y + hub.h, y1 = n.y;
        return [hx, y0, hx, y0 + 70, x, y1 - 70, x, y1];
      },
      through: function (hub) { var hx = hub.x + hub.w / 2; return "L" + hx + "," + (hub.y + hub.h); },
      labelKey: "short", subKey: "subShort"
    };
  }

  function curve(p) { return "M" + p[0] + "," + p[1] + " C" + p[2] + "," + p[3] + " " + p[4] + "," + p[5] + " " + p[6] + "," + p[7]; }
  function curveTail(p) { return "C" + p[2] + "," + p[3] + " " + p[4] + "," + p[5] + " " + p[6] + "," + p[7]; }
  function reversePts(p) { return [p[6], p[7], p[4], p[5], p[2], p[3], p[0], p[1]]; }

  function node(svg, box, label, sub, vertical) {
    var g = el("g", { "class": "f-node" }, svg);
    el("rect", { x: box.x + 0.75, y: box.y + 0.75, width: box.w - 1.5, height: box.h - 1.5, rx: 6 }, g);
    var cx = box.x + box.w / 2;
    text(g, cx, box.y + box.h / 2 - (vertical ? 3 : 2), label);
    text(g, cx, box.y + box.h / 2 + 14, sub, "sub");
  }

  function render() {
    var vertical = host.clientWidth < 440;
    var next = vertical ? "v" : "h";
    if (next === mode) return;
    mode = next;
    host.textContent = "";

    var L = layout(vertical);
    var svg = el("svg", { viewBox: "0 0 " + L.w + " " + L.h, "aria-hidden": "true", focusable: "false" }, host);

    L.groups.forEach(function (g) { text(svg, g.x, g.y, g.t, "f-group"); });

    var ins = L.src.map(function (n) { return L.inPath(n, L.hub); });
    var outs = L.tgt.map(function (n) { return L.outPath(L.hub, n); });
    ins.concat(outs).forEach(function (p) { el("path", { d: curve(p), "class": "f-path" }, svg); });

    L.src.forEach(function (b, i) { node(svg, b, sources[i][L.labelKey], sources[i].sub, vertical); });
    L.tgt.forEach(function (b, i) { node(svg, b, targets[i][L.labelKey], targets[i][L.subKey], vertical); });

    var h = L.hub, hx = h.x + h.w / 2;

    if (!reduce) drawPackets(svg, L, ins, outs, vertical, h, hx);
    drawHub(svg, h, hx);
  }

  function drawHub(svg, h, hx) {
    var hub = el("g", { "class": "f-hub" }, svg);
    el("rect", { x: h.x, y: h.y, width: h.w, height: h.h, rx: 8 }, hub);
    text(hub, hx, h.y + 34, "PartnerLinQ");
    text(hub, hx, h.y + 54, "Mapping, validation,", "sub");
    text(hub, hx, h.y + 69, "monitoring", "sub");
    el("rect", { x: hx - 50, y: h.y + 84, width: 100, height: 22, rx: 11, "class": "tag" }, hub);
    text(hub, hx, h.y + 99, "LinQ.IQ agents", "tag-text");

  }

  function drawPackets(svg, L, ins, outs, vertical, h, hx) {

    var dur = 6;
    packets.forEach(function (pk, i) {
      var a = ins[pk.s], b = outs[pk.t], d;
      if (!pk.reverse) {
        d = curve(a) + " " + L.through(L.hub) + " " + curveTail(b);
      } else {
        var rb = reversePts(b), ra = reversePts(a), hubIn = vertical
          ? "L" + hx + "," + h.y
          : "L" + h.x + "," + (h.y + h.h / 2);
        d = curve(rb) + " " + hubIn + " " + curveTail(ra);
      }
      var w = pk.label.length > 3 ? 46 : 36;
      var g = el("g", { "class": "f-packet", opacity: "0" }, svg);
      el("rect", { x: -w / 2, y: -10, width: w, height: 20, rx: 4 }, g);
      var t = text(g, 0, 4, pk.label);
      t.setAttribute("text-anchor", "middle");
      var begin = (i * dur / packets.length) + "s";
      el("animateMotion", { path: d, dur: dur + "s", begin: begin, repeatCount: "indefinite", calcMode: "paced" }, g);
      el("animate", { attributeName: "opacity", values: "0;1;1;0", keyTimes: "0;0.08;0.9;1", dur: dur + "s", begin: begin, repeatCount: "indefinite" }, g);
    });
  }

  render();
  var timer;
  window.addEventListener("resize", function () { clearTimeout(timer); timer = setTimeout(render, 120); });
})();
