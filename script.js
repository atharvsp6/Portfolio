/* ═══════════════════════════════════════════════════
   NEURAL COSMOS — PORTFOLIO SCRIPT
   Atharv Patil
   ═══════════════════════════════════════════════════ */
(() => {
    'use strict';

    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => [...p.querySelectorAll(s)];
    const body = document.body;
    const html = document.documentElement;

    // ═══════════════════════════════════════════
    //  PREFERS REDUCED MOTION CHECK
    // ═══════════════════════════════════════════
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ═══════════════════════════════════════════
    //  THEME TOGGLE
    // ═══════════════════════════════════════════
    const themeToggle = $('#themeToggle');
    const storedTheme = localStorage.getItem('nc-theme');
    if (storedTheme) html.setAttribute('data-theme', storedTheme);

    themeToggle.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('nc-theme', next);
    });

    // ═══════════════════════════════════════════
    //  HAMBURGER MENU
    // ═══════════════════════════════════════════
    const hamburger = $('#hamburger');
    const navLinks = $('#navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    $$('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // ═══════════════════════════════════════════
    //  SMOOTH SCROLL
    // ═══════════════════════════════════════════
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = $(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ═══════════════════════════════════════════
    //  SCROLL PROGRESS BAR
    // ═══════════════════════════════════════════
    const scrollProgress = $('#scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';

        // Navbar shadow
        const navbar = $('#navbar');
        navbar.classList.toggle('scrolled', scrollTop > 60);
    });

    // ═══════════════════════════════════════════
    //  ACTIVE NAV HIGHLIGHT
    // ═══════════════════════════════════════════
    const sections = $$('section[id]');
    const navItems = $$('.nav-link[data-section]');

    const observerNav = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(n => n.classList.remove('active'));
                const match = navItems.find(n => n.dataset.section === entry.target.id);
                if (match) match.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observerNav.observe(s));

    // ═══════════════════════════════════════════
    //  MAGNETIC CURSOR
    // ═══════════════════════════════════════════
    const magCursor = $('#magCursor');
    const cursorDot = $('.mag-cursor-dot');
    const cursorRing = $('.mag-cursor-ring');
    let mx = -100, my = -100, cx = -100, cy = -100;

    if (window.innerWidth > 768 && magCursor) {
        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
        });

        function animateCursor() {
            cx += (mx - cx) * 0.15;
            cy += (my - cy) * 0.15;
            if (cursorDot) {
                cursorDot.style.left = mx + 'px';
                cursorDot.style.top = my + 'px';
            }
            if (cursorRing) {
                cursorRing.style.left = cx + 'px';
                cursorRing.style.top = cy + 'px';
            }
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Magnetic effect on .magnetic elements
        $$('.magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => magCursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => {
                magCursor.classList.remove('hovering');
                el.style.transform = '';
            });
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${relX * 0.2}px, ${relY * 0.2}px)`;
            });
        });
    }

    // ═══════════════════════════════════════════
    //  NEURAL NETWORK BACKGROUND
    // ═══════════════════════════════════════════
    const neuralCanvas = $('#neuralCanvas');
    const nCtx = neuralCanvas.getContext('2d');
    let nodes = [];
    const NODE_COUNT = 80;
    const CONNECTION_DIST = 150;

    function resizeNeural() {
        neuralCanvas.width = window.innerWidth;
        neuralCanvas.height = window.innerHeight;
    }
    resizeNeural();
    window.addEventListener('resize', resizeNeural);

    function initNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * neuralCanvas.width,
                y: Math.random() * neuralCanvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1,
                pulse: Math.random() * Math.PI * 2,
            });
        }
    }
    initNodes();

    function drawNeural() {
        nCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);

        const isDark = html.getAttribute('data-theme') === 'dark';
        const baseColor = isDark ? [100, 130, 255] : [60, 100, 200];

        // Update and draw nodes
        for (const node of nodes) {
            node.x += node.vx;
            node.y += node.vy;
            node.pulse += 0.02;

            // Bounce off edges
            if (node.x < 0 || node.x > neuralCanvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > neuralCanvas.height) node.vy *= -1;

            // Mouse proximity glow
            const dxM = node.x - mx;
            const dyM = node.y - my;
            const distMouse = Math.sqrt(dxM * dxM + dyM * dyM);
            const mouseInfluence = Math.max(0, 1 - distMouse / 250);

            const alpha = (0.15 + mouseInfluence * 0.6) * (0.7 + 0.3 * Math.sin(node.pulse));
            const radius = node.r + mouseInfluence * 2;

            nCtx.beginPath();
            nCtx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            nCtx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`;
            nCtx.fill();

            // Glow effect for mouse-proximate nodes
            if (mouseInfluence > 0.3) {
                nCtx.beginPath();
                nCtx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
                nCtx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${mouseInfluence * 0.15})`;
                nCtx.fill();
            }
        }

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.12;

                    // Brighter connections near mouse
                    const midX = (nodes[i].x + nodes[j].x) / 2;
                    const midY = (nodes[i].y + nodes[j].y) / 2;
                    const dxMid = midX - mx;
                    const dyMid = midY - my;
                    const distMid = Math.sqrt(dxMid * dxMid + dyMid * dyMid);
                    const mouseBoost = Math.max(0, 1 - distMid / 200) * 0.3;

                    nCtx.beginPath();
                    nCtx.moveTo(nodes[i].x, nodes[i].y);
                    nCtx.lineTo(nodes[j].x, nodes[j].y);
                    nCtx.strokeStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha + mouseBoost})`;
                    nCtx.lineWidth = 0.5 + mouseBoost * 2;
                    nCtx.stroke();
                }
            }
        }

        if (!prefersReduced) requestAnimationFrame(drawNeural);
    }
    if (!prefersReduced) drawNeural();

    // ═══════════════════════════════════════════
    //  HERO — TEXT SCRAMBLE EFFECT
    // ═══════════════════════════════════════════
    const heroLabel = $('#heroLabel');
    const scrambleChars = '!<>-_\\/[]{}—=+*^?#________';
    const originalText = heroLabel.textContent;

    function scrambleText(el, finalText, duration = 1500) {
        let frame = 0;
        const totalFrames = duration / 30;
        const interval = setInterval(() => {
            let output = '';
            for (let i = 0; i < finalText.length; i++) {
                if (frame / totalFrames > i / finalText.length) {
                    output += finalText[i];
                } else {
                    output += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                }
            }
            el.textContent = output;
            frame++;
            if (frame > totalFrames) {
                el.textContent = finalText;
                clearInterval(interval);
            }
        }, 30);
    }

    // Trigger scramble on load
    setTimeout(() => scrambleText(heroLabel, originalText, 1200), 500);

    // ═══════════════════════════════════════════
    //  TYPEWRITER WITH PER-ROLE COLORS
    // ═══════════════════════════════════════════
    const typewriterEl = $('#typewriter');
    const roles = [
        { text: 'Full Stack Developer', role: 'fullstack' },
        { text: 'Data Analyst', role: 'data' },
        { text: 'ML Engineer', role: 'ml' },
        { text: 'AI Enthusiast', role: 'ml' },
    ];
    let roleIdx = 0, charIdx = 0, deleting = false;
    const TYPE_SPEED = 80, DELETE_SPEED = 40, PAUSE = 1800;

    function typewrite() {
        const current = roles[roleIdx];
        typewriterEl.setAttribute('data-role', current.role);

        if (!deleting) {
            typewriterEl.textContent = current.text.slice(0, ++charIdx);
            if (charIdx === current.text.length) {
                deleting = true;
                setTimeout(typewrite, PAUSE);
                return;
            }
        } else {
            typewriterEl.textContent = current.text.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
            }
        }
        setTimeout(typewrite, deleting ? DELETE_SPEED : TYPE_SPEED);
    }
    typewrite();

    // ═══════════════════════════════════════════
    //  HERO — 3D BRAIN REMOVED (using avatar image now)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    //  ABOUT — PARTICLE DOTS AROUND AVATAR
    // ═══════════════════════════════════════════
    const aboutParticlesCanvas = $('#aboutParticles');
    if (aboutParticlesCanvas) {
        const apCtx = aboutParticlesCanvas.getContext('2d');
        let apW, apH;
        const aboutDots = [];
        const DOT_COUNT = 40;

        function resizeAboutParticles() {
            const wrapper = aboutParticlesCanvas.parentElement;
            apW = wrapper.clientWidth * 1.3;
            apH = wrapper.clientHeight * 1.3;
            aboutParticlesCanvas.width = apW;
            aboutParticlesCanvas.height = apH;
        }
        resizeAboutParticles();
        window.addEventListener('resize', resizeAboutParticles);

        for (let i = 0; i < DOT_COUNT; i++) {
            aboutDots.push({
                x: Math.random() * 600,
                y: Math.random() * 700,
                r: Math.random() * 2.5 + 0.8,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                phase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.5 ? 'rgba(79,142,247,' : 'rgba(168,85,247,',
            });
        }

        function drawAboutParticles() {
            apCtx.clearRect(0, 0, apW, apH);
            for (const d of aboutDots) {
                d.phase += 0.015;
                d.x += d.vx + Math.sin(d.phase) * 0.2;
                d.y += d.vy + Math.cos(d.phase * 0.7) * 0.15;

                // Wrap around edges
                if (d.x < -10) d.x = apW + 10;
                if (d.x > apW + 10) d.x = -10;
                if (d.y < -10) d.y = apH + 10;
                if (d.y > apH + 10) d.y = -10;

                const alpha = 0.3 + 0.2 * Math.sin(d.phase);
                apCtx.beginPath();
                apCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                apCtx.fillStyle = d.color + alpha + ')';
                apCtx.fill();

                // Faint glow
                apCtx.beginPath();
                apCtx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
                apCtx.fillStyle = d.color + (alpha * 0.15) + ')';
                apCtx.fill();
            }
            if (!prefersReduced) requestAnimationFrame(drawAboutParticles);
        }
        if (!prefersReduced) drawAboutParticles();
    }

    // About avatar scale-up on scroll enter
    const aboutAvatarWrapper = $('#aboutAvatarWrapper');
    if (aboutAvatarWrapper) {
        const aboutScaleObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutAvatarWrapper.classList.add('scale-up');
                } else {
                    aboutAvatarWrapper.classList.remove('scale-up');
                }
            });
        }, { threshold: 0.3 });
        aboutScaleObserver.observe(aboutAvatarWrapper);
    }

    // ═══════════════════════════════════════════
    //  GAUGE ANIMATION
    // ═══════════════════════════════════════════
    const gauges = $$('.gauge');
    const circumference = 2 * Math.PI * 52; // r=52

    const gaugeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gauge = entry.target;
                const value = parseFloat(gauge.dataset.value);
                const max = parseFloat(gauge.dataset.max);
                const fill = gauge.querySelector('.gauge-fill');
                const offset = circumference - (value / max) * circumference;
                fill.style.strokeDashoffset = offset;
                gaugeObserver.unobserve(gauge);
            }
        });
    }, { threshold: 0.5 });

    gauges.forEach(g => gaugeObserver.observe(g));

    // ═══════════════════════════════════════════
    //  PROJECT CARD 3D TILT + GLOW
    // ═══════════════════════════════════════════
    $$('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');

            // 3D tilt
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = `perspective(800px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Project card reveal
    const cardObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    $$('.project-card').forEach(c => cardObserver.observe(c));

    // ═══════════════════════════════════════════
    //  PROJECT FILTER
    // ═══════════════════════════════════════════
    const filterBtns = $$('.filter-btn');
    const projectCards = $$('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden-card');
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden-card');
                }
            });
        });
    });

    // ═══════════════════════════════════════════
    //  SECTION REVEAL ON SCROLL
    // ═══════════════════════════════════════════
    const revealElements = $$('.section-header, .about-split, .about-left, .about-right, .timeline-strip, .filter-bar, .editorial-item, .contact-wrapper, .contact-info-bar, .contact-avatar-wrap');

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════════
    //  CONTACT — CONVERSATIONAL CHAT FORM
    // ═══════════════════════════════════════════
    const chatMessages = $('#chatMessages');
    const chatInput = $('#chatInput');
    const chatSend = $('#chatSend');

    const chatSteps = [
        { question: "What's your email?", field: 'email' },
        { question: "What would you like to talk about?", field: 'message' },
    ];
    let chatStep = 0;
    const chatData = {};

    function addBubble(text, isUser = false) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isUser ? 'user' : 'bot'}`;
        bubble.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChatInput() {
        const value = chatInput.value.trim();
        if (!value) return;

        addBubble(value, true);
        chatInput.value = '';

        if (chatStep === 0) {
            chatData.name = value;
        } else if (chatStep === 1) {
            chatData.email = value;
        } else if (chatStep === 2) {
            chatData.message = value;
        }

        if (chatStep < chatSteps.length) {
            setTimeout(() => {
                addBubble(chatSteps[chatStep].question);
            }, 600);
            chatStep++;
        } else {
            setTimeout(() => {
                addBubble(`Thanks, ${chatData.name}! 🚀 I'll get back to you at <strong>${chatData.email}</strong> soon. In the meantime, feel free to explore my work!`);
                chatInput.disabled = true;
                chatSend.disabled = true;
            }, 600);
        }
    }

    chatSend.addEventListener('click', handleChatInput);
    chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleChatInput();
    });

    // ═══════════════════════════════════════════
    //  CONTACT — GLOBE REMOVED (using avatar image now)
    // ═══════════════════════════════════════════

    // ═══════════════════════════════════════════
    //  HERO PARALLAX
    // ═══════════════════════════════════════════
    const heroContent = $('.hero-content');
    const heroVisual = $('.hero-visual');

    if (!prefersReduced) {
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${Math.min(sy * 0.08, 80)}px)`;
            }
            if (heroContent) {
                heroContent.style.transform = `translateY(${sy * 0.05}px)`;
                heroContent.style.opacity = Math.max(0, 1 - sy / 600);
            }
        });
    }

    // ═══════════════════════════════════════════
    //  NAME GRADIENT SHIFT ON SCROLL
    // ═══════════════════════════════════════════
    const nameLines = $$('.name-line');
    if (!prefersReduced) {
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            const pos = (sy * 0.2) % 200;
            nameLines.forEach(line => {
                line.style.backgroundPosition = `${pos}% 50%`;
            });
        });
    }

})();
