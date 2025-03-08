// Main initialization to wrap all scripts
document.addEventListener("DOMContentLoaded", function() {
  // Initialize each component in proper sequence
  AnimationUtils.initPreLoader();
  ButtonUtils.initButtonIcon();
  ButtonUtils.initPushButton();
  AnimationUtils.initScrollReveal();
  AnimationUtils.initTextReveal();
  AnimationUtils.initCardReveal();
  ButtonUtils.initTextButton();
  AnimationUtils.initAccordion();
  CarouselUtils.initImageCarousel();
  GLTransitionUtils.initProductCarousel();
  CarouselUtils.initCarouselContentTrigger();
  EffectsUtils.initPillsFooterEffect();
});

// Animation Utilities
const AnimationUtils = {
  // PreLoader Animation
  initPreLoader: function() {
    gsap.set('[loader="bar"]', {transformOrigin:"left center", scaleX:0, scaleY:1});
    gsap.set("#container-scale", {height:0, scale:1, opacity:0, filter:"blur(0px)"});
    gsap.set('[image-stagger="reveal"]', {y:400});
    gsap.set('[pre-loader-text="headline"]', {opacity:0});
    gsap.set('[pre-loader-text="paragraph"]', {opacity:0});
    gsap.set('[button-stagger="0.2"]', {opacity:0});
    
    let timeline = gsap.timeline({defaults:{ease:"power4.inOut"}});
    timeline.to('[loader="bar"]', {scaleX:1, duration:1.2, ease:"none"})
      .add("vertical", ">")
      .to('[loader="bar"]', {scaleY:70, duration:0.7}, "vertical")
      .fromTo("#container-scale", {height:0, opacity:0}, {height:"19%", opacity:1, duration:1}, "vertical")
      .to('[image-stagger="reveal"]', {
        y:0, 
        duration:1.4, 
        stagger:0.7, 
        ease:"power4.inOut", 
        force3D:true, 
        autoRound:false, 
        onComplete: function() {
          gsap.set(this.targets(), {clearProps:"transform"});
        }
      }, "vertical+=0.12")
      .to("#container-scale", {scale:7, opacity:0.1, filter:"blur(3px)", duration:1.8, ease:"expo.out"}, "vertical+=2")
      .to('[pre-loader-text="headline"]', {opacity:1, duration:1.3}, "<+=0.3")
      .to('[pre-loader-text="paragraph"]', {opacity:1, duration:1.3}, "<+=0.5")
      .to('[button-stagger="0.2"]', {opacity:1, duration:1, stagger:0.2}, "<+=0.3");
    
    timeline.play();
    gsap.set("#nav", {y:-50, opacity:0, filter:"blur(20px)"});
    
    let headlineEl = document.querySelector('[anm-intro-headline="stagger"]');
    let subtitleEl = document.querySelector('[anm-intro-subtitle="blur"]');
    
    if (headlineEl && subtitleEl) {
      headlineEl.style.perspective = "1000px";
      subtitleEl.style.perspective = "1000px";
      
      let headlineSplit = new SplitType('[anm-intro-headline="stagger"]', {types:"words"});
      gsap.set(headlineSplit.words, {y:50, opacity:0, filter:"blur(10px)", rotationY:-50, transformStyle:"preserve-3d"});
      gsap.set('[anm-intro-subtitle="blur"]', {y:20, opacity:0, filter:"blur(10px)", rotationY:-20, transformStyle:"preserve-3d"});
      gsap.set("#intro-scroll-btn", {y:30, opacity:0, visibility:"hidden", display:"none"});
      
      let introTimeline = gsap.timeline({paused:true, defaults:{ease:"expo.out"}});
      introTimeline
        .to(headlineSplit.words, {y:0, opacity:1, filter:"blur(0px)", rotationY:0, duration:1, stagger:0.3}, "<")
        .to('[anm-intro-subtitle="blur"]', {y:0, opacity:1, filter:"blur(0px)", rotationY:0, duration:1, stagger:0.4}, "-=0.3")
        .to("#nav", {y:0, opacity:1, filter:"blur(0px)", duration:1}, "<+=0.4")
        .to("#intro-scroll-btn", {display:"block", visibility:"visible", opacity:1, y:0, duration:1}, "-=0.8");
      
      document.querySelectorAll(".btn_preloader_activate, .btn_text_prealoder-deactivate").forEach(button => {
        button.addEventListener("click", function() {
          gsap.to('[anm-out-preloader="shader"]', {
            duration:1.5, 
            opacity:0, 
            filter:"blur(20px)", 
            ease:"expo.out",
            onComplete() {
              let preloaderEl = document.querySelector('[anm-out-preloader="shader"]');
              if (preloaderEl) {
                preloaderEl.style.display = "none";
              }
              introTimeline.play();
            }
          });
        });
      });
    }
  },
  
  // Scroll Reveal for Eyebrow and Title
  initScrollReveal: function() {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll("[reveal-on-scroll=section]").forEach(section => {
      let eyebrows = section.querySelectorAll("[reveal-on-scroll=eyebrow]");
      let titles = section.querySelectorAll("[reveal-on-scroll=title]");
      
      if (eyebrows.length) {
        gsap.fromTo(eyebrows, 
          {y:100, opacity:0}, 
          {
            y:0, 
            opacity:1, 
            duration:1.2, 
            ease:"power4.out", 
            stagger:0.2,
            scrollTrigger: {
              trigger: section,
              start: "70% bottom",
              end: "bottom top",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      
      if (titles.length) {
        gsap.fromTo(titles, 
          {y:100, opacity:0}, 
          {
            y:0, 
            opacity:1, 
            duration:1.4, 
            ease:"power4.out", 
            stagger:0.2,
            scrollTrigger: {
              trigger: section,
              start: "100% bottom",
              end: "bottom top",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  },
  
  // Text Reveal Animation
  initTextReveal: function() {
    const textSections = document.querySelectorAll("[anm-scroll-text=section]");
    
    if (textSections.length === 0) return;
    
    textSections.forEach(section => {
      // Check if disabled based on viewport
      if (this.isAnimationDisabled(section)) return;
      
      const scroller = section.closest("[anm-scroller=scroller]") || window;
      const startPosition = section.getAttribute("anm-start") || "top 20%";
      const resetAnimation = section.getAttribute("anm-reset");
      const headlines = section.querySelectorAll("[anm-scroll-text=headline]");
      const texts = section.querySelectorAll("[anm-scroll-text=text]");
      
      const timeline = gsap.timeline({defaults: {duration: 1, ease: "expo.out"}});
      
      function animateElements(elements, defaultDistance) {
        elements.forEach(element => {
          const distance = element.getAttribute("anm-distance") || defaultDistance;
          const splitType = element.getAttribute("anm-split") || "lines";
          const staggerValue = parseFloat(element.getAttribute("anm-lines-stagger")) || 0.08;
          const durationValue = parseFloat(element.getAttribute("anm-duration")) || 1.2;
          const delayValue = parseFloat(element.getAttribute("anm-delay")) || 0.2;
          const easeValue = element.getAttribute("anm-ease") || "expo.out";
          const customAttrs = element.getAttribute("anm-custom");
          
          // Parse custom attributes
          const customOptions = {};
          if (customAttrs) {
            customAttrs.split(",").forEach(attr => {
              const [key, value] = attr.split(":").map(str => str.trim());
              if (key && value) {
                customOptions[key] = value;
              }
            });
          }
          
          if (splitType) {
            const splitText = new SplitType(element, {types: "lines"});
            timeline.fromTo(
              splitText.lines,
              {y: distance, autoAlpha: 0, ...customOptions},
              {
                y: 0, 
                autoAlpha: 1, 
                stagger: staggerValue, 
                duration: durationValue, 
                delay: delayValue, 
                ease: easeValue,
                ...customOptions
              },
              0
            );
          } else {
            timeline.fromTo(
              element,
              {y: distance, autoAlpha: 0, ...customOptions},
              {
                yPercent: 0, 
                autoAlpha: 1, 
                duration: durationValue, 
                delay: delayValue, 
                ease: easeValue,
                ...customOptions
              },
              0
            );
          }
        });
      }
      
      ScrollTrigger.create({
        animation: timeline,
        trigger: section,
        scroller: scroller,
        start: startPosition,
        end: "top 30%",
        toggleActions: resetAnimation ? "none play none reset" : "none play none none"
      });
      
      animateElements(headlines, "100%");
      animateElements(texts, "50%");
    });
  },
  
  // Card Reveal Animation
  initCardReveal: function() {
    const cardContainers = document.querySelectorAll("[anm-cards-container=section]");
    
    if (!cardContainers || cardContainers.length === 0) return;
    
    cardContainers.forEach(container => {
      if (this.isAnimationDisabled(container)) return;
      
      const scroller = container.closest("[anm-scroller=scroller]") || window;
      const startPosition = container.getAttribute("anm-start") || "55% bottom";
      const endPosition = container.getAttribute("anm-end") || "bottom top";
      const scrubAnimation = container.getAttribute("anm-scrub") || false;
      const resetAnimation = container.getAttribute("anm-reset") || false;
      const cards = container.querySelectorAll("[anm-cards-scroll=card]");
      
      const timeline = gsap.timeline({defaults: {duration: 1, ease: "power2.inOut"}});
      
      ScrollTrigger.create({
        animation: timeline,
        trigger: container,
        scroller: scroller,
        start: resetAnimation === "true" ? "top bottom" : startPosition,
        end: resetAnimation === "true" ? startPosition : endPosition,
        scrub: scrubAnimation === "true",
        toggleActions: resetAnimation === "true" ? "none play none reset" : (scrubAnimation === "true" ? null : "play none none none")
      });
      
      cards.forEach((card, index) => {
        const duration = card.getAttribute("anm-duration") || 1;
        const customAttrs = card.getAttribute("anm-custom") || "";
        const ease = card.getAttribute("anm-ease") || "power2.inOut";
        const delay = card.getAttribute("anm-delay") || (0.1 * index);
        const animationType = card.getAttribute("anm-type") || "slide";
        const direction = card.getAttribute("anm-direction") || "bottom";
        
        // Parse custom attributes
        const customOptions = {};
        if (customAttrs) {
          customAttrs.split(",").forEach(attr => {
            const [key, value] = attr.split(":").map(str => str.trim());
            if (key && value) {
              customOptions[key] = value;
            }
          });
        }
        
        switch (animationType) {
          case "opacity":
            timeline.fromTo(
              card,
              {opacity: 0, ...customOptions},
              {opacity: 1, duration: duration, ease: ease, delay: delay},
              0
            );
            break;
            
          case "slide":
            const distance = card.getAttribute("anm-distance") || "100%";
            
            switch (direction) {
              case "top":
                timeline.fromTo(
                  card,
                  {y: -distance, opacity: 0, ...customOptions},
                  {y: 0, opacity: 1, duration: duration, ease: ease, delay: delay},
                  0
                );
                break;
                
              case "bottom":
                timeline.fromTo(
                  card,
                  {y: distance, opacity: 0, ...customOptions},
                  {y: 0, opacity: 1, duration: duration, ease: ease, delay: delay},
                  0
                );
                break;
                
              case "left":
                timeline.fromTo(
                  card,
                  {x: -distance, opacity: 0, ...customOptions},
                  {x: 0, opacity: 1, duration: duration, ease: ease, delay: delay},
                  0
                );
                break;
                
              case "right":
                timeline.fromTo(
                  card,
                  {x: distance, opacity: 0, ...customOptions},
                  {x: 0, opacity: 1, duration: duration, ease: ease, delay: delay},
                  0
                );
                break;
            }
            break;
            
          case "scale":
            const scaleValue = parseFloat(card.getAttribute("anm-scale")) || 0.8;
            
            timeline.fromTo(
              card,
              {scale: scaleValue, ...customOptions},
              {scale: 1, duration: duration, ease: ease, delay: delay},
              0
            );
            break;
        }
      });
    });
  },
  
  // Accordion Animation
  initAccordion: function() {
    const accordionSections = document.querySelectorAll("[anm-accordion=section]");
    
    if (!accordionSections || accordionSections.length === 0) return;
    
    accordionSections.forEach(section => {
      if (this.isAnimationDisabled(section)) return;
      
      const allowMultiple = section.getAttribute("anm-allow-multiple");
      const accordions = section.querySelectorAll("[anm-accordion=accordion]");
      let activeAccordion = null;
      
      if (!accordions || accordions.length === 0) return;
      
      accordions.forEach(accordion => {
        const trigger = accordion.querySelector("[anm-accordion=trigger]");
        let isOpen = accordion.getAttribute("anm-open") || "false";
        const content = accordion.querySelector("[anm-accordion=content]");
        const icon = accordion.querySelector("[anm-accordion=icon]");
        const duration = accordion.getAttribute("anm-duration") || 1;
        const delay = accordion.getAttribute("anm-delay") || 0;
        const ease = accordion.getAttribute("anm-ease") || "expo.inOut";
        const customAttrs = accordion.getAttribute("anm-custom") || "";
        
        // Parse custom attributes
        const customOptions = {};
        if (customAttrs) {
          customAttrs.split(",").forEach(attr => {
            const [key, value] = attr.split(":").map(str => str.trim());
            if (key && value) {
              customOptions[key] = value;
            }
          });
        }
        
        // Compute target properties
        const targetProps = {};
        for (let key in customOptions) {
          if (key === "opacity") {
            targetProps[key] = "1";
          } else if (key === "scale") {
            targetProps[key] = 1;
          } else {
            targetProps[key] = customOptions[key].replace(/(\d+(\.\d+)?)/g, match => {
              const valueWithUnit = match.match(/(\d+(\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|deg|rad|grad|turn|cvw|cvh)?/);
              return valueWithUnit ? `0${valueWithUnit[3] || ""}` : "0";
            });
            
            if (!/\d/.test(customOptions[key])) {
              const computedStyle = window.getComputedStyle(content);
              targetProps[key] = computedStyle[key] || customOptions[key];
            }
          }
        }
        
        const timeline = gsap.timeline({
          defaults: {duration: duration, ease: ease},
          delay: delay,
          paused: true
        });
        
        gsap.set(content, {height: 0, ...customOptions});
        
        timeline
          .to(icon, {rotate: -135})
          .fromTo(
            content,
            {height: 0, ...customOptions},
            {height: "auto", ...targetProps},
            "<"
          );
        
        if (isOpen === "true") {
          timeline.play();
          activeAccordion = accordion;
        }
        
        trigger.addEventListener("click", () => {
          if (isOpen === "false") {
            // Close active accordion if not allowing multiple
            if (allowMultiple !== true && activeAccordion && activeAccordion !== accordion) {
              activeAccordion.querySelector("[anm-accordion=trigger]").click();
            }
            
            isOpen = "true";
            activeAccordion = accordion;
            timeline.play();
          } else {
            isOpen = "false";
            activeAccordion = null;
            timeline.reverse();
          }
        });
      });
    });
  },
  
  // Utility function to check if animation is disabled for device
  isAnimationDisabled: function(element) {
    const disableAttr = element.getAttribute("anm-disable");
    if (!disableAttr) return false;
    
    const disabledDevices = disableAttr.split(",").map(device => device.trim());
    
    const mediaQueries = {
      desktop: "(min-width: 992px)",
      tablet: "(min-width: 768px) and (max-width: 991px)",
      landscape: "(orientation: landscape) and (max-width: 767px)",
      mobile: "(max-width: 479px)"
    };
    
    const relevantQueries = disabledDevices
      .map(device => mediaQueries[device])
      .filter(Boolean);
    
    if (relevantQueries.length === 0) return false;
    
    return relevantQueries.some(query => window.matchMedia(query).matches);
  }
};

// GL Transition Utilities
const GLTransitionUtils = {
  // Product Carousel with WebGL Transitions
  initProductCarousel: function() {
    document.addEventListener("DOMContentLoaded", function() {
      // Check for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Set up canvas
      const pixelRatio = window.devicePixelRatio || 1;
      const canvas = document.getElementById("glcanvas");
      
      if (!canvas) {
        return;
      }
      
      const gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        preserveDrawingBuffer: true
      }) || canvas.getContext("experimental-webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        preserveDrawingBuffer: true
      });
      
      if (!gl) {
        return;
      }
      
      // Image URLs
      const imageURLs = [
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c0bcc523ac588f406e23fb_Levacel%20Product%20Image.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c0bcd59fcf2c6cbc6e4e0d_Venestasi%20Visual.%20Pura%20Pharma.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c0c09f85db12f4788c1f80_Ansirem%20Pura%20Pharma.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c0c0ad23ac588f4072a636_Vitamina%20D3%202.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c0c0bc699d3cd9bfea37d9_B6%20Magnesio%20Visual.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c0c0d0147fcfd5a3601199_Snell%20Fame%20Visual.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c333d85a0c70363eae219d_Rodiols%20Rosea.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c0c23f608a44fb45bacefe_Tricopyl%20Pura.webp"
      ];
      
      const textures = [];
      const images = [];
      let loadedCount = 0;
      let currentIndex = 0;
      let targetIndex = null;
      let isAnimating = false;
      let animationStartTime = 0;
      
      // Shaders
      const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        
        void main() {
          v_texCoord = a_texCoord;
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;
      
      const fragmentShaderSource = `
        precision highp float;
        
        uniform sampler2D u_from;
        uniform sampler2D u_to;
        uniform float progress;
        
        uniform float size;
        uniform float zoom;
        uniform float colorSeparation;
        
        uniform float seed;
        
        varying vec2 v_texCoord;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(a, b, u.x) +
                  (c - a) * u.y * (1.0 - u.x) +
                  (d - b) * u.x * u.y;
        }
        
        float smoothTransition(float t) {
          t = clamp(t, 0.001, 0.999);
          return t * t * (3.0 - 2.0 * t);
        }
        
        void main() {
          vec2 p = v_texCoord;
          
          float smoothProgress = smoothTransition(progress);
          float inv = 1.0 - smoothProgress;
          
          float noiseValue = noise(p * zoom + seed) * (1.0 - 0.3 * length(p - vec2(0.5)));
          
          vec2 disp = size * vec2(
            cos(zoom * p.x) * noiseValue,
            sin(zoom * p.y) * noiseValue * 0.2
          );
          
          vec2 distFrom = p + smoothProgress * disp;
          vec2 distTo   = p + inv * disp;
          
          vec4 texFrom = texture2D(u_from, distFrom);
          vec4 texTo   = texture2D(u_to,   distTo);
          
          vec4 finalColor;
          
          // Color separation
          if (colorSeparation > 0.0) {
            vec4 r1 = texture2D(u_from, distFrom + vec2(colorSeparation * 0.005, 0.0) * smoothProgress);
            vec4 b1 = texture2D(u_from, distFrom - vec2(colorSeparation * 0.005, 0.0) * smoothProgress);
            
            vec4 r2 = texture2D(u_to, distTo + vec2(colorSeparation * 0.005, 0.0) * inv);
            vec4 b2 = texture2D(u_to, distTo - vec2(colorSeparation * 0.005, 0.0) * inv);
            
            texFrom.r = r1.r;
            texFrom.b = b1.b;
            
            texTo.r = r2.r;
            texTo.b = b2.b;
          }
          
          finalColor = mix(texFrom, texTo, smoothProgress);
          
          // Vignette
          float vignette = length(p - 0.5) * 0.3;
          finalColor.rgb *= (1.0 - vignette * smoothProgress * 0.2);
          
          gl_FragColor = finalColor;
        }
      `;
      
      // Create shader
      function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          return shader;
        }
        
        gl.deleteShader(shader);
        return null;
      }
      
      // Generate random seed for transitions
      function generateRandomSeed() {
        return Math.random() * 10;
      }
      
      // Load texture
      function loadTexture(gl, url, index, callback) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        
        const image = new Image();
        image.crossOrigin = "anonymous";
        
        image.onload = function() {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          
          // Check if image dimensions are powers of 2
          if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          }
          
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          
          // Enable anisotropic filtering if available
          const aniso = gl.getExtension("EXT_texture_filter_anisotropic");
          if (aniso) {
            const maxAniso = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
          }
          
          images[index] = image;
          callback(texture);
        };
        
        image.onerror = function() {
          callback(texture);
        };
        
        image.src = url;
      }
      
      // Check if a number is a power of 2
      function isPowerOf2(value) {
        return (value & (value - 1)) === 0;
      }
      
      // Resize canvas to match parent container
      function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        
        const width = Math.floor(container.clientWidth * pixelRatio);
        const height = Math.floor(container.clientHeight * pixelRatio);
        
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, canvas.width, canvas.height);
          
          if (loadedCount === imageURLs.length && !isAnimating) {
            updateTextureCoords(currentIndex);
            render();
          }
        }
      }
      
      // Update texture coordinates based on image aspect ratio
      function updateTextureCoords(index) {
        if (!images[index]) return;
        
        const image = images[index];
        const imageAspect = image.width / image.height;
        const canvasAspect = canvas.width / canvas.height;
        
        let scaleX = 1;
        let scaleY = 1;
        let offsetX, offsetY;
        
        if (imageAspect > canvasAspect) {
          // Image is wider than canvas
          scaleY = canvasAspect / imageAspect;
          offsetY = (1 - scaleY) / 2;
          offsetX = 0;
        } else {
          // Image is taller than canvas
          scaleX = imageAspect / canvasAspect;
          offsetX = (1 - scaleX) / 2;
          offsetY = 0;
        }
        
        const right = offsetX + scaleX;
        const bottom = offsetY + scaleY;
        
        const positions = [
          -1, -1,
           1, -1,
          -1,  1,
           1,  1
        ];
        
        const texCoords = [
          offsetX, bottom,
          right, bottom,
          offsetX, offsetY,
          right, offsetY
        ];
        
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      }
      
      // Call resize on load and window resize
      resizeCanvas();
      
      // Set up WebGL
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      window.addEventListener("resize", resizeCanvas);
      
      // Create shaders
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      
      if (!vertexShader || !fragmentShader) {
        return;
      }
      
      // Create program
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return;
      }
      
      gl.useProgram(program);
      
      // Set up buffers
      const positionBuffer = gl.createBuffer();
      const texCoordBuffer = gl.createBuffer();
      
      const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
      const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
      
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.enableVertexAttribArray(texCoordAttributeLocation);
      
      // Get uniform locations
      const fromTextureLocation = gl.getUniformLocation(program, "u_from");
      const toTextureLocation = gl.getUniformLocation(program, "u_to");
      const progressLocation = gl.getUniformLocation(program, "progress");
      const sizeLocation = gl.getUniformLocation(program, "size");
      const zoomLocation = gl.getUniformLocation(program, "zoom");
      const colorSeparationLocation = gl.getUniformLocation(program, "colorSeparation");
      const seedLocation = gl.getUniformLocation(program, "seed");
      
      // Set default uniform values
      gl.uniform1f(sizeLocation, 0.12);
      gl.uniform1f(zoomLocation, 8);
      gl.uniform1f(colorSeparationLocation, 0.4);
      gl.uniform1f(seedLocation, generateRandomSeed());
      
      // Load all textures
      for (let i = 0; i < imageURLs.length; i++) {
        loadTexture(gl, imageURLs[i], i, function(texture) {
          textures[i] = texture;
          loadedCount++;
          
          if (loadedCount === imageURLs.length) {
            updateTextureCoords(currentIndex);
            initRender(currentIndex);
          }
        });
      }
      
      // Initialize rendering
      function initRender(index) {
        gl.uniform1f(progressLocation, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[index]);
        gl.uniform1i(fromTextureLocation, 0);
        
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[index]);
        gl.uniform1i(toTextureLocation, 1);
        
        render();
      }
      
      // Render function
      function render() {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      
      // Animate transition between images
      function animateTransition() {
        function animate(timestamp) {
          const elapsed = timestamp - animationStartTime;
          let t = elapsed / 1200; // 1.2 seconds for transition
          
          if (t > 1) t = 1;
          
          // Ease function for smooth transition
          const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          
          gl.uniform1f(progressLocation, easedT);
          render();
          
          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            updateTextureCoords(currentIndex = targetIndex);
            gl.uniform1f(progressLocation, 0);
            
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
            gl.uniform1i(fromTextureLocation, 0);
            
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
            gl.uniform1i(toTextureLocation, 1);
            
            isAnimating = false;
            render();
          }
        }
        
        isAnimating = true;
        animationStartTime = performance.now();
        updateTextureCoords(currentIndex);
        requestAnimationFrame(animate);
      }
      
      // Set up navigation buttons
      const nextButton = document.getElementById("next");
      const prevButton = document.getElementById("prev");
      
      // Next button click handler
      if (nextButton) {
        nextButton.addEventListener("click", function() {
          if (!isAnimating && loadedCount >= imageURLs.length) {
            targetIndex = (currentIndex + 1) % textures.length;
            gl.uniform1f(seedLocation, generateRandomSeed());
            
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
            gl.uniform1i(fromTextureLocation, 0);
            
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, textures[targetIndex]);
            gl.uniform1i(toTextureLocation, 1);
            
            animateTransition();
          }
        });
      }
      
      // Previous button click handler
      if (prevButton) {
        prevButton.addEventListener("click", function() {
          if (!isAnimating && loadedCount >= imageURLs.length) {
            targetIndex = (currentIndex - 1 + textures.length) % textures.length;
            gl.uniform1f(seedLocation, generateRandomSeed());
            
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
            gl.uniform1i(fromTextureLocation, 0);
            
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, textures[targetIndex]);
            gl.uniform1i(toTextureLocation, 1);
            
            animateTransition();
          }
        });
      }
      
      // Set up product thumbnail navigation
      [
        {id: "levacel", index: 0},
        {id: "venestasi", index: 1},
        {id: "ansirem", index: 2},
        {id: "vitamina", index: 3},
        {id: "magnesio", index: 4},
        {id: "snell", index: 5},
        {id: "rodiola", index: 6},
        {id: "tricopyl", index: 7}
      ].forEach(product => {
        const element = document.getElementById(product.id);
        
        if (element) {
          element.addEventListener("click", function() {
            if (!isAnimating && loadedCount >= imageURLs.length) {
              targetIndex = product.index;
              gl.uniform1f(seedLocation, generateRandomSeed());
              
              gl.activeTexture(gl.TEXTURE0);
              gl.bindTexture(gl.TEXTURE_2D, textures[currentIndex]);
              gl.uniform1i(fromTextureLocation, 0);
              
              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, textures[targetIndex]);
              gl.uniform1i(toTextureLocation, 1);
              
              animateTransition();
            }
          });
        }
      });
    });
  }
};

