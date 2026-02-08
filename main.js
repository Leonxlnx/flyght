/* ════════════════════════════════════════════════════════
   FLYGHT — Intro & Hero Animations
   No cursor. Clean cinematic intro. Content behind bars.
   ════════════════════════════════════════════════════════ */

import gsap from 'gsap';

// ── Elements ────────────────────────────────────────────

const intro = document.getElementById('intro');
const introTop = document.getElementById('introTop');
const introBottom = document.getElementById('introBottom');
const introLine = document.getElementById('introLine');
const introCounter = document.getElementById('introCounter');

const noise = document.querySelector('.noise');
const vignette = document.querySelector('.vignette');

const eyebrow = document.getElementById('eyebrow');
const eyebrowLines = document.querySelectorAll('.eyebrow-line');
const titleChars = document.querySelectorAll('.title-char');
const titleSweep = document.getElementById('titleSweep');
const tagInners = document.querySelectorAll('.tag-inner');
const filmIndex = document.getElementById('filmIndex');
const filmEntries = document.querySelectorAll('.film-entry');
const cta = document.getElementById('cta');

// ════════════════════════════════════════════════════════
//   MASTER TIMELINE
//   Counter → Line Expands → Bars Split (glow edges) → Reveal
// ════════════════════════════════════════════════════════

const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

// ── 1. Counter fades in and counts 00 → 100 ────────────

tl.to(introCounter, {
    opacity: 1,
    duration: 0.4,
})

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

    // ── 2. Counter fades, Line appears and expands ──────────

    .to(introCounter, {
        opacity: 0,
        duration: 0.3,
    }, '-=0.15')

    .set(introLine, { opacity: 1 })

    .to(introLine, {
        width: '100vw',
        duration: 1.2,
        ease: 'power4.inOut',
    })

    // Line brightens
    .to(introLine, {
        height: '3px',
        boxShadow: '0 0 30px 6px rgba(210, 210, 225, 0.4), 0 0 80px 15px rgba(210, 210, 225, 0.1)',
        duration: 0.4,
        ease: 'power2.out',
    })

    // ── 3. Bars split open — edges GLOW ─────────────────────

    // Add glowing edges to the bars BEFORE they move
    .to(introTop, {
        boxShadow: '0 3px 40px 5px rgba(210, 210, 225, 0.25), 0 1px 8px rgba(210, 210, 225, 0.5)',
        duration: 0.3,
    }, '-=0.1')

    .to(introBottom, {
        boxShadow: '0 -3px 40px 5px rgba(210, 210, 225, 0.25), 0 -1px 8px rgba(210, 210, 225, 0.5)',
        duration: 0.3,
    }, '<')

    // Bars slide away — revealing the hero behind them
    .to(introTop, {
        yPercent: -100,
        duration: 1.4,
        ease: 'power3.inOut',
    })

    .to(introBottom, {
        yPercent: 100,
        duration: 1.4,
        ease: 'power3.inOut',
    }, '<')

    // Line fades during the split
    .to(introLine, {
        opacity: 0,
        duration: 0.6,
    }, '<+0.2')

    // ── 4. Overlays fade in ─────────────────────────────────

    .to(vignette, {
        opacity: 1,
        duration: 1.2,
    }, '-=0.8')

    .to(noise, {
        opacity: 0.02,
        duration: 1.2,
    }, '<')

    // Remove the intro from DOM after it's gone
    .set(intro, { display: 'none' })

    // ── 5. Hero content reveals ─────────────────────────────

    // Eyebrow
    .to(eyebrow, {
        opacity: 1,
        duration: 0.7,
    }, '-=0.8')

    .to(eyebrowLines, {
        width: 45,
        duration: 0.6,
        ease: 'power2.out',
    }, '<+0.1')

    // Title letters — slide up from mask
    .to(titleChars, {
        y: 0,
        duration: 0.9,
        stagger: 0.055,
        ease: 'power4.out',
    }, '-=0.3')

    // Sweep light across title
    .set(titleSweep, { opacity: 1 })
    .to(titleSweep, {
        left: '110%',
        duration: 1.2,
        ease: 'power2.inOut',
    })
    .set(titleSweep, { opacity: 0 })

    // Tagline lines
    .to(tagInners, {
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power4.out',
    }, '-=1')

    // Film index
    .to(filmIndex, {
        opacity: 1,
        duration: 0.5,
    }, '-=0.4')

    .from(filmEntries, {
        y: 12,
        opacity: 0,
        duration: 0.45,
        stagger: 0.035,
        ease: 'power2.out',
    }, '<')

    // CTA
    .to(cta, {
        opacity: 1,
        duration: 0.5,
    }, '-=0.1')

    .from(cta, {
        y: 10,
        duration: 0.5,
        ease: 'power2.out',
    }, '<');

// ── Title Letter Hover ──────────────────────────────────

titleChars.forEach((c, i) => {
    c.addEventListener('mouseenter', () => {
        gsap.to(c, { y: -8, duration: 0.3, ease: 'power3.out' });
        // Neighbors lift slightly
        if (titleChars[i - 1]) gsap.to(titleChars[i - 1], { y: -3, duration: 0.3, ease: 'power3.out' });
        if (titleChars[i + 1]) gsap.to(titleChars[i + 1], { y: -3, duration: 0.3, ease: 'power3.out' });
    });

    c.addEventListener('mouseleave', () => {
        gsap.to(c, { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        if (titleChars[i - 1]) gsap.to(titleChars[i - 1], { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        if (titleChars[i + 1]) gsap.to(titleChars[i + 1], { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
});
