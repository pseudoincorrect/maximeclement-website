/* Global UI behaviour. Works with Astro view transitions (re-inits on astro:page-load). */
const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) =>
  r.querySelector<T>(s);
const $$ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) =>
  Array.from(r.querySelectorAll<T>(s));
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Theme ---------- */
export function applyTheme() {
  let t = 'dark';
  try {
    t = localStorage.getItem('theme') || 'dark';
  } catch {}
  document.documentElement.dataset.theme = t;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', t === 'light' ? '#eef1fa' : '#171a2c');
}

/* ---------- Sidebar ---------- */
function setNav(open: boolean) {
  $('#sidebar')?.classList.toggle('-translate-x-full', !open);
  $('#nav-backdrop')?.classList.toggle('hidden', !open);
  $('[data-nav-open]')?.setAttribute('aria-expanded', String(open));
}

/* ---------- Carousel ---------- */
const slideIndex = (track: HTMLElement) => Math.round(track.scrollLeft / track.clientWidth);
function goSlide(root: HTMLElement, i: number) {
  const track = $('[data-track]', root)!;
  const n = track.children.length;
  track.scrollTo({
    left: ((i + n) % n) * track.clientWidth,
    behavior: reduce() ? 'auto' : 'smooth',
  });
}
function syncDots(root: HTMLElement) {
  const track = $('[data-track]', root);
  if (!track) return;
  const idx = slideIndex(track);
  $$('[data-dot]', root).forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
}

/* ---------- Lightbox ---------- */
let lbImages: HTMLImageElement[] = [];
let lbIndex = 0;
function showLightbox(i: number) {
  const dlg = $<HTMLDialogElement>('#lightbox');
  if (!dlg || !lbImages.length) return;
  lbIndex = (i + lbImages.length) % lbImages.length;
  const img = lbImages[lbIndex];
  $<HTMLImageElement>('#lightbox-img')!.src = img.currentSrc || img.src;
  $<HTMLImageElement>('#lightbox-img')!.alt = img.alt;
  $('#lightbox-caption')!.textContent = `${img.alt} (${lbIndex + 1}/${lbImages.length})`;
  if (!dlg.open) dlg.showModal();
}

/* ---------- Project filters ---------- */
function applyFilter(cat: string) {
  $$('[data-filter]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.filter === cat)),
  );
  let shown = 0;
  $$('[data-categories]').forEach((c) => {
    const ok = cat === 'all' || c.dataset.categories!.split('|').includes(cat);
    c.classList.toggle('hidden', !ok);
    if (ok) shown++;
  });
  const count = $('#filter-count');
  if (count) count.textContent = `${shown} project${shown === 1 ? '' : 's'}`;
}

/* ---------- Delegated listeners (registered once) ---------- */
document.addEventListener('click', async (e) => {
  const t = e.target as HTMLElement;
  if (t.closest('[data-nav-open]')) return setNav(true);
  if (t.closest('[data-nav-close]') || t.closest('#nav-backdrop')) return setNav(false);
  if (t.closest('[data-theme-toggle]')) {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', next);
    } catch {}
    return applyTheme();
  }
  const toc = t.closest<HTMLAnchorElement>('[data-toc] a');
  if (toc) {
    const d = document.getElementById(toc.hash.slice(1));
    if (d instanceof HTMLDetailsElement) d.open = true;
  }
  if (t.closest('[data-top]'))
    return window.scrollTo({ top: 0, behavior: reduce() ? 'auto' : 'smooth' });

  const copy = t.closest<HTMLElement>('[data-copy]');
  if (copy) {
    const label = $('[data-copy-label]', copy)!;
    const original = label.textContent;
    try {
      await navigator.clipboard.writeText(copy.dataset.copy!);
      label.textContent = 'Copied!';
    } catch {
      label.textContent = 'Copy failed';
    }
    return void setTimeout(() => (label.textContent = original), 2000);
  }

  const filter = t.closest<HTMLElement>('[data-filter]');
  if (filter) return applyFilter(filter.dataset.filter!);

  const root = t.closest<HTMLElement>('[data-carousel]');
  if (root) {
    const track = $('[data-track]', root)!;
    if (t.closest('[data-prev]')) return goSlide(root, slideIndex(track) - 1);
    if (t.closest('[data-next]')) return goSlide(root, slideIndex(track) + 1);
    const dot = t.closest<HTMLElement>('[data-dot]');
    if (dot) return goSlide(root, Number(dot.dataset.dot));
    const img = t.closest<HTMLImageElement>('img[data-lightbox]');
    if (img) {
      lbImages = $$<HTMLImageElement>('img[data-lightbox]', root);
      return showLightbox(lbImages.indexOf(img));
    }
  }

  // Standalone images (outside a carousel) are grouped by their [data-gallery] parent
  const img = t.closest<HTMLImageElement>('img[data-lightbox]');
  if (img) {
    lbImages = $$<HTMLImageElement>(
      'img[data-lightbox]',
      img.closest('[data-gallery]') ?? document,
    );
    return showLightbox(lbImages.indexOf(img));
  }

  if (t.closest('[data-lb-close]') || t.id === 'lightbox')
    return $<HTMLDialogElement>('#lightbox')?.close();
  if (t.closest('[data-lb-prev]')) return showLightbox(lbIndex - 1);
  if (t.closest('[data-lb-next]')) return showLightbox(lbIndex + 1);
});

