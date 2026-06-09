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

document.addEventListener('DOMContentLoaded', function () {
  // Close nav on mobile click
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.getElementById('navLinks').classList.remove('open');
    });
  });

  // Scroll reveal animation observer
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
  var typingSpeed = 50; // milliseconds per letter
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
      var duration = 550; // ms duration (extremely fast!)
      var startTime = null;
      var isFloat = target % 1 !== 0; // Check if float (CGPA)
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
    // Re-observe so it triggers when scrolled to
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
          statsObserver.unobserve(entry.target); // Trigger only once per viewport entry
        }
      });
    }, { threshold: 0.08 });
    statsObserver.observe(statsSection);
  }

  // Globals for theme switch re-trigger
  window.startTyping = startTyping;
  window.resetStats = resetStats;
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
    statusEl.textContent = '✕ Please fill all fields.';
    return;
  }

  // Show sending state
  btn.disabled = true;
  statusEl.className = 'form-status sending';
  statusEl.textContent = '⏳ Sending message...';

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

    if (result.success === "true" || result.success === true) {
      statusEl.className = 'form-status success';
      statusEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
      form.reset();
    } else {
      statusEl.className = 'form-status error';
      statusEl.textContent = '✕ Failed to send. Please email me directly at mandoreparth14@gmail.com';
    }
  } catch (err) {
    statusEl.className = 'form-status error';
    statusEl.textContent = '✕ Network error. Please email me directly at mandoreparth14@gmail.com';
  }

  btn.disabled = false;

  // Auto-hide status after 8s
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
  // Update tab buttons
  document.querySelectorAll('.showcase-tab').forEach(function (btn) {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  // Update panels
  document.querySelectorAll('.showcase-panel').forEach(function (panel) {
    panel.classList.remove('active');
  });
  var target = document.getElementById('panel-' + tabName);
  if (target) {
    target.classList.add('active');
    // Re-trigger reveal animations for newly visible content
    target.querySelectorAll('.reveal:not(.visible)').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('visible'); }, i * 80);
    });
  }
}
