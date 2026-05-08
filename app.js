const STORAGE_KEY = "flexilayout-studio-state-v1";

const defaultState = {
  mode: "flex",
  containerWidth: "100%",
  containerHeight: "520px",
  itemCount: 8,

  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flexWrap: "wrap",
  gapSize: "16px",

  gridColumns: "repeat(4, 1fr)",
  gridRows: "repeat(2, minmax(110px, 1fr))",
  gridAutoFlow: "row",
  gridJustifyItems: "stretch",
  gridAlignItems: "stretch",
  gridGap: "16px",

  paddingSize: "20px",
  borderRadius: "24px",
  borderWidth: "1px",

  bgStyle: "aurora",
  itemStyle: "gradient",
  primaryHue: 265,
  accentHue: 190,

  itemMinWidth: "120px",
  itemMinHeight: "110px",
  itemPadding: "16px",
  itemRadius: "18px",

  device: "desktop",
  theme: "dark"
};

let state = loadSavedState() || { ...defaultState };

const refs = {
  modeFlexBtn: document.getElementById("modeFlexBtn"),
  modeGridBtn: document.getElementById("modeGridBtn"),
  flexControls: document.getElementById("flexControls"),
  gridControls: document.getElementById("gridControls"),

  containerWidth: document.getElementById("containerWidth"),
  containerHeight: document.getElementById("containerHeight"),
  itemCount: document.getElementById("itemCount"),
  itemCountValue: document.getElementById("itemCountValue"),

  flexDirection: document.getElementById("flexDirection"),
  justifyContent: document.getElementById("justifyContent"),
  alignItems: document.getElementById("alignItems"),
  flexWrap: document.getElementById("flexWrap"),
  gapSize: document.getElementById("gapSize"),

  gridColumns: document.getElementById("gridColumns"),
  gridRows: document.getElementById("gridRows"),
  gridAutoFlow: document.getElementById("gridAutoFlow"),
  gridJustifyItems: document.getElementById("gridJustifyItems"),
  gridAlignItems: document.getElementById("gridAlignItems"),
  gridGap: document.getElementById("gridGap"),

  paddingSize: document.getElementById("paddingSize"),
  borderRadius: document.getElementById("borderRadius"),
  borderWidth: document.getElementById("borderWidth"),

  bgStyle: document.getElementById("bgStyle"),
  itemStyle: document.getElementById("itemStyle"),
  primaryHue: document.getElementById("primaryHue"),
  primaryHueValue: document.getElementById("primaryHueValue"),
  accentHue: document.getElementById("accentHue"),
  accentHueValue: document.getElementById("accentHueValue"),

  itemMinWidth: document.getElementById("itemMinWidth"),
  itemMinHeight: document.getElementById("itemMinHeight"),
  itemPadding: document.getElementById("itemPadding"),
  itemRadius: document.getElementById("itemRadius"),

  previewFrame: document.getElementById("previewFrame"),
  layoutPreview: document.getElementById("layoutPreview"),
  itemTemplate: document.getElementById("previewItemTemplate"),

  cssOutput: document.getElementById("cssOutput"),
  htmlOutput: document.getElementById("htmlOutput"),

  copyCssBtn: document.getElementById("copyCssBtn"),
  copyHtmlBtn: document.getElementById("copyHtmlBtn"),
  downloadJsonBtn: document.getElementById("downloadJsonBtn"),
  toggleThemeBtn: document.getElementById("toggleThemeBtn"),
  randomizeBtn: document.getElementById("randomizeBtn"),
  formatCssBtn: document.getElementById("formatCssBtn"),
  formatHtmlBtn: document.getElementById("formatHtmlBtn"),
  resetBtn: document.getElementById("resetBtn"),
  saveStateBtn: document.getElementById("saveStateBtn"),
  loadStateBtn: document.getElementById("loadStateBtn"),
  clearStateBtn: document.getElementById("clearStateBtn"),

  statMode: document.getElementById("statMode"),
  statItems: document.getElementById("statItems"),
  statGap: document.getElementById("statGap"),
  statSurface: document.getElementById("statSurface"),

  toast: document.getElementById("toast")
};