// Footer Effects Utilities
const EffectsUtils = {
  // Pills Footer Effect
  initPillsFooterEffect: function() {
    const root = document.querySelector(".mwg_effect020");
    if (!root) return;
    
    const images = [];
    root.querySelectorAll(".medias img").forEach(img => {
      images.push(img.getAttribute("src"));
    });
    
    let incr = 0;
    let oldIncrX = 0;
    let oldIncrY = 0;
    let resetDist = window.innerWidth / 12;
    let indexImg = 0;
    
    function createMedia(x, y, deltaX, deltaY) {
      let img = document.createElement("img");
      img.setAttribute("src", images[indexImg]);
      root.appendChild(img);
      
      let tl = gsap.timeline({
        onComplete() {
          root.removeChild(img);
          tl && tl.kill();
        }
      });
      
      // Initial animation
      tl.fromTo(img, 
        {
          xPercent: -50 + (Math.random() - 0.5) * 40,
          yPercent: -50 + (Math.random() - 0.5) * 6,
          scaleX: 1.15,
          scaleY: 1.15
        },
        {
          scaleX: 1,
          scaleY: 1,
          ease: "elastic.out(1.5, 0.5)",
          duration: 0.7
        }
      );
      
      // Movement animation
      tl.fromTo(img,
        {
          x: x,
          y: y,
          rotation: (Math.random() - 0.5) * 10
        },
        {
          x: "+=" + deltaX * 2.5,
          y: "+=" + deltaY * 2.5,
          rotation: (Math.random() - 0.5) * 10,
          ease: "power2.out",
          duration: 1.8
        },
        "<"
      );
      
      // Fade out animation
      tl.to(img, {
        duration: 0.5,
        scale: 0.7,
        delay: 0.15,
        ease: "back.in(1.2)"
      });
      
      // Update index for next image
      indexImg = (indexImg + 1) % images.length;
    }
    
    window.addEventListener("DOMContentLoaded", () => {
      // Initial reference point
      root.addEventListener("mousemove", e => {
        oldIncrX = e.clientX;
        oldIncrY = e.clientY;
      }, {once: true});
      
      // Track mouse movement and create media elements
      root.addEventListener("mousemove", e => {
        let x = e.clientX;
        let y = e.clientY;
        
        // Calculate movement and accumulate distance
        incr += (Math.abs(x - oldIncrX) + Math.abs(y - oldIncrY)) * 0.7;
        
        // Create new media element when distance threshold is exceeded
        if (incr > resetDist) {
          incr = 0;
          createMedia(x, y - root.getBoundingClientRect().top, x - oldIncrX, y - oldIncrY);
        }
        
        // Update reference position
        oldIncrX = x;
        oldIncrY = y;
      });
    });
  }
};

