/* ════════════════════════════════════════════════════════
   FLYGHT — Intro + Hero Animations
   Clean title reveal (no letter-by-letter)
   ════════════════════════════════════════════════════════ */

import gsap from 'gsap';

// ── Elements ────────────────────────────────────────────

const intro = document.getElementById('intro');
const introTop = document.getElementById('introTop');
const introBottom = document.getElementById('introBottom');
const introLine = document.getElementById('introLine');
const introCounter = document.getElementById('introCounter');
const noise = document.querySelector('.noise');

const heroSub = document.getElementById('heroSub');
const heroTitle = document.querySelector('.hero-title');
const heroDivider = document.getElementById('heroDivider');
const dividerLines = document.querySelectorAll('.divider-line');
const heroDesc = document.getElementById('heroDesc');
const ctaWrap = document.getElementById('ctaWrap');
const manifestRows = document.querySelectorAll('.manifest-row');

// ════════════════════════════════════════════════════════
//   MASTER TIMELINE
// ════════════════════════════════════════════════════════

const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

// ── 1. Counter ──────────────────────────────────────────

tl.to(introCounter, { opacity: 1, duration: 0.4 })

    .to(introCounter, {
        innerText: 100,
        duration: 2,
        ease: 'power2.inOut',
        snap: { innerText: 1 },
        onUpdate() {
            const v = Math.round(parseFloat(introCounter.innerText));
            introCounter.innerText = String(v).padStart(3, '0');
        },
    })

    // ── 2. Line expands ────────────────────────────────────

    .to(introCounter, { opacity: 0, duration: 0.3 }, '-=0.15')

    .set(introLine, { opacity: 1 })

    .to(introLine, {
        width: '100vw',
        duration: 1.2,
        ease: 'power4.inOut',
    })

    .to(introLine, {
        height: '3px',
        boxShadow: '0 0 30px 6px rgba(214,212,204,0.4), 0 0 80px 15px rgba(214,212,204,0.1)',
        duration: 0.35,
        ease: 'power2.out',
    })

    // ── 3. Split — line gone, edges glow ────────────────────

    .set(introLine, { opacity: 0 })

    .set(introTop, {
        boxShadow: '0 3px 35px 4px rgba(214,212,204,0.25), 0 1px 6px rgba(214,212,204,0.5)',
    })
    .set(introBottom, {
        boxShadow: '0 -3px 35px 4px rgba(214,212,204,0.25), 0 -1px 6px rgba(214,212,204,0.5)',
    })

    .to(introTop, { yPercent: -100, duration: 1.4, ease: 'power3.inOut' })
    .to(introBottom, { yPercent: 100, duration: 1.4, ease: 'power3.inOut' }, '<')

    .to(introTop, {
        boxShadow: '0 3px 35px 4px transparent, 0 1px 6px transparent',
        duration: 0.8,
    }, '<+0.3')
    .to(introBottom, {
        boxShadow: '0 -3px 35px 4px transparent, 0 -1px 6px transparent',
        duration: 0.8,
    }, '<')

    .to(noise, { opacity: 0.02, duration: 1 }, '-=0.8')
    .set(intro, { display: 'none' })

    // ── 4. Hero content ─────────────────────────────────────

    // Subtitle
    .to(heroSub, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
    }, '-=0.9')

    // Title — clean single reveal from mask
    .to(heroTitle, {
        y: 0,
        duration: 1.1,
        ease: 'power4.out',
    }, '-=0.5')

    // Divider
    .to(heroDivider, { opacity: 1, duration: 0.5 }, '-=0.5')
    .to(dividerLines, { width: 50, duration: 0.7, ease: 'power2.out' }, '<')

    // Description
    .to(heroDesc, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
    }, '-=0.3')

    // CTA
    .to(ctaWrap, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
    }, '-=0.3')

    // Manifest rows (from right)
    .to(manifestRows, {
        opacity: 1,
        duration: 0.4,
        stagger: 0.04,
    }, '-=0.4')

    .from(manifestRows, {
        x: 15,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out',
    }, '<');

// ── Background Parallax ─────────────────────────────────

const bgImg = document.querySelector('.hero-bg-img');

if (bgImg && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(bgImg, {
            x: nx * -10,
            y: ny * -10,
            duration: 2.5,
            ease: 'power2.out',
            overwrite: 'auto',
        });
    });
}
