---
layout: page
title: More about me
permalink: /more-about-me/
nav: true
nav_order: 4
---

<p class="feed-bio">
  I spend a lot of my time listening to <strong>music</strong>, and I de-stress by
  <strong>running</strong>. I am always happy to talk about music across a wide range
  of genres, including piano, soul, jazz, rock, and hip-hop. I also enjoy finding nice
  cafes and grabbing a <strong>coffee</strong>.
</p>

{%- assign updates = site.data.updates -%}
{%- if updates and updates.size > 0 -%}
  <h2 class="feed-updates-title">Latest updates</h2>
  <ul class="updates">
    {%- for item in updates -%}
      <li class="updates-item">
        <span class="updates-date">{{ item.date | append: '-01' | date: '%b %Y' }}</span>
        <span class="updates-text">{{ item.text }}</span>
      </li>
    {%- endfor -%}
  </ul>
{%- endif -%}

{%- if site.data.now.albums_intro -%}
  <p class="feed-albums-intro">{{ site.data.now.albums_intro }}</p>
{%- endif -%}

<div class="feed-grid">
  {%- for post in site.data.gallery -%}
    {%- assign cover = post.images | first -%}
    {%- assign cover_src = cover | prepend: '/assets/img/' | relative_url -%}
    {%- assign cover_stem = cover | remove: '.jpg' | remove: '.jpeg' | remove: '.png' | remove: '.tiff' | remove: '.gif' | prepend: '/assets/img/' | relative_url -%}
    <figure class="feed-tile{% if post.images.size > 1 %} feed-tile-multi{% endif %}">
      <picture>
        {%- if site.imagemagick.enabled -%}
          <source srcset="{{ cover_stem }}-480.webp 480w, {{ cover_stem }}-800.webp 800w" type="image/webp" />
        {%- endif -%}
        <img src="{{ cover_src }}" alt="{{ post.title | escape }}" loading="lazy" />
      </picture>
      <span class="feed-tile-overlay">
        {%- comment -%} date is optional: album entries carry a title only. {%- endcomment -%}
        <span class="feed-tile-caption">
          {%- if post.date %}{{ post.date | append: '-01' | date: '%b %Y' }} · {% endif -%}
          {{ post.title }}
        </span>
      </span>
    </figure>
  {%- endfor -%}
</div>
