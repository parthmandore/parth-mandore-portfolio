/**
 * GitHub Classic Theme Controller (Dark & Light)
 * Preserves authentic interactions from the GitHub origin/main implementation.
 */
(function () {
  'use strict';

  var INITIAL_PROJECT_COUNT = 6;
  var showAllProjects = false;

  var projects = [
    {
      title: 'Repository Mentor AI',
      description: 'An AI-powered GitHub repository analysis platform that performs static code analysis, architecture detection, semantic repository search, RAG-based Q&A, security insights, and recruiter-friendly repository reports.',
      image: 'assets/repomentor.png',
      demo: 'https://repomentor.netlify.app',
      github: 'https://github.com/parthmandore/RepoMentor-AI',
      technologies: ['FastAPI', 'Next.js', 'PostgreSQL', 'pgvector', 'Ollama', 'RAG']
    },
    {
      title: 'GymBuddy AI Trainer',
      description: 'A premium, real-time, browser-based AI personal trainer tracking biomechanics, counting reps, flagging form errors via CV pose tracking, and offering audio-visual cues. Includes gaming features and a developer playground.',
      image: 'assets/gymbuddy.png',
      github: 'https://github.com/parthmandore/GymBuddy-AI-Trainer',
      technologies: ['Python', 'Computer Vision', 'MediaPipe', 'FastAPI', 'WebSockets']
    },
    {
      title: 'Career AI Platform 🚀',
      description: 'An AI-powered career assistance platform that helps users manage resumes, improve ATS compatibility, and streamline career development workflows.',
      image: 'assets/career-ai.png',
      github: 'https://github.com/parthmandore/career-ai-platform',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'OpenAI API', 'Node.js']
    },
    {
      title: 'MindPulse AI',
      description: 'A machine learning project using Scikit-Learn Random Forest to predict burnout risk using lifestyle and work factors like sleep, stress, exercise, screen time, and water intake.',
      image: 'assets/mindpulse.png',
      github: 'https://github.com/parthmandore/MindPulse-AI',
      technologies: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas', 'NumPy']
    },
    {
      title: 'Spotify Web Player',
      description: 'A responsive, pixel-perfect frontend replica of the Spotify web player built for user interface design practice and layout replication.',
      image: 'assets/spotify.png',
      github: 'https://github.com/parthmandore/Spotify_Clone',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API']
    },
    {
      title: 'URL Shortener Service',
      description: 'A high-throughput URL shortening service converting long URLs to unique short links with redirect support, built with optimized short-code generation and layered architecture.',
      image: 'assets/url-shortner.jpeg',
      github: 'https://github.com/parthmandore/url-shortener-api',
      technologies: ['Java', 'Spring Boot', 'MySQL', 'RESTful API', 'Docker']
    },
    {
      title: 'Gyan — Assistive Learning Platform',
      description: 'An offline-first assistive mobile learning platform designed for children with dyslexia and dysgraphia. Selected as Top 25 National Finalist at Ideathon 2025.',
      image: 'assets/gyan.png',
      github: 'https://github.com/parthmandore/Gyan',
      technologies: ['React Native', 'TypeScript', 'SQLite', 'Expo']
    }
  ];

  function buildProjectCardHTML(project, index) {
    var card = '';
    card += '<div class="project-card card-enter" style="--enter-delay: ' + (index * 80) + 'ms">';

    card += '<div class="project-img">';
    var basePath = (typeof window !== 'undefined' && window.location.pathname.indexOf('/themes/') !== -1) ? '../../' : '';
    card += '<img src="' + basePath + project.image + '" alt="' + project.title + '" loading="lazy" />';
    card += '</div>';

    card += '<div class="project-name">' + project.title + '</div>';
    card += '<div class="project-desc line-clamp">' + project.description + '</div>';

    if (project.technologies && project.technologies.length > 0) {
      card += '<div class="project-tech-chips">';
      project.technologies.forEach(function (tech) {
        card += '<span class="project-tech-chip">' + tech + '</span>';
      });
      card += '</div>';
    }

    card += '<div class="project-links">';
    if (project.demo) {
      card += '<a href="' + project.demo + '" target="_blank" rel="noopener noreferrer" class="project-link">';
      card += '🌐 Live Demo';
      card += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      card += '</a>';
    }
    if (project.github) {
      card += '<a href="' + project.github + '" target="_blank" rel="noopener noreferrer" class="project-link">';
      card += 'GitHub ↗';
      card += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      card += '</a>';
    }
    card += '</div>';

    card += '</div>';
    return card;
  }

  function renderProjects() {
    var grid = document.getElementById('projectsGrid');
    var toggleBtn = document.getElementById('toggleProjectsBtn');
    var toggleWrap = document.getElementById('showMoreWrap');
    if (!grid) return;

    var visible = showAllProjects ? projects : projects.slice(0, INITIAL_PROJECT_COUNT);
    var html = '';
    visible.forEach(function (project, i) {
      html += buildProjectCardHTML(project, i);
    });
    grid.innerHTML = html;

    if (toggleBtn) {
      var textEl = toggleBtn.querySelector('.btn-show-more-text');
      if (textEl) {
        textEl.textContent = showAllProjects ? '↑ Show Less' : '↓ Show More Projects';
      }
    }
    if (toggleWrap) {
      if (projects.length <= INITIAL_PROJECT_COUNT) {
        toggleWrap.classList.add('hidden');
      } else {
        toggleWrap.classList.remove('hidden');
      }
    }

    if (window._revealObserver) {
      grid.querySelectorAll('.project-card').forEach(function (card) {
        window._revealObserver.observe(card);
      });
    }
  }

  function toggleProjects() {
    var wasExpanded = showAllProjects;
    showAllProjects = !showAllProjects;
    renderProjects();

    if (wasExpanded) {
      var showcase = document.getElementById('github-showcase');
      if (showcase) {
        showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Showcase tab switcher (Projects <-> Skills)
  function switchTab(tabName) {
    document.querySelectorAll('.showcase-tab').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.showcase-panel').forEach(function (panel) {
      panel.classList.remove('active');
    });
    var target = document.getElementById('panel-' + tabName);
    if (target) {
      target.classList.add('active');
      target.querySelectorAll('.reveal:not(.visible)').forEach(function (el, i) {
        el.style.transitionDelay = (i * 80) + 'ms';
        el.classList.add('visible');
      });
    }
  }

  // Hero section typing effect
  var typingTimeout = null;
  function startTyping() {
    var heroTag = document.querySelector('#view-github .hero-tag');
    if (!heroTag) return;
    clearTimeout(typingTimeout);
    heroTag.classList.remove('typing-finished');
    heroTag.classList.add('typing');
    var typingText = '// Computer Engineering Student';
    var typingSpeed = 50;
    var currentText = '';
    heroTag.textContent = '';
    var i = 0;

    function type() {
      if (i < typingText.length) {
        currentText += typingText.charAt(i);
        heroTag.textContent = currentText;
        i++;
        typingTimeout = setTimeout(type, typingSpeed);
      } else {
        heroTag.classList.remove('typing');
        heroTag.classList.add('typing-finished');
      }
    }
    type();
  }

  function resetTyping() {
    var heroTag = document.querySelector('#view-github .hero-tag');
    if (heroTag) {
      clearTimeout(typingTimeout);
      heroTag.classList.remove('typing');
      heroTag.classList.remove('typing-finished');
      heroTag.textContent = '';
    }
  }

  // Animated counters for stats section
  var statsStarted = false;
  var statsObserver = null;

  function animateCounters() {
    if (statsStarted) return;
    statsStarted = true;

    var counters = document.querySelectorAll('#view-github .stat-num');
    counters.forEach(function (counter) {
      var target = parseFloat(counter.getAttribute('data-target'));
      var duration = 550;
      var startTime = null;
      var isFloat = target % 1 !== 0;
      var suffix = counter.getAttribute('data-suffix') || '';

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var currentValue = progress * target;

        if (isFloat) {
          counter.textContent = currentValue.toFixed(2) + suffix;
        } else {
          counter.textContent = Math.floor(currentValue) + suffix;
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          if (isFloat) {
            counter.textContent = target.toFixed(2) + suffix;
          } else {
            counter.textContent = target + suffix;
          }
        }
      }
      window.requestAnimationFrame(step);
    });
  }

  function resetStats() {
    statsStarted = false;
    var counters = document.querySelectorAll('#view-github .stat-num');
    counters.forEach(function (counter) {
      var suffix = counter.getAttribute('data-suffix') || '';
      var target = parseFloat(counter.getAttribute('data-target'));
      var isFloat = target % 1 !== 0;
      if (isFloat) {
        counter.textContent = '0.00' + suffix;
      } else {
        counter.textContent = '0' + suffix;
      }
    });
    var statsSection = document.querySelector('#view-github .about-stats');
    if (statsSection && statsObserver) {
      statsObserver.observe(statsSection);
    }
  }

  // AJAX contact form submission
  async function sendGitHubMessage(e) {
    e.preventDefault();

    var btn = document.getElementById('ghSendBtn');
    var statusEl = document.getElementById('ghFormStatus');
    var form = document.getElementById('ghContactForm');

    var name = document.getElementById('ghFormName').value.trim();
    var email = document.getElementById('ghFormEmail').value.trim();
    var msg = document.getElementById('ghFormMsg').value.trim();

    if (!name || !email || !msg) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = '✕ Please fill all fields.';
      }
      return;
    }

    if (btn) btn.disabled = true;
    if (statusEl) {
      statusEl.className = 'form-status sending';
      statusEl.textContent = '⏳ Sending message...';
    }

    try {
      var response = await fetch('https://formsubmit.co/ajax/mandoreparth14@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: msg,
          _subject: 'New message from Portfolio — ' + name
        })
      });

      var result = await response.json();

      if (result.success === 'true' || result.success === true) {
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
        }
        if (form) form.reset();
      } else {
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.textContent = '✕ Failed to send. Please email me directly at mandoreparth14@gmail.com';
        }
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = '✕ Network error. Please email me directly at mandoreparth14@gmail.com';
      }
    }

    if (btn) btn.disabled = false;

    setTimeout(function () {
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.textContent = '';
      }
    }, 8000);
  }

  // Initialize GitHub portfolio view
  function initGitHubView() {
    renderProjects();

    var toggleBtn = document.getElementById('toggleProjectsBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleProjects);
    }

    var form = document.getElementById('ghContactForm');
    if (form) {
      form.addEventListener('submit', sendGitHubMessage);
    }

    // Scroll reveal observer
    var reveals = document.querySelectorAll('#view-github .reveal');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        } else {
          e.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (r) {
      observer.observe(r);
    });
    window._revealObserver = observer;

    // Typewriter observer
    var heroSection = document.getElementById('github-hero');
    if (heroSection) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            startTyping();
          } else {
            resetTyping();
          }
        });
      }, { threshold: 0.1 });
      heroObserver.observe(heroSection);
    }

    // Stats counter observer
    var statsSection = document.querySelector('#view-github .about-stats');
    if (statsSection) {
      statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      statsObserver.observe(statsSection);
    }

    // Custom cursor
    var cursor = document.getElementById('cursor');
    if (cursor) {
      document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
    }

    // Mobile nav toggler
    var hamburger = document.getElementById('ghHamburger');
    var navLinks = document.getElementById('ghNavLinks');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('open');
      });
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks.classList.remove('open');
        });
      });
    }
  }

  function toggleMenu() {
    var navLinks = document.getElementById('ghNavLinks') || document.getElementById('navLinks');
    if (navLinks) {
      navLinks.classList.toggle('open');
    }
  }

  async function sendMessage(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    var btn = document.getElementById('ghSendBtn') || document.getElementById('sendBtn');
    var statusEl = document.getElementById('ghFormStatus') || document.getElementById('formStatus');
    var form = document.getElementById('ghContactForm') || document.getElementById('contactForm');

    var nameEl = document.getElementById('ghFormName') || document.getElementById('formName');
    var emailEl = document.getElementById('ghFormEmail') || document.getElementById('formEmail');
    var msgEl = document.getElementById('ghFormMsg') || document.getElementById('formMsg');

    var name = nameEl ? nameEl.value.trim() : '';
    var email = emailEl ? emailEl.value.trim() : '';
    var msg = msgEl ? msgEl.value.trim() : '';

    if (!name || !email || !msg) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = '✕ Please fill all fields.';
      }
      return;
    }

    if (btn) btn.disabled = true;
    if (statusEl) {
      statusEl.className = 'form-status sending';
      statusEl.textContent = '⏳ Sending message...';
    }

    try {
      var res = await fetch('https://formspree.io/f/mqkvrvbw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: msg })
      });
      if (res.ok) {
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.textContent = '✓ Message sent! I will get back to you soon.';
        }
        if (form) form.reset();
      } else {
        throw new Error('Server returned ' + res.status);
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = '✕ Failed to send. Please email directly at parthmandore13@gmail.com';
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  // Export methods for global access and theme switching
  window.GitHubPortfolio = {
    init: initGitHubView,
    startTyping: startTyping,
    resetTyping: resetTyping,
    animateCounters: animateCounters,
    resetStats: resetStats,
    switchTab: switchTab,
    toggleProjects: toggleProjects,
    renderProjects: renderProjects,
    toggleMenu: toggleMenu,
    sendMessage: sendMessage
  };

  window.switchTab = switchTab;
  window.startTyping = startTyping;
  window.resetStats = resetStats;
  window.toggleMenu = toggleMenu;
  window.sendMessage = sendMessage;

})();
