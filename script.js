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
  // INITIALIZE 3D GALLERY (if Three.js loaded)
  // ============================================
  if (typeof THREE !== 'undefined' && typeof initGallery3D === 'function') {
    // Wait for section to be visible
    setTimeout(() => {
      initGallery3D();
    }, 500);
  }

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
  // SMOOTH SCROLL & OVERLAY NAVIGATION
  // ============================================
  
  // Sections that should be overlays (not scrollable)
  const overlaySections = ['about', 'exhibitions', 'commissions', 'contact'];
  
  document.querySelectorAll('nav a[href^="#"], .next-section-btn[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.querySelector(`#${targetId}`);
      
      console.log('Clicked on:', targetId, 'Target found:', target);
      
      if (!target) return;
      
      // If it's an overlay section, show it as overlay
      if (overlaySections.includes(targetId)) {
        console.log('Opening overlay:', targetId);
        // Hide all overlays first
        document.querySelectorAll('.about-section, .exhibitions-section, .commissions-section, .contact-section').forEach(section => {
          section.classList.remove('active');
        });
        // Show the target overlay
        target.classList.add('active');
        console.log('Added active class to:', targetId);
        // Disable body scroll when overlay is open
        document.body.style.overflow = 'hidden';
        
        // Force ScrollTrigger refresh for overlay content
        setTimeout(() => {
          ScrollTrigger.refresh();
          window.scrollBy(0, 1);
          setTimeout(() => window.scrollBy(0, -1), 50);
        }, 300);
      } else {
        // Normal scroll for hero and works sections
        if (targetId === 'works') {
          // For works section, scroll with offset to show content better
          const targetPosition = target.offsetTop - 80; // 80px offset from top
          window.scrollTo({ 
            top: targetPosition, 
            behavior: 'smooth' 
          });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Force ScrollTrigger refresh after smooth scroll completes
        setTimeout(() => {
          ScrollTrigger.refresh();
          window.scrollBy(0, 1);
          setTimeout(() => window.scrollBy(0, -1), 50);
        }, 800);
      }
    });
  });

  // CTA button smooth scroll
  document.querySelectorAll('.cta-button[href^="#"]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.querySelector(`#${targetId}`);
      
      if (!target) return;
      
      // If it's an overlay section, show it as overlay
      if (overlaySections.includes(targetId)) {
        // Hide all overlays first
        document.querySelectorAll('.about-section, .exhibitions-section, .commissions-section, .contact-section').forEach(section => {
          section.classList.remove('active');
        });
        // Show the target overlay
        target.classList.add('active');
        // Disable body scroll when overlay is open
        document.body.style.overflow = 'hidden';
        
        // Force ScrollTrigger refresh for overlay content
        setTimeout(() => {
          ScrollTrigger.refresh();
          window.scrollBy(0, 1);
          setTimeout(() => window.scrollBy(0, -1), 50);
        }, 300);
      } else {
        // Normal scroll for hero and works sections
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Force ScrollTrigger refresh after smooth scroll completes
        setTimeout(() => {
          ScrollTrigger.refresh();
          window.scrollBy(0, 1);
          setTimeout(() => window.scrollBy(0, -1), 50);
        }, 800);
      }
    });
  });
  
  // Close overlay when clicking on logo
  document.querySelector('nav .logo a').addEventListener('click', function(e) {
    e.preventDefault();
    // Hide all overlays
    document.querySelectorAll('.about-section, .exhibitions-section, .commissions-section, .contact-section').forEach(section => {
      section.classList.remove('active');
    });
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Close button handlers
  document.querySelectorAll('.overlay-close').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.about-section, .exhibitions-section, .commissions-section, .contact-section').forEach(section => {
        section.classList.remove('active');
        // Clear GSAP inline styles from contact section
        if (section.id === 'contact') {
          gsap.set(section, { clearProps: "all" });
          gsap.set(section.querySelectorAll('.title-wrapper, .contact-item'), { clearProps: "all" });
        }
      });
      document.body.style.overflow = 'auto';
    });
  });
  
  // Close overlay with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const anyOverlayActive = document.querySelector('.about-section.active, .exhibitions-section.active, .commissions-section.active, .contact-section.active');
      if (anyOverlayActive) {
        document.querySelectorAll('.about-section, .exhibitions-section, .commissions-section, .contact-section').forEach(section => {
          section.classList.remove('active');
          // Clear GSAP inline styles from contact section
          if (section.id === 'contact') {
            gsap.set(section, { clearProps: "all" });
            gsap.set(section.querySelectorAll('.title-wrapper, .contact-item'), { clearProps: "all" });
          }
        });
        document.body.style.overflow = 'auto';
      }
    }
  });

  // ============================================
  // EXHIBITIONS INTERACTIVITY
  // ============================================
  const exhibitionItems = document.querySelectorAll('.exhibition-item');
  if (exhibitionItems.length > 0) {
    exhibitionItems.forEach(item => {
      item.addEventListener('click', function() {
        const exhibitionIndex = this.getAttribute('data-exhibition');
        
        // Update active item
        exhibitionItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Update preview
        document.querySelectorAll('.exhibition-preview-image').forEach(preview => {
          preview.classList.remove('active');
        });
        const targetPreview = document.querySelector(`[data-preview="${exhibitionIndex}"]`);
        if (targetPreview) {
          targetPreview.classList.add('active');
        }
      });
    });
  }

  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      // Show button when scrolled down past 300px
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
  }

  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Close any open overlays first
      document.querySelectorAll('.about-section, .exhibitions-section, .commissions-section, .contact-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Re-enable body scroll
      document.body.style.overflow = 'auto';
      
      // Force scroll to top immediately
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also try smooth scroll as backup
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 10);
    });
  }

  // ============================================
  // FEATURED ARTWORK DETAIL VIEW
  // ============================================
  const artworkDetail = document.getElementById('artwork-detail');
  const artworkDetailClose = document.querySelector('.artwork-detail-close');
  const detailImg = document.getElementById('detail-img');
  const detailTitle = document.querySelector('.artwork-detail-title');
  const detailYear = document.querySelector('.artwork-detail-year');
  const detailTechnique = document.querySelector('.artwork-detail-technique');
  const detailDimensions = document.querySelector('.artwork-detail-dimensions');
  const detailDescription = document.querySelector('.artwork-detail-description');
  const detailImageWrapper = document.querySelector('.artwork-detail-image-wrapper');

  // Artwork data with descriptions
  const artworkData = {
    '1': {
      description: 'Captured in the gentle light of morning, this piece explores the boundaries between reality and contemplation. The composition invites the viewer to experience a moment of profound stillness and inner reflection.'
    },
    '2': {
      description: 'A study in human connection and emotional vulnerability. Through careful observation of form and gesture, this work reveals the delicate balance between strength and tenderness that defines the feminine experience.'
    },
    '3': {
      description: 'An exploration of introspection and self-awareness. The subtle interplay of light and shadow creates a meditative space, inviting viewers to pause and engage with their own inner landscape.'
    },
    '4': {
      description: 'This work represents the culmination of a series exploring the essence of being. The dominant scale and intimate detail work together to create an immersive experience that transcends the canvas itself.'
    },
    '5': {
      description: 'Nature\'s cycles of growth and transformation are captured through expressive brushwork and organic forms. The piece celebrates the beauty of natural processes and the vitality of life itself.'
    },
    '6': {
      description: 'A moment frozen in time, inviting contemplation on the nature of perception and memory. The interplay between surface and depth creates a visual dialogue that unfolds slowly before the viewer.'
    },
    '7': {
      description: 'Subtle and evocative, this work speaks in whispers rather than declarations. The restrained palette and delicate application reveal layers of meaning through quiet observation and patient viewing.'
    }
  };

  function openArtworkDetail(item) {
    const img = item.querySelector('img');
    const title = item.querySelector('.artwork-title');
    const year = item.querySelector('.artwork-year');
    const details = item.querySelector('.artwork-details');
    const artworkId = item.getAttribute('data-artwork');
    
    // Parse technique and dimensions from details
    const detailsText = details.textContent;
    const parts = detailsText.split('·');
    const technique = parts[0] ? parts[0].trim() : 'Oil on canvas';
    const dimensions = parts[1] ? parts[1].trim() : '';
    
    // Set content
    detailImg.src = img.src;
    detailImg.alt = img.alt;
    detailTitle.textContent = title.textContent;
    detailYear.textContent = year.textContent;
    detailTechnique.textContent = technique;
    detailDimensions.textContent = dimensions;
    detailDescription.textContent = artworkData[artworkId]?.description || '';
    
    // Show detail view
    artworkDetail.classList.add('active');
    artworkDetail.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Reset animations
    gsap.set(detailImageWrapper, { 
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' 
    });
    gsap.set(detailImg, { 
      scale: 1.08 
    });
    gsap.set([detailTitle, '.artwork-detail-info-item', detailDescription], { 
      y: 30, 
      opacity: 0 
    });
    
    // Cinematic reveal animation
    const detailTl = gsap.timeline({ 
      delay: 0.2,
      defaults: { ease: 'power3.out' }
    });
    
    detailTl
      // Image curtain reveal
      .to(detailImageWrapper, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: prefersReducedMotion ? 0.4 : 1.2,
        ease: 'power4.inOut'
      })
      // Image scale to normal
      .to(detailImg, {
        scale: 1,
        duration: prefersReducedMotion ? 0.4 : 1.4,
        ease: 'power3.out'
      }, '-=0.8')
      // Title reveal
      .to(detailTitle, {
        y: 0,
        opacity: 1,
        duration: prefersReducedMotion ? 0.3 : 0.8
      }, '-=0.6')
      // Info items stagger
      .to('.artwork-detail-info-item', {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: prefersReducedMotion ? 0.3 : 0.6
      }, '-=0.4')
      // Description fade in
      .to(detailDescription, {
        y: 0,
        opacity: 1,
        duration: prefersReducedMotion ? 0.3 : 0.8
      }, '-=0.3');
  }

  function closeArtworkDetail() {
    const closeTl = gsap.timeline({
      onComplete: () => {
        artworkDetail.classList.remove('active');
        artworkDetail.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
    
    closeTl
      .to([detailTitle, '.artwork-detail-info-item', detailDescription], {
        y: -20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: 'power2.in'
      })
      .to(detailImageWrapper, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      }, '-=0.2');
  }

  // Add click handlers to View Detail buttons
  document.querySelectorAll('.view-detail-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const slideContent = this.closest('.slide-content');
      const artworkId = slideContent.getAttribute('data-artwork');
      const title = slideContent.querySelector('.slide-title').textContent;
      const catalogueNum = slideContent.querySelector('.catalogue-number').textContent;
      const description = slideContent.querySelector('.slide-description').textContent;
      const metaValues = slideContent.querySelectorAll('.meta-value');
      
      // Populate detail view
      const imgNum = artworkId;
      detailImg.src = `./assets/img${imgNum}.jpg`;
      detailImg.alt = `${title} painting by Claudia`;
      detailTitle.textContent = title;
      detailYear.textContent = metaValues[0]?.textContent || '';
      detailTechnique.textContent = metaValues[1]?.textContent || '';
      detailDimensions.textContent = metaValues[2]?.textContent || '';
      detailDescription.textContent = artworkData[artworkId]?.description || description;
      
      // Show detail view
      artworkDetail.classList.add('active');
      artworkDetail.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Reset animations
      gsap.set(detailImageWrapper, { 
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' 
      });
      gsap.set(detailImg, { 
        scale: 1.08 
      });
      gsap.set([detailTitle, '.artwork-detail-info-item', detailDescription], { 
        y: 30, 
        opacity: 0 
      });
      
      // Cinematic reveal animation
      const detailTl = gsap.timeline({ 
        delay: 0.2,
        defaults: { ease: 'power3.out' }
      });
      
      detailTl
        .to(detailImageWrapper, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: prefersReducedMotion ? 0.4 : 1.2,
          ease: 'power4.inOut'
        })
        .to(detailImg, {
          scale: 1,
          duration: prefersReducedMotion ? 0.4 : 1.4,
          ease: 'power3.out'
        }, '-=0.8')
        .to(detailTitle, {
          y: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0.3 : 0.8
        }, '-=0.6')
        .to('.artwork-detail-info-item', {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: prefersReducedMotion ? 0.3 : 0.6
        }, '-=0.4')
        .to(detailDescription, {
          y: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0.3 : 0.8
        }, '-=0.3');
    });
  });

  // Close button handler
  artworkDetailClose.addEventListener('click', closeArtworkDetail);
  
  // Click outside to close
  artworkDetail.addEventListener('click', function(e) {
    if (e.target === artworkDetail) {
      closeArtworkDetail();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && artworkDetail.classList.contains('active')) {
      closeArtworkDetail();
    }
  });

  // ============================================
  // LIGHTBOX (kept for backward compatibility)
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
  // CINEMATIC INTRO SEQUENCE
  // ============================================
  
  // Initial setup - hide everything
  gsap.set("nav", { y: -100, opacity: 0 });
  gsap.set(".letter-wrapper", { y: "100%", opacity: 0 });
  gsap.set(".subtitle-wrapper h1", { y: 50, opacity: 0 });
  gsap.set(".description-line", { y: 30, opacity: 0 });
  gsap.set(".hero-cta", { y: 30, opacity: 0, scale: 0.95 });

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
  // SECTION TRANSITIONS
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
    // Skip overlay sections to avoid conflicts
    if (title.closest('.about-section, .exhibitions-section, .commissions-section, .contact-section')) {
      return;
    }
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
      start: "top 80%",
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
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  // Commissions section (emphasized for conversion)
  const commissionsTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".commissions-section",
      start: "top 80%",
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

  // Contact section with fade - DISABLED for overlay mode
  /*
  gsap.from(".contact-item", {
    y: 20,
    opacity: 0,
    stagger: 0.2,
    duration: baseDuration,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
  */

  // Force initial ScrollTrigger refresh to catch visible sections
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);

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


