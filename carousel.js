document.addEventListener('DOMContentLoaded', function() {
  console.log("Script GSAP avviato");
  
  // Indice corrente e totale slide
  let currentIndex = 0;
  const totalSlides = 8;
  
  // URL dei pulsanti
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
  
  // Funzione helper per selezionare elementi con gestione errori
  function safeSelect(baseClass, index) {
    const num = index < 10 ? `0${index}` : index;
    
    // Prova varie combinazioni di classi
    let selector = `.${baseClass}.is--${num}, .${baseClass}.is-${num}`;
    let elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) {
      console.warn(`Nessun elemento trovato per ${baseClass} indice ${num}`);
    }
    
    return elements;
  }
  
  // Inizializza lo stato UI
  function initializeUI() {
    console.log("Inizializzazione stato UI");
    
    // Nascondi tutti gli elementi tranne il primo
    for (let i = 2; i <= totalSlides; i++) {
      // Titoli
      gsap.set(safeSelect('product_title', i), { y: 100 });
      
      // Sottotitoli
      gsap.set(safeSelect('product_sub', i), { opacity: 0, filter: 'blur(10px)' });
      
      // Box immagini
      gsap.set(safeSelect('image_box', i), { scale: 0, opacity: 0 });
      
      // Paragrafi
      gsap.set(safeSelect('product_paragraph', i), { opacity: 0, y: 30, filter: 'blur(10px)' });
    }
    
    // Imposta il pulsante dinamico
    const dynamicButton = document.getElementById('dinamic-button');
    if (dynamicButton) {
      dynamicButton.href = buttonUrls[0];
      console.log("Pulsante dinamico impostato:", buttonUrls[0]);
    }
  }
  
  // Funzione per animare tra slide
  function animateToSlide(fromIndex, toIndex, direction) {
    console.log(`Animazione da ${fromIndex+1} a ${toIndex+1}, direzione: ${direction}`);
    
    // Indici per selettori (1-based)
    const fromNum = fromIndex + 1;
    const toNum = toIndex + 1;
    
    // Timeline GSAP
    const tl = gsap.timeline({
      onStart: function() {
        console.log("Animazione iniziata");
      },
      onComplete: function() {
        console.log("Animazione completata");
      }
    });
    
    // 1. Anima i titoli
    tl.to(safeSelect('product_title', fromNum), {
      y: direction > 0 ? -100 : 100,
      duration: duration,
      ease: "power2.inOut"
    }, 0);
    
    tl.fromTo(safeSelect('product_title', toNum), {
      y: direction > 0 ? 100 : -100
    }, {
      y: 0,
      duration: duration,
      ease: "power2.inOut"
    }, 0);
    
    // 2. Anima i sottotitoli
    tl.to(safeSelect('product_sub', fromNum), {
      opacity: 0,
      filter: 'blur(10px)',
      duration: duration,
      ease: "power2.inOut"
    }, 0.1);
    
    tl.fromTo(safeSelect('product_sub', toNum), {
      opacity: 0,
      filter: 'blur(10px)'
    }, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: duration,
      ease: "power2.inOut"
    }, 0.2);
    
    // 3. Anima i box immagine
    tl.to(safeSelect('image_box', fromNum), {
      scale: 0,
      opacity: 0,
      duration: duration,
      ease: "power2.inOut"
    }, 0);
    
    tl.fromTo(safeSelect('image_box', toNum), {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: duration,
      ease: "power2.inOut"
    }, 0.1);
    
    // 4. Anima i paragrafi
    tl.to(safeSelect('product_paragraph', fromNum), {
      opacity: 0,
      y: direction > 0 ? -30 : 30,
      filter: 'blur(10px)',
      duration: duration,
      ease: "power2.inOut"
    }, 0.2);
    
    tl.fromTo(safeSelect('product_paragraph', toNum), {
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
    
    // 5. Aggiorna il pulsante dinamico
    const dynamicButton = document.getElementById('dinamic-button');
    if (dynamicButton) {
      dynamicButton.href = buttonUrls[toIndex];
    }
  }
  
  // Funzioni per navigare tra slide
  function goToNextSlide() {
    const fromIndex = currentIndex;
    const toIndex = (currentIndex + 1) % totalSlides;
    
    animateToSlide(fromIndex, toIndex, 1);
    currentIndex = toIndex;
  }
  
  function goToPrevSlide() {
    const fromIndex = currentIndex;
    const toIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    
    animateToSlide(fromIndex, toIndex, -1);
    currentIndex = toIndex;
  }
  
  // Assicurati che lo script aspetti un po' prima di inizializzare
  // per evitare conflitti con altri script
  setTimeout(function() {
    // Aggiungi listener ai pulsanti
    const nextButton = document.getElementById('next');
    if (nextButton) {
      nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        goToNextSlide();
      });
      console.log("Listener aggiunto al pulsante next");
    }
    
    const prevButton = document.getElementById('prev');
    if (prevButton) {
      prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        goToPrevSlide();
      });
      console.log("Listener aggiunto al pulsante prev");
    }
    
    // Inizializza l'UI
    initializeUI();
  }, 500);
});
