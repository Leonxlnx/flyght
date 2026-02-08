/* ════════════════════════════════════════════════════════
   FLYGHT — Intro + Hero + Takeoff Transition
   Title 3D tilt on mouse, CTA triggers plane flyout
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
const heroTitleImg = document.getElementById('heroTitleImg');
const titleReveal = document.getElementById('titleReveal');
const heroDivider = document.getElementById('heroDivider');
const dividerLines = document.querySelectorAll('.divider-line');
const heroDesc = document.getElementById('heroDesc');
const ctaWrap = document.getElementById('ctaWrap');
const ctaBtn = document.querySelector('.cta-btn');
const ctaIcon = document.querySelector('.cta-icon');
const manifestRows = document.querySelectorAll('.manifest-row');

// Takeoff
const takeoffOverlay = document.getElementById('takeoffOverlay');
const takeoffPlane = document.getElementById('takeoffPlane');
const takeoffCard = document.getElementById('takeoffCard');

// ════════════════════════════════════════════════════════
//   3D TITLE TILT ON MOUSE MOVE
//   
//   Subtle rotation following cursor position.
//   X moves → rotateY, Y moves → rotateX (inverted).
//   Max ±6° — just enough to feel alive.
// ════════════════════════════════════════════════════════

let titleReady = false; // only tilt after intro animation

function initTitleTilt() {
    if (!titleReveal || !heroTitleImg) return;

    const maxRotX = 6;  // degrees
    const maxRotY = 8;

    document.addEventListener('mousemove', (e) => {
        if (!titleReady) return;

        const rect = titleReveal.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Distance from title center, normalized -1 to 1
        const nx = (e.clientX - cx) / (window.innerWidth / 2);
        const ny = (e.clientY - cy) / (window.innerHeight / 2);

        // Clamp to ±1
        const clampedX = Math.max(-1, Math.min(1, nx));
        const clampedY = Math.max(-1, Math.min(1, ny));

        gsap.to(heroTitleImg, {
            rotateY: clampedX * maxRotY,
            rotateX: clampedY * -maxRotX,
            duration: 1.2,
            ease: 'power2.out',
            overwrite: 'auto',
        });
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        gsap.to(heroTitleImg, {
            rotateY: 0,
            rotateX: 0,
            duration: 1,
            ease: 'power2.out',
        });
    });
}

initTitleTilt();

// ════════════════════════════════════════════════════════
//   CTA → TAKEOFF TRANSITION
//
//   1. Plane icon flies out of button
//   2. Spins and grows to fill screen
//   3. Overlay fades in
//   4. Film card appears
// ════════════════════════════════════════════════════════

function initTakeoff() {
    if (!ctaBtn || !takeoffOverlay || !takeoffPlane || !takeoffCard) return;

    ctaBtn.addEventListener('click', () => {
        // Get plane icon's position on screen
        const iconRect = ctaIcon.getBoundingClientRect();
        const startX = iconRect.left + iconRect.width / 2;
        const startY = iconRect.top + iconRect.height / 2;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Position the overlay plane at the button icon's location
        gsap.set(takeoffPlane, {
            left: startX,
            top: startY,
            xPercent: -50,
            yPercent: -50,
            fontSize: '1.5rem',
            opacity: 1,
            rotation: 0,
            scale: 1,
        });

        // Activate overlay (starts invisible bg)
        takeoffOverlay.classList.add('active');

        const tl2 = gsap.timeline();

        // Phase 1: Plane lifts off from button — flies upward and grows
        tl2.to(takeoffPlane, {
            left: centerX,
            top: centerY - 50,
            fontSize: '4rem',
            rotation: -35,
            duration: 0.8,
            ease: 'power2.in',
        })

            // Phase 2: Plane does a dramatic spin + huge scale
            .to(takeoffPlane, {
                fontSize: '18rem',
                rotation: -360 - 35,
                top: centerY,
                opacity: 0.7,
                duration: 1.0,
                ease: 'power3.inOut',
            })

            // Fade overlay background in during spin
            .to(takeoffOverlay, {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.inOut',
            }, '-=0.8')

            // Hero content fades out
            .to('.hero-center', {
                opacity: 0,
                scale: 0.95,
                duration: 0.5,
            }, '-=1.0')

            .to('.manifest', {
                opacity: 0,
                x: 30,
                duration: 0.4,
            }, '<')

            // Phase 3: Plane fades away
            .to(takeoffPlane, {
                opacity: 0,
                fontSize: '30rem',
                duration: 0.6,
                ease: 'power2.in',
            })

            // Phase 4: Film card emerges
            .to(takeoffCard, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
            }, '-=0.2')

            .from(takeoffCard, {
                y: 40,
                scale: 0.92,
                duration: 1,
                ease: 'power3.out',
            }, '<');
    });
}

initTakeoff();

// ════════════════════════════════════════════════════════
//   MASTER TIMELINE — INTRO + HERO
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

    // Title image — slides up from mask
    .to(heroTitleImg, {
        y: 0,
        duration: 1.1,
        ease: 'power4.out',
        onComplete() {
            titleReady = true; // enable tilt after reveal
        },
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
