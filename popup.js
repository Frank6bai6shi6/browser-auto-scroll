const speedInput = document.querySelector("#speed");
const speedNumber = document.querySelector("#speed-number");
const intervalEnabled = document.querySelector("#interval-enabled");
const intervalSettings = document.querySelector("#interval-settings");
const scrollSeconds = document.querySelector("#scroll-seconds");
const pauseSeconds = document.querySelector("#pause-seconds");
const toggleButton = document.querySelector("#toggle");
const stopButton = document.querySelector("#stop-all");
const selectAreaButton = document.querySelector("#select-area");
const statusText = document.querySelector("#status");
const targetStatus = document.querySelector("#target-status");
const messageText = document.querySelector("#message");

let running = false;
let targetName = "整个网页";

function selectedDirection() {
  return Number(document.querySelector('input[name="direction"]:checked').value);
}

function render() {
  toggleButton.textContent = running ? "暂停滚动" : "开始滚动";
  toggleButton.classList.toggle("running", running);
  statusText.textContent = running ? "当前页面正在滚动" : "当前页面已停止";
  targetStatus.textContent = `当前目标：${targetName}`;
  intervalSettings.classList.toggle("disabled", !intervalEnabled.checked);
}

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("找不到当前标签页");
  if (!/^https?:/i.test(tab.url || "")) {
    throw new Error("此页面受浏览器保护，请在普通网页中使用");
  }
  return tab;
}

async function ensureContentScript(tabId) {
  try {
    return await chrome.tabs.sendMessage(tabId, { type: "auto-scroll:get-state" });
  } catch {
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
    return chrome.tabs.sendMessage(tabId, { type: "auto-scroll:get-state" });
  }
}

async function sendUpdate(nextRunning = running) {
  const tab = await activeTab();
  await ensureContentScript(tab.id);
  const settings = {
    type: "auto-scroll:update",
    running: nextRunning,
    speed: Number(speedNumber.value),
    direction: selectedDirection(),
    intervalEnabled: intervalEnabled.checked,
    scrollSeconds: Number(scrollSeconds.value),
    pauseSeconds: Number(pauseSeconds.value)
  };
  const state = await chrome.tabs.sendMessage(tab.id, settings);
  running = state.running;
  targetName = state.targetName || "整个网页";
  await chrome.storage.local.set({
    speed: state.speed,
    direction: state.direction,
    intervalEnabled: state.intervalEnabled,
    scrollSeconds: state.scrollSeconds,
    pauseSeconds: state.pauseSeconds
  });
  render();
}

async function safely(action) {
  messageText.textContent = "";
  toggleButton.disabled = true;
  stopButton.disabled = true;
  selectAreaButton.disabled = true;
  try {
    await action();
  } catch (error) {
    messageText.textContent = error.message || "操作失败，请刷新网页后重试";
  } finally {
    toggleButton.disabled = false;
    stopButton.disabled = false;
    selectAreaButton.disabled = false;
  }
}

speedInput.addEventListener("input", () => {
  speedNumber.value = speedInput.value;
  render();
  if (running) safely(() => sendUpdate(true));
});

speedNumber.addEventListener("input", () => {
  if (speedNumber.value === "") return;
  const value = Math.max(0, Math.min(1000, Number(speedNumber.value)));
  speedInput.value = String(Math.min(120, value));
  if (running) safely(() => sendUpdate(true));
});

speedNumber.addEventListener("change", () => {
  const value = Math.max(0, Math.min(1000, Number(speedNumber.value) || 0));
  speedNumber.value = String(value);
  speedInput.value = String(Math.min(120, value));
  render();
  safely(() => sendUpdate(running));
});

document.querySelectorAll('input[name="direction"]').forEach((radio) => {
  radio.addEventListener("change", () => safely(() => sendUpdate(running)));
});

toggleButton.addEventListener("click", () => safely(() => sendUpdate(!running)));
stopButton.addEventListener("click", () => safely(() => sendUpdate(false)));
intervalEnabled.addEventListener("change", () => {
  render();
  safely(() => sendUpdate(running));
});
[scrollSeconds, pauseSeconds].forEach((input) => {
  input.addEventListener("change", () => safely(() => sendUpdate(running)));
});
selectAreaButton.addEventListener("click", () => safely(async () => {
  const tab = await activeTab();
  await ensureContentScript(tab.id);
  await chrome.tabs.sendMessage(tab.id, { type: "auto-scroll:select-target" });
  window.close();
}));

async function initialize() {
  const saved = await chrome.storage.local.get({
    speed: 10, direction: 1, intervalEnabled: false, scrollSeconds: 20, pauseSeconds: 60
  });
  const savedSpeed = Math.max(0, Math.min(1000, Number(saved.speed) || 0));
  speedNumber.value = savedSpeed;
  speedInput.value = Math.min(120, savedSpeed);
  intervalEnabled.checked = saved.intervalEnabled;
  scrollSeconds.value = saved.scrollSeconds;
  pauseSeconds.value = saved.pauseSeconds;
  const directionRadio = document.querySelector(`input[name="direction"][value="${saved.direction}"]`);
  if (directionRadio) directionRadio.checked = true;
  render();

  try {
    const tab = await activeTab();
    const state = await ensureContentScript(tab.id);
    running = Boolean(state.running);
    targetName = state.targetName || "整个网页";
    const currentSpeed = state.speed ?? saved.speed;
    const normalizedSpeed = Math.max(0, Math.min(1000, Number(currentSpeed) || 0));
    speedNumber.value = normalizedSpeed;
    speedInput.value = Math.min(120, normalizedSpeed);
    intervalEnabled.checked = state.intervalEnabled ?? saved.intervalEnabled;
    scrollSeconds.value = state.scrollSeconds ?? saved.scrollSeconds;
    pauseSeconds.value = state.pauseSeconds ?? saved.pauseSeconds;
    const currentDirection = document.querySelector(`input[name="direction"][value="${state.direction}"]`);
    if (currentDirection) currentDirection.checked = true;
    render();
  } catch (error) {
    messageText.textContent = error.message;
  }
}

initialize();
