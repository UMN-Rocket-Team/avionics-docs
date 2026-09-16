---
layout: home
title: Home
nav_order: 1
description: "Documentation for the University of Minnesota Rocket Team Avionics subteam."
permalink: /
---

<div class="hero">
  <h1>UMN Rocket Team — Avionics</h1>
  <p>Documentation, tutorials, and project records for the Avionics subteam.</p>
</div>

Welcome to the Avionics documentation page. This site is where we keep everything a new or returning
member needs — who's on the team, what we're building, and how to get up to speed on hardware,
firmware, software, and GNC.

<div class="card-grid">

  <a class="card" href="{{ '/docs/team/' | relative_url }}">
    <span class="card-icon"></span>
    <h2>Meet the Team</h2>
    <p>Who we are, subteam leads, and how to get in touch.</p>
  </a>

  <a class="card" href="{{ '/docs/projects/' | relative_url }}">
    <span class="card-icon"></span>
    <h2>Projects</h2>
    <p>Current and past avionics projects, with build logs and design docs.</p>
  </a>

  <a class="card" href="{{ '/docs/tutorials/' | relative_url }}">
    <span class="card-icon"></span>
    <h2>Tutorials</h2>
    <p>Onboarding guides for Hardware, Software, Firmware, and GNC.</p>
  </a>

</div>

## Getting started

New to the team? Here's the recommended path:

1. Read through **[Meet the Team]({{ '/docs/team/' | relative_url }})** to see how Avionics is currently organized.
2. Pick a subteam under **[Tutorials]({{ '/docs/tutorials/' | relative_url }})** and work through the tutorials.
3. Browse **[Projects]({{ '/docs/projects/' | relative_url }})** to see what you'll actually be working on.

## Quick links

| Subteam | Tutorials | Notes |
|:--|:--|:--|
| Hardware | [Start here]({{ '/docs/tutorials/hardware/' | relative_url }}) | PCB design, sensor selection, wiring |
| Software | [Start here]({{ '/docs/tutorials/software/' | relative_url }}) | Ground station, telemetry, data pipelines |
| Firmware | [Start here]({{ '/docs/tutorials/firmware/' | relative_url }}) | Flight firmware, testing scripts, drivers |
| GNC | [Start here]({{ '/docs/tutorials/gnc/' | relative_url }}) | Guidance, navigation, and control algorithms |

---

<p class="footnote">Maintained by the UMN Rocket Team Avionics subteam. Found an error or an outdated page? Open a pull request or ping a subteam lead.</p>

<style>
.hero {
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
}
.hero h1 {
  margin-bottom: 0.25rem;
  font-size: 2.1rem;
}
.hero p {
  color: #5c5c5c;
  font-size: 1.05rem;
  margin: 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin: 1.75rem 0 2rem;
}

.card {
  display: block;
  padding: 1.25rem 1.25rem 1.5rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  text-decoration: none !important;
  color: inherit;
  background: linear-gradient(180deg, rgba(0,0,0,0.015), rgba(0,0,0,0));
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  border-color: rgba(0,0,0,0.2);
}
.card-icon {
  font-size: 1.6rem;
  display: block;
  margin-bottom: 0.5rem;
}
.card h2 {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
}
.card p {
  margin: 0;
  font-size: 0.92rem;
  color: #5c5c5c;
}

@media (prefers-color-scheme: dark) {
  .hero { border-bottom-color: rgba(255,255,255,0.1); }
  .hero p { color: #b3b3b3; }
  .card { border-color: rgba(255,255,255,0.12); background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)); }
  .card:hover { border-color: rgba(255,255,255,0.3); box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
  .card p { color: #b3b3b3; }
}

.footnote {
  font-size: 0.85rem;
  color: #808080;
}
</style>
