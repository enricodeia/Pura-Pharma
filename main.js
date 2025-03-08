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
  // GLTransitionUtils.initProductCarousel(); - Removed
  // CarouselUtils.initCarouselContentTrigger(); - Removed
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
const GLTransitionUtils = {};

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
  }
};
