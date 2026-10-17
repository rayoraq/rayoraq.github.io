(function () {
    'use strict';

    var THEME_KEY = 'theme-preference';
    var root = document.documentElement;
    var toggle = document.getElementById('themeToggle');
    var progressBar = document.getElementById('progressBar');

    if (toggle) {
        toggle.addEventListener('click', function () {
            var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            var next = current === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        });
    }

    function updateProgress() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
        }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.nav__links a');

    function setActive(id) {
        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    }

    if ('IntersectionObserver' in window && sections.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        sections.forEach(function (s) { spy.observe(s); });
    }

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('main section, main figure').forEach(function (el) {
            // Применяем .reveal только к элементам, которые ещё не видны сразу
            var rect = el.getBoundingClientRect();
            if (rect.top > window.innerHeight - 60) {
                el.classList.add('reveal');
                revealObserver.observe(el);
            }
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (href && href.charAt(0) === '#') {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (history.pushState) {
                        history.pushState(null, '', href);
                    }
                }
            }
        });
    });
})();