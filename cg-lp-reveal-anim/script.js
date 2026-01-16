window.addEventListener("DOMContentLoaded", function () {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // LANGUAGE SWITCHER
  // ============================================
  let currentLang = 'en';

  function switchLanguage(lang) {
    currentLang = lang;
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
      el.textContent = text;
    });
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }

  // Language button handlers
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.getAttribute('data-lang'));
    });
  });

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // CTA button smooth scroll
  document.querySelectorAll('.cta-button[href^="#"]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================
  // LIGHTBOX
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxDetails = document.querySelector('.lightbox-details');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(item) {
    const img = item.querySelector('img');
    const title = item.querySelector('.artwork-title');
    const year = item.querySelector('.artwork-year');
    const details = item.querySelector('.artwork-details');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = `${title.textContent} (${year.textContent})`;
    lightboxDetails.textContent = details.textContent;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Add click handlers to all artwork images
  document.querySelectorAll('.item-img').forEach(img => {
    img.addEventListener('click', function() {
      const item = this.closest('.item');
      openLightbox(item);
    });
    
    // Keyboard accessibility
    img.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const item = this.closest('.item');
        openLightbox(item);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ESC key to close lightbox
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ============================================
  // GSAP ANIMATIONS
  // ============================================
  
  // Detect if mobile for lighter animations
  const isMobile = window.innerWidth <= 900;

  // Initial setup
  gsap.set("nav", { y: -100, opacity: 0 });
  gsap.set(".letter-wrapper", { y: "100%" });
  gsap.set(".subtitle-wrapper h1", { y: 50, opacity: 0 });
  gsap.set(".description-line", { y: 30, opacity: 0 });
  gsap.set(".hero-cta", { y: 30, opacity: 0 });
  gsap.set(".item-copy-wrapper p", { y: 30, opacity: 0 });
  gsap.set(".item-img", { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" });

  // Hero animation timeline - slower, more elegant
  gsap.defaults({ duration: 1.2, ease: "power3.out" });
  const heroTl = gsap.timeline({ delay: 0.5 });

  heroTl
    .to(".letter-wrapper", {
      y: 0,
      stagger: 0.1,
      duration: 1.4,
      ease: "power4.out"
    })
    .to(".subtitle-wrapper h1", {
      y: 0,
      opacity: 1,
      duration: 1
    }, "-=0.8")
    .to(".description-line", {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      duration: 0.9
    }, "-=0.5")
    .to(".hero-cta", {
      y: 0,
      opacity: 1,
      duration: 0.9
    }, "-=0.4")
    .to("nav", {
      y: 0,
      opacity: 1,
      duration: 1
    }, "-=0.8");

  // Gallery animations with ScrollTrigger
  gsap.utils.toArray(".item").forEach((item, index) => {
    const animDuration = isMobile ? 0.8 : 1.2;
    
    gsap.to(item.querySelector(".item-img"), {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: animDuration,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none none"
      }
    });

    gsap.to(item.querySelectorAll(".item-copy-wrapper p"), {
      y: 0,
      opacity: 1,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });
  });

  // Section titles animation
  gsap.utils.toArray(".section-title").forEach(title => {
    gsap.from(title.querySelector(".title-wrapper"), {
      y: 50,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  // About section animation
  gsap.from(".about-text p", {
    y: 30,
    opacity: 0,
    stagger: 0.25,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  // Exhibitions section animation
  gsap.from(".exhibition-item", {
    y: 40,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".exhibitions-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  // Commissions section animation (emphasized for conversion)
  const commissionsTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".commissions-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  commissionsTl
    .from(".commissions-text p", {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out"
    })
    .from(".commissions-cta", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.5");

  // Contact section animation
  gsap.from(".contact-item", {
    y: 30,
    opacity: 0,
    stagger: 0.25,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });
});