const deviceButtons = Array.from(document.querySelectorAll(".device-btn"));
const presetButtons = Array.from(document.querySelectorAll(".preset-btn"));

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
}

function saveStateSilently() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showToast(message) {
  refs.toast.textContent = message;
  refs.toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    refs.toast.classList.remove("show");
  }, 2200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function syncInputsFromState() {
  Object.keys(refs).forEach((key) => {
    if (!refs[key] || !("value" in refs[key])) return;
    if (state[key] !== undefined) refs[key].value = state[key];
  });

  refs.itemCountValue.textContent = state.itemCount;
  refs.primaryHueValue.textContent = state.primaryHue;
  refs.accentHueValue.textContent = state.accentHue;

  refs.modeFlexBtn.classList.toggle("active", state.mode === "flex");
  refs.modeGridBtn.classList.toggle("active", state.mode === "grid");
  refs.modeFlexBtn.setAttribute("aria-selected", String(state.mode === "flex"));
  refs.modeGridBtn.setAttribute("aria-selected", String(state.mode === "grid"));

  refs.flexControls.classList.toggle("hidden", state.mode !== "flex");
  refs.gridControls.classList.toggle("hidden", state.mode !== "grid");

  deviceButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.device === state.device);
  });

  document.body.classList.toggle("light-theme", state.theme === "light");
}

function setCSSVariables() {
  document.documentElement.style.setProperty("--primary-hue", state.primaryHue);
  document.documentElement.style.setProperty("--accent-hue", state.accentHue);
}

function getPreviewWidth(device) {
  if (device === "tablet") return "820px";
  if (device === "mobile") return "390px";
  return "100%";
}

function createPreviewItems(count) {
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= count; i += 1) {
    const clone = refs.itemTemplate.content.firstElementChild.cloneNode(true);
    clone.classList.add(`item-style-${state.itemStyle}`);
    clone.style.setProperty("--item-min-width", state.itemMinWidth);
    clone.style.setProperty("--item-min-height", state.itemMinHeight);
    clone.style.setProperty("--item-padding", state.itemPadding);
    clone.style.setProperty("--item-radius", state.itemRadius);

    clone.querySelector(".item-index").textContent = `${String(i).padStart(2, "0")}`;
    clone.querySelector(".item-meta").textContent =
      state.mode === "flex" ? "Flex Item" : "Grid Item";

    if (state.mode === "grid") {
      if (i % 5 === 0 && state.itemCount > 5) {
        clone.style.gridColumn = "span 2";
      }
      if (i % 7 === 0 && state.itemCount > 6) {
        clone.style.gridRow = "span 2";
      }
    }

    fragment.appendChild(clone);
  }

  return fragment;
}

function buildContainerStyles() {
  const baseStyles = [
    `width: ${state.containerWidth};`,
    `height: ${state.containerHeight};`,
    `padding: ${state.paddingSize};`,
    `border-radius: ${state.borderRadius};`,
    `border: ${state.borderWidth} solid rgba(255,255,255,0.08);`,
    `box-sizing: border-box;`
  ];

  if (state.mode === "flex") {
    baseStyles.push(
      "display: flex;",
      `flex-direction: ${state.flexDirection};`,
      `justify-content: ${state.justifyContent};`,
      `align-items: ${state.alignItems};`,
      `flex-wrap: ${state.flexWrap};`,
      `gap: ${state.gapSize};`
    );
  } else {
    baseStyles.push(
      "display: grid;",
      `grid-template-columns: ${state.gridColumns};`,
      `grid-template-rows: ${state.gridRows};`,
      `grid-auto-flow: ${state.gridAutoFlow};`,
      `justify-items: ${state.gridJustifyItems};`,
      `align-items: ${state.gridAlignItems};`,
      `gap: ${state.gridGap};`
    );
  }

  return baseStyles.join(" ");
}

