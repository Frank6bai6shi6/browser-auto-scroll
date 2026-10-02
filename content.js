(() => {
  if (globalThis.__adjustableAutoScrollInstalled) return;
  globalThis.__adjustableAutoScrollInstalled = true;

  const state = {
    running: false,
    speed: 10,
    direction: 1,
    animationId: null,
    lastTime: 0,
    remainder: 0,
    intervalEnabled: false,
    scrollSeconds: 20,
    pauseSeconds: 60,
    intervalPhase: "scrolling",
    phaseStartedAt: 0,
    target: null,
    selecting: false
  };

  let highlighted = null;

  function isScrollable(element) {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const allowsScroll = /(auto|scroll|overlay)/.test(style.overflowY);
    return allowsScroll && element.scrollHeight > element.clientHeight + 2;
  }

  function findScrollableArea(element) {
    let current = element;
    while (current && current !== document.documentElement) {
      if (isScrollable(current)) return current;
      current = current.parentElement;
    }
    return null;
  }

  function targetName() {
    if (!state.target?.isConnected) return "整个网页";
    const label = state.target.getAttribute("aria-label") || state.target.id;
    return label ? `已选区域：${label}` : "已选择页面内滚动区域";
  }

  function clearHighlight() {
    if (!highlighted) return;
    highlighted.style.removeProperty("outline");
    highlighted.style.removeProperty("outline-offset");
    highlighted = null;
  }

  function finishSelecting() {
    state.selecting = false;
    clearHighlight();
    document.removeEventListener("mousemove", onSelectMove, true);
    document.removeEventListener("click", onSelectClick, true);
    document.removeEventListener("keydown", onSelectKeydown, true);
    document.querySelector("#__auto_scroll_picker_tip")?.remove();
  }

  function onSelectMove(event) {
    const candidate = findScrollableArea(event.target);
    if (candidate === highlighted) return;
    clearHighlight();
    if (candidate) {
      highlighted = candidate;
      highlighted.style.setProperty("outline", "3px solid #2f66ed", "important");
      highlighted.style.setProperty("outline-offset", "-3px", "important");
    }
  }

  function onSelectClick(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const candidate = findScrollableArea(event.target);
    if (candidate) state.target = candidate;
    finishSelecting();
  }

  function onSelectKeydown(event) {
    if (event.key === "Escape") finishSelecting();
  }

  function beginSelecting() {
    stop();
    finishSelecting();
    state.selecting = true;

    const tip = document.createElement("div");
    tip.id = "__auto_scroll_picker_tip";
    tip.textContent = "请点击要自动滚动的区域 · 按 Esc 取消";
    Object.assign(tip.style, {
      position: "fixed", top: "18px", left: "50%", transform: "translateX(-50%)",
      zIndex: "2147483647", padding: "11px 18px", borderRadius: "10px",
      background: "#172033", color: "white", font: "14px Microsoft YaHei UI, sans-serif",
      boxShadow: "0 6px 24px rgba(0,0,0,.28)", pointerEvents: "none"
    });
    document.documentElement.appendChild(tip);
    document.addEventListener("mousemove", onSelectMove, true);
    document.addEventListener("click", onSelectClick, true);
    document.addEventListener("keydown", onSelectKeydown, true);
  }

  function frame(now) {
    if (!state.running) return;
    if (!state.lastTime) state.lastTime = now;
    if (!state.phaseStartedAt) state.phaseStartedAt = now;
    const elapsedSeconds = Math.min((now - state.lastTime) / 1000, 0.1);
    state.lastTime = now;

    if (state.intervalEnabled) {
      const phaseSeconds = state.intervalPhase === "scrolling"
        ? state.scrollSeconds
        : state.pauseSeconds;
      if (now - state.phaseStartedAt >= phaseSeconds * 1000) {
        state.intervalPhase = state.intervalPhase === "scrolling" ? "paused" : "scrolling";
        state.phaseStartedAt = now;
        state.remainder = 0;
      }
    }

    if (!state.intervalEnabled || state.intervalPhase === "scrolling") {
      state.remainder += state.speed * state.direction * elapsedSeconds;
      const wholePixels = Math.trunc(state.remainder);
      if (wholePixels !== 0) {
        if (state.target?.isConnected) state.target.scrollTop += wholePixels;
        else window.scrollBy(0, wholePixels);
        state.remainder -= wholePixels;
      }
    }
    state.animationId = requestAnimationFrame(frame);
  }

  function start() {
    if (state.running) return;
    state.running = true;
    state.lastTime = 0;
    state.remainder = 0;
    state.intervalPhase = "scrolling";
    state.phaseStartedAt = 0;
    state.animationId = requestAnimationFrame(frame);
  }

  function stop() {
    state.running = false;
    state.lastTime = 0;
    state.remainder = 0;
    state.phaseStartedAt = 0;
    if (state.animationId !== null) cancelAnimationFrame(state.animationId);
    state.animationId = null;
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "auto-scroll:get-state") {
      sendResponse({
        running: state.running,
        speed: state.speed,
        direction: state.direction,
        intervalEnabled: state.intervalEnabled,
        scrollSeconds: state.scrollSeconds,
        pauseSeconds: state.pauseSeconds,
        intervalPhase: state.intervalPhase,
        hasTarget: Boolean(state.target?.isConnected),
        targetName: targetName()
      });
      return;
    }

    if (message?.type === "auto-scroll:select-target") {
      beginSelecting();
      sendResponse({ selecting: true });
      return;
    }

    if (message?.type === "auto-scroll:update") {
      const requestedSpeed = Number(message.speed);
      state.speed = Number.isFinite(requestedSpeed)
        ? Math.max(0, Math.min(1000, requestedSpeed))
        : 10;
      state.direction = Number(message.direction) === -1 ? -1 : 1;
      state.intervalEnabled = Boolean(message.intervalEnabled);
      state.scrollSeconds = Math.max(1, Math.min(3600, Number(message.scrollSeconds) || 20));
      state.pauseSeconds = Math.max(1, Math.min(3600, Number(message.pauseSeconds) || 60));
      if (message.running === true) start();
      if (message.running === false) stop();
      sendResponse({
        running: state.running,
        speed: state.speed,
        direction: state.direction,
        intervalEnabled: state.intervalEnabled,
        scrollSeconds: state.scrollSeconds,
        pauseSeconds: state.pauseSeconds,
        intervalPhase: state.intervalPhase,
        hasTarget: Boolean(state.target?.isConnected),
        targetName: targetName()
      });
    }
  });
})();
