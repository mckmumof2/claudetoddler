let activeCategory = "All";
let searchQuery = "";

function getFilteredVideos() {
  return VIDEOS.filter(v => {
    const matchCat = activeCategory === "All" || v.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      v.title.toLowerCase().includes(q) ||
      v.channel.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
}

function videoCardHTML(v) {
  return `
    <div class="video-card fade-in" onclick="openVideo('${v.id}')">
      <div class="thumb-wrap">
        <img src="${v.thumb}" alt="${escHtml(v.title)}" loading="lazy">
        <div class="play-icon">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <span class="thumb-duration">${v.duration}</span>
      </div>
      <div class="card-info">
        <div class="card-title">${escHtml(v.title)}</div>
        <div class="card-meta">
          <span class="card-channel">${escHtml(v.channel)}</span>
          <span class="dot">·</span>
          <span>${v.views} views</span>
          <span class="dot">·</span>
          <span>${v.date}</span>
        </div>
      </div>
    </div>`;
}

function renderGrid() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;
  const videos = getFilteredVideos().slice(0, 12);
  if (videos.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">No videos found for "${escHtml(searchQuery)}"</div>`;
    return;
  }
  grid.innerHTML = videos.map(videoCardHTML).join("");
}

function renderCategories() {
  const wrap = document.getElementById("categoryChips");
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map(cat => `
    <span class="chip${cat === activeCategory ? " active" : ""}" data-cat="${cat}">${cat}</span>
  `).join("");
  wrap.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.cat;
      renderCategories();
      renderGrid();
    });
  });
}

function renderHero() {
  const wrap = document.getElementById("heroWrap");
  if (!wrap) return;
  const featured = VIDEOS.find(v => v.featured) || VIDEOS[0];
  wrap.innerHTML = `
    <div class="hero" onclick="openVideo('${featured.id}')">
      <img src="${featured.thumb}" alt="${escHtml(featured.title)}">
      <div class="hero-overlay">
        <span class="hero-badge">Featured</span>
        <div class="hero-title">${escHtml(featured.title)}</div>
        <div class="hero-meta">${escHtml(featured.channel)} · ${featured.views} views · ${featured.date}</div>
        <div class="hero-actions">
          <button class="btn-play">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Now
          </button>
        </div>
      </div>
    </div>`;
}

function openVideo(id) {
  window.location.href = `video.html?id=${id}`;
}

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

function initSearch() {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  if (!input) return;
  const run = () => { searchQuery = input.value.trim(); renderGrid(); };
  btn?.addEventListener("click", run);
  input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
}

// Index page bootstrap
function initIndex() {
  renderHero();
  renderCategories();
  renderGrid();
  initSearch();
}

if (document.getElementById("videoGrid")) initIndex();
