const STORAGE_KEY = "emptyleaf:editor-content";
const defaultContent = deepClone(window.siteContent);

let content = loadContent();
let revealObserver = null;

const editorElements = {
  toggle: document.getElementById("editorToggle"),
  layer: document.getElementById("editorLayer"),
  backdrop: document.getElementById("editorBackdrop"),
  close: document.getElementById("editorClose"),
  form: document.getElementById("editorForm"),
  status: document.getElementById("editorStatus"),
  export: document.getElementById("editorExport"),
  import: document.getElementById("editorImport"),
  reset: document.getElementById("editorReset"),
};

const fieldLabels = {
  meta: "站点信息",
  profile: "主页介绍",
  services: "服务内容",
  projects: "项目案例",
  process: "合作方式",
  timeline: "经历时间线",
  actions: "主要按钮",
  closing: "页尾收尾",
  title: "标题",
  description: "描述",
  url: "网址",
  themeColor: "主题色",
  name: "名称",
  eyebrow: "小标题",
  availability: "状态",
  role: "角色",
  focusArea: "聚焦方向",
  mainRole: "主要角色",
  location: "位置",
  highlights: "亮点列表",
  about: "关于介绍",
  skills: "标签列表",
  contacts: "联系方式",
  label: "标签",
  value: "显示内容",
  href: "链接",
  kicker: "辅助标题",
  summary: "摘要",
  points: "要点",
  year: "年份",
  tags: "标签",
  cta: "按钮文案",
  step: "步骤",
  period: "时间",
  note: "补充说明",
  primary: "主按钮",
  secondary: "次按钮",
};

if (!window.siteContent) {
  throw new Error("siteContent is missing.");
}

renderSite();
buildEditor();
bindEditorEvents();

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function loadContent() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (isPlainObject(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Unable to load saved content.", error);
  }

  return deepClone(defaultContent);
}

function saveContent(message) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    updateEditorStatus(message || `已自动保存在当前浏览器 ${formatTime(new Date())}`);
  } catch (error) {
    console.warn("Unable to save content.", error);
    updateEditorStatus("当前浏览器禁止本地保存，刷新后改动可能会丢失。");
  }
}

function formatTime(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function updateEditorStatus(message) {
  if (editorElements.status) {
    editorElements.status.textContent = message;
  }
}

function clearElement(element) {
  if (element) {
    element.replaceChildren();
  }
}

function text(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || "";
  }
}

function setMeta(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element && value) {
    element.setAttribute(attribute, value);
  }
}

function setLink(id, config) {
  const element = document.getElementById(id);
  if (!element || !config) {
    return;
  }

  element.textContent = config.label || "";
  element.href = config.href || "#";

  if (isExternalUrl(config.href)) {
    element.target = "_blank";
    element.rel = "noreferrer";
  } else {
    element.removeAttribute("target");
    element.removeAttribute("rel");
  }
}

function isExternalUrl(href) {
  return typeof href === "string" && /^https?:\/\//.test(href);
}

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  if (options.type) {
    element.type = options.type;
  }

  if (options.href) {
    element.href = options.href;
  }

  if (options.htmlFor) {
    element.htmlFor = options.htmlFor;
  }

  if (options.id) {
    element.id = options.id;
  }

  return element;
}

function renderSite() {
  window.siteContent = content;

  document.title = content.meta.title || "";
  setMeta('meta[name="description"]', "content", content.meta.description);
  setMeta('meta[name="theme-color"]', "content", content.meta.themeColor);
  setMeta('meta[property="og:title"]', "content", content.meta.title);
  setMeta('meta[property="og:description"]', "content", content.meta.description);
  setMeta('meta[property="og:url"]', "content", content.meta.url);
  setMeta('link[rel="canonical"]', "href", content.meta.url);

  text("brandName", content.profile.name);
  text("heroEyebrow", content.profile.eyebrow);
  text("heroTitle", content.profile.title);
  text("heroAvailability", content.profile.availability);
  text("heroDescription", content.profile.description);
  text("heroRole", content.profile.role);
  text("focusArea", content.profile.focusArea);
  text("mainRole", content.profile.mainRole);
  text("location", content.profile.location);
  text("aboutText", content.profile.about);
  text("footerText", `© ${new Date().getFullYear()} ${content.profile.name || ""}`);
  text("closingEyebrow", content.closing.eyebrow);
  text("closingTitle", content.closing.title);
  text("closingDescription", content.closing.description);
  text("closingNote", content.closing.note);

  setLink("primaryAction", content.actions.primary);
  setLink("secondaryAction", content.actions.secondary);
  setLink("closingPrimaryAction", content.closing.primary);
  setLink("closingSecondaryAction", content.closing.secondary);

  renderHeroHighlights();
  renderSkillTags();
  renderContactList();
  renderServiceList();
  renderProjectList();
  renderProcessList();
  renderTimeline();
  updateRevealObserver();
}

