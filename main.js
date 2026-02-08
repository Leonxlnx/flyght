/* ════════════════════════════════════════════════════════
   FLYGHT — Smooth Plane Flight with MotionPath
   
   CTA → plane breaks free, smooth curved loop,
   flies AT camera with 3D scale, screen fades black,
   film card emerges.
   ════════════════════════════════════════════════════════ */

import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

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
//   CTA → SMOOTH TAKEOFF
//
//   Uses MotionPathPlugin for a butter-smooth curved
//   flight path. The plane follows the curve with
//   autoRotate so it always faces the direction of travel.
//
//   Path: lift off → smooth loop → center → FLY AT YOU
// ════════════════════════════════════════════════════════

function initTakeoff() {
    if (!ctaBtn || !ctaIcon || !flyingPlane || !takeoffOverlay || !takeoffCard) return;

    let hasLaunched = false;

    ctaBtn.addEventListener('click', () => {
        if (hasLaunched) return;
        hasLaunched = true;

        // Get icon's screen position
        const iconRect = ctaIcon.getBoundingClientRect();
        const startX = iconRect.left + iconRect.width / 2;
        const startY = iconRect.top + iconRect.height / 2;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const centerX = vw / 2;
        const centerY = vh / 2;

        // Hide the original icon inside the button
        gsap.to(ctaIcon, { opacity: 0, duration: 0.15 });

        // Position the free-flying plane at the icon's spot
        gsap.set(flyingPlane, {
            left: startX,
            top: startY,
            xPercent: -50,
            yPercent: -50,
            scale: 1,
            opacity: 1,
            rotation: -30,
        });

        // ── Build the smooth flight path ──
        // All coordinates RELATIVE to starting position
        // The plane will curve up, loop around, then head to center
        const loopRadius = Math.min(vw, vh) * 0.18;

        const flightPath = [
            // Lift off — arc upward and to the right
            { x: loopRadius * 0.6, y: -loopRadius * 1.2 },
            // Top of loop — sweeping right
            { x: loopRadius * 1.5, y: -loopRadius * 0.4 },
            // Right side of loop — coming down
            { x: loopRadius * 1.2, y: loopRadius * 0.6 },
            // Bottom of loop — sweeping left
            { x: loopRadius * 0.3, y: loopRadius * 0.3 },
            // Coming back up — completing the loop
            { x: -loopRadius * 0.3, y: -loopRadius * 0.5 },
            // Straighten out — head toward screen center
            { x: centerX - startX, y: centerY - startY - 20 },
        ];

        const tl2 = gsap.timeline();

        // ── Phase 1+2: Smooth curved flight with loop ──
        tl2.to(flyingPlane, {
            motionPath: {
                path: flightPath,
                curviness: 1.8,        // smooth organic curves
                autoRotate: true,      // plane faces direction of travel
            },
            scale: 3,
            duration: 2.2,
            ease: 'power1.inOut',
        })

            // ── Phase 3: Pause at center, face camera ──
            .to(flyingPlane, {
                rotation: 0,
                scale: 4,
                duration: 0.3,
                ease: 'power2.out',
            })

            // ── Phase 4: FLY AT CAMERA — massive 3D scale ──
            // This creates the "coming right at you" effect
            .to(flyingPlane, {
                scale: 120,
                duration: 1.4,
                ease: 'power2.in',
            })

            // Screen fades to black as plane covers everything
            .to(takeoffOverlay, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.8,
                ease: 'power2.inOut',
                onStart() {
                    takeoffOverlay.classList.add('active');
                },
            }, '-=1.0')

            // Hero fades out underneath
            .to(heroCenter, {
                opacity: 0,
                scale: 0.92,
                filter: 'blur(8px)',
                duration: 0.6,
                ease: 'power2.in',
            }, '-=1.6')

            .to('.manifest', {
                opacity: 0,
                x: 20,
                duration: 0.4,
            }, '<')

            .to('.hero-bg', {
                opacity: 0,
                duration: 0.5,
            }, '<+0.2')

            // Hide plane after it's covered by overlay
            .set(flyingPlane, { opacity: 0 })

            // ── Phase 5: TOP GUN: MAVERICK card fades in clean ──
            .fromTo(takeoffCard, {
                opacity: 0,
                y: 30,
            }, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
            }, '-=0.2');
    });
}

initTakeoff();

// ════════════════════════════════════════════════════════
//   INTRO TIMELINE (no counter)
// ════════════════════════════════════════════════════════

const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

tl.set(introLine, { opacity: 1 }, '+=0.5')

    .to(introLine, {
        width: '100vw',
        duration: 1.4,
        ease: 'power4.inOut',
    })

    .to(introLine, {
        height: '3px',
        boxShadow: '0 0 30px 6px rgba(214,212,204,0.4), 0 0 80px 15px rgba(214,212,204,0.1)',
        duration: 0.35,
        ease: 'power2.out',
    })

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

    // Hero content reveals
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
