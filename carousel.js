/ Script GSAP per le animazioni degli elementi
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Le URL dei pulsanti dinamici
    const buttonUrls = [
      "https://www.purapharma.eu/products/levacel-plus",
      "https://www.purapharma.eu/products/venestasi",
      "https://www.purapharma.eu/products/ansirem",
      "https://www.purapharma.eu/products/vitamina-d3",
      "https://www.purapharma.eu/products/b6-magnesio",
      "https://www.purapharma.eu/products/snell-fame",
      "https://www.purapharma.eu/products/rodiola-rosea",
      "https://www.purapharma.eu/products/tricopyl"
    ];
    
    // Numero totale di slide
    const totalSlides = 8;
    
    // Durata delle animazioni GSAP
    const duration = 0.6;
    
    // Imposta il link iniziale del pulsante
    const dynamicButton = document.getElementById('dinamic-button');
    if (dynamicButton) {
      dynamicButton.href = buttonUrls[0];
    }
    
    // Inizializza lo stato degli elementi UI
    function initializeUIState() {
      console.log("Inizializzazione UI state");
      
      // 1. Titoli: nascondi tutti tranne il primo
      for (let i = 2; i <= totalSlides; i++) {
        const iStr = i < 10 ? `0${i}` : i;
        gsap.set(`.product_title.is--${iStr}`, { y: 100 });
      }
      
      // 2. Sottotitoli: nascondi tutti tranne il primo
      for (let i = 2; i <= totalSlides; i++) {
        const iStr = i < 10 ? `0${i}` : i;
        gsap.set(`.product_sub.is--${iStr}`, { opacity: 0, filter: 'blur(10px)' });
      }
      
      // 3. Box immagini: nascondi tutti tranne il primo
      for (let i = 2; i <= totalSlides; i++) {
        const iStr = i < 10 ? `0${i}` : i;
        gsap.set(`.image_box.is--${iStr}`, { scale: 0, opacity: 0 });
      }
      
      // 4. Paragrafi: nascondi tutti tranne il primo
      for (let i = 2; i <= totalSlides; i++) {
        const iStr = i < 10 ? `0${i}` : i;
        gsap.set(`.product_paragraph.is--${iStr}`, { opacity: 0, y: 30, filter: 'blur(10px)' });
      }
    }
    
    // Funzione per animare la transizione tra slide
    function animateToSlide(fromIndex, toIndex, direction) {
      console.log(`Animazione da ${fromIndex+1} a ${toIndex+1}, direzione: ${direction}`);
      
      // Formatta gli indici per le classi (01, 02, etc)
      const fromStr = (fromIndex + 1) < 10 ? `0${fromIndex + 1}` : (fromIndex + 1);
      const toStr = (toIndex + 1) < 10 ? `0${toIndex + 1}` : (toIndex + 1);
      
      // Timeline GSAP per sincronizzare le animazioni
      const tl = gsap.timeline();
      
      // 1. Anima i titoli
      tl.to(`.product_title.is--${fromStr}`, {
        y: direction > 0 ? -100 : 100,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
      
      tl.fromTo(`.product_title.is--${toStr}`, {
        y: direction > 0 ? 100 : -100
      }, {
        y: 0,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
      
      // 2. Anima i sottotitoli
      tl.to(`.product_sub.is--${fromStr}`, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.1);
      
      tl.fromTo(`.product_sub.is--${toStr}`, {
        opacity: 0,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.2);
      
      // 3. Anima i box immagine
      tl.to(`.image_box.is--${fromStr}`, {
        scale: 0,
        opacity: 0,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
      
      tl.fromTo(`.image_box.is--${toStr}`, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: duration,
        ease: "power2.inOut"
      }, 0.1);
      
      // 4. Anima i paragrafi
      tl.to(`.product_paragraph.is--${fromStr}`, {
        opacity: 0,
        y: direction > 0 ? -30 : 30,
        filter: 'blur(10px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.2);
      
      tl.fromTo(`.product_paragraph.is--${toStr}`, {
        opacity: 0,
        y: direction > 0 ? 30 : -30,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.3);
      
      // 5. Aggiorna il link del pulsante dinamico
      if (dynamicButton) {
        dynamicButton.href = buttonUrls[toIndex];
      }
      
      return tl;
    }
    
    // Inizializza immediatamente
    initializeUIState();
    
    // Connetti con gli eventi WebGL
    window.addEventListener('webglSliderReady', function(e) {
      console.log('WebGL slider pronto, indice corrente:', e.detail.currentIndex);
      
      // Assicurati che tutto sia impostato correttamente all'inizio
      initializeUIState();
    });
    
    window.addEventListener('webglSlideChangeStart', function(e) {
      console.log('Iniziando transizione slide:', e.detail);
      
      // Calcola la direzione (avanti o indietro)
      const fromIndex = e.detail.fromIndex;
      const toIndex = e.detail.toIndex;
      const direction = toIndex > fromIndex ? 1 : -1;
      
      // Gestisci il loop (da ultima a prima o viceversa)
      const actualDirection = (Math.abs(fromIndex - toIndex) > 1) ? -direction : direction;
      
      // Avvia le animazioni GSAP
      animateToSlide(fromIndex, toIndex, actualDirection);
    });
    
    // Aggiungi event listeners anche ai pulsanti per quando WebGL non è pronto
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    
    if (nextButton) {
      nextButton.addEventListener('click', function() {
        // Se webglSlider non è attivo, fai l'animazione solo degli elementi UI
        if (!window.webglSlider) {
          const currentIndex = parseInt(localStorage.getItem('currentSlideIndex') || '0');
          const nextIndex = (currentIndex + 1) % totalSlides;
          
          animateToSlide(currentIndex, nextIndex, 1);
          localStorage.setItem('currentSlideIndex', nextIndex.toString());
          
          // Aggiorna il pulsante dinamico
          if (dynamicButton) {
            dynamicButton.href = buttonUrls[nextIndex];
          }
        }
      });
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', function() {
        // Se webglSlider non è attivo, fai l'animazione solo degli elementi UI
        if (!window.webglSlider) {
          const currentIndex = parseInt(localStorage.getItem('currentSlideIndex') || '0');
          const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
          
          animateToSlide(currentIndex, prevIndex, -1);
          localStorage.setItem('currentSlideIndex', prevIndex.toString());
          
          // Aggiorna il pulsante dinamico
          if (dynamicButton) {
            dynamicButton.href = buttonUrls[prevIndex];
          }
        }
      });
    }
    
    // Debug
    function checkElements() {
      for (let i = 1; i <= totalSlides; i++) {
        const iStr = i < 10 ? `0${i}` : i;
        
        if (!document.querySelector(`.product_title.is--${iStr}`)) {
          console.warn(`Elemento .product_title.is--${iStr} non trovato`);
        }
        
        if (!document.querySelector(`.product_sub.is--${iStr}`)) {
          console.warn(`Elemento .product_sub.is--${iStr} non trovato`);
        }
        
        if (!document.querySelector(`.image_box.is--${iStr}`)) {
          console.warn(`Elemento .image_box.is--${iStr} non trovato`);
        }
        
        if (!document.querySelector(`.product_paragraph.is--${iStr}`)) {
          console.warn(`Elemento .product_paragraph.is--${iStr} non trovato`);
        }
      }
      
      if (!dynamicButton) {
        console.warn('Elemento #dinamic-button non trovato');
      }
    }
    
    // Esegui il controllo degli elementi (utile per debug)
    setTimeout(checkElements, 2000);
  });
})();
