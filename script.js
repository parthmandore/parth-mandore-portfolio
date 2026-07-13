// Theme Toggle
function toggleTheme() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateNavBg();
  
  if (typeof window.startTyping === 'function') {
    window.startTyping();
  }
  if (typeof window.resetStats === 'function') {
    window.resetStats();
  }
}

// Prevent flash of light/dark theme on page load
(function () {
  var saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

// Hamburger Mobile Menu
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ── Projects Data ──
var INITIAL_PROJECT_COUNT = 6;

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
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/parthmandore/GymBuddy-AI-Trainer'
  },
  {
    title: 'Career AI Platform \u{1F680}',
    description: 'An AI-powered career assistance platform that helps users manage resumes, improve ATS compatibility, and streamline career development workflows.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/parthmandore/career-ai-platform'
  },
  {
    title: 'MindPulse AI',
    description: 'A machine learning project using Scikit-Learn Random Forest to predict burnout risk using lifestyle and work factors like sleep, stress, exercise, screen time, and water intake.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/parthmandore/MindPulse-AI'
  },
  {
    title: 'Spotify Clone',
    description: 'A responsive, pixel-perfect frontend replica of the Spotify web player built for user interface design practice and layout replication.',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?auto=format&fit=crop&w=400&q=80',
    github: 'https://github.com/parthmandore/Spotify_Clone'
  },
  {
    title: 'URL Shortener Service',
    description: 'A URL shortening service converting long URLs to unique short links with redirect support, built with optimized short-code generation.',
    image: 'assets/url-shortner.jpeg',
    github: 'https://github.com/parthmandore/url-shortener-api'
  },
  {
    title: 'Personal Portfolio Website',
    description: 'A premium, highly interactive personal portfolio website featuring glassmorphism, dynamic counters, 3D card tilt hover effects, and responsive layout.',
    image: 'assets/portfolio.png',
    github: 'https://github.com/parthmandore'
  }
];

var showAllProjects = false;

