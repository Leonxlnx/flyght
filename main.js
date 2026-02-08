/* ════════════════════════════════════════════
   FLYGHT — Cinematic Hero Experience
   GSAP Animation + Atmospheric Canvas
   ════════════════════════════════════════════ */

import gsap from 'gsap';

// ── Elements ────────────────────────────────

const cursor = document.getElementById('cursor');
const mouseGlow = document.getElementById('mouseGlow');
const introFlare = document.getElementById('introFlare');
const introCounter = document.getElementById('introCounter');
const counterNum = introCounter.querySelector('.intro-counter-num');
const grain = document.querySelector('.grain');
const vignette = document.querySelector('.vignette');
const canvas = document.getElementById('atmosphere');
const ctx = canvas.getContext('2d');

const heroEyebrow = document.getElementById('heroEyebrow');
const heroTitle = document.getElementById('heroTitle');
const heroTagline = document.getElementById('heroTagline');
const heroFilms = document.getElementById('heroFilms');
const heroCta = document.getElementById('heroCta');
const heroBottom = document.getElementById('heroBottom');

const sideMarkers = document.querySelectorAll('.side-marker');
const fragments = document.querySelectorAll('.frag');
const flares = document.querySelectorAll('.flare');
const titleLetters = document.querySelectorAll('.title-letter');

// ── Mouse State ─────────────────────────────

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursor() {
    // Smooth follow for ring
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;

    // Dot follows instantly
    gsap.set(cursor, {
        x: mouseX,
        y: mouseY,
    });

    // Ring follows smoothly (offset applied in CSS)
    const ring = cursor.querySelector('.cursor-ring');
    gsap.set(ring, {
        x: cursorX - mouseX,
        y: cursorY - mouseY,
    });

    // Mouse glow
    gsap.set(mouseGlow, {
        x: cursorX,
        y: cursorY,
    });

    requestAnimationFrame(updateCursor);
}
updateCursor();

// ── Atmospheric Particles ───────────────────

let particles = [];
let canvasW, canvasH;
const PARTICLE_COUNT = 80;

function resizeCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;
}

function createParticle(full) {
    return {
        x: Math.random() * canvasW,
        y: full ? Math.random() * canvasH : -10,
        vx: (Math.random() - 0.5) * 0.15,
        vy: Math.random() * 0.2 + 0.05,
        size: Math.random() * 1.8 + 0.2,
        opacity: Math.random() * 0.3 + 0.05,
        life: full ? Math.random() : 0,
        maxLife: Math.random() * 0.5 + 0.5,
        hue: Math.random() > 0.7 ? 35 : 0,
        sat: Math.random() > 0.7 ? 20 : 0,
    };
}