function renderHeroHighlights() {
  const container = document.getElementById("heroHighlights");
  clearElement(container);

  if (!container) {
    return;
  }

  (content.profile.highlights || []).forEach((item) => {
    const listItem = createElement("li", { text: item });
    container.appendChild(listItem);
  });
}

function renderSkillTags() {
  const container = document.getElementById("skillTags");
  clearElement(container);

  if (!container) {
    return;
  }

  (content.profile.skills || []).forEach((skill) => {
    const tag = createElement("span", {
      className: "tag",
      text: skill,
    });
    container.appendChild(tag);
  });
}

function renderContactList() {
  const container = document.getElementById("contactList");
  clearElement(container);

  if (!container) {
    return;
  }

  (content.profile.contacts || []).forEach((entry) => {
    const item = createElement(entry.href ? "a" : "div", {
      className: "contact-item",
    });

    if (entry.href) {
      item.href = entry.href;
      if (isExternalUrl(entry.href)) {
        item.target = "_blank";
        item.rel = "noreferrer";
      }
    }

    item.appendChild(
      createElement("span", {
        className: "contact-label",
        text: entry.label,
      })
    );
    item.appendChild(
      createElement("span", {
        className: "contact-value",
        text: entry.value,
      })
    );

    container.appendChild(item);
  });
}

function renderServiceList() {
  const container = document.getElementById("serviceList");
  clearElement(container);

  if (!container) {
    return;
  }

  (content.services || []).forEach((service, index) => {
    const article = createElement("article", {
      className: "service-card panel reveal",
    });
    article.style.setProperty("--stagger-index", String(index));

    const meta = createElement("div", { className: "service-meta" });
    meta.appendChild(createElement("span", { text: service.label }));
    meta.appendChild(
      createElement("span", {
        className: "muted-pill",
        text: service.kicker,
      })
    );

    const list = createElement("ul", { className: "bullet-list" });
    (service.points || []).forEach((point) => {
      list.appendChild(createElement("li", { text: point }));
    });

    article.appendChild(meta);
    article.appendChild(createElement("h3", { text: service.title }));
    article.appendChild(createElement("p", { text: service.summary }));
    article.appendChild(list);

    container.appendChild(article);
  });
}

function renderProjectList() {
  const container = document.getElementById("projectList");
  clearElement(container);

  if (!container) {
    return;
  }

  (content.projects || []).forEach((project, index) => {
    const article = createElement("article", {
      className: "project-card panel reveal",
    });
    article.style.setProperty("--stagger-index", String(index));

    const meta = createElement("div", { className: "project-meta" });
    meta.appendChild(createElement("span", { text: project.year }));

    if (project.href && project.href !== "#") {
      const link = createElement("a", {
        className: "project-link",
        text: project.cta,
        href: project.href,
      });

      if (isExternalUrl(project.href)) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }

      meta.appendChild(link);
    } else {
      meta.appendChild(
        createElement("span", {
          className: "project-link muted",
          text: project.cta,
        })
      );
    }

    const tagList = createElement("div", { className: "tag-list" });
    (project.tags || []).forEach((tag) => {
      tagList.appendChild(
        createElement("span", {
          className: "tag",
          text: tag,
        })
      );
    });

    article.appendChild(meta);
    article.appendChild(createElement("h3", { text: project.title }));
    article.appendChild(createElement("p", { text: project.summary }));
    article.appendChild(tagList);

    container.appendChild(article);
  });
}

function renderProcessList() {
  const container = document.getElementById("processList");
  clearElement(container);

  if (!container) {
    return;
  }

  (content.process || []).forEach((item, index) => {
    const article = createElement("article", {
      className: "process-card panel reveal",
    });
    article.style.setProperty("--stagger-index", String(index));
    article.appendChild(
      createElement("p", {
        className: "timeline-period",
        text: item.step,
      })
    );
    article.appendChild(createElement("h3", { text: item.title }));
    article.appendChild(createElement("p", { text: item.description }));
    container.appendChild(article);
  });
}

function renderTimeline() {
  const container = document.getElementById("timeline");
  clearElement(container);

  if (!container) {
    return;
  }

  (content.timeline || []).forEach((item, index) => {
    const article = createElement("article", {
      className: "timeline-item panel reveal",
    });
    article.style.setProperty("--stagger-index", String(index));
    article.appendChild(
      createElement("p", {
        className: "timeline-period",
        text: item.period,
      })
    );
    article.appendChild(createElement("h3", { text: item.title }));
    article.appendChild(createElement("p", { text: item.description }));
    container.appendChild(article);
  });
}

