// Renders the CV PDF inline with pdf.js so /cv/ keeps the site's own chrome
// instead of handing the visitor off to the browser's PDF viewer.
// Canvas + text layer (selectable text) + an overlay for the PDF's own links.
(function () {
  const root = document.querySelector(".cv-pdf");
  if (!root) return;

  const pagesEl = root.querySelector(".cv-pdf-pages");
  const zoomEl = root.querySelector(".cv-pdf-zoom");
  const levelEl = root.querySelector(".cv-pdf-zoom-level");
  const fallbackEl = root.querySelector(".cv-pdf-fallback");

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.25;
  const MAX_PAGE_WIDTH = 900; // px, so the page stays readable on wide screens

  let pdfjsLib = null;
  let pdf = null;
  let zoom = 1;
  let token = 0;
  let tasks = [];

  function addLinkOverlay(annotations, viewport, holder) {
    const links = annotations.filter(function (a) {
      return a.subtype === "Link" && a.url;
    });
    if (!links.length) return;

    const layer = document.createElement("div");
    layer.className = "cv-pdf-links";
    links.forEach(function (a) {
      const r = viewport.convertToViewportRectangle(a.rect);
      const el = document.createElement("a");
      el.href = a.url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
      el.style.left = Math.min(r[0], r[2]) + "px";
      el.style.top = Math.min(r[1], r[3]) + "px";
      el.style.width = Math.abs(r[2] - r[0]) + "px";
      el.style.height = Math.abs(r[3] - r[1]) + "px";
      layer.appendChild(el);
    });
    holder.appendChild(layer);
  }

  // Renders every page into a detached fragment and swaps it in at the end, so
  // resizing and zooming never blank the viewer.
  async function render() {
    const mine = ++token;
    tasks.forEach(function (t) {
      t.cancel();
    });
    tasks = [];

    const available = Math.min(root.clientWidth, MAX_PAGE_WIDTH);
    if (available <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    const fragment = document.createDocumentFragment();

    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      if (mine !== token) return;

      const scale = (available / page.getViewport({ scale: 1 }).width) * zoom;
      const viewport = page.getViewport({ scale: scale });

      const holder = document.createElement("div");
      holder.className = "cv-pdf-page";
      holder.style.width = viewport.width + "px";
      holder.style.height = viewport.height + "px";
      holder.style.setProperty("--scale-factor", scale);

      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      holder.appendChild(canvas);

      const textLayerEl = document.createElement("div");
      textLayerEl.className = "textLayer";
      holder.appendChild(textLayerEl);

      fragment.appendChild(holder);

      const task = page.render({
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
        transform: dpr === 1 ? null : [dpr, 0, 0, dpr, 0, 0],
      });
      tasks.push(task);
      await task.promise;
      if (mine !== token) return;

      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: await page.getTextContent(),
        container: textLayerEl,
        viewport: viewport,
      });
      await textLayer.render();
      addLinkOverlay(await page.getAnnotations({ intent: "display" }), viewport, holder);
      if (mine !== token) return;
    }

    pagesEl.replaceChildren(fragment);
  }

  function setZoom(next) {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    if (clamped === zoom) return;
    zoom = clamped;
    levelEl.textContent = Math.round(zoom * 100) + "%";
    zoomEl.querySelector('[data-zoom="out"]').disabled = zoom <= MIN_ZOOM;
    zoomEl.querySelector('[data-zoom="in"]').disabled = zoom >= MAX_ZOOM;
    render();
  }

  (async function () {
    try {
      pdfjsLib = await import(root.dataset.pdfjsSrc);
      pdfjsLib.GlobalWorkerOptions.workerSrc = root.dataset.pdfjsWorker;
      pdf = await pdfjsLib.getDocument(root.dataset.pdfUrl).promise;
      await render();
    } catch (e) {
      return; // the fallback link stays visible
    }

    fallbackEl.hidden = true;
    zoomEl.hidden = false;
    zoomEl.querySelector('[data-zoom="out"]').disabled = true;

    zoomEl.addEventListener("click", function (e) {
      const button = e.target.closest("[data-zoom]");
      if (!button) return;
      setZoom(zoom + (button.dataset.zoom === "in" ? ZOOM_STEP : -ZOOM_STEP));
    });

    let resizeTimer = null;
    let lastWidth = root.clientWidth;
    new ResizeObserver(function () {
      if (root.clientWidth === lastWidth) return;
      lastWidth = root.clientWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 150);
    }).observe(root);
  })();
})();
