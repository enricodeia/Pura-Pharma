window.onload = function() {
  console.log("Script vanilla minimale avviato");
  
  // Variabili di stato
  var currentIndex = 0;
  var totalSlides = 8;
  
  // URL per il pulsante dinamico
  var buttonUrls = [
    "https://www.purapharma.eu/products/levacel-plus",
    "https://www.purapharma.eu/products/venestasi",
    "https://www.purapharma.eu/products/ansirem",
    "https://www.purapharma.eu/products/vitamina-d3",
    "https://www.purapharma.eu/products/b6-magnesio",
    "https://www.purapharma.eu/products/snell-fame",
    "https://www.purapharma.eu/products/rodiola-rosea",
    "https://www.purapharma.eu/products/tricopyl"
  ];
  
  // Ottieni i pulsanti
  var nextButton = document.getElementById('next');
  var prevButton = document.getElementById('prev');
  var dynamicButton = document.getElementById('dinamic-button');
  
  // Funzione per mostrare/nascondere elementi
  function showSlide(index) {
    // Nascondi tutto prima
    for (var i = 1; i <= totalSlides; i++) {
      var numStr = i < 10 ? "0" + i : i.toString();
      var titleElements = document.querySelectorAll('.product_title.is--' + numStr);
      var subElements = document.querySelectorAll('.product_sub.is--' + numStr);
      var imageElements = document.querySelectorAll('.image_box.is--' + numStr);
      var paragraphElements = document.querySelectorAll('.product_paragraph.is--' + numStr);
      
      for (var el of titleElements) el.style.display = 'none';
      for (var el of subElements) el.style.display = 'none';
      for (var el of imageElements) el.style.display = 'none';
      for (var el of paragraphElements) el.style.display = 'none';
    }
    
    // Mostra solo gli elementi dell'indice corrente
    var activeStr = (index + 1) < 10 ? "0" + (index + 1) : (index + 1).toString();
    var activeTitleElements = document.querySelectorAll('.product_title.is--' + activeStr);
    var activeSubElements = document.querySelectorAll('.product_sub.is--' + activeStr);
    var activeImageElements = document.querySelectorAll('.image_box.is--' + activeStr);
    var activeParagraphElements = document.querySelectorAll('.product_paragraph.is--' + activeStr);
    
    for (var el of activeTitleElements) el.style.display = 'block';
    for (var el of activeSubElements) el.style.display = 'block';
    for (var el of activeImageElements) el.style.display = 'block';
    for (var el of activeParagraphElements) el.style.display = 'block';
    
    // Aggiorna link pulsante
    if (dynamicButton) {
      dynamicButton.href = buttonUrls[index];
    }
  }
  
  // Imposta lo stato iniziale
  showSlide(0);
  
  // Aggiungi eventi ai pulsanti
  if (nextButton) {
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % totalSlides;
      showSlide(currentIndex);
    });
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', function(e) {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      showSlide(currentIndex);
    });
  }
};
