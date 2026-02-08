/* ════════════════════════════════════════════════════════
   FLYGHT — Arc Title + Flight CTA
   Letters same size, positioned along smooth curve
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
const heroTitle = document.getElementById('heroTitle');
const heroDivider = document.getElementById('heroDivider');
const dividerLines = document.querySelectorAll('.divider-line');
const heroDesc = document.getElementById('heroDesc');
const ctaWrap = document.getElementById('ctaWrap');
const manifestRows = document.querySelectorAll('.manifest-row');

// ════════════════════════════════════════════════════════
//   PARABOLIC ARC POSITIONING
//
//   All letters are the same SIZE.
//   They are positioned vertically along a smooth parabola:
//
//     y(i) = amplitude × (t² - 1)
//     where t = normalized position from -1 (left) to +1 (right)
//
//   This creates a ∪ curve: edges fly UP, center stays DOWN.
//   Each letter is also slightly rotated following the
//   curve's tangent: rot(i) = 2 × amplitude × t
//   
//   Result: the word curves up at both ends like wings ✈
// ════════════════════════════════════════════════════════

function applyArc() {
    const letters = document.querySelectorAll('.t');
    const n = letters.length;

    // Responsive amplitude (how much the edges curve up)
    const vw = window.innerWidth;
    let amplitude;
    if (vw > 1200) amplitude = -40;  // px upward at edges
    else if (vw > 768) amplitude = -28;
    else if (vw > 480) amplitude = -18;
    else amplitude = -12;

    // Max rotation at edges (degrees)
    const maxRot = 6;

    letters.forEach((letter, i) => {
        // Normalize i to range [-1, 1]
        const t = (2 * i / (n - 1)) - 1;  // F=-1, T=+1, center=0

        // Parabola: y = amp × (t² - 1)
        // At edges (t=±1): y = 0 (no offset — these are the highest)
        // At center (t=0): y = -amp = +40px (pushed DOWN)
        // So the edges are UP, center is DOWN → ∪ shape
        const ty = amplitude * (t * t - 1);

        // Tangent rotation: follows the slope of the curve
        // slope = 2 × amp × t, convert to degrees
        const rot = maxRot * t;

        letter.style.setProperty('--ty', `${ty}px`);
        letter.style.setProperty('--rot', `${rot}deg`);
    });
}

applyArc();
window.addEventListener('resize', () => requestAnimationFrame(applyArc));

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

    // ── 3. Split ────────────────────────────────────────────

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

    // Title — slides up as one connected word
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

    // Manifest rows
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

// ── Video Background Parallax ───────────────────────────

const bgVideo = document.querySelector('.hero-bg-video');

if (bgVideo && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.to(bgVideo, {
            x: nx * -8,
            y: ny * -8,
            duration: 2.5,
            ease: 'power2.out',
            overwrite: 'auto',
        });
    });
}
