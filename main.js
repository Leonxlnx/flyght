/* ════════════════════════════════════════════════════════
   FLYGHT — SVG Plane Flight Animation
   
   MotionPathPlugin for smooth curved flight:
   → RIGHT → UP → LOOP → keeps looping bigger → 
   flies AT camera 3D → screen black → film card
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
//   CTA → SMOOTH FLIGHT ANIMATION
//
//   Flight path (relative to button):
//   1. Fly RIGHT out of the button
//   2. Curve UPWARD
//   3. Full LOOP (like a barrel roll / loop-the-loop)
//   4. Second wider loop — plane is getting BIGGER
//   5. Straighten out, fly AT camera (scale explosion)
//   6. Screen fades to black → film card
//
//   All curves are smooth via MotionPathPlugin curviness.
//   autoRotate makes the plane face its direction of travel.
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
        const centerX = vw / 2;
        const centerY = vh / 2;

        // Loop radius scales with viewport
        const r1 = Math.min(vw, vh) * 0.14;   // first loop — tight
        const r2 = Math.min(vw, vh) * 0.22;   // second loop — wider

        // Hide icon in button
        gsap.to(ctaIcon, { opacity: 0, duration: 0.12 });

        // Position flying plane at icon location
        gsap.set(flyingPlane, {
            left: startX,
            top: startY,
            xPercent: -50,
            yPercent: -50,
            scale: 1,
            opacity: 1,
            rotation: -90,  // pointing right
        });

        const tl2 = gsap.timeline();

        // ── Phase 1: Fly RIGHT, then curve UP into first loop ──
        //
        //   Path (relative coords from start):
        //
        //          ╭──3──╮
        //         ╱       ╲
        //   1→→→2          4      ← first loop
        //         ╲       ╱
        //          ╰──5──╯
        //              ╲
        //        ╭──7───╮
        //       ╱        ╲
        //      6          8       ← second wider loop  
        //       ╲        ╱
        //        ╰──9───╯
        //             ╲
        //              10→ CENTER → SCALE UP

        tl2.to(flyingPlane, {
            motionPath: {
                path: [
                    // 1→2: Fly right
                    { x: r1 * 1.5, y: 0 },
                    // 2→3: Curve up-right (entering loop)
                    { x: r1 * 2.5, y: -r1 * 1.2 },
                    // 3: Top of first loop
                    { x: r1 * 1.5, y: -r1 * 2 },
                    // 4: Left side of loop
                    { x: r1 * 0.5, y: -r1 * 1.2 },
                    // 5: Bottom of loop (completing circle)
                    { x: r1 * 1.5, y: -r1 * 0.2 },
                ],
                curviness: 2,
                autoRotate: true,
            },
            scale: 2.5,
            duration: 1.6,
            ease: 'power1.inOut',
        })

            // ── Phase 2: Second wider loop — getting bigger ──
            .to(flyingPlane, {
                motionPath: {
                    path: [
                        // Continue from end of first loop into wider arc
                        { x: r1 * 1.5 + r2 * 1.2, y: -r1 * 0.2 + r2 * 0.3 },
                        // Top of second loop
                        { x: r1 * 1.5 + r2 * 0.6, y: -r1 * 0.2 - r2 * 1.5 },
                        // Left of second loop
                        { x: r1 * 1.5 - r2 * 0.8, y: -r1 * 0.2 - r2 * 0.5 },
                        // Bottom of second loop
                        { x: r1 * 1.5 + r2 * 0.2, y: -r1 * 0.2 + r2 * 0.8 },
                        // Straighten — heading toward screen center
                        { x: centerX - startX, y: centerY - startY },
                    ],
                    curviness: 2,
                    autoRotate: true,
                },
                scale: 5,
                duration: 1.8,
                ease: 'power1.inOut',
            })

            // ── Phase 3: Brief pause at center, face forward ──
            .to(flyingPlane, {
                rotation: -90,
                scale: 6,
                duration: 0.25,
                ease: 'power2.out',
            })

            // ── Phase 4: FLY AT CAMERA — 3D SCALE EXPLOSION ──
            // Keep it moving slightly (y upward) while scaling huge
            // so it feels like actual forward flight, not static zoom
            .to(flyingPlane, {
                scale: 200,
                y: '-=60',
                duration: 1.3,
                ease: 'power2.in',
            })

            // ── Overlay fades to black during fly-at ──
            .to(takeoffOverlay, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.7,
                ease: 'power2.inOut',
                onStart() { takeoffOverlay.classList.add('active'); },
            }, '-=0.9')

            // ── Hero fades out during flight ──
            .to(heroCenter, {
                opacity: 0,
                scale: 0.92,
                filter: 'blur(6px)',
                duration: 0.5,
                ease: 'power2.in',
            }, '-=2.0')

            .to('.manifest', {
                opacity: 0, x: 20,
                duration: 0.4,
            }, '<')

            .to('.hero-bg', {
                opacity: 0,
                duration: 0.5,
            }, '<+0.1')

            // Hide plane
            .set(flyingPlane, { opacity: 0 })

            // ── Phase 5: TOP GUN: MAVERICK fades in clean ──
            .fromTo(takeoffCard, {
                opacity: 0,
                y: 30,
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
//   INTRO (no counter — starts with line)
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