function renderPreview() {
  setCSSVariables();
  refs.layoutPreview.style.width = getPreviewWidth(state.device);

  refs.layoutPreview.innerHTML = "";

  const container = document.createElement("div");
  container.className = `layout-container layout-surface-${state.bgStyle}`;
  container.setAttribute("style", buildContainerStyles());
  container.appendChild(createPreviewItems(state.itemCount));

  refs.layoutPreview.appendChild(container);
}

function generateCSS() {
  const gapValue = state.mode === "flex" ? state.gapSize : state.gridGap;

  const containerRules = state.mode === "flex"
    ? [
        "display: flex;",
        `flex-direction: ${state.flexDirection};`,
        `justify-content: ${state.justifyContent};`,
        `align-items: ${state.alignItems};`,
        `flex-wrap: ${state.flexWrap};`,
        `gap: ${state.gapSize};`
      ]
    : [
        "display: grid;",
        `grid-template-columns: ${state.gridColumns};`,
        `grid-template-rows: ${state.gridRows};`,
        `grid-auto-flow: ${state.gridAutoFlow};`,
        `justify-items: ${state.gridJustifyItems};`,
        `align-items: ${state.gridAlignItems};`,
        `gap: ${state.gridGap};`
      ];

  const itemExtraRule = state.mode === "grid"
    ? `
.layout-item:nth-child(5n) {
  grid-column: span 2;
}

.layout-item:nth-child(7n) {
  grid-row: span 2;
}`
    : "";

  return `.layout-container {
  width: ${state.containerWidth};
  height: ${state.containerHeight};
  padding: ${state.paddingSize};
  border-radius: ${state.borderRadius};
  border: ${state.borderWidth} solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
  ${containerRules.join("\n  ")}
}

.layout-item {
  min-width: ${state.itemMinWidth};
  min-height: ${state.itemMinHeight};
  padding: ${state.itemPadding};
  border-radius: ${state.itemRadius};
  color: #ffffff;
  box-sizing: border-box;
}

:root {
  --primary-hue: ${state.primaryHue};
  --accent-hue: ${state.accentHue};
}

.layout-theme-${state.itemStyle} .layout-item {
${generateItemStyleCSS(state.itemStyle).split("\n").map(line => `  ${line}`).join("\n")}
}
${itemExtraRule}

/* Suggested background surface: ${state.bgStyle} */
/* Suggested gap snapshot: ${gapValue} */
`;
}

function generateItemStyleCSS(style) {
  const map = {
    gradient: `background: linear-gradient(
  135deg,
  hsl(var(--primary-hue) 95% 64%),
  hsl(var(--accent-hue) 90% 58%)
);
box-shadow: 0 16px 30px hsl(var(--primary-hue) 90% 55% / 0.22);`,
    glass: `background: linear-gradient(
  135deg,
  rgba(255,255,255,0.16),
  rgba(255,255,255,0.08)
);
border: 1px solid rgba(255,255,255,0.18);
backdrop-filter: blur(10px);`,
    solid: `background: hsl(var(--primary-hue) 58% 44%);
border: 1px solid hsl(var(--primary-hue) 60% 58% / 0.35);`,
    outline: `background: rgba(255,255,255,0.03);
border: 1px dashed hsl(var(--accent-hue) 90% 70% / 0.7);
box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);`
  };

  return map[style] || map.gradient;
}

function generateHTML() {
  let items = "";

  for (let i = 1; i <= state.itemCount; i += 1) {
    items += `  <div class="layout-item">Item ${i}</div>\n`;
  }

  return `<section class="layout-container layout-theme-${state.itemStyle}">
${items}</section>`;
}

function updateOutputs() {
  refs.cssOutput.textContent = generateCSS();
  refs.htmlOutput.textContent = generateHTML();
}

function updateStats() {
  refs.statMode.textContent = state.mode[0].toUpperCase() + state.mode.slice(1);
  refs.statItems.textContent = state.itemCount;
  refs.statGap.textContent = state.mode === "flex" ? state.gapSize : state.gridGap;
  refs.statSurface.textContent = state.bgStyle[0].toUpperCase() + state.bgStyle.slice(1);
}