document.addEventListener('submit', (e) => {
  const form = (e.target as HTMLElement).closest<HTMLFormElement>('[data-mailto-form]');
  if (!form) return;
  e.preventDefault();
  const d = new FormData(form);
  const subject = encodeURIComponent(`Portfolio message from ${d.get('name') || 'a visitor'}`);
  const body = encodeURIComponent(
    `${d.get('message') || ''}\n\n— ${d.get('name') || ''} ${d.get('email') ? `<${d.get('email')}>` : ''}`,
  );
  location.href = `mailto:${form.dataset.mailtoForm}?subject=${subject}&body=${body}`;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setNav(false);
  const dlg = $<HTMLDialogElement>('#lightbox');
  if (dlg?.open) {
    if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
    return;
  }
  const track = (e.target as HTMLElement).closest?.<HTMLElement>('[data-track]');
  if (track) {
    const root = track.closest<HTMLElement>('[data-carousel]')!;
    if (e.key === 'ArrowLeft') goSlide(root, slideIndex(track) - 1);
    if (e.key === 'ArrowRight') goSlide(root, slideIndex(track) + 1);
  }
});

// scroll doesn't bubble: capture it for carousels
document.addEventListener(
  'scroll',
  (e) => {
    const t = e.target as HTMLElement;
    if (t instanceof HTMLElement && t.hasAttribute('data-track'))
      syncDots(t.closest<HTMLElement>('[data-carousel]')!);
  },
  true,
);

// magnetic buttons
document.addEventListener('pointermove', (e) => {
  if (reduce() || e.pointerType !== 'mouse') return;
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-magnetic]');
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
});
document.addEventListener('pointerout', (e) => {
  const el = (e.target as HTMLElement).closest?.<HTMLElement>('[data-magnetic]');
  if (el && !el.contains(e.relatedTarget as Node)) el.style.transform = '';
});

// open the "details" accordion when linked from the table of contents
function openHashDetails() {
  const el = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  if (el instanceof HTMLDetailsElement) el.open = true;
}
window.addEventListener('hashchange', openHashDetails);

// progress bar + back to top
function onScroll() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? h.scrollTop / max : 0;
  const bar = $('#progress');
  if (bar) bar.style.transform = `scaleX(${p})`;
  $('#back-to-top')?.classList.toggle('opacity-0', h.scrollTop < 600);
  $('#back-to-top')?.classList.toggle('pointer-events-none', h.scrollTop < 600);
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Per page-load init ---------- */
let io: IntersectionObserver | null = null;
let tocIo: IntersectionObserver | null = null;

function init() {
  applyTheme();
  setNav(false);
  openHashDetails();
  onScroll();
  $$('[data-carousel]').forEach(syncDots);

  io?.disconnect();
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io!.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  $$('[data-reveal]').forEach((el) => io!.observe(el));

  tocIo?.disconnect();
  const links = $$<HTMLAnchorElement>('[data-toc] a');
  if (links.length) {
    tocIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((l) =>
            l.setAttribute('aria-current', String(l.hash === `#${en.target.id}`)),
          );
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    links.forEach((l) => {
      const s = document.getElementById(l.hash.slice(1));
      if (s) tocIo!.observe(s);
    });
  }
}
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:after-swap', applyTheme);
