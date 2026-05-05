import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   PAGE LOAD — hero & header entrance
   ============================================================ */
export function animatePageLoad() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Header slides down
  tl.fromTo(
    '.ix-header, .header',
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5 }
  );

  // Hero content staggers in — only when hero exists
  const heroChildren = gsap.utils.toArray<Element>('.hero-content > *');
  if (heroChildren.length > 0) {
    tl.fromTo(
      heroChildren,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
      '-=0.2'
    );
  }

  return tl;
}

/* ============================================================
   SCROLL REVEAL — generic elements
   ============================================================ */
export function initScrollReveal() {
  // Feature boxes
  gsap.utils.toArray<Element>('.features .container .box').forEach((box, i) => {
    gsap.fromTo(
      box,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: box,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Category cards
  gsap.utils.toArray<Element>('.category-card-3d').forEach((card, i) => {
    gsap.fromTo(
      card,
      { y: 30, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        delay: i * 0.07,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Product cards
  gsap.utils.toArray<Element>('.card').forEach((card, i) => {
    gsap.fromTo(
      card,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        delay: (i % 4) * 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Pricing plan cards
  gsap.utils.toArray<Element>('.plan-card').forEach((card, i) => {
    gsap.fromTo(
      card,
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Stat cards (About)
  gsap.utils.toArray<Element>('.about-stats article').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        delay: i * 0.07,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Section headings
  gsap.utils.toArray<Element>('h2').forEach((h) => {
    gsap.fromTo(
      h,
      { x: -16, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: h,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* ============================================================
   CARD HOVER — magnetic lift + border glow
   Applies to product cards only (CSS handles the basic lift,
   GSAP adds the smooth border glow)
   ============================================================ */
export function initCardHoverEffects() {
  const cards = document.querySelectorAll<HTMLElement>('.card');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.25), 0 0 40px rgba(59,130,246,0.1)',
        duration: 0.25,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    });
  });
}

/* ============================================================
   SIDEBAR ENTRANCE — products page
   ============================================================ */
export function animateSidebarEntrance() {
  gsap.fromTo(
    '.ix-sidebar',
    { x: -30, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
  );

  gsap.fromTo(
    '.ix-panel-header',
    { y: -16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.1 }
  );
}

/* ============================================================
   FLY-TO-CART — green dot flies from source element to cart badge
   ============================================================ */
export function flyToCart(originEl: HTMLElement) {
  const cartBadge = document.querySelector<HTMLElement>('.cart-badge');
  if (!cartBadge || !originEl) return;

  const originRect = originEl.getBoundingClientRect();
  const cartRect = cartBadge.getBoundingClientRect();

  const dot = document.createElement('div');
  dot.className = 'cart-fly-dot';
  const startX = originRect.left + originRect.width / 2 - 8;
  const startY = originRect.top + originRect.height / 2 - 8;
  dot.style.cssText = `left:${startX}px;top:${startY}px;`;
  document.body.appendChild(dot);

  const endX = cartRect.left + cartRect.width / 2 - 8;
  const endY = cartRect.top + cartRect.height / 2 - 8;

  gsap.fromTo(
    dot,
    { x: 0, y: 0, scale: 1, opacity: 1 },
    {
      x: endX - startX,
      y: endY - startY,
      scale: 0.4,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.in',
      onComplete: () => {
        dot.remove();
        gsap.fromTo(
          cartBadge,
          { scale: 1.7 },
          { scale: 1, duration: 0.35, ease: 'back.out(2)' }
        );
      },
    }
  );
}

/* ============================================================
   STATUS DOT — green pulse  (fallback if CSS not applied)
   ============================================================ */
export function animateStatusDot() {
  const dot = document.querySelector('.ix-status-dot');
  if (!dot) return;
  gsap.to(dot, {
    scale: 0.7,
    opacity: 0.5,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

/* ============================================================
   HERO BUTTON — subtle continuous breathe
   ============================================================ */
export function animateHeroBtn() {
  gsap.to('.hero-btn', {
    boxShadow: '0 8px 28px rgba(59,130,246,0.5), 0 0 50px rgba(59,130,246,0.2)',
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}

/* ============================================================
   CLEANUP
   ============================================================ */
export function killAllAnimations() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.clear();
}
