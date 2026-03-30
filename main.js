const content = window.siteContent;

if (!content) {
  throw new Error("siteContent is missing.");
}

const text = (id, value) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
};

const link = (id, config) => {
  const element = document.getElementById(id);
  if (!element || !config) {
    return;
  }

  element.textContent = config.label;
  element.href = config.href;
};

const setMeta = (selector, attribute, value) => {
  const element = document.querySelector(selector);
  if (element && value) {
    element.setAttribute(attribute, value);
  }
};

document.title = content.meta.title;
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
text("footerText", `© ${new Date().getFullYear()} ${content.profile.name}`);
text("closingEyebrow", content.closing.eyebrow);
text("closingTitle", content.closing.title);
text("closingDescription", content.closing.description);
text("closingNote", content.closing.note);

link("primaryAction", content.actions.primary);
link("secondaryAction", content.actions.secondary);
link("closingPrimaryAction", content.closing.primary);
link("closingSecondaryAction", content.closing.secondary);

const heroHighlights = document.getElementById("heroHighlights");
if (heroHighlights) {
  content.profile.highlights.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    heroHighlights.appendChild(li);
  });
}

const skillTags = document.getElementById("skillTags");
if (skillTags) {
  content.profile.skills.forEach((skill) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = skill;
    skillTags.appendChild(span);
  });
}

const contactList = document.getElementById("contactList");
if (contactList) {
  content.profile.contacts.forEach((entry) => {
    const item = document.createElement(entry.href ? "a" : "div");
    item.className = "contact-item";

    if (entry.href) {
      item.href = entry.href;
      item.target = entry.href.startsWith("http") ? "_blank" : "_self";
      if (item.target === "_blank") {
        item.rel = "noreferrer";
      }
    }

    item.innerHTML = `
      <span class="contact-label">${entry.label}</span>
      <span class="contact-value">${entry.value}</span>
    `;

    contactList.appendChild(item);
  });
}

const serviceList = document.getElementById("serviceList");
if (serviceList) {
  content.services.forEach((service, index) => {
    const article = document.createElement("article");
    article.className = "service-card panel reveal";
    article.style.setProperty("--stagger-index", String(index));

    const points = service.points.map((point) => `<li>${point}</li>`).join("");

    article.innerHTML = `
      <div class="service-meta">
        <span>${service.label}</span>
        <span class="muted-pill">${service.kicker}</span>
      </div>
      <h3>${service.title}</h3>
      <p>${service.summary}</p>
      <ul class="bullet-list">${points}</ul>
    `;

    serviceList.appendChild(article);
  });
}

const projectList = document.getElementById("projectList");
if (projectList) {
  content.projects.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project-card panel reveal";
    article.style.setProperty("--stagger-index", String(index));

    const tags = project.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    const hasLink = project.href && project.href !== "#";
    const actionMarkup = hasLink
      ? `<a class="project-link" href="${project.href}" target="_blank" rel="noreferrer">${project.cta}</a>`
      : `<span class="project-link muted">${project.cta}</span>`;

    article.innerHTML = `
      <div class="project-meta">
        <span>${project.year}</span>
        ${actionMarkup}
      </div>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="tag-list">${tags}</div>
    `;

    projectList.appendChild(article);
  });
}

const processList = document.getElementById("processList");
if (processList) {
  content.process.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "process-card panel reveal";
    article.style.setProperty("--stagger-index", String(index));
    article.innerHTML = `
      <p class="timeline-period">${item.step}</p>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;
    processList.appendChild(article);
  });
}

const timeline = document.getElementById("timeline");
if (timeline) {
  content.timeline.forEach((item, index) => {
    const block = document.createElement("article");
    block.className = "timeline-item panel reveal";
    block.style.setProperty("--stagger-index", String(index));
    block.innerHTML = `
      <p class="timeline-period">${item.period}</p>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;
    timeline.appendChild(block);
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
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
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("revealed");
  });
}
