/* ════════════════════════════════════════════════════════
   FLYGHT — Clean Plane Takeoff Transition
   
   Click → plane flies up-right out of screen →
   Giant plane sweeps in from left → wipes to black →
   Film card appears
   ════════════════════════════════════════════════════════ */

import gsap from 'gsap';

// ── Elements ────────────────────────────────────────────

const intro = document.getElementById('intro');
const introTop = document.getElementById('introTop');
const introBottom = document.getElementById('introBottom');
const introLine = document.getElementById('introLine');
const noise = document.querySelector('.noise');

const heroSub = document.getElementById('heroSub');
const heroTitleImg = document.getElementById('heroTitleImg');
const titleReveal = document.getElementById('titleReveal');
const heroDivider = document.getElementById('heroDivider');
const dividerLines = document.querySelectorAll('.divider-line');
const heroDesc = document.getElementById('heroDesc');
const ctaWrap = document.getElementById('ctaWrap');
const ctaBtn = document.getElementById('ctaBtn');
const ctaIcon = document.getElementById('ctaIcon');
const heroCenter = document.getElementById('heroCenter');
const manifestRows = document.querySelectorAll('.manifest-row');

const takeoffOverlay = document.getElementById('takeoffOverlay');
const takeoffCard = document.getElementById('takeoffCard');
const flyingPlane = document.getElementById('flyingPlane');

// ════════════════════════════════════════════════════════
//   3D TITLE TILT
// ════════════════════════════════════════════════════════

let titleReady = false;

function initTitleTilt() {
    if (!titleReveal || !heroTitleImg) return;

    document.addEventListener('mousemove', (e) => {
        if (!titleReady) return;
        const rect = titleReveal.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, (e.clientX - rect.left - rect.width / 2) / (window.innerWidth / 2)));
        const ny = Math.max(-1, Math.min(1, (e.clientY - rect.top - rect.height / 2) / (window.innerHeight / 2)));

        gsap.to(heroTitleImg, {
            rotateY: nx * 8,
            rotateX: ny * -6,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
        });
    });

    document.addEventListener('mouseleave', () => {
        gsap.to(heroTitleImg, {
            rotateY: 0, rotateX: 0,
            duration: 1, ease: 'power2.out',
        });
    });
}

initTitleTilt();

// ════════════════════════════════════════════════════════
//   CTA TAKEOFF
//
//   1. Click → plane exits button diagonally UP-RIGHT
//      getting bigger as it flies
//   2. Exits the screen on the RIGHT edge
//   3. Brief pause — anticipation
//   4. MASSIVE plane sweeps in from the LEFT
//      filling the entire screen height
//   5. As it crosses, everything wipes to black
//   6. Top Gun: Maverick fades in clean
// ════════════════════════════════════════════════════════

