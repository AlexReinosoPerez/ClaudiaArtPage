window.addEventListener("DOMContentLoaded", function () {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scroll for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Initial setup
  gsap.set("nav", { y: -100, opacity: 0 });
  gsap.set(".letter-wrapper", { y: "100%" });
  gsap.set(".subtitle-wrapper h1", { y: 50, opacity: 0 });
  gsap.set(".item-copy-wrapper p", { y: 30, opacity: 0 });
  gsap.set(".item-img", { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" });

  // Hero animation timeline
  gsap.defaults({ duration: 1, ease: "power3.out" });
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .to(".letter-wrapper", {
      y: 0,
      stagger: 0.08,
      duration: 1.2,
      ease: "power4.out"
    })
    .to(".subtitle-wrapper h1", {
      y: 0,
      opacity: 1,
      duration: 0.8
    }, "-=0.6")
    .to("nav", {
      y: 0,
      opacity: 1,
      duration: 0.8
    }, "-=0.4");

  // Gallery animations with ScrollTrigger
  gsap.utils.toArray(".item").forEach((item, index) => {
    gsap.to(item.querySelector(".item-img"), {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 1,
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
      stagger: 0.1,
      duration: 0.8,
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
      duration: 1,
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
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  // Contact section animation
  gsap.from(".contact-content > *", {
    y: 30,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });
});

