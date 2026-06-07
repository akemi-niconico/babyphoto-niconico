// ===== Header scroll =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== Mobile nav =====
function toggleNav() {
  document.getElementById('nav').classList.toggle('open');
}
document.getElementById('nav').querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('nav').classList.remove('open');
  });
});

// ===== photos.js からギャラリーを自動生成 =====
const INITIAL_COUNT = 20;
const grid = document.getElementById('galleryGrid');

(photoList || []).forEach(p => {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.dataset.category = p.category;
  item.innerHTML = `
    <img src="photos/${p.file}" alt="${p.alt || ''}" loading="lazy">
    <div class="gallery-item-overlay"><span>${categoryLabel(p.category)}</span></div>
  `;
  item.querySelector('img').onerror = () => item.remove();
  item.addEventListener('click', () => {
    buildLightboxList();
    const src = item.querySelector('img').src;
    lightboxIndex = lightboxImages.findIndex(i => i.src === src);
    if (lightboxIndex === -1) lightboxIndex = 0;
    openLightbox();
  });
  grid.appendChild(item);
});

applyInitialLimit();

function applyInitialLimit() {
  const allItems = document.querySelectorAll('.gallery-item');
  allItems.forEach((item, i) => {
    if (i >= INITIAL_COUNT) item.classList.add('over-limit');
  });
  updateMoreButton();
}

function updateMoreButton() {
  const existing = document.getElementById('moreBtn');
  if (existing) existing.remove();
  const hidden = document.querySelectorAll('.gallery-item.over-limit:not(.hidden)').length;
  if (hidden === 0) return;
  const btn = document.createElement('button');
  btn.id = 'moreBtn';
  btn.className = 'btn btn-more';
  btn.textContent = 'More';
  btn.onclick = () => {
    document.querySelectorAll('.gallery-item.over-limit').forEach(el => {
      el.classList.remove('over-limit');
    });
    btn.remove();
  };
  grid.insertAdjacentElement('afterend', btn);
}

function categoryLabel(cat) {
  return { anniversary: 'Anniversary', milkbath: 'Milk Bath',
           birthday: 'Birthday Event', seasonal: 'Seasonal Booth',
           location: 'Location' }[cat] || cat;
}

// ===== Gallery filter =====
const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    let shown = 0;
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.classList.remove('over-limit');
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        shown++;
        if (shown > INITIAL_COUNT) item.classList.add('over-limit');
      } else {
        item.classList.add('hidden');
      }
    });
    updateMoreButton();
  });
});

// ===== Lightbox =====
let lightboxImages = [];
let lightboxIndex = 0;

function buildLightboxList() {
  lightboxImages = [];
  document.querySelectorAll('.gallery-item:not(.hidden)').forEach(item => {
    const img = item.querySelector('img');
    if (img) lightboxImages.push({ src: img.src, alt: img.alt });
  });
}

function openLightbox() {
  const lb = document.getElementById('lightbox');
  updateLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function moveLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  updateLightbox();
}

function updateLightbox() {
  if (!lightboxImages.length) return;
  const { src, alt } = lightboxImages[lightboxIndex];
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightboxCaption').textContent = alt || '';
}

// Keyboard navigation
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') moveLightbox(-1);
  if (e.key === 'ArrowRight') moveLightbox(1);
});

// ===== Scroll fade-in =====
const fadeEls = document.querySelectorAll(
  '.section-header, .gallery-item, .menu-card, .about-inner, .contact-inner'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ===== Contact form (demo) =====
function submitForm(e) {
  e.preventDefault();
  alert('ありがとうございます！\nメッセージを受け付けました。\n（※ デモ用フォームです。実際のお問い合わせはInstagram DMへ）');
  e.target.reset();
}
