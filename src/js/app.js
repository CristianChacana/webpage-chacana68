'use strict';

/**
 * chakana.68 — Security-Hardened Frontend Controller
 * - Zero unsafe HTML injection with untrusted/dynamic strings (strict DOM API creation)
 * - Strict relative asset path allowlist validation
 * - Zero inline event handlers (CSP-compliant)
 */
(function () {
  // Immutable catalog of approved local video assets
  const VIDEOS_DATA = Object.freeze([
    Object.freeze({
      id: 'timmy-basket',
      title: 'Timmy Basketball: Gran Final',
      category: 'accion',
      badge: '🏀 Deportes & Acción',
      description: 'Timmy demuestra quién manda en la duela con clavadas y jugadas de campeonato dignas de un MVP.',
      file: 'src/videos/timmy basketball final final.mp4',
      featured: true
    }),
    Object.freeze({
      id: 'mj-thriller',
      title: 'MJ Thriller Cat — Musical Nocturno',
      category: 'musical',
      badge: '🎵 Musical & Pop',
      description: 'Homenaje felino al clásico Thriller con pasos legendarios, chamarra icónica y ritmo sobrenatural.',
      file: 'src/videos/mj triller cat.mp4',
      featured: true
    }),
    Object.freeze({
      id: 'we-control-meow',
      title: 'We Control The Meow',
      category: 'musical',
      badge: '🎧 Electro & Actitud',
      description: 'Los michis toman el control absoluto del sonido y la ciudad con un beat imparable.',
      file: 'src/videos/we control the meow.mp4',
      featured: false
    }),
    Object.freeze({
      id: 'miaumiau-1min',
      title: 'Miau Miau — Especial 1 Minuto',
      category: 'musical',
      badge: '🎤 Hit Viral (1 Min)',
      description: 'Un minuto completo de pura energía musical gatuna que no podrás dejar de cantar.',
      file: 'src/videos/miaumiau 1 min.mp4',
      featured: false
    }),
    Object.freeze({
      id: 'timmy-bambi',
      title: 'Timmy y Bambi: Dúo Dinámico',
      category: 'aventuras',
      badge: '🐾 Historia & Amistad',
      description: 'El encuentro más tierno y épico entre Timmy y Bambi en una aventura inolvidable.',
      file: 'src/videos/timmy y bambi 1.mp4',
      featured: false
    }),
    Object.freeze({
      id: 'i2v-cinema',
      title: 'Secuencia Cinemática I2V',
      category: 'aventuras',
      badge: '✨ Animación IA',
      description: '10 segundos de puro realismo e impacto visual dando vida al universo de chakana.68.',
      file: 'src/videos/I2V 10-second video. No _11-10_11_47_21.mp4',
      featured: false
    }),
    Object.freeze({
      id: 'workflow-vfx',
      title: 'Transformación & VFX Felino',
      category: 'aventuras',
      badge: '🔥 Magia Visual',
      description: 'Cambio de escena y efectos especiales de última generación protagonizados por nuestros gatos.',
      file: 'src/videos/Workflow Replace the current _11-11_10_11_48.mp4',
      featured: false
    }),
    Object.freeze({
      id: 'short-viral',
      title: 'Clip Express: ¡Haz que suceda!',
      category: 'accion',
      badge: '⚡ Short Viral',
      description: 'Dosis rápida de carisma gatuno ideal para TikTok y YouTube Shorts.',
      file: 'src/videos/sin-t-tulo-haz-que-d (1).mp4',
      featured: false
    })
  ]);

  // Allowlist of valid image assets for lightbox
  const ALLOWED_IMAGES = new Set([
    'src/imagenes/final.jpg',
    'src/imagenes/logo.png',
    'src/imagenes/image_b1cc1879.png',
    'src/logo/logo.jpg'
  ]);

  const ALLOWED_CATEGORIES = new Set(['all', 'musical', 'accion', 'aventuras']);

  /**
   * Validates that a relative media path is safe (no protocol injection, no directory traversal)
   */
  function isSafeRelativeAsset(pathStr) {
    if (typeof pathStr !== 'string' || pathStr.length === 0) return false;
    if (pathStr.includes('..') || pathStr.includes('\\') || /^[a-zA-Z]+:/.test(pathStr)) {
      return false;
    }
    return pathStr.startsWith('src/videos/') || pathStr.startsWith('src/imagenes/') || pathStr.startsWith('src/logo/');
  }

  /**
   * Creates an inline SVG icon safely via DOM APIs (no external script dependency needed)
   */
  function createSvgIcon(name, className) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    if (className) svg.setAttribute('class', className);

    const addPath = (d, fillCurrent = false) => {
      const p = document.createElementNS(ns, 'path');
      p.setAttribute('d', d);
      if (fillCurrent) p.setAttribute('fill', 'currentColor');
      svg.appendChild(p);
    };

    if (name === 'play') {
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', '6 3 20 12 6 21 6 3');
      poly.setAttribute('fill', 'currentColor');
      svg.appendChild(poly);
    } else if (name === 'volume-2') {
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', '11 5 6 9 2 9 2 15 6 15 11 19 11 5');
      svg.appendChild(poly);
      addPath('M15.54 8.46a5 5 0 0 1 0 7.07');
      addPath('M19.07 4.93a10 10 0 0 1 0 14.14');
    }
    return svg;
  }

  /**
   * Builds a single video card using safe DOM nodes (`textContent`, `createElement`)
   */
  function buildVideoCard(video) {
    if (!isSafeRelativeAsset(video.file)) {
      throw new Error('Blocked unsafe video asset path');
    }

    const article = document.createElement('article');
    article.className = 'glass-card rounded-3xl overflow-hidden flex flex-col justify-between group';

    const topWrapper = document.createElement('div');

    // Video preview container
    const thumbContainer = document.createElement('div');
    thumbContainer.className = 'relative video-thumb bg-black overflow-hidden cursor-pointer';
    thumbContainer.setAttribute('role', 'button');
    thumbContainer.setAttribute('tabindex', '0');
    thumbContainer.setAttribute('aria-label', `Reproducir ${video.title}`);

    const videoEl = document.createElement('video');
    videoEl.src = `${encodeURI(video.file)}#t=0.5`;
    videoEl.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500';
    videoEl.muted = true;
    videoEl.loop = true;
    videoEl.playsInline = true;
    videoEl.preload = 'metadata';
    videoEl.setAttribute('controlsList', 'nodownload');
    videoEl.disablePictureInPicture = true;

    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none';

    const badgeRow = document.createElement('div');
    badgeRow.className = 'absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none';

    const badgeSpan = document.createElement('span');
    badgeSpan.className = 'px-3 py-1 rounded-full text-[11px] font-bold bg-black/65 backdrop-blur-md text-amber-300 border border-white/15';
    badgeSpan.textContent = video.badge;

    const previewBadge = document.createElement('span');
    previewBadge.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-orange/90 text-white opacity-0 group-hover:opacity-100 transition-opacity';
    previewBadge.textContent = 'Vista Previa';

    badgeRow.appendChild(badgeSpan);
    badgeRow.appendChild(previewBadge);

    const playCenterWrap = document.createElement('div');
    playCenterWrap.className = 'absolute inset-0 flex items-center justify-center pointer-events-none';

    const playCircle = document.createElement('div');
    playCircle.className = 'w-14 h-14 rounded-full bg-brand-orange/90 text-white flex items-center justify-center shadow-xl shadow-brand-orange/40 group-hover:scale-110 transition-transform';
    playCircle.appendChild(createSvgIcon('play', 'w-6 h-6 fill-current ml-0.5'));
    playCenterWrap.appendChild(playCircle);

    thumbContainer.appendChild(videoEl);
    thumbContainer.appendChild(gradientOverlay);
    thumbContainer.appendChild(badgeRow);
    thumbContainer.appendChild(playCenterWrap);

    // Card Text
    const textWrap = document.createElement('div');
    textWrap.className = 'p-6 pb-4';

    const titleEl = document.createElement('h3');
    titleEl.className = 'font-display font-bold text-xl text-white group-hover:text-brand-amber transition-colors';
    titleEl.textContent = video.title;

    const descEl = document.createElement('p');
    descEl.className = 'text-slate-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed';
    descEl.textContent = video.description;

    textWrap.appendChild(titleEl);
    textWrap.appendChild(descEl);

    topWrapper.appendChild(thumbContainer);
    topWrapper.appendChild(textWrap);

    // Card Footer Action
    const footerWrap = document.createElement('div');
    footerWrap.className = 'px-6 pb-6 pt-2 flex items-center justify-between gap-3';

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white/8 hover:bg-brand-orange text-white border border-white/10 hover:border-brand-orange transition-all flex items-center justify-center gap-2';
    openBtn.appendChild(createSvgIcon('volume-2', 'w-4 h-4'));

    const btnLabel = document.createElement('span');
    btnLabel.textContent = 'Ver con Audio en Cine';
    openBtn.appendChild(btnLabel);

    footerWrap.appendChild(openBtn);

    article.appendChild(topWrapper);
    article.appendChild(footerWrap);

    // Event Listeners (no inline attributes)
    article.addEventListener('mouseenter', () => {
      videoEl.play().catch(() => {});
    });
    article.addEventListener('mouseleave', () => {
      videoEl.pause();
    });

    const handleOpen = () => openVideoModal(video.id);
    thumbContainer.addEventListener('click', handleOpen);
    thumbContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
    openBtn.addEventListener('click', handleOpen);

    return article;
  }

  function renderVideos(filter = 'all') {
    const gridEl = document.getElementById('videos-grid');
    if (!gridEl) return;

    const safeFilter = ALLOWED_CATEGORIES.has(filter) ? filter : 'all';
    const filtered = safeFilter === 'all'
      ? VIDEOS_DATA
      : VIDEOS_DATA.filter(v => v.category === safeFilter);

    gridEl.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (const video of filtered) {
      fragment.appendChild(buildVideoCard(video));
    }
    gridEl.appendChild(fragment);
  }

  // Modal state & elements
  function openVideoModal(videoId) {
    const item = VIDEOS_DATA.find(v => v.id === videoId);
    if (!item || !isSafeRelativeAsset(item.file)) return;

    const videoModal = document.getElementById('video-modal');
    const modalPlayer = document.getElementById('modal-video-player');
    const modalTitle = document.getElementById('modal-video-title');
    const modalBadge = document.getElementById('modal-video-badge');
    const modalDesc = document.getElementById('modal-video-desc');

    if (!videoModal || !modalPlayer || !modalTitle || !modalBadge || !modalDesc) return;

    modalTitle.textContent = item.title;
    modalBadge.textContent = item.badge;
    modalDesc.textContent = item.description;
    modalPlayer.src = encodeURI(item.file);

    videoModal.classList.remove('hidden');
    videoModal.classList.add('flex');
    modalPlayer.play().catch(() => {});
  }

  function closeVideoModal() {
    const videoModal = document.getElementById('video-modal');
    const modalPlayer = document.getElementById('modal-video-player');
    if (!videoModal || !modalPlayer) return;

    modalPlayer.pause();
    modalPlayer.removeAttribute('src');
    modalPlayer.load();
    videoModal.classList.add('hidden');
    videoModal.classList.remove('flex');
  }

  function openImageModal(src, caption) {
    if (!ALLOWED_IMAGES.has(src) || !isSafeRelativeAsset(src)) return;

    const imageModal = document.getElementById('image-modal');
    const modalImageEl = document.getElementById('modal-image-el');
    const modalImageCaption = document.getElementById('modal-image-caption');
    if (!imageModal || !modalImageEl || !modalImageCaption) return;

    modalImageEl.src = encodeURI(src);
    modalImageEl.alt = typeof caption === 'string' ? caption : 'chakana.68 imagen';
    modalImageCaption.textContent = typeof caption === 'string' ? caption : '';

    imageModal.classList.remove('hidden');
    imageModal.classList.add('flex');
  }

  function closeImageModal() {
    const imageModal = document.getElementById('image-modal');
    const modalImageEl = document.getElementById('modal-image-el');
    if (!imageModal || !modalImageEl) return;

    modalImageEl.removeAttribute('src');
    imageModal.classList.add('hidden');
    imageModal.classList.remove('flex');
  }

  function initApp() {
    // Initialize video grid
    renderVideos('all');

    // Bind category filter buttons
    const filterButtons = document.querySelectorAll('#video-filters .filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.className = 'filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all';
        });
        btn.className = 'filter-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-brand-orange text-white shadow-lg shadow-brand-orange/25 transition-all';
        renderVideos(btn.dataset.filter || 'all');
      });
    });

    // Bind lightbox triggers via data-lightbox-src and data-lightbox-caption
    document.querySelectorAll('[data-lightbox-src]').forEach(el => {
      const triggerLightbox = () => {
        const src = el.getAttribute('data-lightbox-src');
        const caption = el.getAttribute('data-lightbox-caption') || '';
        if (src) openImageModal(src, caption);
      };
      el.addEventListener('click', triggerLightbox);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerLightbox();
        }
      });
    });

    // Bind modal close buttons & backdrop clicks
    const closeVideoBtn = document.getElementById('close-video-modal-btn');
    if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideoModal);

    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeVideoModal();
      });
    }

    const closeImageBtn = document.getElementById('close-image-modal-btn');
    if (closeImageBtn) closeImageBtn.addEventListener('click', closeImageModal);

    const imageModal = document.getElementById('image-modal');
    if (imageModal) {
      imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) closeImageModal();
      });
    }

    // Prevent context menu download theft on video elements if desired while keeping UX accessible
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeVideoModal();
        closeImageModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