function refresh() {
  syncInputsFromState();
  renderPreview();
  updateOutputs();
  updateStats();
  saveStateSilently();
}

function updateStateFromInput(id, transform = (value) => value) {
  const element = refs[id];
  if (!element) return;

  element.addEventListener("input", (event) => {
    state[id] = transform(event.target.value);
    refresh();
  });

  element.addEventListener("change", (event) => {
    state[id] = transform(event.target.value);
    refresh();
  });
}

function copyText(text, successMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(successMessage))
      .catch(() => fallbackCopyText(text, successMessage));
  } else {
    fallbackCopyText(text, successMessage);
  }
}

function fallbackCopyText(text, successMessage) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  showToast(successMessage);
}

function exportJSON() {
  const payload = {
    app: "FlexiLayout Studio",
    version: 1,
    exportedAt: new Date().toISOString(),
    state
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "flexilayout-config.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("JSON exported");
}

function setMode(mode) {
  state.mode = mode;
  refresh();
}

function setDevice(device) {
  state.device = device;
  refresh();
}

function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomizeState() {
  state.mode = randomChoice(["flex", "grid"]);
  state.itemCount = Math.floor(Math.random() * 10) + 4;
  state.containerHeight = randomChoice(["420px", "480px", "520px", "580px"]);
  state.bgStyle = randomChoice(["aurora", "midnight", "sunset", "frost"]);
  state.itemStyle = randomChoice(["gradient", "glass", "solid", "outline"]);
  state.primaryHue = Math.floor(Math.random() * 361);
  state.accentHue = Math.floor(Math.random() * 361);
  state.paddingSize = randomChoice(["16px", "20px", "24px", "28px"]);
  state.borderRadius = randomChoice(["18px", "24px", "28px", "32px"]);
  state.itemRadius = randomChoice(["14px", "18px", "22px", "26px"]);
  state.gapSize = randomChoice(["10px", "14px", "16px", "20px", "24px"]);
  state.gridGap = state.gapSize;

  if (state.mode === "flex") {
    state.flexDirection = randomChoice(["row", "column"]);
    state.justifyContent = randomChoice(["flex-start", "center", "space-between", "space-around", "space-evenly"]);
    state.alignItems = randomChoice(["stretch", "center", "flex-start", "flex-end"]);
    state.flexWrap = randomChoice(["wrap", "nowrap"]);
  } else {
    state.gridColumns = randomChoice([
      "repeat(3, 1fr)",
      "repeat(4, 1fr)",
      "2fr 1fr 1fr",
      "repeat(auto-fit, minmax(140px, 1fr))"
    ]);
    state.gridRows = randomChoice([
      "repeat(2, minmax(110px, 1fr))",
      "repeat(3, minmax(90px, 1fr))",
      "auto"
    ]);
    state.gridAutoFlow = randomChoice(["row", "dense", "row dense"]);
    state.gridJustifyItems = randomChoice(["stretch", "center", "start"]);
    state.gridAlignItems = randomChoice(["stretch", "center", "start"]);
  }

  refresh();
  showToast("Layout randomized");
}

function applyPreset(name) {
  const presets = {
    hero: {
      mode: "grid",
      containerHeight: "540px",
      itemCount: 5,
      gridColumns: "1.4fr 1fr 1fr",
      gridRows: "repeat(2, minmax(140px, 1fr))",
      gridAutoFlow: "row",
      gridJustifyItems: "stretch",
      gridAlignItems: "stretch",
      gridGap: "18px",
      bgStyle: "aurora",
      itemStyle: "glass",
      paddingSize: "24px",
      borderRadius: "28px"
    },
    gallery: {
      mode: "grid",
      containerHeight: "520px",
      itemCount: 10,
      gridColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gridRows: "auto",
      gridAutoFlow: "dense",
      gridGap: "14px",
      bgStyle: "frost",
      itemStyle: "gradient"
    },
    dashboard: {
      mode: "grid",
      containerHeight: "560px",
      itemCount: 8,
      gridColumns: "2fr 1fr 1fr",
      gridRows: "repeat(3, minmax(100px, 1fr))",
      gridAutoFlow: "row dense",
      gridGap: "16px",
      bgStyle: "midnight",
      itemStyle: "solid"
    },
    cards: {
      mode: "flex",
      containerHeight: "420px",
      itemCount: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
      flexWrap: "wrap",
      gapSize: "16px",
      bgStyle: "sunset",
      itemStyle: "gradient"
    }
  };

  state = {
    ...state,
    ...presets[name]
  };

  refresh();
  showToast(`${capitalize(name)} preset applied`);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function resetToDefault() {
  state = { ...defaultState };
  refresh();
  showToast("Reset to default");
}

function saveManually() {
  saveStateSilently();
  showToast("Layout saved locally");
}

function loadManually() {
  const saved = loadSavedState();
  if (!saved) {
    showToast("No saved layout found");
    return;
  }
  state = { ...defaultState, ...saved };
  refresh();
  showToast("Saved layout loaded");
}

function clearSaved() {
  localStorage.removeItem(STORAGE_KEY);
  showToast("Saved state cleared");
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  refresh();
  showToast(`${capitalize(state.theme)} theme enabled`);
}

function initializeBindings() {
  updateStateFromInput("containerWidth");
  updateStateFromInput("containerHeight");
  updateStateFromInput("itemCount", (value) => Number(value));

  updateStateFromInput("flexDirection");
  updateStateFromInput("justifyContent");
  updateStateFromInput("alignItems");
  updateStateFromInput("flexWrap");
  updateStateFromInput("gapSize");

  updateStateFromInput("gridColumns");
  updateStateFromInput("gridRows");
  updateStateFromInput("gridAutoFlow");
  updateStateFromInput("gridJustifyItems");
  updateStateFromInput("gridAlignItems");
  updateStateFromInput("gridGap");

  updateStateFromInput("paddingSize");
  updateStateFromInput("borderRadius");
  updateStateFromInput("borderWidth");

  updateStateFromInput("bgStyle");
  updateStateFromInput("itemStyle");
  updateStateFromInput("primaryHue", (value) => Number(value));
  updateStateFromInput("accentHue", (value) => Number(value));

  updateStateFromInput("itemMinWidth");
  updateStateFromInput("itemMinHeight");
  updateStateFromInput("itemPadding");
  updateStateFromInput("itemRadius");

  refs.modeFlexBtn.addEventListener("click", () => setMode("flex"));
  refs.modeGridBtn.addEventListener("click", () => setMode("grid"));

  deviceButtons.forEach((btn) => {
    btn.addEventListener("click", () => setDevice(btn.dataset.device));
  });

  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
  });

  refs.copyCssBtn.addEventListener("click", () => {
    copyText(refs.cssOutput.textContent, "CSS copied");
  });

  refs.copyHtmlBtn.addEventListener("click", () => {
    copyText(refs.htmlOutput.textContent, "HTML copied");
  });

  refs.downloadJsonBtn.addEventListener("click", exportJSON);
  refs.toggleThemeBtn.addEventListener("click", toggleTheme);
  refs.randomizeBtn.addEventListener("click", randomizeState);
  refs.formatCssBtn.addEventListener("click", updateOutputs);
  refs.formatHtmlBtn.addEventListener("click", updateOutputs);
  refs.resetBtn.addEventListener("click", resetToDefault);
  refs.saveStateBtn.addEventListener("click", saveManually);
  refs.loadStateBtn.addEventListener("click", loadManually);
  refs.clearStateBtn.addEventListener("click", clearSaved);

  window.addEventListener("keydown", (event) => {
    const ctrlOrCmd = event.ctrlKey || event.metaKey;

    if (ctrlOrCmd && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveManually();
    }

    if (ctrlOrCmd && event.key.toLowerCase() === "r") {
      event.preventDefault();
      randomizeState();
    }

    if (ctrlOrCmd && event.key.toLowerCase() === "e") {
      event.preventDefault();
      exportJSON();
    }
  });
}

initializeBindings();
refresh();
