document.addEventListener('DOMContentLoaded', function() {
  console.log("GSAP script avviato");
  
  // Stato attuale
  let currentIndex = 0;
  const totalSlides = 8;
  let isAnimating = false;
  
  // URL per il pulsante dinamico
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
  
  // Durata animazione
  const duration = 0.6;
  
  // Verifica elementi direttamente
  function logAllElements() {
    console.log("----- VERIFICA ELEMENTI SUL DOM -----");
    
    // Ottiene tutti gli elementi con pattern di classi specifici
    const allTitles = Array.from(document.querySelectorAll('[class*="product_title"]'));
    console.log("Titoli trovati:", allTitles.length, allTitles.map(el => el.className));
    
    const allSubs = Array.from(document.querySelectorAll('[class*="product_sub"]'));
    console.log("Sottotitoli trovati:", allSubs.length, allSubs.map(el => el.className));
    
    const allImageBoxes = Array.from(document.querySelectorAll('[class*="image_box"]'));
    console.log("Image boxes trovati:", allImageBoxes.length, allImageBoxes.map(el => el.className));
    
    const allParagraphs = Array.from(document.querySelectorAll('[class*="product_paragraph"]'));
    console.log("Paragrafi trovati:", allParagraphs.length, allParagraphs.map(el => el.className));
    
    const dynamicButton = document.getElementById('dinamic-button');
    console.log("Pulsante dinamico:", dynamicButton ? "trovato" : "non trovato");
    
    const nextButton = document.getElementById('next');
    console.log("Pulsante next:", nextButton ? "trovato" : "non trovato");
    
    const prevButton = document.getElementById('prev');
    console.log("Pulsante prev:", prevButton ? "trovato" : "non trovato");
  }
  
  // Inizializzazione UI (usa le classi complete)
  function initializeUI() {
    console.log("Inizializzazione stati UI");
    
    // 1. Titoli: imposta tutti i titoli eccetto il primo
    for (let i = 2; i <= totalSlides; i++) {
      const iStr = i < 10 ? `0${i}` : i;
      const selector = `.product_title.is--${iStr}, .product_title.is-${iStr}, [class*="product_title"][class*="is--${iStr}"]`;
      const elements = document.querySelectorAll(selector);
      
      if (elements.length > 0) {
        console.log(`Inizializzando titolo ${iStr}:`, elements.length, "elementi trovati");
        gsap.set(elements, { y: 100 });
      } else {
        console.warn(`Titolo ${iStr} non trovato con selettore:`, selector);
      }
    }
    
    // 2. Sottotitoli: nascondi tutti tranne il primo
    for (let i = 2; i <= totalSlides; i++) {
      const iStr = i < 10 ? `0${i}` : i;
      const selector = `.product_sub.is--${iStr}, .product_sub.is-${iStr}, [class*="product_sub"][class*="is--${iStr}"]`;
      const elements = document.querySelectorAll(selector);
      
      if (elements.length > 0) {
        console.log(`Inizializzando sottotitolo ${iStr}:`, elements.length, "elementi trovati");
        gsap.set(elements, { opacity: 0, filter: 'blur(10px)' });
      } else {
        console.warn(`Sottotitolo ${iStr} non trovato con selettore:`, selector);
      }
    }
    
    // 3. Box immagini: nascondi tutti tranne il primo
    for (let i = 2; i <= totalSlides; i++) {
      const iStr = i < 10 ? `0${i}` : i;
      const selector = `.image_box.is--${iStr}, .image_box.is-${iStr}, [class*="image_box"][class*="is--${iStr}"]`;
      const elements = document.querySelectorAll(selector);
      
      if (elements.length > 0) {
        console.log(`Inizializzando image box ${iStr}:`, elements.length, "elementi trovati");
        gsap.set(elements, { scale: 0, opacity: 0 });
      } else {
        console.warn(`Image box ${iStr} non trovato con selettore:`, selector);
      }
    }
    
    // 4. Paragrafi: nascondi tutti tranne il primo
    for (let i = 2; i <= totalSlides; i++) {
      const iStr = i < 10 ? `0${i}` : i;
      const selector = `.product_paragraph.is--${iStr}, .product_paragraph.is-${iStr}, [class*="product_paragraph"][class*="is--${iStr}"]`;
      const elements = document.querySelectorAll(selector);
      
      if (elements.length > 0) {
        console.log(`Inizializzando paragrafo ${iStr}:`, elements.length, "elementi trovati");
        gsap.set(elements, { opacity: 0, y: 30, filter: 'blur(10px)' });
      } else {
        console.warn(`Paragrafo ${iStr} non trovato con selettore:`, selector);
      }
    }
    
    // Imposta il link iniziale del pulsante
    const dynamicButton = document.getElementById('dinamic-button');
    if (dynamicButton) {
      dynamicButton.href = buttonUrls[0];
      console.log("Pulsante dinamico impostato:", buttonUrls[0]);
    } else {
      console.warn("Pulsante dinamico non trovato");
    }
  }
  
  // Funzione per animare tra slide (usa le classi complete)
  function animateToSlide(fromIndex, toIndex, direction) {
    if (isAnimating) return;
    isAnimating = true;
    
    console.log(`Animazione da ${fromIndex+1} a ${toIndex+1}, direzione: ${direction}`);
    
    // Formatta gli indici per le classi
    const fromStr = (fromIndex + 1) < 10 ? `0${fromIndex + 1}` : (fromIndex + 1);
    const toStr = (toIndex + 1) < 10 ? `0${toIndex + 1}` : (toIndex + 1);
    
    // Selettori più flessibili
    const fromTitleSelector = `.product_title.is--${fromStr}, .product_title.is-${fromStr}, [class*="product_title"][class*="is--${fromStr}"]`;
    const toTitleSelector = `.product_title.is--${toStr}, .product_title.is-${toStr}, [class*="product_title"][class*="is--${toStr}"]`;
    
    const fromSubSelector = `.product_sub.is--${fromStr}, .product_sub.is-${fromStr}, [class*="product_sub"][class*="is--${fromStr}"]`;
    const toSubSelector = `.product_sub.is--${toStr}, .product_sub.is-${toStr}, [class*="product_sub"][class*="is--${toStr}"]`;
    
    const fromImageSelector = `.image_box.is--${fromStr}, .image_box.is-${fromStr}, [class*="image_box"][class*="is--${fromStr}"]`;
    const toImageSelector = `.image_box.is--${toStr}, .image_box.is-${toStr}, [class*="image_box"][class*="is--${toStr}"]`;
    
    const fromParagraphSelector = `.product_paragraph.is--${fromStr}, .product_paragraph.is-${fromStr}, [class*="product_paragraph"][class*="is--${fromStr}"]`;
    const toParagraphSelector = `.product_paragraph.is--${toStr}, .product_paragraph.is-${toStr}, [class*="product_paragraph"][class*="is--${toStr}"]`;
    
    // Timeline per sincronizzare le animazioni
    const tl = gsap.timeline({
      onComplete: function() {
        isAnimating = false;
        console.log("Animazione completata");
      }
    });
    
    // 1. Anima i titoli
    const fromTitleElements = document.querySelectorAll(fromTitleSelector);
    const toTitleElements = document.querySelectorAll(toTitleSelector);
    
    if (fromTitleElements.length > 0) {
      tl.to(fromTitleElements, {
        y: direction > 0 ? -100 : 100,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
    }
    
    if (toTitleElements.length > 0) {
      tl.fromTo(toTitleElements, {
        y: direction > 0 ? 100 : -100
      }, {
        y: 0,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
    }
    
    // 2. Anima i sottotitoli
    const fromSubElements = document.querySelectorAll(fromSubSelector);
    const toSubElements = document.querySelectorAll(toSubSelector);
    
    if (fromSubElements.length > 0) {
      tl.to(fromSubElements, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.1);
    }
    
    if (toSubElements.length > 0) {
      tl.fromTo(toSubElements, {
        opacity: 0,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.2);
    }
    
    // 3. Anima i box immagine
    const fromImageElements = document.querySelectorAll(fromImageSelector);
    const toImageElements = document.querySelectorAll(toImageSelector);
    
    if (fromImageElements.length > 0) {
      tl.to(fromImageElements, {
        scale: 0,
        opacity: 0,
        duration: duration,
        ease: "power2.inOut"
      }, 0);
    }
    
    if (toImageElements.length > 0) {
      tl.fromTo(toImageElements, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: duration,
        ease: "power2.inOut"
      }, 0.1);
    }
    
    // 4. Anima i paragrafi
    const fromParagraphElements = document.querySelectorAll(fromParagraphSelector);
    const toParagraphElements = document.querySelectorAll(toParagraphSelector);
    
    if (fromParagraphElements.length > 0) {
      tl.to(fromParagraphElements, {
        opacity: 0,
        y: direction > 0 ? -30 : 30,
        filter: 'blur(10px)',
        duration: duration,
        ease: "power2.inOut"
      }, 0.2);
    }
    
    if (toParagraphElements.length > 0) {
      tl.fromTo(toParagraphElements, {
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
    }
    
    // 5. Aggiorna il link del pulsante
    const dynamicButton = document.getElementById('dinamic-button');
    if (dynamicButton) {
      dynamicButton.href = buttonUrls[toIndex];
    }
  }
  
  // Funzione per andare alla slide successiva
  function goToNextSlide() {
    const fromIndex = currentIndex;
    const toIndex = (currentIndex + 1) % totalSlides;
    
    animateToSlide(fromIndex, toIndex, 1);
    currentIndex = toIndex;
  }
  
  // Funzione per andare alla slide precedente
  function goToPrevSlide() {
    const fromIndex = currentIndex;
    const toIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    
    animateToSlide(fromIndex, toIndex, -1);
    currentIndex = toIndex;
  }
  
  // Aggiungi listener ai pulsanti
  const nextButton = document.getElementById('next');
  const prevButton = document.getElementById('prev');
  
  if (nextButton) {
    nextButton.addEventListener('click', goToNextSlide);
    console.log("Listener aggiunto al pulsante next");
  } else {
    console.warn("Pulsante next non trovato");
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', goToPrevSlide);
    console.log("Listener aggiunto al pulsante prev");
  } else {
    console.warn("Pulsante prev non trovato");
  }
  
  // Esegui le verifiche e inizializzazioni
  setTimeout(function() {
    logAllElements();
    initializeUI();
  }, 500);
});
