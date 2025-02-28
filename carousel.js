document.addEventListener('DOMContentLoaded', function() {
  console.log("GSAP script caricato");
  
  // Indice corrente e numero totale di slide
  let currentIndex = 0;
  const totalSlides = 8;
  
  // Array degli URL per il pulsante dinamico
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
  
  // Durata delle animazioni
  const duration = 0.6;
  
  // Riferimento al pulsante dinamico
  const dynamicButton = document.getElementById('dinamic-button');
  if (dynamicButton) {
    dynamicButton.href = buttonUrls[0];
    console.log("Pulsante dinamico impostato:", buttonUrls[0]);
  } else {
    console.warn("Pulsante dinamico non trovato");
  }
  
  // Inizializza lo stato degli elementi UI
  function initializeUI() {
    console.log("Inizializzazione UI");
    
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
    
    // Controlla gli elementi
    setTimeout(checkElements, 500);
  }
  
  // Funzione per animare il passaggio tra slide
  function animateToSlide(fromIndex, toIndex, direction) {
    console.log(`Animazione da ${fromIndex+1} a ${toIndex+1}, direzione: ${direction}`);
    
    // Formatta gli indici per le classi
    const fromStr = (fromIndex + 1) < 10 ? `0${fromIndex + 1}` : (fromIndex + 1);
    const toStr = (toIndex + 1) < 10 ? `0${toIndex + 1}` : (toIndex + 1);
    
    // Timeline per sincronizzare le animazioni
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
    
    // 5. Aggiorna il link del pulsante
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
  
  // Funzione per controllare se gli elementi esistono
  function checkElements() {
    console.log("Controllo elementi UI...");
    
    for (let i = 1; i <= totalSlides; i++) {
      const iStr = i < 10 ? `0${i}` : i;
      
      // Controlla ogni tipo di elemento
      const types = ['product_title', 'product_sub', 'image_box', 'product_paragraph'];
      types.forEach(type => {
        const selector = `.${type}.is--${iStr}`;
        const element = document.querySelector(selector);
        
        if (!element) {
          console.warn(`Elemento ${selector} non trovato`);
        } else {
          console.log(`Elemento ${selector} trovato`);
        }
      });
    }
  }
  
  // Inizializza tutto
  initializeUI();
});
