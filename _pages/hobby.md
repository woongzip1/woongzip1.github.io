---
layout: page
title: More about me
permalink: /more-about-me/
nav: true
nav_order: 4
# Flip to true once the photos are ready — it brings back the filter row and
# the photo grid. Uncomment the `images` block below at the same time: front
# matter is parsed as YAML before Liquid runs, so it cannot be made conditional,
# and leaving it on would load the lightbox on a page with no photos.
show_gallery: false
# images:
#   lightbox2: true
---

<div class="about-me-lede">
  <p>
    I spend a lot of my time listening to <strong>music</strong>, and I de-stress by <strong>running</strong>. 
    I am always happy to talk about music across a wide range of genres, including <em>piano, soul, jazz, rock, and hip-hop</em>.
    I also enjoy finding nice cafes and grabbing a <strong>coffee</strong>.
  </p>
</div>

## Latest updates

<p class="about-me-note">
  <strong>Recently:</strong> enjoying <strong>Sade's</strong> <em>Smooth Operator</em> and <strong>Nujabes'</strong> <em>Luv(sic)</em>.
</p>

<ul class="updates">
  <li class="updates-item">
    <span class="updates-date">Mar 2026</span>
    <span class="updates-text">Completed the 96th Seoul Marathon (10km) with my lab members and advisor.</span>
  </li>
  <li class="updates-item">
    <span class="updates-date">Sep 2025</span>
    <span class="updates-text">Saw MUSE live in Korea, after years of waiting to see my all-time favorite band.</span>
  </li>
  <li class="updates-item">
    <span class="updates-date">Jun 2025</span>
    <span class="updates-text">Joined Luv(sic) Hexalogy Asia Tour with OMA and Shing02, a tribute to Nujabes.</span>
  </li>
  <li class="updates-item">
    <span class="updates-date">Apr 2025</span>
    <span class="updates-text">Saw a piano concert by Ludovico Einaudi at the Sejong Center.</span>
  </li>
  <li class="updates-item">
    <span class="updates-date">Feb 2024</span>
    <span class="updates-text">Caught Sum 41's final concert in Korea before they disbanded.</span>
  </li>
  <li class="updates-item">
    <span class="updates-date">Jan 2024</span>
    <span class="updates-text">Watched the film Ryuichi Sakamoto: Opus, my first time going to the cinema alone.</span>
  </li>
</ul>

{% if page.show_gallery %}

<div class="gallery-filters">
  <button class="gallery-filter active" data-filter="all">All</button>
  <button class="gallery-filter" data-filter="concerts">Concerts</button>
  <button class="gallery-filter" data-filter="running">Running</button>
  <button class="gallery-filter" data-filter="everyday">Everyday</button>
</div>

<div class="gallery-grid">
  {% for photo in site.data.gallery %}
    {% assign src = photo.image | prepend: '/assets/img/' | relative_url %}
    {% assign stem = photo.image | remove: '.jpg' | remove: '.jpeg' | remove: '.png' | remove: '.tiff' | remove: '.gif' | prepend: '/assets/img/' | relative_url %}
    <a
      class="gallery-tile"
      data-category="{{ photo.category }}"
      href="{{ src }}"
      data-lightbox="gallery"
      data-title="{{ photo.caption | escape }} &middot; {{ photo.date }}"
    >
      {%- comment -%}
        Tiles are small, so the 480w WebP is plenty. The lightbox still opens the
        full-size original from the anchor href. If the WebP variants are missing
        (imagemagick disabled), <picture> falls back to the <img> below.
      {%- endcomment -%}
      <picture>
        {% if site.imagemagick.enabled %}
          <source srcset="{{ stem }}-480.webp 480w, {{ stem }}-800.webp 800w" type="image/webp" />
        {% endif %}
        <img src="{{ src }}" alt="{{ photo.caption | escape }}" loading="lazy" />
      </picture>
      <span class="gallery-tile-overlay">
        <span class="gallery-tile-date">{{ photo.date }}</span>
      </span>
    </a>
  {% endfor %}
</div>

<div class="gallery-empty" hidden>Nothing here yet.</div>

<script>
  // Category filter for the photo feed. Pure show/hide so the grid keeps its
  // column rhythm and no images are re-requested when switching tabs.
  (function () {
    const buttons = document.querySelectorAll(".gallery-filter");
    const tiles = document.querySelectorAll(".gallery-tile");
    const empty = document.querySelector(".gallery-empty");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        buttons.forEach((b) => b.classList.toggle("active", b === button));

        let shown = 0;
        tiles.forEach((tile) => {
          const match = filter === "all" || tile.dataset.category === filter;
          tile.hidden = !match;
          if (match) shown++;
        });

        empty.hidden = shown > 0;
      });
    });
  })();
</script>

{% endif %}
