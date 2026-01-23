// 3D Infinite Gallery Carousel
// Adapted from CodePen inspiration
window.initGallery3D = function() {
  const CONFIG = {
    slideCount: 7,
    spacingX: 45,
    pWidth: 14,
    pHeight: 21,
    camZ: 35,
    wallAngleY: -0.25,
    snapDelay: 200,
    lerpSpeed: 0.06
  };

  const totalGalleryWidth = CONFIG.slideCount * CONFIG.spacingX;
  
  const container = document.getElementById('canvas-container');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc4c4b0); // Match site bg
  scene.fog = new THREE.Fog(0xc4c4b0, 10, 110);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, CONFIG.camZ);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const galleryGroup = new THREE.Group();
  scene.add(galleryGroup);

  const textureLoader = new THREE.TextureLoader();
  const planeGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);

  const images = [
    './assets/img1.jpg',
    './assets/img2.jpg',
    './assets/img3.jpg',
    './assets/img4.jpg',
    './assets/img5.jpg',
    './assets/img6.jpg',
    './assets/img7.jpg'
  ];

  const paintingGroups = [];

  for(let i = 0; i < CONFIG.slideCount; i++) {
    const group = new THREE.Group();
    group.position.set(i * CONFIG.spacingX, 0, 0);
    
    const mat = new THREE.MeshBasicMaterial({ 
      map: textureLoader.load(images[i]) 
    });
    const mesh = new THREE.Mesh(planeGeo, mat);
    
    const edges = new THREE.EdgesGeometry(planeGeo);
    const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x222222 }));

    const shadowGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.position.set(0.8, -0.8, -0.5);

    const lineZ = -1;
    const lineLen = CONFIG.spacingX;
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-lineLen/2, 14, lineZ), 
      new THREE.Vector3(lineLen/2, 14, lineZ),
      new THREE.Vector3(-lineLen/2, -14, lineZ), 
      new THREE.Vector3(lineLen/2, -14, lineZ)
    ]);
    const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xdddddd }));

    group.add(shadow);
    group.add(mesh);
    group.add(outline);
    group.add(lines);
    
    galleryGroup.add(group);
    paintingGroups.push(group);
  }

  galleryGroup.rotation.y = CONFIG.wallAngleY;
  galleryGroup.position.x = 3;

  let currentScroll = 0;
  let targetScroll = 0;
  let snapTimer = null;
  let mouse = { x: 0, y: 0 };

  function snapToNearest() {
    const index = Math.round(targetScroll / CONFIG.spacingX);
    targetScroll = index * CONFIG.spacingX;
  }

  const worksSection = document.querySelector('.works-section');
  let isGalleryFocused = false;
  
  // Gallery gets focus when hovering over works section
  worksSection.addEventListener('mouseenter', () => {
    isGalleryFocused = true;
    document.body.style.overflow = 'hidden'; // Prevent page scroll when in gallery
  });
  
  worksSection.addEventListener('mouseleave', () => {
    isGalleryFocused = false;
    document.body.style.overflow = ''; // Restore page scroll
  });
  
  // Auto-activate gallery on mobile/touch devices when fully scrolled into view
  if ('ontouchstart' in window) {
    let scrollTimeout;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Clear any existing timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);
        
        if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
          // Wait a bit to ensure scroll has fully completed
          scrollTimeout = setTimeout(() => {
            isGalleryFocused = true;
            document.body.style.overflow = 'hidden';
          }, 500);
        } else if (!entry.isIntersecting) {
          isGalleryFocused = false;
          document.body.style.overflow = '';
        }
      });
    }, { threshold: [0, 0.5, 0.8, 1] });
    
    observer.observe(worksSection);
  }
  
  // Only capture scroll when gallery is focused
  window.addEventListener('wheel', (e) => {
    if (isGalleryFocused) {
      e.preventDefault();
      targetScroll += e.deltaY * 0.1 + e.deltaX * 0.1;
      if(snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToNearest, CONFIG.snapDelay);
    }
  }, { passive: false });
  
  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (isGalleryFocused) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetScroll -= CONFIG.spacingX;
        snapToNearest();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetScroll += CONFIG.spacingX;
        snapToNearest();
      }
    }
  });

  let touchStart = 0;
  let touchStartY = 0;
  let isTouchScrolling = false;
  
  worksSection.addEventListener('touchstart', e => {
    touchStart = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isTouchScrolling = false;
    if(snapTimer) clearTimeout(snapTimer);
  });
  
  worksSection.addEventListener('touchmove', e => {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = Math.abs(touchStart - touchCurrentX);
    const diffY = Math.abs(touchStartY - touchCurrentY);
    
    // Determine if this is a horizontal or vertical swipe
    if (!isTouchScrolling) {
      isTouchScrolling = true;
      // If horizontal swipe is dominant, use gallery navigation
      if (diffX > diffY && diffX > 10) {
        e.preventDefault(); // Prevent page scroll for horizontal swipe
        const diff = touchStart - touchCurrentX;
        targetScroll += diff * 0.6;
        touchStart = touchCurrentX;
      }
      // If vertical swipe, allow normal scroll (don't preventDefault)
    } else if (diffX > diffY) {
      // Continue horizontal navigation
      e.preventDefault();
      const diff = touchStart - touchCurrentX;
      targetScroll += diff * 0.6;
      touchStart = touchCurrentX;
    }
    // Otherwise let the vertical scroll happen naturally
    
    if(snapTimer) clearTimeout(snapTimer);
  }, { passive: false });

  worksSection.addEventListener('touchend', () => {
    if (isTouchScrolling) {
      snapToNearest();
    }
    isTouchScrolling = false;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function updateUI(scrollX) {
    const rawIndex = Math.round(scrollX / CONFIG.spacingX);
    const safeIndex = ((rawIndex % CONFIG.slideCount) + CONFIG.slideCount) % CONFIG.slideCount;
    
    for(let i = 0; i < CONFIG.slideCount; i++) {
      const el = document.getElementById(`slide-${i}`);
      if(el) {
        if(i === safeIndex) el.classList.add('active');
        else el.classList.remove('active');
      }
    }
  }
  
  // Initialize first slide as active on load
  setTimeout(() => {
    const firstSlide = document.getElementById('slide-0');
    if (firstSlide) {
      firstSlide.classList.add('active');
    }
  }, 100);

  function animate() {
    requestAnimationFrame(animate);
    currentScroll += (targetScroll - currentScroll) * CONFIG.lerpSpeed;
    
    const xMove = currentScroll * Math.cos(CONFIG.wallAngleY);
    const zMove = currentScroll * Math.sin(CONFIG.wallAngleY);
    camera.position.x = xMove;
    camera.position.z = CONFIG.camZ - zMove;
    
    paintingGroups.forEach((group, i) => {
      const originalX = i * CONFIG.spacingX;
      const distFromCam = currentScroll - originalX;
      const shift = Math.round(distFromCam / totalGalleryWidth) * totalGalleryWidth;
      group.position.x = originalX + shift;
    });
    
    camera.rotation.x = mouse.y * 0.05;
    camera.rotation.y = -mouse.x * 0.05;
    
    updateUI(currentScroll);
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Click handler for opening lightbox
  const raycaster = new THREE.Raycaster();
  const clickMouse = new THREE.Vector2();

  container.addEventListener('click', (e) => {
    // Calculate mouse position in normalized device coordinates
    const rect = container.getBoundingClientRect();
    clickMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    clickMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(clickMouse, camera);
    
    // Check for intersections with all paintings
    const allMeshes = [];
    paintingGroups.forEach(group => {
      group.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material.map) {
          allMeshes.push(child);
        }
      });
    });

    const intersects = raycaster.intersectObjects(allMeshes);
    
    if (intersects.length > 0) {
      // Find which painting was clicked
      const clickedMesh = intersects[0].object;
      let paintingIndex = -1;
      
      paintingGroups.forEach((group, i) => {
        group.children.forEach(child => {
          if (child === clickedMesh) {
            paintingIndex = i;
          }
        });
      });

      if (paintingIndex >= 0) {
        // Open lightbox with the clicked image
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.querySelector('.lightbox-title');
        const lightboxDetails = document.querySelector('.lightbox-details');
        
        lightboxImg.src = images[paintingIndex];
        lightboxImg.alt = `Artwork ${paintingIndex + 1}`;
        
        // Get info from slide content
        const slideContent = document.getElementById(`slide-${paintingIndex}`);
        if (slideContent) {
          const title = slideContent.querySelector('.slide-title');
          const catalogueNum = slideContent.querySelector('.catalogue-number');
          const metaValues = slideContent.querySelectorAll('.meta-value');
          
          lightboxTitle.textContent = title ? title.textContent : '';
          
          // Build details string
          let details = catalogueNum ? catalogueNum.textContent : '';
          if (metaValues.length > 0) {
            const year = metaValues[0] ? metaValues[0].textContent : '';
            const medium = metaValues[1] ? metaValues[1].textContent : '';
            const size = metaValues[2] ? metaValues[2].textContent : '';
            details += ` • ${year} • ${medium} • ${size}`;
          }
          lightboxDetails.textContent = details;
        }
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  animate();
};