function updateRevealObserver() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

function bindEditorEvents() {
  if (!editorElements.toggle) {
    return;
  }

  editorElements.toggle.addEventListener("click", () => {
    setEditorOpen(true);
  });

  editorElements.backdrop.addEventListener("click", () => {
    setEditorOpen(false);
  });

  editorElements.close.addEventListener("click", () => {
    setEditorOpen(false);
  });

  editorElements.export.addEventListener("click", exportContent);
  editorElements.import.addEventListener("change", importContent);
  editorElements.reset.addEventListener("click", resetContent);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !editorElements.layer.hidden) {
      setEditorOpen(false);
    }
  });
}

function setEditorOpen(isOpen) {
  if (!editorElements.layer || !editorElements.toggle) {
    return;
  }

  editorElements.layer.hidden = !isOpen;
  editorElements.toggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("editor-open", isOpen);
}

function buildEditor() {
  if (!editorElements.form) {
    return;
  }

  clearElement(editorElements.form);

  Object.entries(content).forEach(([key, value], index) => {
    const section = createEditorNode(key, value, [key], 0);
    if (section.tagName === "DETAILS") {
      section.open = index < 2;
    }
    editorElements.form.appendChild(section);
  });
}

function createEditorNode(key, value, path, level) {
  if (Array.isArray(value)) {
    return createArrayEditor(key, value, path, level);
  }

  if (isPlainObject(value)) {
    return createObjectEditor(key, value, path, level);
  }

  return createPrimitiveEditor(key, value, path);
}

function createObjectEditor(key, value, path, level) {
  const label = getLabel(key);

  if (level === 0) {
    const details = createElement("details", { className: "editor-section" });
    const summary = createElement("summary", { text: label });
    const body = createElement("div", { className: "editor-section-body" });

    Object.entries(value).forEach(([childKey, childValue]) => {
      body.appendChild(createEditorNode(childKey, childValue, [...path, childKey], level + 1));
    });

    details.appendChild(summary);
    details.appendChild(body);
    return details;
  }

  const fieldset = createElement("fieldset", { className: "editor-group" });
  const legend = createElement("legend", { text: label });
  const body = createElement("div", { className: "editor-group-body" });

  Object.entries(value).forEach(([childKey, childValue]) => {
    body.appendChild(createEditorNode(childKey, childValue, [...path, childKey], level + 1));
  });

  fieldset.appendChild(legend);
  fieldset.appendChild(body);
  return fieldset;
}

function createArrayEditor(key, value, path, level) {
  const fieldset = createElement("fieldset", { className: "editor-group" });
  const legend = createElement("legend", { text: getLabel(key) });
  const body = createElement("div", { className: "editor-group-body" });
  const head = createElement("div", { className: "editor-array-head" });
  const title = createElement("span", {
    className: "editor-field-label",
    text: `${value.length} 项`,
  });
  const actions = createElement("div", { className: "editor-array-actions" });
  const addButton = createMiniButton("新增一项", () => {
    addArrayItem(path);
  });
  const items = createElement("div", { className: "editor-array-items" });

  actions.appendChild(addButton);
  head.appendChild(title);
  head.appendChild(actions);

  value.forEach((item, index) => {
    const itemBox = createElement("div", { className: "editor-array-item" });
    const itemHeader = createElement("div", { className: "editor-array-item-header" });
    const itemTitle = createElement("span", {
      className: "editor-array-item-title",
      text: `${getLabel(key)} ${index + 1}`,
    });
    const itemActions = createElement("div", { className: "editor-array-actions" });

    itemActions.appendChild(
      createMiniButton("上移", () => {
        moveArrayItem(path, index, -1);
      })
    );
    itemActions.appendChild(
      createMiniButton("下移", () => {
        moveArrayItem(path, index, 1);
      })
    );
    itemActions.appendChild(
      createMiniButton(
        "删除",
        () => {
          removeArrayItem(path, index);
        },
        "editor-danger"
      )
    );

    itemHeader.appendChild(itemTitle);
    itemHeader.appendChild(itemActions);
    itemBox.appendChild(itemHeader);

    if (Array.isArray(item) || isPlainObject(item)) {
      itemBox.appendChild(createEditorNode(`${key}Item`, item, [...path, index], level + 1));
    } else {
      itemBox.appendChild(createPrimitiveEditor(`${key}Item`, item, [...path, index]));
    }

    items.appendChild(itemBox);
  });

  body.appendChild(head);
  body.appendChild(items);
  fieldset.appendChild(legend);
  fieldset.appendChild(body);

  return fieldset;
}

