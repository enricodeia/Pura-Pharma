document.addEventListener('DOMContentLoaded', function() {
  // Array dei link dei prodotti in ordine
  const productLinks = [
    "https://www.purapharma.eu/products/levacel-plus",
    "https://www.purapharma.eu/products/venestasi",
    "https://www.purapharma.eu/products/ansirem",
    "https://www.purapharma.eu/products/vitamina-d3",
    "https://www.purapharma.eu/products/b6-magnesio",
    "https://www.purapharma.eu/products/snell-fame",
    "https://www.purapharma.eu/products/rodiola-rosea",
    "https://www.purapharma.eu/products/tricopyl"
  ];
  
  let currentIndex = 0;
  const totalItems = productLinks.length;

  // Debug: Controlla se il primo elemento viene selezionato correttamente
  console.log('Element .product_title.is--01:', document.querySelector('.product_title.is--01'));

  // Funzione per aggiornare il link del bottone dinamico
  function updateButtonLink(index) {
    const dynamicButton = document.getElementById('dinamic-button');
    dynamicButton.setAttribute('href', productLinks[index]);
  }

  // Funzione per gestire la transizione tra le slide
  function goToSlide(newIndex) {
    const prevIndex = currentIndex;
    // Assicurati che l'indice sia ciclico
    currentIndex = (newIndex + totalItems) % totalItems;

    // Anima il titolo: quello corrente esce e il successivo entra
    gsap.to(`.product_title.is--0${prevIndex + 1}`, { y: -100, opacity: 0, duration: 0.5 });
    gsap.fromTo(`.product_title.is--0${currentIndex + 1}`, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });

    // Anima il sottotitolo
    gsap.to(`.product_sub.is--0${prevIndex + 1}`, { opacity: 0, filter: 'blur(10px)', duration: 0.5 });
    gsap.to(`.product_sub.is--0${currentIndex + 1}`, { opacity: 1, filter: 'blur(0px)', duration: 0.5 });

    // Anima l'immagine: quella corrente si riduce, quella successiva si ingrandisce
    gsap.to(`.image_box.is--0${prevIndex + 1}`, { scale: 0, opacity: 0, duration: 0.5 });
    gsap.fromTo(`.image_box.is--0${currentIndex + 1}`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });

    // Anima il paragrafo
    gsap.to(`.product_paragraph.is--0${prevIndex + 1}`, { y: 30, opacity: 0, filter: 'blur(10px)', duration: 0.5 });
    gsap.to(`.product_paragraph.is--0${currentIndex + 1}`, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5 });

    // Aggiorna il link del bottone dinamico
    updateButtonLink(currentIndex);
  }

  // Event listener per il pulsante "next"
  document.getElementById('next').addEventListener('click', function(e) {
    e.preventDefault();
    goToSlide(currentIndex + 1);
  });

  // Event listener per il pulsante "prev"
  document.getElementById('prev').addEventListener('click', function(e) {
    e.preventDefault();
    goToSlide(currentIndex - 1);
  });

  // Inizializza il bottone dinamico con il primo link
  updateButtonLink(currentIndex);
});
