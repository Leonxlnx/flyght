/* ════════════════════════════════════════════════════════
   FLYGHT — Intro (no counter) + Hero + Takeoff
   
   CTA → plane icon breaks free, loops, flies AT you 3D
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

// Takeoff
const takeoffOverlay = document.getElementById('takeoffOverlay');
const takeoffCard = document.getElementById('takeoffCard');
const flyingPlane = document.getElementById('flyingPlane');

// ════════════════════════════════════════════════════════
//   3D TITLE TILT ON MOUSE MOVE
// ════════════════════════════════════════════════════════

let titleReady = false;

function initTitleTilt() {
    if (!titleReveal || !heroTitleImg) return;

    const maxRotX = 6;
    const maxRotY = 8;

    document.addEventListener('mousemove', (e) => {
        if (!titleReady) return;

        const rect = titleReveal.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
        const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)));

        gsap.to(heroTitleImg, {
            rotateY: nx * maxRotY,
            rotateX: ny * -maxRotX,
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
//   CTA → TAKEOFF TRANSITION
//
//   The actual ✈ icon breaks out of the button.
//   1. Icon teleports to a fixed plane element
//   2. Lifts off upward
//   3. Does a vertical LOOP (circle path)
//   4. Then flies STRAIGHT AT the camera (scale 1→100)
//   5. Screen fills with the plane, overlay fades in
//   6. Film card emerges
// ════════════════════════════════════════════════════════

function initTakeoff() {
    if (!ctaBtn || !ctaIcon || !flyingPlane || !takeoffOverlay || !takeoffCard) return;

    let hasLaunched = false;

    ctaBtn.addEventListener('click', () => {
        if (hasLaunched) return;
        hasLaunched = true;

        // ── Get icon position on screen ──
        const iconRect = ctaIcon.getBoundingClientRect();
        const startX = iconRect.left + iconRect.width / 2;
        const startY = iconRect.top + iconRect.height / 2;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Hide original icon, show flying plane at same spot
        ctaIcon.style.opacity = '0';
        gsap.set(flyingPlane, {
            left: startX,
            top: startY,
            xPercent: -50,
            yPercent: -50,
            fontSize: '1.2rem',
            opacity: 1,
            rotation: 0,
            scale: 1,
        });

        const tl2 = gsap.timeline();

        // ── Phase 1: Lift off — rise up from button ──
        tl2.to(flyingPlane, {
            top: startY - 120,
            left: startX + 30,
            fontSize: '2.5rem',
            rotation: -40,
            duration: 0.6,
            ease: 'power2.out',
        })

            // ── Phase 2: LOOP-THE-LOOP ──
            // Fly in a vertical circle (clockwise from top)
            // Using keyframes for smooth circular motion
            .to(flyingPlane, {
                keyframes: [
                    // Arc right & down
                    {
                        left: startX + 180,
                        top: startY - 60,
                        rotation: 30,
                        fontSize: '3rem',
                        duration: 0.35,
                        ease: 'none',
                    },
                    // Bottom of loop
                    {
                        left: startX + 100,
                        top: startY + 60,
                        rotation: 120,
                        fontSize: '2.8rem',
                        duration: 0.35,
                        ease: 'none',
                    },
                    // Arc left & up
                    {
                        left: startX - 50,
                        top: startY - 20,
                        rotation: 220,
                        fontSize: '3rem',
                        duration: 0.35,
                        ease: 'none',
                    },
                    // Complete loop — back up top
                    {
                        left: startX + 30,
                        top: startY - 150,
                        rotation: 350,
                        fontSize: '3.5rem',
                        duration: 0.35,
                        ease: 'none',
                    },
                ],
            })

            // ── Phase 3: Fly toward center, straighten ──
            .to(flyingPlane, {
                left: centerX,
                top: centerY - 30,
                rotation: -15,
                fontSize: '5rem',
                duration: 0.5,
                ease: 'power2.inOut',
            })

            // ── Phase 4: FLY AT THE CAMERA — 3D scale explosion ──
            // The plane gets MASSIVE, as if it's flying right into your face
            .to(flyingPlane, {
                scale: 80,
                rotation: -5,
                duration: 1.2,
                ease: 'power3.in',
            })

            // Overlay fades in as the plane covers everything
            .to(takeoffOverlay, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.5,
                ease: 'power2.inOut',
                onStart() {
                    takeoffOverlay.classList.add('active');
                },
            }, '-=0.8')

            // Hero content fades out
            .to(heroCenter, {
                opacity: 0,
                scale: 0.9,
                duration: 0.5,
                ease: 'power2.in',
            }, '-=1.3')

            .to('.manifest', {
                opacity: 0,
                x: 30,
                duration: 0.4,
            }, '<')

            .to('.hero-bg', {
                opacity: 0,
                duration: 0.6,
            }, '<')

            // Hide the flying plane
            .set(flyingPlane, { opacity: 0 })

            // ── Phase 5: Film card reveal ──
            .fromTo(takeoffCard, {
                opacity: 0,
                y: 50,
                scale: 0.88,
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: 'power3.out',
            }, '-=0.3');
    });
}

initTakeoff();

// ════════════════════════════════════════════════════════
//   MASTER TIMELINE — INTRO + HERO
//   (No counter — starts directly with line)
// ════════════════════════════════════════════════════════

const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

// ── 1. Line appears & expands ──────────────────────────

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

    // ── 2. Split ────────────────────────────────────────────

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

    // ── 3. Hero content ─────────────────────────────────────

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
