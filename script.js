/* =========================
   Quantum Scholar AI Scripts
   ========================= */

/* ---------- Loading screen ---------- */
const loadingScreen = document.getElementById('loadingScreen');
const loadingFill = document.getElementById('loadingFill');
let lp = 0;
const loader = setInterval(() => {
  lp += Math.random() * 18;
  if (lp >= 100) {
    lp = 100;
    clearInterval(loader);
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.pointerEvents = 'none';
      setTimeout(() => loadingScreen.remove(), 400);
    }, 300);
  }
  loadingFill.style.width = lp + '%';
}, 220);

/* ---------- Theme toggle ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
});

/* ---------- Stats counter ---------- */
function animateCounters() {
  document.querySelectorAll('.stat-value[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    let n = 0;
    const inc = Math.max(1, Math.round(target / 60));
    const t = setInterval(() => {
      n += inc;
      if (n >= target) { n = target; clearInterval(t); }
      el.textContent = n.toLocaleString();
    }, 20);
  });
}
window.addEventListener('load', animateCounters);

/* ---------- Courses data ---------- */
const COURSE_DATA = {
  beginner: [
    {
      title: 'AI Fundamentals',
      weeks: 8,
      level: 'Beginner',
      students: 4200,
      completed: 3100,
      skills: ['ML Basics', 'Python', 'Data Analysis'],
      progress: 75
    },
    {
      title: 'Web Development Basics',
      weeks: 12,
      level: 'Beginner',
      students: 5200,
      completed: 3600,
      skills: ['HTML', 'CSS', 'JavaScript'],
      progress: 60
    },
    {
      title: 'Data Science Intro',
      weeks: 10,
      level: 'Beginner',
      students: 3300,
      completed: 1800,
      skills: ['Stats', 'Pandas', 'Viz'],
      progress: 40
    }
  ],
  intermediate: [
    {
      title: 'Advanced Machine Learning',
      weeks: 16,
      level: 'Intermediate',
      students: 2700,
      completed: 1400,
      skills: ['Deep Learning', 'NNs', 'TensorFlow'],
      progress: 35
    },
    {
      title: 'Full-Stack Development',
      weeks: 20,
      level: 'Intermediate',
      students: 3100,
      completed: 1800,
      skills: ['React', 'Node.js', 'DBs'],
      progress: 50
    },
    {
      title: 'Cloud Computing',
      weeks: 14,
      level: 'Intermediate',
      students: 1900,
      completed: 900,
      skills: ['AWS', 'Docker', 'K8s'],
      progress: 25
    }
  ],
  pro: [
    {
      title: 'AI Research & Innovation',
      weeks: 24,
      level: 'Pro',
      students: 1200,
      completed: 420,
      skills: ['Research', 'Paper Writing', 'Innovation'],
      progress: 20
    },
    {
      title: 'Tech Leadership',
      weeks: 18,
      level: 'Pro',
      students: 1500,
      completed: 600,
      skills: ['Team Mgmt', 'Strategy', 'Vision'],
      progress: 45
    },
    {
      title: 'Quantum Computing',
      weeks: 20,
      level: 'Pro',
      students: 900,
      completed: 240,
      skills: ['Q. Mechanics', 'Qubits', 'Algorithms'],
      progress: 15
    }
  ]
};

const courseGrid = document.getElementById('courseGrid');

function courseCardHTML(c) {
  return `
    <div class="card course-card tilt">
      <div class="story-badge">${c.level}</div>
      <h3>${c.title}</h3>
      <p class="muted">${c.weeks} weeks • ${c.students.toLocaleString()} learners • ${c.completed.toLocaleString()} completed</p>
      <div class="tags">
        ${c.skills.map(s => `<span class="tag">${s}</span>`).join('')}
      </div>
      <div class="progress" title="Your progress in this course">
        <div class="fill" style="--p:${c.progress}%"></div>
      </div>
      <div class="card-actions" style="margin-top:12px; display:flex; gap:10px;">
        <button class="btn btn-primary">Enroll Now</button>
        <button class="btn btn-outline">Syllabus</button>
      </div>
    </div>
  `;
}

function renderCourses(level = 'beginner') {
  courseGrid.innerHTML = COURSE_DATA[level].map(courseCardHTML).join('');
  attachTilt();
}
renderCourses();

/* Tabs */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCourses(btn.dataset.level);
  });
});

/* ---------- Dashboard status list ---------- */
const statusList = document.getElementById('statusList');
const STATUS_ITEMS = [
  { course: 'AI Fundamentals', done: 6, total: 8, hours: 46, cert: false },
  { course: 'Web Development Basics', done: 7, total: 12, hours: 60, cert: false },
  { course: 'Data Science Intro', done: 4, total: 10, hours: 28, cert: false },
  { course: 'Tech Leadership', done: 10, total: 18, hours: 72, cert: false },
  { course: 'AI Research & Innovation', done: 4, total: 24, hours: 32, cert: false }
];

function statusItemHTML(item) {
  const pct = Math.round((item.done / item.total) * 100);
  return `
    <div class="status-item">
      <div>
        <strong>${item.course}</strong>
        <div class="muted small">${item.done}/${item.total} modules • ${item.hours} hours</div>
      </div>
      <div style="display:grid; gap:8px; min-width:160px;">
        <div class="progress"><div class="fill" style="--p:${pct}%"></div></div>
        <div class="small" style="text-align:right; font-weight:800;">${pct}%</div>
      </div>
    </div>
  `;
}
statusList.innerHTML = STATUS_ITEMS.map(statusItemHTML).join('');

/* ---------- Tilt (3D-ish) ---------- */
let tiltNodes = [];
function attachTilt() {
  tiltNodes = Array.from(document.querySelectorAll('.tilt'));
  tiltNodes.forEach(node => {
    node.addEventListener('mousemove', onTiltMove);
    node.addEventListener('mouseleave', onTiltLeave);
  });
}
function onTiltMove(e) {
  const r = this.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const rx = ((y / r.height) - 0.5) * -8;
  const ry = ((x / r.width) - 0.5) * 10;
  this.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
}
function onTiltLeave() {
  this.style.transform = 'rotateX(0) rotateY(0)';
}
attachTilt();

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('reveal-in');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section .card, .section .section-head, .hero-copy, .hero-visual')
  .forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

/* reveal CSS (inserted at runtime to keep style.css tidy) */
const revealStyle = document.createElement('style');
revealStyle.textContent = `
.reveal { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
.reveal-in { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(revealStyle);

/* ---------- Modals ---------- */
function openModal(id) { document.getElementById(id).classList.add('show'); }
function closeModal(id) { document.getElementById(id).classList.remove('show'); }

document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.getAttribute('data-open')));
});
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
});
document.querySelectorAll('[data-switch]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const to = a.getAttribute('data-switch');
    const closeId = a.getAttribute('data-close');
    if (closeId) closeModal(closeId);
    openModal(to);
  });
});
document.querySelectorAll('.modal').forEach(m =>
  m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('show'); })
);

/* ---------- Smooth nav ---------- */
document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const node = document.getElementById(id);
    node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