// Button Utilities
const ButtonUtils = {
  // Icon Button Animation
  initButtonIcon: function() {
    const buttons = document.querySelectorAll("[anm-icon-btn=wrap]");
    
    if (!buttons || buttons.length === 0) return;
    
    buttons.forEach(button => {
      if (AnimationUtils.isAnimationDisabled(button)) return;
      
      const icon = button.querySelector("[anm-icon-btn=icon]");
      const bg = button.querySelector("[anm-icon-btn=bg]");
      const text = button.querySelector(".anm_icon_btn_text");
      const color = button.getAttribute("anm-color") || window.getComputedStyle(button).color;
      const duration = button.getAttribute("anm-duration") || 0.5;
      const ease = button.getAttribute("anm-ease") || "power3.inOut";
      const delay = button.getAttribute("anm-delay") || 0;
      
      const iconClone = icon.cloneNode(true);
      iconClone.style.position = "absolute";
      icon.after(iconClone);
      iconClone.style.left = "-100%";
      iconClone.style.top = "100%";
      
      const timeline = gsap.timeline({
        defaults: {ease: ease, duration: duration, delay: delay},
        paused: true
      });
      
      timeline
        .to(button, {color: color})
        .to(text, {color: "#282D32"}, "<")
        .to(icon, {xPercent: 100, yPercent: -100}, "<")
        .to(iconClone, {xPercent: 100, yPercent: -100}, "<")
        .to(bg, {scaleX: 15, scaleY: 10}, "<");
      
      button.addEventListener("mouseenter", () => {
        timeline.play();
      });
      
      button.addEventListener("mouseleave", () => {
        timeline.reverse();
      });
    });
  },
  
  // Push Button Animation
  initPushButton: function() {
    const buttons = document.querySelectorAll("[anm-push-btn=wrap]");
    
    if (!buttons || buttons.length === 0) return;
    
    buttons.forEach(button => {
      if (AnimationUtils.isAnimationDisabled(button)) return;
      
      const text = button.querySelector("[anm-push-btn=text]");
      const direction = button.getAttribute("anm-direction");
      const textClone = text.cloneNode(true);
      
      textClone.style.position = "absolute";
      text.after(textClone);
      
      const timeline = gsap.timeline({
        defaults: {ease: "power3.inOut", duration: 0.5},
        paused: true
      });
      
      if (direction === "up") {
        textClone.style.bottom = "-105%";
        timeline
          .to(text, {yPercent: -105})
          .to(textClone, {yPercent: -105}, "<");
      } else if (direction === "down") {
        textClone.style.top = "-105%";
        timeline
          .to(text, {yPercent: 105})
          .to(textClone, {yPercent: 105}, "<");
      } else if (direction === "left") {
        textClone.style.top = "0";
        textClone.style.right = "105%";
        timeline
          .to(text, {xPercent: 105})
          .to(textClone, {xPercent: 105}, "<");
      } else if (direction === "right") {
        textClone.style.top = "0";
        textClone.style.left = "105%";
        timeline
          .to(text, {xPercent: -105})
          .to(textClone, {xPercent: -105}, "<");
      }
      
      button.addEventListener("mouseenter", () => {
        timeline.play();
      });
      
      button.addEventListener("mouseleave", () => {
        timeline.reverse();
      });
    });
  },
  
  // Text Button with Underline
  initTextButton: function() {
    const buttons = document.querySelectorAll("[anm-text-btn=wrap]");
    
    if (!buttons || buttons.length === 0) return;
    
    buttons.forEach(button => {
      if (AnimationUtils.isAnimationDisabled(button)) return;
      
      const underline = button.querySelector("[anm-text-btn=underline]");
      const scaleValue = button.getAttribute("anm-line-scale") || 0;
      const ease = button.getAttribute("anm-ease") || "power2.inOut";
      const duration = button.getAttribute("anm-duration") || 0.3;
      const delay = button.getAttribute("anm-delay") || 0;
      const customAttrs = button.getAttribute("anm-custom") || "";
      
      // Parse custom attributes
      const customOptions = {};
      if (customAttrs) {
        customAttrs.split(",").forEach(attr => {
          const [key, value] = attr.split(":").map(str => str.trim());
          if (key && value) {
            customOptions[key] = value;
          }
        });
      }
      
      // Compute target properties
      const targetProps = {};
      for (let key in customOptions) {
        if (key === "opacity") {
          targetProps[key] = "1";
        } else if (key === "scale") {
          targetProps[key] = 1;
        } else {
          targetProps[key] = customOptions[key].replace(/(\d+(\.\d+)?)/g, match => {
            const valueWithUnit = match.match(/(\d+(\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|deg|rad|grad|turn|cvw|cvh)?/);
            return valueWithUnit ? `0${valueWithUnit[3] || ""}` : "0";
          });
          
          if (!/\d/.test(customOptions[key])) {
            const computedStyle = window.getComputedStyle(underline);
            targetProps[key] = computedStyle[key] || customOptions[key];
          }
        }
      }
      
      const timeline = gsap.timeline({
        defaults: {duration: duration, ease: ease, delay: delay}
      });
      
      timeline.set(underline, {scaleX: scaleValue, transformOrigin: "left"});
      
      button.addEventListener("mouseenter", () => {
        timeline.clear();
        timeline.fromTo(
          underline,
          {scaleX: scaleValue, ...customOptions},
          {scaleX: 1, transformOrigin: "left", ...targetProps}
        );
      });
      
      button.addEventListener("mouseleave", () => {
        timeline.clear();
        timeline.fromTo(
          underline,
          {scaleX: 1, ...customOptions},
          {scaleX: scaleValue, transformOrigin: "right", ...targetProps}
        );
      });
    });
  }
};

// Carousel Utilities
const CarouselUtils = {
  // Image Carousel
  initImageCarousel: function() {
    gsap.registerPlugin(Observer, ScrollTrigger);
    
    let total = 0;
    let xTo;
    let itemValues = [];
    let isScrolling = true;
    
    window.addEventListener("DOMContentLoaded", () => {
      let container = document.querySelector(".mwg_effect008 .container");
      if (!container) return;
      
      let cards = document.querySelectorAll(".mwg_effect008 .card");
      let itemCount = cards.length / 2;
      let containerWidth = container.clientWidth / 2;
      
      let wrapX = gsap.utils.wrap(-containerWidth, 0);
      xTo = gsap.quickTo(container, "x", {duration: 0.5, ease: "power3", modifiers: {x: gsap.utils.unitize(wrapX)}});
      
      for (let i = 0; i < itemCount; i++) {
        itemValues.push((Math.random() - 0.5) * 20);
      }
      
      let animation = gsap.timeline({paused: true});
      
      function slideFunction(self, deltaY) {
        if (isScrolling) {
          xTo(total -= deltaY / 10);
        }
      }
      
      animation.to(cards, {
        rotate: index => itemValues[index % itemCount],
        xPercent: index => itemValues[index % itemCount],
        yPercent: index => itemValues[index % itemCount],
        scale: 0.95,
        duration: 0.5,
        ease: "back.inOut(3)"
      });
      
      Observer.create({
        target: container,
        type: "pointer,touch",
        onPress: () => animation.play(),
        onDrag(event) {
          xTo(total += event.deltaX);
        },
        onRelease() {
          animation.reverse();
        },
        onStop() {
          animation.reverse();
        }
      });
      
      gsap.ticker.add(slideFunction);
      
      ScrollTrigger.create({
        trigger: ".mwg_effect008",
        start: "top bottom",
        end: "bottom top",
        onEnter() {
          isScrolling = true;
        },
        onEnterBack() {
          isScrolling = true;
        },
        onLeave() {
          isScrolling = false;
        },
        onLeaveBack() {
          isScrolling = false;
        }
      });
      
      let resizeCarousel = () => {
        let carouselElement = document.querySelector(".mwg_effect008");
        if (carouselElement) {
          carouselElement.style.width = window.innerWidth + "px";
        }
      };
      
      resizeCarousel();
      window.addEventListener("resize", resizeCarousel);
    });
  },
  
  // Carousel Content Trigger
  initCarouselContentTrigger: function() {
    window.addEventListener("DOMContentLoaded", () => {
      let currentIndex = 0;
      let isAnimating = false;
      
      // Product data
      const productURLs = [
        "https://www.purapharma.eu/products/levacel-plus",
        "https://www.purapharma.eu/products/venestasi",
        "https://www.purapharma.eu/products/ansirem",
        "https://www.purapharma.eu/products/vitamina-d3",
        "https://www.purapharma.eu/products/b6-magnesio",
        "https://www.purapharma.eu/products/snell-fame",
        "https://www.purapharma.eu/products/rodiola-rosea",
        "https://www.purapharma.eu/products/tricopyl"
      ];
      
      const productTitles = [
        "Levacel Plus", 
        "Venestasi", 
        "Ansirem", 
        "Vitamina D3", 
        "B6-Magnesio", 
        "Snell Fame", 
        "Rodiola Rosea", 
        "Tricopyl"
      ];
      
      const productImages = [
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c44960bc7c4a621d87bcbf_Levacel%20Plus%20Benefits.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c4496ad9ff72e4db88c53a_Venestasi%20Info.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c449c870acacede47f6f04_Ansirem.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c449e66cdcf41ed2d20db9_Vitamina%20D3%20Benefits.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c449f0f5982184595cd57f_B6Magnesio%20Benefits.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c44a00eb2c880d284b7ca1_660501.jpg",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c44a08453ee89423431939_Rodiola%20Rosea%20Pura%20Pharma%20Dettagli.webp",
        "https://cdn.prod.website-files.com/6749e677c74b3f0e424aab25/67c44a11c591228c8197ee2a_Tricopyl%20Benefits.webp"
      ];
      
      const productDetails = [
        {composizione: "60 capsule vegetali - 500mg"},
        {composizione: "30 compresse - 1g"},
        {composizione: "30 capsule - 500mg"},
        {composizione: "60 perle vegetali - 250mg"},
        {composizione: "60 capsule vegetali - 550mg"},
        {composizione: "60 capsule vegetali - 550mg"},
        {composizione: "60 capsule vegetali - 500mg"},
        {composizione: "60 capsule vegetali - 500mg"}
      ];
      
      const circleClasses = [
        "circle_01", "circle_02", "circle_03", "circle_04", 
        "circle_05", "circle_06", "circle_07", "circle_08"
      ];
      
      const circleIds = [
        "levacel", "venestasi", "ansirem", "vitamina", 
        "magnesio", "snell", "rodiola", "tricopyl"
      ];
      
      const totalProducts = productURLs.length;
      
      // Animation functions
      const animateTransition = (fromIndex, toIndex, direction) => {
        if (isAnimating) return;
        
        isAnimating = true;
        
        const fromLabel = fromIndex + 1 < 10 ? `0${fromIndex + 1}` : fromIndex + 1;
        const toLabel = toIndex + 1 < 10 ? `0${toIndex + 1}` : toIndex + 1;
        
        let tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
          }
        });
        
        tl.to(`.product_title.is--${fromLabel}`, {
          y: direction > 0 ? -150 : 150, 
          duration: 0.6, 
          ease: "power2.inOut"
        }, 0)
        .fromTo(`.product_title.is--${toLabel}`, 
          {y: direction > 0 ? 150 : -150}, 
          {y: 0, duration: 0.6, ease: "power2.inOut"}, 
          0
        )
        .to(`.product_sub.is--${fromLabel}`, {
          opacity: 0, 
          filter: "blur(10px)", 
          duration: 0.6, 
          ease: "power2.inOut"
        }, 0.1)
        .fromTo(`.product_sub.is--${toLabel}`, 
          {opacity: 0, filter: "blur(10px)"}, 
          {opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.inOut"}, 
          0.2
        )
        .to(`.image_box.is--${fromLabel}`, {
          scale: 0, 
          opacity: 0, 
          duration: 0.6, 
          ease: "power2.inOut"
        }, 0)
        .fromTo(`.image_box.is--${toLabel}`, 
          {scale: 0, opacity: 0}, 
          {scale: 1, opacity: 1, duration: 0.6, ease: "power2.inOut"}, 
          0.1
        )
        .to(`.product_paragraph.is--${fromLabel}`, {
          opacity: 0, 
          y: direction > 0 ? -30 : 30, 
          filter: "blur(10px)", 
          duration: 0.6, 
          ease: "power2.inOut"
        }, 0.2)
        .fromTo(`.product_paragraph.is--${toLabel}`, 
          {opacity: 0, y: direction > 0 ? 30 : -30, filter: "blur(10px)"}, 
          {opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.inOut"}, 
          0.3
        );
        
        // Update dynamic button
        const dynamicButton = document.getElementById("dinamic-button");
        if (dynamicButton) {
          dynamicButton.href = productURLs[toIndex];
          dynamicButton.setAttribute("target", "_blank");
        }
        
        updateCirclesState(toIndex);
      };
      
      const updateCirclesState = (activeIndex) => {
        circleClasses.forEach((cls, index) => {
          const el = document.getElementById(circleIds[index]) || document.querySelector(`.${cls}`);
          
          if (el) {
            const img = el.querySelector(".carousel_image");
            
            if (index === activeIndex) {
              gsap.to(el, {scale: 1, opacity: 1, duration: 0.4, ease: "power1.inOut"});
              if (img) gsap.to(img, {scale: 1, duration: 0.4, ease: "back.out(1.7)"});
              el.onmouseenter = null;
              el.onmouseleave = null;
            } else {
              gsap.to(el, {scale: 0.9, opacity: 1, duration: 0.4, ease: "power1.inOut"});
              if (img) gsap.to(img, {scale: 0.8, duration: 0.4, ease: "power1.inOut"});
              el.onmouseenter = null;
              el.onmouseleave = null;
            }
          }
        });
      };
      
      const navigateToProduct = (targetIndex) => {
        if (targetIndex !== currentIndex) {
          const dir = targetIndex > currentIndex ? 1 : -1;
          animateTransition(currentIndex, targetIndex, dir);
          currentIndex = targetIndex;
        }
      };
      
      // Set up event listeners
      const nextBtn = document.getElementById("next");
      if (nextBtn) {
        nextBtn.addEventListener("click", evt => {
          evt.preventDefault();
          if (isAnimating) return;
          
          const nextIndex = (currentIndex + 1) % totalProducts;
          animateTransition(currentIndex, nextIndex, 1);
          currentIndex = nextIndex;
        });
      }
      
      const prevBtn = document.getElementById("prev");
      if (prevBtn) {
        prevBtn.addEventListener("click", evt => {
          evt.preventDefault();
          if (isAnimating) return;
          
          const prevIndex = (currentIndex - 1 + totalProducts) % totalProducts;
          animateTransition(currentIndex, prevIndex, -1);
          currentIndex = prevIndex;
        });
      }
      
      // Initialize UI
      setTimeout(() => {
        // Hide all products except the first one
        for (let i = 2; i <= totalProducts; i++) {
          const lbl = i < 10 ? `0${i}` : i;
          gsap.set(`.product_title.is--${lbl}`, {y: 150});
          gsap.set(`.product_sub.is--${lbl}`, {opacity: 0, filter: "blur(10px)"});
          gsap.set(`.image_box.is--${lbl}`, {scale: 0, opacity: 0});
          gsap.set(`.product_paragraph.is--${lbl}`, {opacity: 0, y: 30, filter: "blur(10px)"});
        }
        
        // Set up circle thumbnails
        circleClasses.forEach((cls, index) => {
          const el = document.getElementById(circleIds[index]) || document.querySelector(`.${cls}`);
          
          if (el) {
            const img = el.querySelector(".carousel_image");
            
            if (index === 0) {
              gsap.set(el, {scale: 1, opacity: 1});
              if (img) gsap.set(img, {scale: 1});
            } else {
              gsap.set(el, {scale: 0.9, opacity: 1});
              if (img) gsap.set(img, {scale: 0.8});
              el.onmouseenter = null;
              el.onmouseleave = null;
            }
            
            el.addEventListener("click", evt => {
              evt.preventDefault();
              if (isAnimating) return;
              navigateToProduct(index);
            });
          }
        });
        
        // Set up dynamic button
        const dynBtn = document.getElementById("dinamic-button");
        if (dynBtn) {
          dynBtn.href = productURLs[0];
          dynBtn.setAttribute("target", "_blank");
        }
      }, 500);
    });
  }
};
