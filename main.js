/* ════════════════════════════════════════════════════════
   FLYGHT — Intro & Hero Animations
   Counter → Line → Split (line gone) → Reveal
   ════════════════════════════════════════════════════════ */

import gsap from 'gsap';

// ── Elements ────────────────────────────────────────────

const intro = document.getElementById('intro');
const introTop = document.getElementById('introTop');
const introBottom = document.getElementById('introBottom');
const introLine = document.getElementById('introLine');
const introCounter = document.getElementById('introCounter');

const noise = document.querySelector('.noise');
const eyebrow = document.getElementById('eyebrow');
const eyebrowLines = document.querySelectorAll('.eyebrow-line');
const titleChars = document.querySelectorAll('.title-char');
const tagInners = document.querySelectorAll('.tag-inner');
const filmIndex = document.getElementById('filmIndex');
const filmEntries = document.querySelectorAll('.film-entry');
const cta = document.getElementById('cta');

// ════════════════════════════════════════════════════════
//   MASTER TIMELINE
// ════════════════════════════════════════════════════════

const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

// ── 1. Counter ──────────────────────────────────────────

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

    // ── 2. Counter out, Line in ─────────────────────────────

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

    // Line brightens and glows
    .to(introLine, {
        height: '3px',
        boxShadow: '0 0 30px 6px rgba(224, 223, 216, 0.4), 0 0 80px 15px rgba(224, 223, 216, 0.1)',
        duration: 0.35,
        ease: 'power2.out',
    })

    // ── 3. Split — Line disappears INSTANTLY, edges glow ────

    // Kill the line immediately
    .set(introLine, { opacity: 0 })

    // Give the bar edges their glow (replaces the line visually)
    .set(introTop, {
        boxShadow: '0 3px 35px 4px rgba(224, 223, 216, 0.25), 0 1px 6px rgba(224, 223, 216, 0.5)',
    })
    .set(introBottom, {
        boxShadow: '0 -3px 35px 4px rgba(224, 223, 216, 0.25), 0 -1px 6px rgba(224, 223, 216, 0.5)',
    })

    // Bars slide away — hero image revealed behind
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

    // Fade the glowing edges as bars move away
    .to(introTop, {
        boxShadow: '0 3px 35px 4px rgba(224, 223, 216, 0), 0 1px 6px rgba(224, 223, 216, 0)',
        duration: 0.8,
    }, '<+0.3')

    .to(introBottom, {
        boxShadow: '0 -3px 35px 4px rgba(224, 223, 216, 0), 0 -1px 6px rgba(224, 223, 216, 0)',
        duration: 0.8,
    }, '<')

    // ── 4. Overlays ─────────────────────────────────────────

    .to(noise, {
        opacity: 0.02,
        duration: 1.2,
    }, '-=0.8')

    .set(intro, { display: 'none' })

    // ── 5. Hero content ─────────────────────────────────────

    .to(eyebrow, {
        opacity: 1,
        duration: 0.7,
    }, '-=1')

    .to(eyebrowLines, {
        width: 40,
        duration: 0.6,
        ease: 'power2.out',
    }, '<+0.1')

    // Title letters slide up
    .to(titleChars, {
        y: 0,
        duration: 0.9,
        stagger: 0.05,
        ease: 'power4.out',
    }, '-=0.3')

    // Tagline
    .to(tagInners, {
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power4.out',
    }, '-=0.5')

    // Film index
    .to(filmIndex, {
        opacity: 1,
        duration: 0.5,
    }, '-=0.3')

    .from(filmEntries, {
        y: 12,
        opacity: 0,
        duration: 0.4,
        stagger: 0.03,
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
        gsap.to(c, { y: -7, duration: 0.3, ease: 'power3.out' });
        if (titleChars[i - 1]) gsap.to(titleChars[i - 1], { y: -3, duration: 0.3, ease: 'power3.out' });
        if (titleChars[i + 1]) gsap.to(titleChars[i + 1], { y: -3, duration: 0.3, ease: 'power3.out' });
    });

    c.addEventListener('mouseleave', () => {
        gsap.to(c, { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        if (titleChars[i - 1]) gsap.to(titleChars[i - 1], { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        if (titleChars[i + 1]) gsap.to(titleChars[i + 1], { y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
});

// ── Subtle parallax on hero background ──────────────────

const heroBg = document.querySelector('.hero-bg-img');

if (heroBg && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(heroBg, {
            x: nx * -8,
            y: ny * -8,
            duration: 2,
            ease: 'power2.out',
            overwrite: 'auto',
        });
    });
}
