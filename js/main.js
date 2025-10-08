// main.js - basit client loader ve tema yöneticisi
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

async function loadSection(id, url){
  try{
    const res = await fetch(url, {cache: 'no-store'});
    if(!res.ok) throw new Error('Not found');
    const html = await res.text();
    // Parse HTML safely and append nodes without executing scripts
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const container = document.getElementById(id);
    if(!container) return;
    // clear existing
    while(container.firstChild) container.removeChild(container.firstChild);
    // move nodes except scripts
    Array.from(doc.body.childNodes).forEach(node=>{
      if(node.nodeName.toLowerCase() === 'script') return; // skip scripts
      container.appendChild(document.importNode(node, true));
    });
  }catch(e){
    console.error('Section load failed', id, e);
    const container = document.getElementById(id);
    if(container){
      while(container.firstChild) container.removeChild(container.firstChild);
      const card = document.createElement('div'); card.className='card p-3';
      const p = document.createElement('p'); p.className='muted'; p.textContent = 'Bölüm yüklenemedi.';
      card.appendChild(p); container.appendChild(card);
    }
  }
}

// load external sections
loadSection('about-placeholder','sections/about.html');
loadSection('projects-placeholder','sections/projects.html');
loadSection('contact-placeholder','sections/contact.html');

// theme
function setTheme(t){
  if(t==='dark') htmlEl.setAttribute('data-theme','dark');
  else htmlEl.removeAttribute('data-theme');
  themeToggle.setAttribute('aria-pressed', t==='dark');
}

const saved = localStorage.getItem('theme');
if(saved) setTheme(saved);
else setTheme('dark'); // default to dark theme

themeToggle.addEventListener('click', ()=>{
  const isDark = htmlEl.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  setTheme(next);
  localStorage.setItem('theme', next);
});

// keyboard support
themeToggle.addEventListener('keydown',(e)=>{
  if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeToggle.click(); }
});

// smooth scroll for nav links and active state
const navContainer = document.querySelector('header nav') || document;
const navLinks = Array.from(navContainer.querySelectorAll('a.nav-link')) || [];
navLinks.forEach(a=>{
  a.addEventListener('click',(e)=>{
    e.preventDefault();
    const href = a.getAttribute('href');
    const target = document.querySelector(href);
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    // update active immediately
    navLinks.forEach(n=>n.classList.remove('active'));
    a.classList.add('active');
  });
});

function onScroll(){
  const positions = navLinks.map(l=>{
    const sel = l.getAttribute('href');
    const el = document.querySelector(sel);
    if(!el) return {link:l, top: Infinity};
    const rect = el.getBoundingClientRect();
    return {link:l, top: Math.abs(rect.top)};
  });
  positions.sort((a,b)=>a.top-b.top);
  navLinks.forEach(l=>l.classList.remove('active'));
  if(positions[0] && positions[0].link) positions[0].link.classList.add('active');
}
window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

// Typing effect
const words = ['Front-end geliştiricisi', '', 'PHP & HTML/CSS tutkunu'];
const typingEl = document.getElementById('typing');
let tIndex=0, cIndex=0, forward=true;
function tick(){
  const word = words[tIndex];
  if(forward){
    cIndex++;
    if(cIndex>word.length){ forward=false; setTimeout(tick,800); return; }
  } else {
    cIndex--;
    if(cIndex===0){ forward=true; tIndex=(tIndex+1)%words.length; }
  }
  typingEl.textContent = word.slice(0,cIndex);
  setTimeout(tick, forward?120:50);
}
if(typingEl) tick();

// Reveal on scroll
const ro = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('visible');
  });
},{threshold:0.12});
document.querySelectorAll('.card, .hero, section').forEach(el=>el.classList.add('reveal'));
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// FAB and back-to-top
const fab = document.getElementById('contactFab');
const backTop = document.getElementById('backTop');
if(fab) fab.addEventListener('click', ()=>{
  const target = document.getElementById('contact');
  if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
});
window.addEventListener('scroll', ()=>{
  if(window.scrollY>300) backTop.classList.add('show'); else backTop.classList.remove('show');
});
if(backTop) backTop.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

// Make project cards position-relative and add overlay
setTimeout(()=>{
  document.querySelectorAll('.card').forEach(c=>{
    if(c.querySelector('.overlay')) return;
    c.classList.add('position-relative');
    const ov = document.createElement('div'); ov.className='overlay'; c.appendChild(ov);
  });
},600);

// Contact form removed — using social links instead. No form handler.

// Hero entrance animation (subtle)
document.addEventListener('DOMContentLoaded', ()=>{
  const h1 = document.getElementById('intro-title');
  const decor = document.querySelector('.hero-decor');
  if(h1){ h1.style.opacity=0; h1.style.transform='translateY(10px)'; setTimeout(()=>{ h1.style.transition='all 520ms ease'; h1.style.opacity=1; h1.style.transform='none'; },220); }
  if(decor){ decor.style.opacity=0; decor.style.transform='scale(0.98)'; setTimeout(()=>{ decor.style.transition='all 680ms cubic-bezier(.2,.9,.3,1)'; decor.style.opacity=1; decor.style.transform='none'; },400); }
});

// Project modal: open when project links are clicked
function setupProjectModal(){
  const modal = document.getElementById('projectModal');
  if(!modal) return;
  const title = document.getElementById('modalTitle');
  const desc = document.getElementById('modalDesc');
  const actions = document.getElementById('modalActions');

  function openModal(t,d,action){
    title.textContent = t || '';
    desc.textContent = d || '';
    // clear actions
    while(actions.firstChild) actions.removeChild(actions.firstChild);
    if(typeof action === 'function') action(actions);
    else if(typeof action === 'string'){ const span=document.createElement('span'); span.textContent=action; actions.appendChild(span); }
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', closeModal));
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

  // bind project buttons (delegation)
  document.body.addEventListener('click',(e)=>{
    const btn = e.target.closest && e.target.closest('.card a');
    if(!btn) return;
    e.preventDefault();
    const card = btn.closest('.card');
    const t = card && card.querySelector('h3') ? card.querySelector('h3').innerText : 'Proje';
    const d = card && card.querySelector('.muted') ? card.querySelector('.muted').innerText : '';
    // create actions programmatically to avoid innerHTML
    const a1 = document.createElement('a'); a1.className='btn btn-primary me-2'; a1.href='#'; a1.textContent='Aç';
    const a2 = document.createElement('a'); a2.className='btn btn-outline-secondary'; a2.href='#'; a2.textContent='Kod';
    openModal(t,d,function(panelActions){ panelActions.appendChild(a1); panelActions.appendChild(a2); });
  });
}
setupProjectModal();
