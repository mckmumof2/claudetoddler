function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

function formatViews(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1).replace(/\.0$/,"") + "M";
  if (n >= 1e3) return (n/1e3).toFixed(0) + "K";
  return n;
}

function sidebarCardHTML(v) {
  return `
    <div class="sidebar-card" onclick="loadVideo('${v.id}')">
      <div class="sidebar-thumb">
        <img src="${v.thumb}" alt="${escHtml(v.title)}" loading="lazy">
        <span class="sidebar-duration">${v.duration}</span>
      </div>
      <div class="sidebar-info">
        <div class="sidebar-title-text">${escHtml(v.title)}</div>
        <div class="sidebar-meta">${escHtml(v.channel)}</div>
        <div class="sidebar-meta">${v.views} views · ${v.date}</div>
      </div>
    </div>`;
}

let liked = false;
let subscribed = false;

function loadVideo(id) {
  const video = VIDEOS.find(v => v.id === id);
  if (!video) { document.querySelector(".player-layout").innerHTML = '<p style="padding:40px;color:#888">Video not found.</p>'; return; }

  const ch = CHANNELS[video.channelId] || { name: video.channel, subs: "—", avatar: video.channel[0] };
  liked = false;
  subscribed = false;

  // Update URL without reload
  history.replaceState(null, "", `video.html?id=${id}`);
  document.title = `${video.title} — VideoPortal`;

  // Player
  document.getElementById("playerWrap").innerHTML = `
    <video controls poster="${video.thumb}" preload="none" style="position:absolute;inset:0;width:100%;height:100%;">
      <source src="" type="video/mp4">
      <div style="position:absolute;inset:0;background:#111;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#555"><path d="M8 5v14l11-7z"/></svg>
        <p style="color:#555;font-size:13px">Demo — no video file attached</p>
      </div>
    </video>`;

  // Poster fallback (show thumb since no real video)
  document.getElementById("playerWrap").innerHTML = `
    <div style="position:absolute;inset:0;background:#111;display:flex;align-items:center;justify-content:center;flex-direction:column;cursor:pointer" onclick="this.innerHTML='<div style=position:absolute;inset:0;background:#000;display:flex;align-items:center;justify-content:center><p style=color:#555;font-size:13px>Demo player — no video source</p></div>'">
      <img src="${video.thumb}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.7" alt="">
      <svg width="72" height="72" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" style="filter:drop-shadow(0 2px 8px rgba(0,0,0,.5));position:relative;z-index:1"><path d="M8 5v14l11-7z"/></svg>
      <p style="position:relative;z-index:1;color:rgba(255,255,255,0.7);font-size:13px;margin-top:12px">Click to play</p>
    </div>`;

  // Info
  document.getElementById("playerTitle").textContent = video.title;
  document.getElementById("playerViews").textContent = `${video.views} views`;
  document.getElementById("playerDate").textContent = video.date;
  document.getElementById("playerLikeBtn").innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
    <span id="likeCount">${video.likes}</span>`;

  // Channel
  document.getElementById("channelAvatar").textContent = ch.avatar;
  document.getElementById("channelName").textContent = ch.name;
  document.getElementById("channelSubs").textContent = `${ch.subs} subscribers`;

  // Description
  const short = video.description.split("\n")[0];
  const full = video.description;
  const descEl = document.getElementById("descriptionEl");
  descEl.className = "description";
  descEl.innerHTML = `<span class="desc-short">${escHtml(short)}<span style="color:#aaa"> …more</span></span><span class="desc-full">${escHtml(full).replace(/\n/g,"<br>")}</span>`;
  descEl.onclick = () => descEl.classList.toggle("expanded");

  // Like button
  document.getElementById("playerLikeBtn").onclick = () => {
    liked = !liked;
    document.getElementById("playerLikeBtn").classList.toggle("liked", liked);
    showToast(liked ? "Added to liked videos" : "Removed from liked videos");
  };

  // Subscribe
  const subBtn = document.getElementById("subscribeBtn");
  subBtn.className = "btn-subscribe";
  subBtn.textContent = "Subscribe";
  subBtn.onclick = () => {
    subscribed = !subscribed;
    subBtn.textContent = subscribed ? "Subscribed" : "Subscribe";
    subBtn.classList.toggle("subscribed", subscribed);
    showToast(subscribed ? `Subscribed to ${ch.name}` : `Unsubscribed from ${ch.name}`);
  };

  // Share
  document.getElementById("shareBtn").onclick = () => {
    navigator.clipboard?.writeText(location.href).then(() => showToast("Link copied!")).catch(() => showToast("Copy the URL to share"));
  };

  // Sidebar: related (same category, exclude current)
  const related = VIDEOS.filter(v => v.id !== id).sort((a,b) => {
    if (a.category === video.category && b.category !== video.category) return -1;
    if (b.category === video.category && a.category !== video.category) return 1;
    return b.viewsNum - a.viewsNum;
  }).slice(0, 8);

  document.getElementById("sidebarList").innerHTML = related.map(sidebarCardHTML).join("");
}

function initPlayer() {
  const id = getParam("id") || VIDEOS[0].id;
  loadVideo(id);

  // Search wire-up (reuses nav)
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");
  const run = () => { if (input.value.trim()) window.location.href = `index.html?q=${encodeURIComponent(input.value.trim())}`; };
  btn?.addEventListener("click", run);
  input?.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
}

if (document.getElementById("playerWrap")) initPlayer();
