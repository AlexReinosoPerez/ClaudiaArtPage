window.addEventListener("DOMContentLoaded", function () {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // RESPONSIVE & ACCESSIBILITY DETECTION
  // ============================================
  const isMobile = window.innerWidth <= 900;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Adjust durations based on device and preferences
  const baseDuration = prefersReducedMotion ? 0.3 : (isMobile ? 0.6 : 0.8);
  const longDuration = prefersReducedMotion ? 0.4 : (isMobile ? 0.8 : 1.2);

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
  // CINEMATIC INTRO SEQUENCE (TASK 4)
  // ============================================
  
  // Initial setup - hide everything
  gsap.set("nav", { y: -100, opacity: 0 });
  gsap.set(".letter-wrapper", { y: "100%", opacity: 0 });
  gsap.set(".subtitle-wrapper h1", { y: 50, opacity: 0 });
  gsap.set(".description-line", { y: 30, opacity: 0 });
  gsap.set(".hero-cta", { y: 30, opacity: 0, scale: 0.95 });
  gsap.set(".item-copy-wrapper p", { y: 30, opacity: 0 });
  gsap.set(".item-img", { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" });

  // Cinematic intro timeline
  gsap.defaults({ ease: "power2.out" });
  const introTl = gsap.timeline({ delay: 0.3 });

  // Hero title reveal with cinematic timing
  introTl
    .to(".letter-wrapper", {
      y: 0,
      opacity: 1,
      stagger: 0.08,
      duration: longDuration,
      ease: "power4.out"
    })
    .to(".subtitle-wrapper h1", {
      y: 0,
      opacity: 1,
      duration: baseDuration
    }, "-=0.6")
    .to(".description-line", {
      y: 0,
      opacity: 1,
      stagger: 0.12,
      duration: baseDuration
    }, "-=0.4")
    .to(".hero-cta", {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: baseDuration,
      ease: "back.out(1.2)"
    }, "-=0.3")
    .to("nav", {
      y: 0,
      opacity: 1,
      duration: baseDuration
    }, "-=0.6");

  // Subtle hero background zoom (desktop only, respects reduced motion)
  if (!isMobile && !prefersReducedMotion) {
    gsap.to(".hero", {
      scale: 1.03,
      duration: 12,
      ease: "none"
    });
  }

  // ============================================
  // ARTWORK REVEAL ON SCROLL (TASK 1)
  // ============================================
  gsap.utils.toArray(".item").forEach((item, index) => {
    const itemImg = item.querySelector(".item-img");
    
    // Cinematic reveal: scale + opacity + curtain
    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        end: "top 40%",
        toggleActions: "play none none none"
      }
    });

    revealTl
      .fromTo(item, 
        { 
          scale: 0.9, 
          opacity: 0 
        },
        { 
          scale: 1, 
          opacity: 1, 
          duration: baseDuration,
          ease: "power2.out"
        }
      )
      .to(itemImg, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: longDuration,
        ease: "power3.inOut",
        onComplete: () => {
          itemImg.classList.add('revealed');
        }
      }, "-=0.4");

    // Text reveal with stagger
    gsap.to(item.querySelectorAll(".item-copy-wrapper p"), {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: baseDuration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });
  });

  // ============================================
  // PARALLAX ON ARTWORK ROWS (TASK 3)
  // ============================================
  if (!isMobile && !prefersReducedMotion) {
    const itemsCols = gsap.utils.toArray(".items-col");
    
    itemsCols.forEach((col, index) => {
      // Alternating parallax direction
      const direction = index % 2 === 0 ? -10 : 10;
      
      gsap.to(col, {
        x: `${direction}%`,
        ease: "none",
        scrollTrigger: {
          trigger: ".works-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5, // Smooth parallax linked to scroll
          invalidateOnRefresh: true
        }
      });
    });
  }

  // ============================================
  // CINEMATIC SECTION TRANSITIONS (TASK 2)
  // ============================================
  const sections = [
    { trigger: ".works-section", element: ".works-section" },
    { trigger: ".about-section", element: ".about-section" },
    { trigger: ".exhibitions-section", element: ".exhibitions-section" },
    { trigger: ".commissions-section", element: ".commissions-section" },
    { trigger: ".contact-section", element: ".contact-section" }
  ];

  sections.forEach((section, index) => {
    gsap.fromTo(section.element,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: baseDuration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section.trigger,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Section titles with fade and scale
  gsap.utils.toArray(".section-title").forEach(title => {
    gsap.fromTo(title.querySelector(".title-wrapper"),
      {
        y: 30,
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: baseDuration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // About section text with stagger
  gsap.from(".about-text p", {
    y: 20,
    opacity: 0,
    stagger: 0.15,
    duration: baseDuration,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  // Exhibitions with elegant stagger
  gsap.from(".exhibition-item", {
    y: 30,
    opacity: 0,
    stagger: 0.2,
    duration: baseDuration,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".exhibitions-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  // Commissions section (emphasized for conversion)
  const commissionsTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".commissions-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  commissionsTl
    .from(".commissions-text p", {
      y: 20,
      opacity: 0,
      stagger: 0.15,
      duration: baseDuration,
      ease: "power2.out"
    })
    .from(".commissions-cta", {
      y: 20,
      opacity: 0,
      scale: 0.95,
      duration: baseDuration,
      ease: "back.out(1.2)"
    }, "-=0.3");

  // Contact section with fade
  gsap.from(".contact-item", {
    y: 20,
    opacity: 0,
    stagger: 0.2,
    duration: baseDuration,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  // ============================================
  // SMOOTH SCROLL INDICATOR (OPTIONAL)
  // ============================================
  if (!isMobile) {
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: rgba(0,0,0,0.3);
      z-index: 9999;
      transform-origin: left;
    `;
    document.body.appendChild(scrollProgress);

    gsap.to(scrollProgress, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3
      }
    });
  }

  // ============================================
  // REFRESH SCROLLTRIGGER ON RESIZE
  // ============================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });
});


