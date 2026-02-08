/* ════════════════════════════════════════════════════════
   FLYGHT — Film Page: Top Gun: Maverick
   Scroll-reveal animations with GSAP + ScrollTrigger
   ════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Elements ────────────────────────────────────────────

const filmNav = document.getElementById('filmNav');
const filmNumber = document.getElementById('filmNumber');
const filmTitle = document.getElementById('filmTitle');
const filmMeta = document.getElementById('filmMeta');
const filmQuote = document.getElementById('filmQuote');
const scrollHint = document.getElementById('scrollHint');

// ════════════════════════════════════════════════════════
//   HERO ENTRANCE ANIMATION
// ════════════════════════════════════════════════════════

const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTL
    // Nav slides down
    .to(filmNav, {
        opacity: 1,
        y: 0,
        duration: 0.8,
    }, '+=0.3')

    // Film number
    .to(filmNumber, {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.4')

    // Title
    .to(filmTitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out',
    }, '-=0.3')

    // Meta
    .to(filmMeta, {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.5')

    // Quote
    .to(filmQuote, {
        opacity: 1,
        duration: 0.8,
    }, '-=0.3')

    // Scroll hint
    .to(scrollHint, {
        opacity: 0.6,
        duration: 0.5,
    }, '-=0.2');

// ════════════════════════════════════════════════════════
//   SCROLL-TRIGGERED SECTIONS
// ════════════════════════════════════════════════════════

// Helper: reveal elements when section enters viewport
function revealOnScroll(selector, stagger = 0.15) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
        });
    });
}

// Section labels
revealOnScroll('.section-label');

// Section content blocks
revealOnScroll('.section-content');

// Fact cards — staggered
const factCards = document.querySelectorAll('.fact-card');
if (factCards.length) {
    gsap.to(factCards, {
        scrollTrigger: {
            trigger: '.facts-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
    });
}

// Next film section
revealOnScroll('.next-label');
revealOnScroll('.next-card');

// ════════════════════════════════════════════════════════
//   PARALLAX EFFECTS
// ════════════════════════════════════════════════════════

// Hero parallax — content moves up slower than scroll
const heroContent = document.querySelector('.film-hero-content');
if (heroContent) {
    gsap.to(heroContent, {
        scrollTrigger: {
            trigger: '.film-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
        y: -80,
        opacity: 0.3,
        ease: 'none',
    });
}

// Quote parallax
if (filmQuote) {
    gsap.to(filmQuote, {
        scrollTrigger: {
            trigger: '.film-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        },
        y: -40,
        opacity: 0,
        ease: 'none',
    });
}

// Hide scroll hint on scroll
if (scrollHint) {
    gsap.to(scrollHint, {
        scrollTrigger: {
            trigger: '.film-hero',
            start: 'top top',
            end: '20% top',
            scrub: 1,
        },
        opacity: 0,
        y: -15,
        ease: 'none',
    });
}

// ════════════════════════════════════════════════════════
//   NAV BACKGROUND INTENSITY ON SCROLL
// ════════════════════════════════════════════════════════

ScrollTrigger.create({
    trigger: '.film-hero',
    start: 'top top',
    end: '80% top',
    onUpdate: (self) => {
        const progress = self.progress;
        filmNav.style.background = `rgba(6, 6, 9, ${0.6 + progress * 0.3})`;
    },
});
