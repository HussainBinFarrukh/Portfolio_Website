// Page motion. GSAP (ScrollTrigger, SplitText, ScrambleText, DrawSVG,
// MotionPath) + Lenis smooth scroll. Everything degrades to a complete,
// static page when scripts fail or reduced motion is requested.
(function () {
  var root = document.documentElement;
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var hasGsap = window.gsap && window.ScrollTrigger;
  if (!hasGsap) {
    root.classList.remove("anim");
    var flowHost = document.getElementById("flow");
    if (flowHost && window.FlowDiagram) FlowDiagram.build(flowHost, flowHost.clientWidth < 600);
    if (window.Brain) Brain.build(document.querySelector(".brain"));
    loopWork();
    return;
  }
  window.__animReady = true;

  var plugins = [ScrollTrigger];
  ["SplitText", "ScrambleTextPlugin", "DrawSVGPlugin", "MotionPathPlugin"].forEach(function (n) { if (window[n]) plugins.push(window[n]); });
  gsap.registerPlugin.apply(gsap, plugins);
  var hasSplit = !!window.SplitText, hasScramble = !!window.ScrambleTextPlugin, hasDraw = !!window.DrawSVGPlugin, hasMotion = !!window.MotionPathPlugin;

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>";

  // Smooth scroll --------------------------------------------------------
  if (!reduce && window.Lenis) {
    var lenis = new Lenis({ anchors: { offset: -72 }, lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Fonts change line breaks, so split text only after they load (max 1.5s wait).
  var fontsReady = Promise.race([
    document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
    new Promise(function (r) { setTimeout(r, 1500); })
  ]);

  fontsReady.then(function () {
    heroIntro();
    progressBar();
    revealTitles();
    stats();
    flow();
    agents();
    loopWork();
    workReveal();
    timeline();
    pointerEffects();
    ScrollTrigger.refresh();
  });

  // Hero -------------------------------------------------------------------
  function heroIntro() {
    var title = document.querySelector(".hero-title");
    var scr = document.querySelector(".scramble");
    if (reduce) { root.classList.remove("anim"); return; }

    var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    var words = [title];
    if (hasSplit) {
      var split = SplitText.create(title, { type: "lines,words", mask: "lines", linesClass: "line" });
      words = split.words;
    }
    gsap.set([".hero-kicker", ".hero-focus", ".lede", ".hero-links > *", ".where"], { autoAlpha: 0, y: 18 });
    gsap.set(words, { yPercent: 115 });
    root.classList.remove("anim");

    tl.to(".hero-kicker", { autoAlpha: 1, y: 0, duration: 0.9 }, 0.15)
      .to(words, { yPercent: 0, duration: 1.15, stagger: 0.035 }, 0.25)
      .to(".hero-focus", { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.7")
      .to(".lede", { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.75")
      .to(".hero-links > *", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07 }, "-=0.7")
      .to(".where", { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.6");

    if (scr && hasScramble) {
      var list = scr.dataset.words.split("|"), i = 0;
      tl.add(function cycle() {
        i = (i + 1) % list.length;
        gsap.to(scr, { duration: 1.1, scrambleText: { text: list[i], chars: CHARS, speed: 0.5 } });
        gsap.delayedCall(2.8, cycle);
      }, "+=1.4");
    }

    // Hero content drifts up and fades as you scroll away
    gsap.to(".hero-inner", { yPercent: -12, autoAlpha: 0.15, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  function progressBar() {
    if (reduce) return;
    gsap.to(".scroll-progress span", { scaleX: 1, ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  }

  // Section titles rise out of a line mask --------------------------------
  function revealTitles() {
    if (reduce || !hasSplit) return;
    document.querySelectorAll(".reveal-title, .footer-title").forEach(function (h) {
      var s = SplitText.create(h, { type: "lines,words", mask: "lines" });
      gsap.from(s.words, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.03,
        scrollTrigger: { trigger: h, start: "top 85%", once: true } });
    });
  }

  // Count-up stats ---------------------------------------------------------
  function stats() {
    var nums = document.querySelectorAll(".stat-num");
    if (reduce) return;
    nums.forEach(function (n) {
      if (!n.dataset.to) return;
      var to = parseFloat(n.dataset.to), dec = parseInt(n.dataset.decimals || "0", 10), pre = n.dataset.prefix || "", suf = n.dataset.suffix || "", o = { v: 0 };
      n.textContent = pre + (0).toFixed(dec) + suf;
      gsap.to(o, { v: to, duration: 1.8, ease: "power3.out",
        onUpdate: function () { var v = o.v.toFixed(dec); if (n.dataset.group) v = Number(v).toLocaleString("en-US"); n.textContent = pre + v + suf; },
        scrollTrigger: { trigger: n, start: "top 90%", once: true } });
    });
    gsap.from(".stat", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: ".stats", start: "top 88%", once: true } });
  }

  // Integration landscape: intro on first view, then the lifecycle loops
  // while the section is on screen.
  function flow() {
    var host = document.getElementById("flow");
    if (!host || !window.FlowDiagram) return;
    var stepsEl = document.querySelectorAll(".lifecycle li");
    var setStep = function (k) {
      stepsEl.forEach(function (li, i) { li.classList.toggle("on", i === k); li.classList.toggle("done", i < k); });
    };
    var mm = gsap.matchMedia();
    mm.add({ wide: "(min-width: 600px)", narrow: "(max-width: 599px)", reduce: "(prefers-reduced-motion: reduce)" }, function (ctx) {
      var r = FlowDiagram.build(host, ctx.conditions.narrow);
      if (ctx.conditions.reduce || !hasMotion) {
        stepsEl.forEach(function (li) { li.classList.add("done"); });
        return;
      }
      var loop = FlowDiagram.lifecycle(r, { scramble: hasScramble, onStep: setStep });
      var nodes = Object.keys(r.nodes).map(function (k) { return r.nodes[k]; });
      var paths = Object.keys(r.edges).map(function (k) { return r.edges[k]; });
      var intro = gsap.timeline({ paused: true, onComplete: function () { loop.play(0); } });
      intro.from(nodes, { autoAlpha: 0, scale: 0.9, transformOrigin: "50% 50%", stagger: 0.05, duration: 0.5, ease: "back.out(1.6)" }, 0)
        .from(r.hub, { autoAlpha: 0, scale: 0.92, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(1.4)" }, 0.2);
      if (hasDraw) intro.fromTo(paths, { drawSVG: "0%" }, { drawSVG: "100%", stagger: 0.04, duration: 0.7, ease: "power1.inOut" }, 0.4);
      if (r.edgeLabels.length) intro.from(r.edgeLabels, { autoAlpha: 0, duration: 0.4, stagger: 0.03 }, 0.9);
      gsap.to(r.hubGlow, { scale: 1.02, transformOrigin: "50% 50%", duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });

      var started = false;
      ScrollTrigger.create({
        trigger: ".flow-figure", start: "top 80%", end: "bottom top",
        onToggle: function (self) {
          if (self.isActive && !started) { started = true; intro.play(); }
          else if (started && intro.progress() === 1) { self.isActive ? loop.resume() : loop.pause(); }
        }
      });
      return function () { loop.kill(); intro.kill(); setStep(-1); };
    });
  }

  // Agent orchestration: pinned, scroll-driven run ------------------------
  function agents() {
    var section = document.querySelector(".agents-section");
    if (!section) return;
    var stage = document.getElementById("stage");
    var wrap = stage.parentElement;
    var q = function (k) { return stage.querySelector('[data-k="' + k + '"]'); };
    var cards = { request: q("request"), orch: q("orch"), cfg: q("cfg"), map: q("map"), mon: q("mon"), exc: q("exc"), gate: q("gate"), prod: q("prod") };
    var agentKeys = ["cfg", "map", "mon", "exc"];
    var labels = ["Request arrives", "Orchestrator plans the run", "Configuration agent", "Mapping agent", "Monitoring agent", "Exception agent", "Human review", "Promoted to production"];
    var stepN = section.querySelector(".run-step-n"), stepText = section.querySelector(".run-step-text"), bar = section.querySelector(".run-bar span");
    var beams = {};
    stage.querySelectorAll(".beam-live path").forEach(function (p) { beams[p.dataset.beam] = p; });
    var beamStep = { "b-req": 1, "b-cfg": 2, "b-map": 3, "b-mon": 4, "b-exc": 5, "b-gate": 6, "b-prod": 7 };
    var brain = window.Brain ? Brain.build(stage.querySelector(".brain")) : null;
    var hint = section.querySelector(".scroll-hint");
    // How busy the brain looks at each step: planning and agents working run hottest.
    var brainLevel = [0.25, 0.9, 0.75, 0.75, 0.75, 0.85, 0.4, 0.3];

    // Store the final text of every animated line once.
    var texts = stage.querySelectorAll(".log li, .request-text, .orch-plan");
    texts.forEach(function (t) { t.dataset.full = t.textContent; });

    function finalState() {
      agentKeys.forEach(function (k) { cards[k].classList.remove("working"); cards[k].classList.add("done"); cards[k].querySelector(".state").textContent = "done"; });
      cards.gate.classList.add("approved");
      cards.gate.querySelector(".gate-text").textContent = "4 changes approved by analyst";
      cards.gate.querySelector(".gate-btn").textContent = "Approved";
      cards.prod.classList.add("live");
      stepN.textContent = "8"; stepText.textContent = labels[7];
      if (bar) bar.style.transform = "scaleX(1)";
    }

    function applyStep(k, approved, live) {
      if (brain) brain.setActivity(brainLevel[k]);
      if (hint) hint.classList.toggle("gone", k >= 7);
      stepN.textContent = String(k + 1);
      stepText.textContent = labels[k];
      agentKeys.forEach(function (key, i) {
        var c = cards[key], s = i + 2, state = c.querySelector(".state");
        var st = k < s ? "idle" : k === s ? "working" : "done";
        c.classList.toggle("working", st === "working");
        c.classList.toggle("done", st === "done");
        if (state.textContent !== st) state.textContent = st;
      });
      cards.gate.classList.toggle("approved", approved);
      cards.gate.querySelector(".gate-text").textContent = approved ? "4 changes approved by analyst" : "4 changes waiting for an analyst";
      cards.gate.querySelector(".gate-btn").textContent = approved ? "Approved" : "Approve";
      cards.prod.classList.toggle("live", live);
      Object.keys(beams).forEach(function (b) { beams[b].style.opacity = beamStep[b] === k ? 1 : 0.4; });
    }

    var mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", finalState);

    // Desktop: fixed 960x640 board, scaled to fit, pinned and scrubbed.
    mm.add("(min-width: 820px) and (prefers-reduced-motion: no-preference)", function () {
      // Fit the board to the space left under the heading, by width and by height.
      var head = section.querySelector(".agents-head");
      function fit() {
        var pad = parseFloat(getComputedStyle(wrap).paddingLeft) || 0;
        var availW = wrap.clientWidth - pad * 2;
        var availH = window.innerHeight - head.offsetHeight - 84 - 26 - 20;
        var s = Math.max(0.55, Math.min(1, availW / 960, availH / 640));
        stage.style.transform = "scale(" + s + ")";
        stage.style.marginLeft = Math.max(0, (availW - 960 * s) / 2) + "px";
        wrap.style.height = 640 * s + "px";
      }
      fit();
      ScrollTrigger.addEventListener("refreshInit", fit);

      texts.forEach(function (t) { t.textContent = ""; });
      gsap.set(Object.values(cards), { autoAlpha: 0, y: 16 });
      gsap.set(cards.orch, { scale: 0.9 });
      if (hasDraw) gsap.set(Object.values(beams), { drawSVG: "0%" });

      var tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        // Read state from the smoothed timeline, not raw scroll, so labels match the visuals.
        onUpdate: function () {
          var t = tl.time(), k = 0;
          for (var i = 0; i < marks.length; i++) if (t >= marks[i]) k = i;
          applyStep(k, t >= approveAt, t >= liveAt);
          if (bar) bar.style.transform = "scaleX(" + tl.progress() + ")";
        },
        scrollTrigger: { trigger: section, start: "top top", end: "+=3200", pin: ".agents-pin", scrub: 0.8, anticipatePin: 1 }
      });
      var marks = [];
      var write = function (el, d) {
        return hasScramble
          ? gsap.to(el, { duration: d || 0.8, scrambleText: { text: el.dataset.full, chars: CHARS, speed: 0.6 }, ease: "none" })
          : gsap.to(el, { duration: d || 0.4, onStart: function () { el.textContent = el.dataset.full; } });
      };
      var draw = function (b, d) { return hasDraw ? gsap.to(beams[b], { drawSVG: "100%", duration: d || 0.6, ease: "power1.inOut" }) : gsap.to({}, { duration: 0.1 }); };

      // 1 request
      marks.push(0);
      tl.to(cards.request, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .add(write(cards.request.querySelector(".request-text"), 1.2), 0.3);
      // 2 orchestrator
      marks.push(tl.duration() + 0.2);
      tl.add(draw("b-req"), marks[1])
        .to(cards.orch, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)" }, marks[1] + 0.4)
        .fromTo(cards.orch.querySelector(".orch-ring"), { autoAlpha: 0.9, scale: 0.9 }, { autoAlpha: 0, scale: 1.25, duration: 0.9 }, marks[1] + 0.7)
        .add(write(cards.orch.querySelector(".orch-plan"), 1), marks[1] + 0.8);
      // 3-6 agents
      agentKeys.forEach(function (key) {
        var at = tl.duration() + 0.3;
        marks.push(at);
        tl.add(draw("b-" + key), at)
          .to(cards[key], { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.35);
        cards[key].querySelectorAll(".log li").forEach(function (li, j) { tl.add(write(li, 0.7), at + 0.7 + j * 0.55); });
      });
      // 7 human review
      var g = tl.duration() + 0.3;
      marks.push(g);
      tl.add(draw("b-gate"), g)
        .to(cards.gate, { autoAlpha: 1, y: 0, duration: 0.5 }, g + 0.35)
        .fromTo(cards.gate.querySelector(".gate-btn"), { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1 }, g + 1.3);
      var approveAt = g + 1.4;
      // 8 production
      var p = tl.duration() + 0.3;
      marks.push(p);
      tl.add(draw("b-prod", 0.4), p)
        .to(cards.prod, { autoAlpha: 1, y: 0, duration: 0.5 }, p + 0.25)
        .fromTo(cards.prod.querySelector(".check"), { scale: 0.4 }, { scale: 1, duration: 0.5, ease: "back.out(2.5)" }, p + 0.6);
      var liveAt = p + 0.6;
      tl.to({}, { duration: 0.8 }); // hold the finished state before unpinning

      applyStep(0, false, false);

      return function () {
        ScrollTrigger.removeEventListener("refreshInit", fit);
        stage.style.transform = ""; stage.style.marginLeft = ""; wrap.style.height = "";
        texts.forEach(function (t) { t.textContent = t.dataset.full; });
      };
    });

    // Mobile: stacked cards, each one plays its part as it enters.
    mm.add("(max-width: 819px) and (prefers-reduced-motion: no-preference)", function () {
      finalState();
      agentKeys.forEach(function (k) { cards[k].classList.remove("done"); cards[k].querySelector(".state").textContent = "idle"; });
      Object.keys(cards).forEach(function (key) {
        var c = cards[key];
        gsap.from(c, { autoAlpha: 0, y: 24, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: c, start: "top 88%", once: true,
            onEnter: function () {
              if (agentKeys.indexOf(key) > -1) {
                c.classList.add("working"); c.querySelector(".state").textContent = "working";
                gsap.delayedCall(1.6, function () { c.classList.remove("working"); c.classList.add("done"); c.querySelector(".state").textContent = "done"; });
              }
              if (hasScramble) c.querySelectorAll(".log li, .request-text, .orch-plan").forEach(function (li, j) {
                gsap.fromTo(li, { scrambleText: { text: "" } }, { delay: 0.2 + j * 0.3, duration: 0.8, scrambleText: { text: li.dataset.full, chars: CHARS, speed: 0.6 } });
              });
            } } });
      });
    });
  }

  // Implementations: a continuous loop. The card set is cloned once so the
  // track can slide by exactly one set width; CSS runs the motion.
  function loopWork() {
    var track = document.querySelector(".work-track");
    if (!track || track.classList.contains("looping")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var set = track.querySelector(".work-set");
    var clone = set.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    track.appendChild(clone);
    track.classList.add("looping");
  }

  function workReveal() {
    if (reduce) return;
    gsap.from(".work-loop", { autoAlpha: 0, x: 80, duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: ".work", start: "top 75%", once: true } });
  }

  // Career line draws as you scroll -----------------------------------------
  function timeline() {
    if (reduce) return;
    gsap.to(".timeline-line span", { scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: 0.5 } });
    gsap.utils.toArray(".tl-org").forEach(function (o) {
      gsap.from(o.querySelectorAll(".org, .roles li, .org-note"), { x: -20, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: o, start: "top 80%", once: true } });
    });
  }

  // Pointer effects: magnetic buttons and spotlight cards --------------------
  function pointerEffects() {
    if (!finePointer) return;
    document.querySelectorAll(".spot").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", (e.clientX - r.left) + "px");
        c.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
    if (reduce) return;
    document.querySelectorAll(".magnetic").forEach(function (b) {
      var xTo = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" });
      var yTo = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
      });
      b.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
    });
  }
})();
