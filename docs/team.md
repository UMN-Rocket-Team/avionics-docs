---
layout: default
title: Meet the Team
nav_order: 2
permalink: /docs/team/
---

<div class="hero">
  <h1>Meet the Avionics Team</h1>
  <p>The people guiding design, development, testing, and documentation of every custom flight computer the team builds.</p>
</div>

<div class="team-grid">

  <div class="team-card">
    <div class="avatar">
      <img src="{{ '/assets/images/team/mohamed-mohamed.jpg' | relative_url }}" alt="Mohamed-dek Mohamed"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="avatar-fallback">MM</div>
    </div>
    <h3>Mohamed-dek Mohamed</h3>
    <p class="role">Avionics Lead</p>
    <a class="email" href="mailto:moha2063@umn.edu">moha2063@umn.edu</a>
  </div>

  <div class="team-card">
    <div class="avatar">
      <img src="{{ '/assets/images/team/kevin-salitros.jpg' | relative_url }}" alt="Kevin Salitros"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="avatar-fallback">KS</div>
    </div>
    <h3>Kevin Salitros</h3>
    <p class="role">Hardware Lead</p>
    <a class="email" href="mailto:salit047@umn.edu">salit047@umn.edu</a>
  </div>

  <div class="team-card">
    <div class="avatar">
      <img src="{{ '/assets/images/team/joyce-tsai.jpg' | relative_url }}" alt="Joyce Tsai"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="avatar-fallback">JT</div>
    </div>
    <h3>Joyce Tsai</h3>
    <p class="role">Firmware Lead</p>
    <a class="email" href="mailto:tsai0171@umn.edu">tsai0171@umn.edu</a>
  </div>

  <div class="team-card">
    <div class="avatar">
      <img src="{{ '/assets/images/team/alistair-white.jpg' | relative_url }}" alt="Alistair White"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="avatar-fallback">AW</div>
    </div>
    <h3>Alistair White</h3>
    <p class="role">GNC Lead</p>
    <a class="email" href="mailto:whit3491@umn.edu">whit3491@umn.edu</a>
  </div>

  <div class="team-card open">
    <div class="avatar">
      <div class="avatar-fallback">?</div>
    </div>
    <h3>Position Open</h3>
    <p class="role">Software Lead</p>
    <a class="email" href="mailto:moha2063@umn.edu">Interested? Contact the Avionics Lead</a>
  </div>

</div>

<style>
.hero {
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
}
.hero h1 { margin-bottom: 0.25rem; font-size: 2.1rem; }
.hero p { color: #5c5c5c; font-size: 1.05rem; margin: 0; }

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1.25rem;
  margin: 1.75rem 0 2rem;
}

.team-card {
  text-align: center;
  padding: 1.5rem 1rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(0,0,0,0.015), rgba(0,0,0,0));
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}
.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  border-color: rgba(0,0,0,0.2);
}
.team-card.open { border-style: dashed; }

.avatar {
  width: 96px;
  height: 96px;
  margin: 0 auto 0.85rem;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.avatar-fallback {
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7b2ff7, #5b8def);
  color: #fff;
  font-weight: 700;
  font-size: 1.4rem;
  letter-spacing: 0.03em;
}
.team-card.open .avatar-fallback {
  display: flex;
  background: rgba(0,0,0,0.06);
  color: #999;
}

.team-card h3 { margin: 0 0 0.15rem; font-size: 1.05rem; }
.team-card .role { margin: 0 0 0.6rem; font-size: 0.85rem; color: #5c5c5c; text-transform: uppercase; letter-spacing: 0.04em; }
.team-card .email { font-size: 0.85rem; text-decoration: none; }

@media (prefers-color-scheme: dark) {
  .hero { border-bottom-color: rgba(255,255,255,0.1); }
  .hero p { color: #b3b3b3; }
  .team-card { border-color: rgba(255,255,255,0.12); background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)); }
  .team-card:hover { border-color: rgba(255,255,255,0.3); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
  .team-card .role { color: #b3b3b3; }
  .team-card.open .avatar-fallback { background: rgba(255,255,255,0.08); color: #aaa; }
}
</style>