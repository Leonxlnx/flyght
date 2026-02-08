/* ════════════════════════════════════════════════════════
   FLYGHT — Film Page: Top Gun: Maverick
   Entrance reveal + plane flies right→left to go back
   ════════════════════════════════════════════════════════ */

import gsap from 'gsap';

// ── Elements ──

const heroCenter = document.getElementById('heroCenter');
const filmNumber = document.getElementById('filmNumber');
const filmTitle = document.getElementById('filmTitle');
const filmMeta = document.getElementById('filmMeta');
const filmQuote = document.getElementById('filmQuote');
const manifest = document.getElementById('manifest');
const flyingPlane = document.getElementById('flyingPlane');

// ════════════════════════════════════════════════════════
//   ENTRANCE ANIMATION
//   Giant plane sweeps right→left revealing the film page
// ════════════════════════════════════════════════════════

const vw = window.innerWidth;
const vh = window.innerHeight;

const entranceTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

// Start with a giant plane sweeping RIGHT→LEFT (mirroring the hero exit)
gsap.set(flyingPlane, {
    left: vw + 200,
    top: vh / 2,
    xPercent: -50,
    yPercent: -50,
    scale: 45,
    rotation: -90,   // nose pointing LEFT (SVG faces up at 0, -90 = left)
    opacity: 1,
});

entranceTL
    // Giant plane sweeps right→left across screen
    .to(flyingPlane, {
        left: -vw * 0.5,
        duration: 1.0,
        ease: 'power1.inOut',
    })

    // Hide plane after sweep
    .set(flyingPlane, { opacity: 0 })

    // Film number
    .to(filmNumber, {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.3')

    // Title
    .to(filmTitle, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power4.out',
    }, '-=0.35')

    // Meta
    .to(filmMeta, {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.5')

    // Quote
    .to(filmQuote, {
        opacity: 1,
        duration: 0.8,
    }, '-=0.3')

    // Manifest
    .to(manifest, {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.5');

// ════════════════════════════════════════════════════════
//   CLICK ANYWHERE → plane flies RIGHT→LEFT back to hero
// ════════════════════════════════════════════════════════

let transitioning = false;

document.addEventListener('click', () => {
    if (transitioning) return;
    transitioning = true;

    const tl = gsap.timeline();

    // Small plane appears at right edge, flies left across screen
    gsap.set(flyingPlane, {
        left: vw + 100,
        top: vh * 0.45,
        xPercent: -50,
        yPercent: -50,
        scale: 1.5,
        rotation: -90,  // nose pointing LEFT
        opacity: 1,
    });

    tl
        // Plane flies left, getting bigger
        .to(flyingPlane, {
            left: -200,
            top: vh * 0.5,
            scale: 6,
            rotation: -90,
            duration: 1.2,
            ease: 'power2.in',
        })

        .set(flyingPlane, { opacity: 0 })

        // Brief pause
        .to({}, { duration: 0.2 })

        // GIANT sweep right→left
        .set(flyingPlane, {
            left: vw * 1.5,
            top: vh / 2,
            xPercent: -50,
            yPercent: -50,
            scale: 45,
            rotation: -90,
            opacity: 1,
        })

        .to(flyingPlane, {
            left: -vw * 0.5,
            duration: 1.0,
            ease: 'power1.inOut',
        })

        // Fade out content as plane sweeps
        .to(heroCenter, {
            opacity: 0,
            x: 80,
            duration: 0.5,
            ease: 'power2.in',
        }, '-=0.9')

        .to(manifest, {
            opacity: 0,
            x: 60,
            duration: 0.4,
        }, '<')

        .to('.hero-bg', {
            opacity: 0,
            duration: 0.4,
        }, '<+0.1')

        .set(flyingPlane, { opacity: 0 })

        // Navigate back to home
        .to({}, {
            duration: 0.3,
            onComplete() {
                window.location.href = '/';
            },
        });
});
