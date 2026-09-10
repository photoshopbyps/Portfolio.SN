export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/profile") {
        return json(await getProfile(env));
      }
      if (url.pathname === "/api/portfolio") {
        return json(await getPortfolio(env));
      }
      if (url.pathname === "/" || url.pathname === "/index.html") {
        const [profile, portfolio] = await Promise.all([
          getProfile(env),
          getPortfolio(env),
        ]);
        return new Response(renderPage(profile, portfolio), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
      return new Response("Not found", { status: 404 });
    } catch (err) {
      return new Response(`Server error: ${err.message}`, { status: 500 });
    }
  },
};

// ---------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------

async function getProfile(env) {
  const profile = await env.DB.prepare(
    "SELECT * FROM profile WHERE id = 1"
  ).first();
  const skills = await env.DB.prepare(
    "SELECT name FROM skills ORDER BY sort_order"
  ).all();
  const tools = await env.DB.prepare(
    "SELECT name FROM tools ORDER BY sort_order"
  ).all();
  const languages = await env.DB.prepare(
    "SELECT name, proficiency FROM languages ORDER BY sort_order"
  ).all();

  return {
    ...profile,
    skills: skills.results.map((s) => s.name),
    tools: tools.results.map((t) => t.name),
    languages: languages.results,
  };
}

async function getPortfolio(env) {
  const items = await env.DB.prepare(
    "SELECT * FROM portfolio_items ORDER BY sort_order"
  ).all();
  return items.results;
}

function json(data) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// ---------------------------------------------------------------------
// Page render
// ---------------------------------------------------------------------

function renderPage(profile, portfolio) {
  const categories = [...new Set(portfolio.map((p) => p.category))];

  const chipsHtml = categories
    .map((c) => `<button class="chip" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
    .join("\n");

  const gridHtml = portfolio
    .map(
      (item, i) => `
      <a class="tile tile--${(i % 5) + 1}" href="${escapeHtml(item.view_url)}" target="_blank" rel="noopener" data-category="${escapeHtml(item.category)}">
        <img src="${escapeHtml(item.thumbnail_url)}" alt="${escapeHtml(item.title)}" loading="lazy" />
        <div class="tile-meta">
          <span class="tile-title">${escapeHtml(item.title)}</span>
          <span class="tile-category">${escapeHtml(item.category)}</span>
        </div>
      </a>`
    )
    .join("\n");

  const skillsHtml = profile.skills
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");
  const toolsHtml = profile.tools
    .map((t) => `<span class="tool">${escapeHtml(t)}</span>`)
    .join("");
  const languagesHtml = profile.languages
    .map((l) => `<li>${escapeHtml(l.name)} <span>${escapeHtml(l.proficiency)}</span></li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(profile.name)} — ${escapeHtml(profile.tagline)}</title>
<meta name="description" content="${escapeHtml(profile.bio)}" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${CSS}
</style>
</head>
<body>

<header class="topbar">
  <span class="mark">${escapeHtml(profile.name)}</span>
  <nav class="topnav">
    <a href="#work">Work</a>
    <a href="#about">About</a>
    <a class="topnav-cta" href="${escapeHtml(profile.upwork_url)}" target="_blank" rel="noopener">Hire me on Upwork</a>
  </nav>
</header>

<section class="hero">
  <div class="hero-main">
    <p class="hero-eyebrow"><span class="dot"></span>${escapeHtml(profile.availability)}</p>
    <h1>${escapeHtml(profile.tagline)}</h1>
    <p class="hero-bio">${escapeHtml(profile.bio)}</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="${escapeHtml(profile.upwork_url)}" target="_blank" rel="noopener">View Upwork profile</a>
      <a class="btn btn-ghost" href="#work">See the work ↓</a>
    </div>
  </div>
  <div class="hero-stats">
    <div class="stat"><span class="stat-value">${escapeHtml(profile.total_earnings)}</span><span class="stat-label">Earned on Upwork</span></div>
    <div class="stat"><span class="stat-value">${escapeHtml(String(profile.total_jobs))}</span><span class="stat-label">Jobs completed</span></div>
    <div class="stat"><span class="stat-value">${escapeHtml(profile.hourly_rate)}</span><span class="stat-label">Starting rate</span></div>
    <div class="stat"><span class="stat-value">${escapeHtml(profile.location)}</span><span class="stat-label">Based in</span></div>
  </div>
</section>

<section class="work" id="work">
  <div class="section-head">
    <h2>Selected work</h2>
    <div class="chips">
      <button class="chip is-active" data-category="all">All</button>
      ${chipsHtml}
    </div>
  </div>
  <div class="grid">
    ${gridHtml}
  </div>
</section>

<section class="about" id="about">
  <div class="about-col">
    <h2>About</h2>
    <p>${escapeHtml(profile.bio)}</p>
    <h3>Languages</h3>
    <ul class="plain-list">${languagesHtml}</ul>
  </div>
  <div class="about-col">
    <h3>Skills</h3>
    <ul class="plain-list">${skillsHtml}</ul>
    <h3>Tools</h3>
    <div class="tools">${toolsHtml}</div>
  </div>
</section>

<footer class="footer">
  <p>${escapeHtml(profile.name)} · ${escapeHtml(profile.location)}</p>
  <a href="${escapeHtml(profile.upwork_url)}" target="_blank" rel="noopener">Work with me on Upwork →</a>
</footer>

<script>
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const category = chip.dataset.category;
    document.querySelectorAll('.tile').forEach((tile) => {
      const show = category === 'all' || tile.dataset.category === category;
      tile.style.display = show ? '' : 'none';
    });
  });
});
</script>