function initParticles() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(true));
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Subtle atmospheric haze at bottom
    const hazeGradient = ctx.createLinearGradient(0, canvasH * 0.7, 0, canvasH);
    hazeGradient.addColorStop(0, 'transparent');
    hazeGradient.addColorStop(1, 'rgba(176, 141, 87, 0.015)');
    ctx.fillStyle = hazeGradient;
    ctx.fillRect(0, 0, canvasW, canvasH);

    for (const p of particles) {
        // Mouse influence
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            const force = (200 - dist) / 200 * 0.01;
            p.vx -= dx * force * 0.01;
            p.vy -= dy * force * 0.01;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.001;

        // Fade in/out based on life
        let alpha = p.opacity;
        if (p.life < 0.1) alpha *= p.life / 0.1;
        if (p.life > p.maxLife - 0.1) alpha *= (p.maxLife - p.life) / 0.1;

        if (p.life >= p.maxLife || p.y > canvasH + 10 || p.x < -10 || p.x > canvasW + 10) {
            Object.assign(p, createParticle(false));
            p.x = Math.random() * canvasW;
            continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.sat > 0) {
            ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, 75%, ${alpha})`;
        } else {
            ctx.fillStyle = `rgba(232, 228, 220, ${alpha})`;
        }
        ctx.fill();

        // Glow for larger particles
        if (p.size > 1.2) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
            glow.addColorStop(0, `rgba(176, 141, 87, ${alpha * 0.12})`);
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.fill();
        }
    }

    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', resizeCanvas);
initParticles();
drawParticles();

// ── Fragment Parallax ───────────────────────

function updateFragments() {
    fragments.forEach((frag) => {
        const speed = parseFloat(frag.style.getPropertyValue('--s')) || 0.5;
        const dx = (mouseX - window.innerWidth / 2) * speed * 0.015;
        const dy = (mouseY - window.innerHeight / 2) * speed * 0.015;
        gsap.to(frag, {
            x: dx,
            y: dy,
            duration: 2,
            ease: 'power2.out',
        });
    });
    requestAnimationFrame(updateFragments);
}
updateFragments();

// ── Title Letter Hover Shimmer ──────────────

titleLetters.forEach((letter) => {
    letter.addEventListener('mouseenter', () => {
        gsap.to(letter, {
            backgroundPosition: '0% 100%',
            duration: 0.6,
            ease: 'power2.inOut',
        });
        gsap.to(letter, {
            y: -8,
            duration: 0.4,
            ease: 'power3.out',
        });
    });

    letter.addEventListener('mouseleave', () => {
        gsap.to(letter, {
            backgroundPosition: '0% 0%',
            duration: 0.8,
            ease: 'power2.inOut',
        });
        gsap.to(letter, {
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)',
        });
    });
});

// ════════════════════════════════════════════
//   MASTER TIMELINE — The Cinematic Intro
// ════════════════════════════════════════════

const master = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
});

// Phase 1: Counter counts up
master
    .set(introCounter, { opacity: 1 })
    .to(counterNum, {
        innerText: 100,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power2.in',
        onUpdate: function () {
            const val = Math.round(gsap.getProperty(counterNum, 'innerText'));
            counterNum.textContent = String(val).padStart(2, '0');
        },
    })

    // Phase 2: Flare appears and widens
    .to(introFlare, {
        opacity: 1,
        width: '70%',
        duration: 0.8,
        ease: 'power4.out',
    }, '-=0.5')

    .to(introCounter, {
        opacity: 0,
        duration: 0.3,
    }, '-=0.3')

    // Phase 3: Flare expands full + bars recede
    .to(introFlare, {
        width: '150%',
        height: '6px',
        opacity: 0,
        duration: 1.2,
        ease: 'power3.in',
    })

    .to('.intro-bar--top', {
        scaleY: 0,
        duration: 1.4,
        ease: 'power4.inOut',
    }, '-=0.8')

    .to('.intro-bar--bottom', {
        scaleY: 0,
        duration: 1.4,
        ease: 'power4.inOut',
    }, '<')

    // Phase 4: Environment fades in
    .to(grain, {
        opacity: 0.035,
        duration: 1.5,
    }, '-=0.8')

    .to(vignette, {
        opacity: 1,
        duration: 1.5,
    }, '<')

    .to(canvas, {
        opacity: 1,
        duration: 2,
    }, '<')

    .to(mouseGlow, {
        opacity: 1,
        duration: 1,
    }, '<+0.5')

    // Phase 5: Fragments drift in
    .to(fragments, {
        opacity: 1,
        duration: 2,
        stagger: 0.08,
    }, '<')

    .to(flares, {
        opacity: 1,
        duration: 2,
        stagger: 0.2,
    }, '<+0.3')

    // Phase 6: Hero content reveals
    .to(heroEyebrow, {
        opacity: 1,
        duration: 1,
    }, '-=1.2')

    // Letters slide up from below
    .to(titleLetters, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.07,
        ease: 'power4.out',
    }, '-=0.8')

    .to(heroTagline, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
    }, '-=0.5')

    .from(heroTagline, {
        y: 20,
        duration: 1,
        ease: 'power3.out',
    }, '<')

    .to(heroFilms, {
        opacity: 1,
        duration: 0.8,
    }, '-=0.4')

    .from('.hero-film', {
        y: 12,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
    }, '<')

    .to(heroCta, {
        opacity: 1,
        duration: 0.8,
    }, '-=0.2')

    .from(heroCta, {
        y: 15,
        duration: 0.8,
        ease: 'power2.out',
    }, '<')

    // Phase 7: Side elements
    .to(sideMarkers, {
        opacity: 1,
        duration: 1,
        stagger: 0.1,
    }, '-=0.6')

    .to(heroBottom, {
        opacity: 1,
        duration: 1,
    }, '<')

    // Phase 8: Subtle post-reveal shimmer on title
    .to(titleLetters, {
        backgroundPosition: '0% 50%',
        duration: 3,
        stagger: 0.1,
        ease: 'power1.inOut',
    }, '-=1');

// ── Subtle Continuous Animations ────────────

// Flares gently pulse
gsap.to('.flare--1', {
    opacity: 0.6,
    x: 30,
    duration: 8,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 6,
});

gsap.to('.flare--2', {
    opacity: 0.5,
    x: -20,
    duration: 10,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 7,
});

gsap.to('.flare--3', {
    scale: 1.5,
    opacity: 0.8,
    duration: 6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 5,
});

// Fragments slowly drift
fragments.forEach((frag, i) => {
    gsap.to(frag, {
        y: `+=${10 + Math.random() * 20}`,
        x: `+=${(Math.random() - 0.5) * 15}`,
        duration: 15 + Math.random() * 10,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.5,
    });
});
