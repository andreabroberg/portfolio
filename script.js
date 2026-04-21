document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const links = document.querySelectorAll('a, button');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    const emailMeBtn = document.getElementById('email-me-btn');
    if (emailMeBtn) {
        emailMeBtn.addEventListener('click', () => {
            window.location.href = 'mailto:andrea.broberg03@gmail.com';
        });
    }

    const downloadCvBtn = document.getElementById('download-cv-btn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', () => {
            const cvLink = document.createElement('a');
            cvLink.href = 'images/Andrea_Broberg_CV.pdf';
            cvLink.download = 'Andrea_Broberg_CV.pdf';
            document.body.appendChild(cvLink);
            cvLink.click();
            cvLink.remove();
        });
    }

    // Project card tracking for GTM/GA4 via dataLayer
    document.addEventListener('click', (e) => {
        const projectLink = e.target.closest('a.project-card');
        if (!projectLink) return;

        const projectUrl = projectLink.href;
        const projectName = projectLink.dataset.projectName
            || projectLink.querySelector('.project-name')?.textContent?.trim()
            || projectLink.getAttribute('aria-label')
            || '';

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'project_click',
            project_url: projectUrl,
            project_name: projectName
        });

        // Let the browser handle navigation normally so GTM link click triggers
        // and "Wait for Tags" can work without custom interception.
    });

    // Recycle Life Case Film: looping teaser -> open YouTube on click
    const casefilmWrapper = document.getElementById('casefilm-player-wrapper');
    const casefilmTrigger = document.getElementById('casefilm-play-trigger');
    const casefilmTeaser = document.getElementById('casefilm-teaser');
    const CASEFILM_YOUTUBE_URL = 'https://youtu.be/NwvAOvpxTaA';
    const CASEFILM_TEASER_MAX_SECONDS = 6;

    if (casefilmTeaser) {
        casefilmTeaser.addEventListener('timeupdate', () => {
            if (casefilmTeaser.currentTime >= CASEFILM_TEASER_MAX_SECONDS) {
                casefilmTeaser.currentTime = 0;
                casefilmTeaser.play();
            }
        });
    }

    function startCasefilmPlayback() {
        if (!casefilmWrapper) return;
        window.open(CASEFILM_YOUTUBE_URL, '_blank', 'noopener,noreferrer');
    }

    if (casefilmTrigger) {
        casefilmTrigger.addEventListener('click', startCasefilmPlayback);
    }

    // Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal, .reveal-up');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: '-6% 0px -8% 0px'
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));


    const heroContent = document.getElementById('hero-content');
    let scrollTicking = false;

    function updateScrollEffects() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        const isMobile = window.innerWidth < 768;
        const heroFadeDistance = Math.max(220, window.innerHeight * 0.42);
        const heroFadeProgress = Math.min(window.scrollY / heroFadeDistance, 1);
        const heroOpacity = Math.max(1 - heroFadeProgress * 1.35, 0);
        
        if (heroContent) {
            heroContent.style.setProperty('--hero-content-opacity', heroOpacity.toFixed(3));
            heroContent.style.setProperty('--hero-content-offset', `${(-heroFadeProgress * 1.75).toFixed(2)}rem`);
            heroContent.style.setProperty('--hero-content-scale', (1 - heroFadeProgress * 0.025).toFixed(3));
        }

        // Navbar effect
        if (window.scrollY > 50) {
            navbar.classList.add('is-scrolled');
            navbar.style.padding = isMobile ? '0.85rem 1rem' : '1rem 1.5rem';
            navbar.style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('is-scrolled');
            navbar.style.padding = isMobile ? '1rem' : '2rem 1.5rem';
            navbar.style.backgroundColor = isMobile ? 'rgba(5, 5, 5, 0.84)' : 'transparent';
            navbar.style.backdropFilter = isMobile ? 'blur(10px)' : 'none';
        }
        scrollTicking = false;
    }

    function requestScrollUpdate() {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollEffects);
    }

    updateScrollEffects();
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate);
});