function createPrimitiveEditor(key, value, path) {
  if (typeof value === "boolean") {
    const wrapper = createElement("label", { className: "editor-check" });
    const checkbox = createElement("input", { type: "checkbox" });
    checkbox.checked = value;
    checkbox.dataset.path = JSON.stringify(path);
    checkbox.addEventListener("change", handleFieldChange);
    wrapper.appendChild(checkbox);
    wrapper.appendChild(
      createElement("span", {
        className: "editor-field-label",
        text: getLabel(key),
      })
    );
    return wrapper;
  }

  const wrapper = createElement("label", { className: "editor-field" });
  const label = createElement("span", {
    className: "editor-field-label",
    text: getLabel(key),
  });
  const isTextArea = shouldUseTextArea(key, value);
  const control = createElement(isTextArea ? "textarea" : "input", {
    className: isTextArea ? "editor-textarea" : "editor-input",
  });

  if (!isTextArea) {
    control.type = "text";
  }

  control.value = value || "";
  control.dataset.path = JSON.stringify(path);
  control.addEventListener("input", handleFieldChange);

  wrapper.appendChild(label);
  wrapper.appendChild(control);

  return wrapper;
}

function shouldUseTextArea(key, value) {
  if (typeof value !== "string") {
    return false;
  }

  return (
    value.length > 60 ||
    value.includes("\n") ||
    /description|summary|about|note/i.test(key)
  );
}

function getLabel(key) {
  if (fieldLabels[key]) {
    return fieldLabels[key];
  }

  const readable = String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .trim();

  if (!readable) {
    return "内容";
  }

  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

function createMiniButton(label, handler, extraClass = "") {
  const button = createElement("button", {
    className: `editor-mini-button ${extraClass}`.trim(),
    text: label,
    type: "button",
  });
  button.addEventListener("click", handler);
  return button;
}

function handleFieldChange(event) {
  const path = JSON.parse(event.target.dataset.path);
  const previousValue = getValueAtPath(content, path);
  const nextValue =
    typeof previousValue === "boolean" ? event.target.checked : event.target.value;

  setValueAtPath(content, path, nextValue);
  renderSite();
  saveContent();
}

function getValueAtPath(source, path) {
  return path.reduce((current, key) => current[key], source);
}

function setValueAtPath(source, path, value) {
  const parent = getValueAtPath(source, path.slice(0, -1));
  parent[path[path.length - 1]] = value;
}

function addArrayItem(path) {
  const list = getValueAtPath(content, path);
  const fallbackList = getValueAtPath(defaultContent, path) || [];
  const template = list.length > 0 ? list[0] : fallbackList[0];
  list.push(createEmptyLike(template));
  afterStructureChange("已新增一项。");
}

function removeArrayItem(path, index) {
  const list = getValueAtPath(content, path);
  list.splice(index, 1);
  afterStructureChange("已删除一项。");
}

function moveArrayItem(path, index, direction) {
  const list = getValueAtPath(content, path);
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= list.length) {
    return;
  }

  const current = list[index];
  list[index] = list[targetIndex];
  list[targetIndex] = current;
  afterStructureChange("已调整顺序。");
}

function createEmptyLike(example) {
  if (Array.isArray(example)) {
    if (example.length === 0) {
      return [];
    }

    return [createEmptyLike(example[0])];
  }

  if (isPlainObject(example)) {
    const result = {};
    Object.entries(example).forEach(([key, value]) => {
      result[key] = createEmptyLike(value);
    });
    return result;
  }

  if (typeof example === "boolean") {
    return false;
  }

  if (typeof example === "number") {
    return 0;
  }

  if (example === undefined) {
    return "";
  }

  return "";
}

function afterStructureChange(message) {
  renderSite();
  buildEditor();
  saveContent(message);
}

function exportContent() {
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = createElement("a", {
    href: url,
  });

  link.download = "emptyleaf-content.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  updateEditorStatus("已导出当前内容 JSON。");
}

function importContent(event) {
  const [file] = event.target.files || [];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));

      if (!isPlainObject(parsed)) {
        throw new Error("Imported file must be an object.");
      }

      content = parsed;
      renderSite();
      buildEditor();
      saveContent("已导入 JSON 并保存到当前浏览器。");
    } catch (error) {
      console.warn("Unable to import content.", error);
      updateEditorStatus("导入失败，请确认这是有效的 JSON 文件。");
    } finally {
      event.target.value = "";
    }
  };

  reader.readAsText(file);
}

function resetContent() {
  const confirmed = window.confirm("确定要恢复默认模板吗？当前浏览器里保存的改动会被清空。");

  if (!confirmed) {
    return;
  }

  content = deepClone(defaultContent);

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to remove saved content.", error);
  }

  renderSite();
  buildEditor();
  updateEditorStatus("已恢复默认模板。");
}