function initTakeoff() {
    if (!ctaBtn || !ctaIcon || !flyingPlane || !takeoffOverlay || !takeoffCard) return;

    let hasLaunched = false;

    ctaBtn.addEventListener('click', () => {
        if (hasLaunched) return;
        hasLaunched = true;

        const iconRect = ctaIcon.getBoundingClientRect();
        const startX = iconRect.left + iconRect.width / 2;
        const startY = iconRect.top + iconRect.height / 2;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Hide icon in button
        gsap.to(ctaIcon, { opacity: 0, duration: 0.1 });

        // Position flying plane at icon spot
        // SVG points UP by default. rotation:90 = facing RIGHT
        gsap.set(flyingPlane, {
            left: startX,
            top: startY,
            xPercent: -50,
            yPercent: -50,
            scale: 1,
            opacity: 1,
            rotation: 75,   // facing right, slightly angled up
        });

        const tl2 = gsap.timeline();

        // ── Phase 1: Fly diagonal UP-RIGHT, getting bigger ──
        // Smooth continuous flight from button to off-screen right
        tl2.to(flyingPlane, {
            left: vw + 150,          // exit right edge
            top: startY - vh * 0.4,  // fly upward
            scale: 6,                // getting bigger
            rotation: 75,            // nose pointing right (up-right trajectory)
            duration: 1.2,
            ease: 'power2.in',       // accelerates — feels like thrust
        })

            // Hide after exit
            .set(flyingPlane, { opacity: 0 })

            // ── Phase 2: Brief anticipation pause ──
            .to({}, { duration: 0.3 })

            // ── Phase 3: GIANT plane sweeps in from LEFT ──
            // Reposition: huge, off-screen left, centered vertically
            .set(flyingPlane, {
                left: -vw * 0.5,
                top: vh / 2,
                xPercent: -50,
                yPercent: -50,
                scale: 45,             // MASSIVE
                rotation: 90,          // nose pointing right
                opacity: 1,
            })

            // Sweep across the screen left → right
            .to(flyingPlane, {
                left: vw * 1.5,
                rotation: 90,          // keep nose pointing right
                duration: 1.0,
                ease: 'power1.inOut',
            })

            // ── Everything fades/wipes out as plane crosses ──
            .to(heroCenter, {
                opacity: 0,
                x: -80,               // pushed left by the sweep
                duration: 0.5,
                ease: 'power2.in',
            }, '-=0.9')

            .to('.manifest', {
                opacity: 0,
                x: -60,
                duration: 0.4,
            }, '<')

            .to('.hero-bg', {
                opacity: 0,
                duration: 0.4,
            }, '<+0.1')

            // Overlay fades in behind the sweep
            .to(takeoffOverlay, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.5,
                ease: 'power2.inOut',
                onStart() { takeoffOverlay.classList.add('active'); },
            }, '-=0.6')

            // Hide plane after sweep
            .set(flyingPlane, { opacity: 0 })

            // ── Phase 4: TOP GUN: MAVERICK fades in clean ──
            .fromTo(takeoffCard, {
                opacity: 0,
                y: 25,
            }, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
            }, '-=0.1');
    });
}

initTakeoff();

// ════════════════════════════════════════════════════════
//   INTRO (no counter)
// ════════════════════════════════════════════════════════

const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

tl.set(introLine, { opacity: 1 }, '+=0.5')

    .to(introLine, {
        width: '100vw',
        duration: 1.4,
        ease: 'power4.inOut',
    })

    // Directly split — no brightening
    .set(introLine, { opacity: 0 })

    .to(introTop, { yPercent: -100, duration: 1.4, ease: 'power3.inOut' })
    .to(introBottom, { yPercent: 100, duration: 1.4, ease: 'power3.inOut' }, '<')

    .to(noise, { opacity: 0.02, duration: 1 }, '-=0.8')
    .set(intro, { display: 'none' })

    // Hero reveals
    .to(heroSub, {
        opacity: 1, y: 0,
        duration: 0.8, ease: 'power3.out',
    }, '-=0.9')

    .to(heroTitleImg, {
        y: 0,
        duration: 1.1,
        ease: 'power4.out',
        onComplete() { titleReady = true; },
    }, '-=0.5')

    .to(heroDivider, { opacity: 1, duration: 0.5 }, '-=0.5')
    .to(dividerLines, { width: 50, duration: 0.7, ease: 'power2.out' }, '<')

    .to(heroDesc, {
        opacity: 1, y: 0,
        duration: 0.8, ease: 'power3.out',
    }, '-=0.3')

    .to(ctaWrap, {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'power3.out',
    }, '-=0.3')

    .to(manifestRows, {
        opacity: 1, duration: 0.4, stagger: 0.04,
    }, '-=0.4')

    .from(manifestRows, {
        x: 15, duration: 0.5, stagger: 0.04, ease: 'power2.out',
    }, '<');

// ── Video Parallax ──────────────────────────────────────

const bgVideo = document.querySelector('.hero-bg-video');
if (bgVideo && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(bgVideo, {
            x: ((e.clientX / window.innerWidth) - 0.5) * -16,
            y: ((e.clientY / window.innerHeight) - 0.5) * -16,
            duration: 2.5,
            ease: 'power2.out',
            overwrite: 'auto',
        });
    });
}