</body>
</html>`;
}

// ---------------------------------------------------------------------
// Styles — minimalist, monochrome, image-forward
// ---------------------------------------------------------------------

const CSS = `
:root {
  --ink: #0F0F0E;
  --paper: #FAFAF8;
  --grey: #706D66;
  --line: #DEDDD7;
  --accent: #D64545;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

h1, h2, h3 {
  font-family: 'Archivo', sans-serif;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0;
}

a { color: inherit; }

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 48px;
  border-bottom: 1px solid var(--line);
}
.mark { font-family: 'Archivo', sans-serif; font-weight: 700; font-size: 18px; }
.topnav { display: flex; align-items: center; gap: 28px; font-size: 14px; }
.topnav a { text-decoration: none; }
.topnav-cta {
  border: 1px solid var(--ink);
  padding: 8px 16px;
  border-radius: 999px;
}

.hero {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 64px;
  padding: 96px 48px 80px;
  border-bottom: 1px solid var(--line);
  align-items: end;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: var(--grey);
  margin: 0 0 24px;
}
.dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--accent);
  display: inline-block;
}
.hero h1 {
  font-size: clamp(40px, 5.5vw, 76px);
  line-height: 1.02;
  max-width: 14ch;
}
.hero-bio {
  max-width: 52ch;
  color: var(--grey);
  font-size: 17px;
  margin: 28px 0 36px;
}
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
.btn {
  display: inline-block;
  padding: 13px 24px;
  text-decoration: none;
  font-size: 14px;
  border-radius: 999px;
  border: 1px solid var(--ink);
}
.btn-primary { background: var(--ink); color: var(--paper); }
.btn-ghost { background: transparent; }

.hero-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 20px;
  border-left: 1px solid var(--line);
  padding-left: 40px;
}
.stat-value {
  display: block;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: 26px;
}
.stat-label {
  display: block;
  color: var(--grey);
  font-size: 13px;
  margin-top: 4px;
}

.work { padding: 80px 48px; border-bottom: 1px solid var(--line); }
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}
.section-head h2 { font-size: 32px; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--grey);
  cursor: pointer;
}
.chip.is-active { border-color: var(--ink); color: var(--ink); }

.grid {
  columns: 4 260px;
  column-gap: 20px;
}
.tile {
  display: block;
  break-inside: avoid;
  margin-bottom: 20px;
  text-decoration: none;
  color: var(--ink);
  position: relative;
  border: 1px solid var(--line);
  overflow: hidden;
}
.tile img {
  width: 100%;
  display: block;
}
.tile--2 img, .tile--4 img { aspect-ratio: 3/4; object-fit: cover; }
.tile-meta {
  padding: 14px 16px;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.tile-title { font-size: 13px; font-weight: 500; }
.tile-category {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--grey);
  white-space: nowrap;
}

.about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  padding: 80px 48px;
  border-bottom: 1px solid var(--line);
}
.about h2 { font-size: 28px; margin-bottom: 20px; }
.about h3 {
  font-size: 14px;
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 500;
  text-transform: none;
  color: var(--grey);
  margin: 32px 0 14px;
}
.about p { color: var(--grey); max-width: 48ch; }
.plain-list { list-style: none; margin: 0; padding: 0; }
.plain-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  font-size: 15px;
}
.plain-list li span { color: var(--grey); font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
.tools { display: flex; flex-wrap: wrap; gap: 8px; }
.tool {
  font-size: 13px;
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--grey);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 48px;
  font-size: 14px;
  color: var(--grey);
}
.footer a { text-decoration: none; color: var(--ink); }

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; padding: 64px 24px; }
  .hero-stats { border-left: none; padding-left: 0; border-top: 1px solid var(--line); padding-top: 24px; }
  .topbar, .work, .about, .footer { padding-left: 24px; padding-right: 24px; }
  .about { grid-template-columns: 1fr; }
  .grid { columns: 2 200px; }
}
`;
