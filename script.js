/* ============================================================
   FIKR INTEGRATED ACADEMY — SITE SCRIPT
   ------------------------------------------------------------
   Loaded via <script src="script.js" defer> at the end of <head>,
   so it always runs after the DOM has been parsed (no need for a
   DOMContentLoaded wrapper) but never blocks HTML parsing/paint.
   Sections: footer year, navbar scroll state, mobile menu,
   academics tabs, scroll-reveal animation, admissions form
   (mailto), custom cursor, back-to-top, smooth anchor scrolling,
   hero background carousel.
   ============================================================ */

/* ——————————————————————————————————
   FOOTER YEAR: Auto-updates each year
—————————————————————————————————— */
document.getElementById('footer-year').textContent = new Date().getFullYear();


/* ——————————————————————————————————
   NAVBAR: Scroll behaviour
   Adds .scrolled class when user scrolls > 80px
—————————————————————————————————— */
const navbar = document.getElementById('navbar');
// { passive: true }: tells the browser this handler never calls
// preventDefault(), so scrolling can stay smooth/off the main thread.
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });
// Ensure correct state on page load
if (window.scrollY > 80) navbar.classList.add('scrolled');


/* ——————————————————————————————————
   MOBILE MENU: Toggle open/close
—————————————————————————————————— */
const hamburgerBtn  = document.getElementById('hamburgerBtn');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const mobileNav     = document.getElementById('mobileNav');

hamburgerBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  // Switch icon between bars and X
  hamburgerIcon.className = mobileNav.classList.contains('open')
    ? 'fas fa-xmark'
    : 'fas fa-bars';
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburgerIcon.className = 'fas fa-bars';
  });
});


/* ——————————————————————————————————
   ACADEMICS TABS: Switch between Primary & Secondary
   Called directly from onclick attributes in HTML
—————————————————————————————————— */
function switchTab(btn, tabId) {
  // Deactivate all tabs and panels
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

  // Activate clicked tab and matching panel
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}


/* ——————————————————————————————————
   SCROLL REVEAL ANIMATION
   Uses IntersectionObserver for performance
—————————————————————————————————— */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Animate only once
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

// Observe all elements with .reveal or .reveal-stagger
document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
  revealObserver.observe(el);
});


/* ——————————————————————————————————
   FORM SUBMISSION (mailto)
   Opens the user's email client with a pre-filled message
—————————————————————————————————— */
function submitForm() {
  const name     = document.getElementById('parentName').value.trim();
  const phone    = document.getElementById('phone').value.trim();
  const email    = document.getElementById('email').value.trim();
  const childName = document.getElementById('childName').value.trim();
  const childAge  = document.getElementById('childAge').value.trim();
  const message   = document.getElementById('message').value.trim();

  if (!name || !phone || !email) {
    alert('Please fill in your name, phone number and email address.');
    return;
  }

  const subject = 'Admissions Enquiry - ' + name;
  const bodyLines = [
    'Parent/Guardian Name: ' + name,
    'Phone Number: ' + phone,
    'Email Address: ' + email,
    "Child's Name: " + (childName || '-'),
    "Child's Age / Year Group: " + (childAge || '-'),
    '',
    'Message:',
    message || '-'
  ];
  const body = bodyLines.join('\n');

  const mailtoLink = 'mailto:fikracademy@outlook.com?subject=' +
    encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

  window.location.href = mailtoLink;

  alert(
    'Thank you, ' + name + '!\n\n' +
    'Your email app should now open with your enquiry pre-filled. ' +
    'Please hit send to complete your submission, and our admissions team will contact you within 24 hours.\n\nJazakAllahu Khayran!'
  );
}


/* ——————————————————————————————————
   CUSTOM CURSOR
   Skipped entirely on touch devices and for users who have
   requested reduced motion (avoids a continuous rAF loop that
   they didn't ask for and that costs battery for no benefit).
—————————————————————————————————— */
(function() {
  const ring = document.getElementById('custom-cursor-ring');
  const dot  = document.getElementById('custom-cursor-dot');
  if (!ring || !dot) return;

  // Only activate on non-touch devices
  if (!window.matchMedia('(pointer: fine)').matches) return;
  // Respect OS-level "reduce motion" preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mx = -100, my = -100; // off-screen until first move
  let rx = -100, ry = -100;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // Dot follows instantly
    dot.style.transform = 'translate(' + mx + 'px, ' + my + 'px) translate(-50%, -50%)';
  });

  // Ring follows with slight lag
  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = 'translate(' + rx + 'px, ' + ry + 'px) translate(-50%, -50%)';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverEls = 'a, button, [role="button"], input, textarea, select, label';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


/* ——————————————————————————————————
   BACK TO TOP
—————————————————————————————————— */
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ——————————————————————————————————
   SMOOTH ANCHOR SCROLLING
   Accounts for fixed navbar height (~80px) so a jumped-to
   section isn't hidden underneath it.
—————————————————————————————————— */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // Height of fixed navbar
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ——————————————————————————————————
   HERO BACKGROUND CAROUSEL
   Cycles through the 5 hero images, crossfading via the
   .active class (actual fade transition lives in style.css).
   The first slide has loading="eager" in the HTML so it paints
   immediately; the rest are loading="lazy" for faster first load.
—————————————————————————————————— */
(function () {
  const slides = document.querySelectorAll('#heroCarousel .hero-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 6000);
})();
