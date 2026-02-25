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

    function trackEvent(eventName, params = {}) {
        console.log(`[Event Tracked]: ${eventName}`, params);
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }

    // Portfolio Quiz Logic
    const quizQuestions = [
        "Do you have a clear Call to Action (CTA) on your hero section?",
        "Do you have event tracking (GA4/GTM) implemented on key buttons?",
        "Do you demonstrate your strategic thinking, not just your experience?",
        "Do you offer something valuable in exchange for email signups?",
        "Do you have social proof (testimonials or client logos) visible?",
        "Is your portfolio fully responsive and optimized for all devices (mobile, tablet, desktop)?",
        "Do you actively track your conversion rate from visitor to lead?",
        "Does your portfolio offer something different from the rest?",
        "Do you show the tools you’re skilled in?",
        "Do you reflect on what you could improve?"
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    const answers = [];

    const startView = document.getElementById('quiz-start-view');
    const questionsView = document.getElementById('quiz-questions-view');
    const resultsView = document.getElementById('quiz-results-view');
    const startBtn = document.getElementById('start-quiz-btn');
    const questionText = document.getElementById('question-text');
    const progressFill = document.getElementById('progress-fill');
    const optBtns = document.querySelectorAll('.quiz-opt-btn');
    const finalScoreText = document.getElementById('final-score');
    const dynamicAnalysis = document.getElementById('dynamic-analysis');
    const leadBox = document.getElementById('quiz-lead-box');
    const postLeadContent = document.getElementById('post-lead-content');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startView.style.display = 'none';
            questionsView.style.display = 'block';
            trackEvent('quiz_start');
            showQuestion();
        });
    }

    function showQuestion() {
        if (questionText && progressFill) {
            questionText.textContent = quizQuestions[currentQuestionIndex];
            progressFill.style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
        }
    }

    optBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.getAttribute('data-value'));
            score += val;
            answers.push({ question: quizQuestions[currentQuestionIndex], answer: val === 1 ? 'Yes' : 'No' });

            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                completeQuiz();
            }
        });
    });

    async function completeQuiz() {
        if (questionsView && resultsView && finalScoreText) {
            questionsView.style.display = 'none';
            resultsView.style.display = 'block';
            finalScoreText.textContent = score;
            const totalQ = document.getElementById('total-questions');
            if (totalQ) totalQ.textContent = `/ ${quizQuestions.length}`;
            
            trackEvent('quiz_complete', { score: score });
        }
    }

    async function generateAnalysis() {
        if (!dynamicAnalysis) return;
        try {
            throw new Error('Client-side Gemini SDK is disabled on static Live Server');
        } catch (err) {
            console.error('Gemini error:', err);
            const isPerfectScore = score === quizQuestions.length;
            dynamicAnalysis.innerHTML = `
                <h4>Your Improvement Plan</h4>
                <p>${
                    isPerfectScore
                        ? `Good job, you scored a perfect ${score}/${quizQuestions.length}. But there's always room for improvement.`
                        : `Your score of ${score}/${quizQuestions.length} shows you have a solid foundation, but there's room to optimize for even higher conversion.`
                }</p>
                <h4>Top 3 Recommendations</h4>
                <ul>
                    <li>Implement advanced event tracking to see where users drop off.</li>
                    <li>A/B test your hero CTA copy for better engagement.</li>
                    <li>Add more social proof to build immediate trust.</li>
                </ul>
            `;
        }
    }

    // Lead Form
    const leadForm = document.getElementById('lead-form');

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('lead-email');
            const email = emailInput ? emailInput.value : '';
            trackEvent('email_submit', { email: email });
            
            // API usage: POST request to save lead (mocking the endpoint)
            try {
                console.log(`Saving lead to API: ${email}`);
                // In a real scenario, this would be:
                // await fetch('/api/leads', { method: 'POST', body: JSON.stringify({ email, score }) });
                
                // Simulate API delay
                const submitBtn = leadForm.querySelector('button');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }
                
                await new Promise(resolve => setTimeout(resolve, 800));
                
                if (leadBox) leadBox.style.display = 'none';
                if (postLeadContent) postLeadContent.style.display = 'block';
                
                trackEvent('score_result', { score: score });
                generateAnalysis();
                lucide.createIcons();
            } catch (err) {
                console.error('Lead save error:', err);
            }
        });
    }

    // Share Score LinkedIn
    const shareScoreBtn = document.getElementById('share-score-linkedin');
    if (shareScoreBtn) {
        shareScoreBtn.addEventListener('click', () => {
            const shareText = `Tried Andrea Broberg’s Portfolio Score quiz.

A structured way to review your portfolio - it also includes a short whitepaper with suggestions.

Worth a look:
https://andreabroberg.github.io/portfolio/`;
            
            // Using the feed share URL which often supports pre-filled text better than share-offsite
            const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
            window.open(linkedinUrl, '_blank');
        });
    }

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
        if (!newQuoteBtn || !quoteText || !quoteAuthor) return;
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

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', fetchQuote);
        // Initial fetch
        fetchQuote();
    }

    // Recycle Life Case Film: animated cover -> main video on click
    const casefilmWrapper = document.getElementById('casefilm-player-wrapper');
    const casefilmTrigger = document.getElementById('casefilm-play-trigger');
    const casefilmMainVideo = document.getElementById('casefilm-main-video');
    const casefilmTeaser = document.getElementById('casefilm-teaser');

    function startCasefilmPlayback() {
        if (!casefilmWrapper || !casefilmMainVideo) return;
        casefilmWrapper.classList.add('is-playing');
        if (casefilmTeaser) casefilmTeaser.pause();
        const playPromise = casefilmMainVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch((err) => {
                console.error('Case film playback error:', err);
            });
        }
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
            }
        });
    }, {
        threshold: 0.1
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));


    // Navbar Scroll Effect & Quote Widget Fade
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const quoteWidget = document.getElementById('quote-widget');
        if (!navbar) return;
        
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
        if (quoteWidget) {
            if (window.scrollY > 100) {
                quoteWidget.classList.add('fade-out');
            } else {
                quoteWidget.classList.remove('fade-out');
            }
        }
    });
});