function buildProjectCardHTML(project, index) {
  var card = '';
  card += '<div class="project-card card-enter" style="--enter-delay: ' + (index * 80) + 'ms">';

  // Image
  card += '<div class="project-img">';
  card += '<img src="' + project.image + '" alt="' + project.title + '" loading="lazy" />';
  card += '</div>';

  // Title
  card += '<div class="project-name">' + project.title + '</div>';

  // Description
  card += '<div class="project-desc line-clamp">' + project.description + '</div>';

  // Technology chips
  if (project.technologies && project.technologies.length > 0) {
    card += '<div class="project-tech-chips">';
    project.technologies.forEach(function (tech) {
      card += '<span class="project-tech-chip">' + tech + '</span>';
    });
    card += '</div>';
  }

  // Links
  card += '<div class="project-links">';
  if (project.demo) {
    card += '<a href="' + project.demo + '" target="_blank" rel="noopener noreferrer" class="project-link">';
    card += '\u{1F310} Live Demo';
    card += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    card += '</a>';
  }
  if (project.github) {
    card += '<a href="' + project.github + '" target="_blank" rel="noopener noreferrer" class="project-link">';
    card += 'GitHub \u2197';
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

  // Update toggle button text and visibility
  if (toggleBtn) {
    var textEl = toggleBtn.querySelector('.btn-show-more-text');
    if (textEl) {
      textEl.textContent = showAllProjects ? '\u2191 Show Less' : '\u2193 Show More Projects';
    }
  }
  if (toggleWrap) {
    if (projects.length <= INITIAL_PROJECT_COUNT) {
      toggleWrap.classList.add('hidden');
    } else {
      toggleWrap.classList.remove('hidden');
    }
  }

  // Register new cards with the global IntersectionObserver
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

  // On collapse, scroll the toggle button into view so the user doesn't jump
  if (wasExpanded) {
    var showcase = document.getElementById('showcase');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// ── DOMContentLoaded ──
document.addEventListener('DOMContentLoaded', function () {
  // Close nav on mobile click
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.getElementById('navLinks').classList.remove('open');
    });
  });

  // Scroll reveal animation observer (shared globally)
  var reveals = document.querySelectorAll('.reveal');
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
  // Store observer globally so dynamically rendered cards can register
  window._revealObserver = observer;

  // Custom cursor follower
  var cursor = document.getElementById('cursor');
  if (cursor) {
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }

  // Hero section typing effect
  var heroTag = document.querySelector('.hero-tag');
  var typingText = "// Computer Engineering Student";
  var typingSpeed = 50;
  var typingTimeout = null;

  function startTyping() {
    if (!heroTag) return;
    clearTimeout(typingTimeout);
    heroTag.classList.remove('typing-finished');
    heroTag.classList.add('typing');
    var currentText = "";
    heroTag.textContent = "";
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
    if (heroTag) {
      clearTimeout(typingTimeout);
      heroTag.classList.remove('typing');
      heroTag.classList.remove('typing-finished');
      heroTag.textContent = "";
    }
  }

  // Reset typewriter when out of view
  var heroSection = document.getElementById('hero');
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

  // Animated counters for stats section
  var statsSection = document.querySelector('.about-stats');
  var statsStarted = false;
  var statsObserver = null;

  function animateCounters() {
    if (statsStarted) return;
    statsStarted = true;
    
    var counters = document.querySelectorAll('.stat-num');
    counters.forEach(function (counter) {
      var target = parseFloat(counter.getAttribute('data-target'));
      var start = 0;
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
    var counters = document.querySelectorAll('.stat-num');
    counters.forEach(function (counter) {
      var suffix = counter.getAttribute('data-suffix') || '';
      var target = parseFloat(counter.getAttribute('data-target'));
      var isFloat = target % 1 !== 0;
      if (isFloat) {
        counter.textContent = "0.00" + suffix;
      } else {
        counter.textContent = "0" + suffix;
      }
    });
    if (statsSection && statsObserver) {
      statsObserver.observe(statsSection);
    }
  }

  // Trigger counters on scroll
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

  // Globals for theme switch re-trigger
  window.startTyping = startTyping;
  window.resetStats = resetStats;

  // Render projects on page load
  renderProjects();

  // Attach toggle button event listener (no inline onclick)
  var toggleBtn = document.getElementById('toggleProjectsBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleProjects);
  }
});

// AJAX contact form submit
async function sendMessage(e) {
  e.preventDefault();

  var btn = document.getElementById('sendBtn');
  var statusEl = document.getElementById('formStatus');
  var form = document.getElementById('contactForm');

  var name = document.getElementById('formName').value.trim();
  var email = document.getElementById('formEmail').value.trim();
  var msg = document.getElementById('formMsg').value.trim();

  if (!name || !email || !msg) {
    statusEl.className = 'form-status error';
    statusEl.textContent = '\u2715 Please fill all fields.';
    return;
  }

  btn.disabled = true;
  statusEl.className = 'form-status sending';
  statusEl.textContent = '\u23F3 Sending message...';

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
        _subject: 'New message from Portfolio \u2014 ' + name
      })
    });

    var result = await response.json();

    if (result.success === "true" || result.success === true) {
      statusEl.className = 'form-status success';
      statusEl.textContent = '\u2713 Message sent! I\'ll get back to you soon.';
      form.reset();
    } else {
      statusEl.className = 'form-status error';
      statusEl.textContent = '\u2715 Failed to send. Please email me directly at mandoreparth14@gmail.com';
    }
  } catch (err) {
    statusEl.className = 'form-status error';
    statusEl.textContent = '\u2715 Network error. Please email me directly at mandoreparth14@gmail.com';
  }

  btn.disabled = false;

  setTimeout(function () {
    statusEl.className = 'form-status';
    statusEl.textContent = '';
  }, 8000);
}

// Navbar background opacity on scroll
function updateNavBg() {
  var nav = document.getElementById('navbar');
  var theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    nav.style.background = window.scrollY > 60 ? 'rgba(8,7,20,0.75)' : 'rgba(8,7,20,0.2)';
  } else {
    nav.style.background = window.scrollY > 60 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.2)';
  }
}
window.addEventListener('scroll', updateNavBg);

// Portfolio Tab Switcher
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
    // Re-trigger reveal animations for newly visible content
    target.querySelectorAll('.reveal:not(.visible)').forEach(function (el, i) {
      el.style.transitionDelay = (i * 80) + 'ms';
      el.classList.add('visible');
    });
  }
}
