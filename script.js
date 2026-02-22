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
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

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

    // Quote Fetching
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');

    const fallbacks = [
        { content: "Growth is never by mere chance; it is the result of forces working together.", author: "James Cash Penney" },
        { content: "The best way to predict the future is to create it.", author: "Peter Drucker" },
        { content: "Quality is not an act, it is a habit.", author: "Aristotle" }
    ];

    async function fetchQuote() {
        newQuoteBtn.disabled = true;
        const refreshIcon = newQuoteBtn.querySelector('i');
        if (refreshIcon) refreshIcon.style.animation = 'spin 1s linear infinite';
        
        try {
            const response = await fetch('https://dummyjson.com/quotes/random');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            
            quoteText.style.opacity = 0;
            quoteAuthor.style.opacity = 0;
            
            setTimeout(() => {
                quoteText.textContent = `"${data.quote}"`;
                quoteAuthor.textContent = `${data.author}`;
                quoteText.style.opacity = 1;
                quoteAuthor.style.opacity = 1;
            }, 300);
        } catch (err) {
            console.error('Quote fetch error:', err);
            const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            quoteText.textContent = `"${randomFallback.content}"`;
            quoteAuthor.textContent = `${randomFallback.author}`;
        } finally {
            newQuoteBtn.disabled = false;
            if (refreshIcon) refreshIcon.style.animation = 'none';
        }
    }

    newQuoteBtn.addEventListener('click', fetchQuote);
    // Initial fetch
    fetchQuote();

    // Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal, .reveal-up');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // LinkedIn Share
    const shareBtn = document.getElementById('share-linkedin');
    shareBtn.addEventListener('click', () => {
        const url = encodeURIComponent(window.location.href);
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        window.open(linkedinUrl, '_blank');
    });

    // Navbar Scroll Effect & Quote Widget Fade
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const quoteWidget = document.getElementById('quote-widget');
        
        // Navbar effect
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 1.5rem';
            navbar.style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.padding = '2rem 1.5rem';
            navbar.style.backgroundColor = 'transparent';
            navbar.style.backdropFilter = 'none';
        }

        // Quote widget fade
        if (window.scrollY > 100) {
            quoteWidget.classList.add('fade-out');
        } else {
            quoteWidget.classList.remove('fade-out');
        }
    });
});
