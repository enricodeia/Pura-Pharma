// Ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Array of product URLs corresponding to each slide
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

  // Initialize the current index
  let currentIndex = 0;
  const totalItems = productLinks.length;

  // Function to update the dynamic button's href attribute
  function updateButtonLink(index) {
    const dynamicButton = document.getElementById('dinamic-button');
    dynamicButton.setAttribute('href', productLinks[index]);
  }

  // Function to handle the transition between slides
  function goToSlide(newIndex) {
    // Calculate the previous and next indices
    const prevIndex = currentIndex;
    currentIndex = (newIndex + totalItems) % totalItems;

    // Animate the product titles
    gsap.fromTo(`.product_title.is--0${prevIndex + 1}`, { y: 0 }, { y: -100, duration: 0.5 });
    gsap.fromTo(`.product_title.is--0${currentIndex + 1}`, { y: 100 }, { y: 0, duration: 0.5 });

    // Animate the product subtitles
    gsap.to(`.product_sub.is--0${prevIndex + 1}`, { opacity: 0, filter: 'blur(10px)', duration: 0.5 });
    gsap.to(`.product_sub.is--0${currentIndex + 1}`, { opacity: 1, filter: 'blur(0px)', duration: 0.5 });

    // Animate the images
    gsap.fromTo(`.image_box.is--0${prevIndex + 1}`, { scale: 1, opacity: 1 }, { scale: 0, opacity: 0, duration: 0.5 });
    gsap.fromTo(`.image_box.is--0${currentIndex + 1}`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });

    // Animate the product paragraphs
    gsap.to(`.product_paragraph.is--0${prevIndex + 1}`, { opacity: 0, y: 30, filter: 'blur(10px)', duration: 0.5 });
    gsap.to(`.product_paragraph.is--0${currentIndex + 1}`, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 });

    // Update the dynamic button link
    updateButtonLink(currentIndex);
  }

  // Event listeners for the navigation buttons
  document.getElementById('next').addEventListener('click', function(event) {
    event.preventDefault();
    goToSlide(currentIndex + 1);
  });

  document.getElementById('prev').addEventListener('click', function(event) {
    event.preventDefault();
    goToSlide(currentIndex - 1);
  });

  // Initialize the first slide
  updateButtonLink(currentIndex);
});

