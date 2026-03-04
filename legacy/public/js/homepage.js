// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
  setupScrollEffects();
  setupModalEvents();
  setupNavigation();
  animateCounters();
}

// Navigation Functions
function toggleMenu() {
  const navMenu = document.querySelector(".nav-menu");
  navMenu.classList.toggle("active");
}

function setupNavigation() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Active navigation highlighting
  window.addEventListener("scroll", updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Scroll Functions
function scrollToFeatures() {
  document.getElementById("features").scrollIntoView({
    behavior: "smooth",
  });
}

function setupScrollEffects() {
  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector(".hero");
    const maxParallax = 150; // Limit max movement
    const speed = Math.min(scrolled * 0.5, maxParallax);

    if (parallax) {
      parallax.style.transform = `translateY(${speed}px)`;
    }
  });

  // Fade in animations
  const observerOptions = {
    threshold: 0.2, // Trigger a bit earlier
    rootMargin: "0px 0px -100px 0px", // Reveal sooner
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
}

// Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const speed = 200;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.textContent.replace(/\D/g, ""));
        const increment = target / speed;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = formatNumber(target);
            clearInterval(timer);
          } else {
            counter.textContent = formatNumber(Math.floor(current));
          }
        }, 1);

        observer.unobserve(counter);
      }
    });
  });

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "k+";
  }
  return num + "%";
}

// Modal Functions
function setupModalEvents() {
  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
}

function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function openSignupModal() {
  document.getElementById("signupModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  document.body.style.overflow = "auto";
}

function closeAllModals() {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
  document.body.style.overflow = "auto";
}

function switchToSignup() {
  closeModal("loginModal");
  openSignupModal();
}

function switchToLogin() {
  closeModal("signupModal");
  openLoginModal();
}

// Form Handling
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  // Validate form
  if (!email || !password) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Show success and redirect
    showNotification("Login successful! Redirecting...", "success");
    setTimeout(() => {
      // Here you would redirect to the dashboard
      // window.location.href = '/dashboard';
      closeModal("loginModal");
      showNotification("Welcome back! This is a demo.", "info");
    }, 1500);
  }, 2000);
}

function handleSignup(event) {
  event.preventDefault();

  const firstName = document.getElementById("signupFirstName").value;
  const lastName = document.getElementById("signupLastName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const agreeTerms = document.getElementById("agreeTerms").checked;

  // Validate form
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  if (password.length < 8) {
    showNotification("Password must be at least 8 characters long", "error");
    return;
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error");
    return;
  }

  if (!agreeTerms) {
    showNotification("Please agree to the terms and conditions", "error");
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Show success and redirect
    showNotification(
      "Account created successfully! Please check your email.",
      "success",
    );
    setTimeout(() => {
      closeModal("signupModal");
      openLoginModal();
    }, 2000);
  }, 2000);
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type = "info") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "notification-content";

  const icon = document.createElement("i");
  icon.className = `fas fa-${getNotificationIcon(type)}`;

  const messageSpan = document.createElement("span");
  messageSpan.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.className = "notification-close";
  const closeIcon = document.createElement("i");
  closeIcon.className = "fas fa-times";
  closeBtn.appendChild(closeIcon);
  closeBtn.addEventListener("click", () => notification.remove());

  contentDiv.append(icon, messageSpan, closeBtn);
  notification.appendChild(contentDiv);

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 400px;
    `;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  };
  return icons[type] || "info-circle";
}

function getNotificationColor(type) {
  const colors = {
    success: "#4ecdc4",
    error: "#ff6b6b",
    warning: "#feca57",
    info: "#667eea",
  };
  return colors[type] || "#667eea";
}

// Feature interaction functions
function startJournaling() {
  showNotification("Please sign up or log in to start journaling", "info");
  setTimeout(() => {
    openSignupModal();
  }, 1500);
}

function showTrends() {
  showNotification("Please sign up or log in to view your trends", "info");
  setTimeout(() => {
    openSignupModal();
  }, 1500);
}

// Floating cards animation
function initFloatingAnimation() {
  const cards = document.querySelectorAll(".floating-card");
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 2}s`;
  });
}

// Call on page load
document.addEventListener("DOMContentLoaded", function () {
  initFloatingAnimation();
});

// Phone mockup interaction
function initPhoneMockup() {
  const moodCircles = document.querySelectorAll(".phone-mockup .mood-circle");

  setInterval(() => {
    // Remove active class from all circles
    moodCircles.forEach((circle) => circle.classList.remove("active"));

    // Add active class to random circle
    const randomCircle =
      moodCircles[Math.floor(Math.random() * moodCircles.length)];
    randomCircle.classList.add("active");
  }, 3000);
}

// Initialize phone mockup animation
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initPhoneMockup, 2000);
});

// Smooth reveal animations for sections
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(
    ".feature-card, .about-stat, .journey-step",
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    revealObserver.observe(element);
  });
}

// Initialize reveal animations
document.addEventListener("DOMContentLoaded", function () {
  initRevealAnimations();
});

// Handle window resize for responsive design
window.addEventListener("resize", function () {
  // Close mobile menu if window is resized to desktop
  if (window.innerWidth > 768) {
    const navMenu = document.querySelector(".nav-menu");
    navMenu.classList.remove("active");
  }
});
