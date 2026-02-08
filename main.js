/* ════════════════════════════════════════════════════════
   FLYGHT — Cinematic Intro & Hero Animations
   ════════════════════════════════════════════════════════ */

import gsap from 'gsap';

// ── Refs ────────────────────────────────────────────────

const cursor = document.getElementById('cursor');
const intro = document.getElementById('intro');
const introTop = document.getElementById('introTop');
const introBottom = document.getElementById('introBottom');
const introLine = document.getElementById('introLine');
const introCounter = document.getElementById('introCounter');

const noise = document.querySelector('.noise');
const vignette = document.querySelector('.vignette');
const gradientBg = document.querySelector('.gradient-bg');

const eyebrow = document.getElementById('eyebrow');
const eyebrowLineL = document.getElementById('eyebrowLineL');
const eyebrowLineR = document.getElementById('eyebrowLineR');
const titleChars = document.querySelectorAll('.title-char');
const titleAccent = document.getElementById('titleAccent');
const taglineInners = document.querySelectorAll('.tagline-inner');
const filmIndex = document.getElementById('filmIndex');
const filmEntries = document.querySelectorAll('.film-entry');
const cta = document.getElementById('cta');
const markers = document.querySelectorAll('.marker');

// ── Mouse ───────────────────────────────────────────────

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let cx = mx, cy = my;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
});

// Cursor hover detection
const hoverables = document.querySelectorAll('.cta-btn, .film-entry, .title-char');
hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

function animateCursor() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;

    cursor.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

    const ring = cursor.querySelector('.cursor-circle');
    ring.style.transform = `translate3d(${cx - mx}px, ${cy - my}px, 0)`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// ── Title Letter Interactions ───────────────────────────

titleChars.forEach((char, i) => {
    char.addEventListener('mouseenter', () => {
        gsap.to(char, {
            y: -10,
            backgroundPosition: '0% 100%',
            duration: 0.4,
            ease: 'power3.out',
        });

        // Subtly move neighboring letters
        const prev = titleChars[i - 1];
        const next = titleChars[i + 1];
        if (prev) gsap.to(prev, { y: -4, duration: 0.4, ease: 'power3.out' });
        if (next) gsap.to(next, { y: -4, duration: 0.4, ease: 'power3.out' });
    });

    char.addEventListener('mouseleave', () => {
        gsap.to(char, {
            y: 0,
            backgroundPosition: '0% 0%',
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)',
        });

        const prev = titleChars[i - 1];
        const next = titleChars[i + 1];
        if (prev) gsap.to(prev, { y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        if (next) gsap.to(next, { y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
});

// ════════════════════════════════════════════════════════
//   MASTER TIMELINE
// ════════════════════════════════════════════════════════

const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

// ── Phase 1: Counter ────────────────────────────────────
// "00" appears, counts to "100"

tl.to(introCounter, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out',
})
    .to(introCounter, {
        innerText: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        snap: { innerText: 1 },
        onUpdate() {
            const v = Math.round(parseFloat(introCounter.innerText));
            introCounter.innerText = String(v).padStart(3, '0');
        },
    })

    // ── Phase 2: Counter fades, Line appears & expands ──────
    // A thin teal line at center grows from 0 to full viewport width

    .to(introCounter, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
    }, '-=0.2')

    .to(introLine, {
        width: '100vw',
        duration: 1,
        ease: 'power4.inOut',
    }, '-=0.1')

    // ── Phase 3: Bars split open ────────────────────────────
    // The line stays, top bar slides up, bottom bar slides down

    .to(introLine, {
        height: '3px',
        boxShadow: '0 0 40px 8px rgba(122, 179, 176, 0.3), 0 0 100px 20px rgba(122, 179, 176, 0.08)',
        duration: 0.3,
        ease: 'power2.out',
    })

    .to(introTop, {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
    }, '-=0.1')

    .to(introBottom, {
        yPercent: 100,
        duration: 1.2,
        ease: 'power4.inOut',
    }, '<')

    // Line fades as bars separate
    .to(introLine, {
        opacity: 0,
        height: '1px',
        duration: 0.8,
        ease: 'power2.in',
    }, '<+0.3')

    // ── Phase 4: Environment reveals ────────────────────────

    .to(gradientBg, {
        opacity: 1,
        duration: 2,
        ease: 'power1.out',
    }, '-=0.6')

    .to(vignette, {
        opacity: 1,
        duration: 1.5,
    }, '<')

    .to(noise, {
        opacity: 0.025,
        duration: 1.5,
    }, '<+0.3')

    // Hide intro layer
    .set(intro, { display: 'none' })

    // ── Phase 5: Hero Content ───────────────────────────────

    // Eyebrow
    .to(eyebrow, {
        opacity: 1,
        duration: 0.8,
    }, '-=1')

    .to([eyebrowLineL, eyebrowLineR], {
        width: 50,
        duration: 0.8,
        ease: 'power2.out',
    }, '<')

    // Title letters — clip-masked slide up
    .to(titleChars, {
        y: 0,
        duration: 1,
        stagger: 0.06,
        ease: 'power4.out',
    }, '-=0.4')

    // Title accent line
    .to(titleAccent, {
        opacity: 1,
        width: '280px',
        duration: 0.8,
        ease: 'power2.out',
    }, '-=0.3')

    // Tagline lines
    .to(taglineInners, {
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power4.out',
    }, '-=0.4')

    // Film index
    .to(filmIndex, {
        opacity: 1,
        duration: 0.6,
    }, '-=0.3')

    .from(filmEntries, {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out',
    }, '<')

    // CTA
    .to(cta, {
        opacity: 1,
        duration: 0.6,
    }, '-=0.1')

    .from(cta, {
        y: 12,
        duration: 0.6,
        ease: 'power2.out',
    }, '<')

    // Corner markers
    .to(markers, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
    }, '-=0.4')

    // ── Phase 6: Post-reveal shimmer ────────────────────────
    // A subtle gradient sweep across the title

    .to(titleChars, {
        backgroundPosition: '0% 40%',
        duration: 2.5,
        stagger: 0.08,
        ease: 'sine.inOut',
    }, '-=0.5')

    .to(titleChars, {
        backgroundPosition: '0% 0%',
        duration: 2,
        stagger: 0.08,
        ease: 'sine.inOut',
    });

// ── Ambient: Gradient orbs parallax with mouse ──────────

function animateOrbs() {
    const nx = (mx / window.innerWidth - 0.5) * 2;  // -1 to 1
    const ny = (my / window.innerHeight - 0.5) * 2;

    const orbs = document.querySelectorAll('.gradient-orb');
    const speeds = [12, 8, 15];

    orbs.forEach((orb, i) => {
        gsap.to(orb, {
            x: nx * speeds[i],
            y: ny * speeds[i],
            duration: 3,
            ease: 'power2.out',
            overwrite: 'auto',
        });
    });

    requestAnimationFrame(animateOrbs);
}
animateOrbs();
