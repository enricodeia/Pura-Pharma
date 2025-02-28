document.addEventListener("DOMContentLoaded", function() {
  // Array of product URLs (order corresponds to slides 1-8)
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
  const totalSlides = productLinks.length;
  
  // Updates the dynamic button's href attribute based on slide index
  function updateButtonLink(index) {
    const dynamicButton = document.getElementById("dinamic-button");
    dynamicButton.setAttribute("href", productLinks[index]);
  }
  
  // Handles slide transitions.
  // 'direction' should be "next" or "prev" to determine the animation direction.
  function goToSlide(newIndex, direction = "next") {
    const prevIndex = currentIndex;
    // Cycle the index (ensures looping)
    currentIndex = (newIndex + totalSlides) % totalSlides;
    
    // Set a multiplier to reverse animations on "prev"
    const dirMultiplier = direction === "next" ? 1 : -1;
    
    // Animate Titles: current moves out upward (or downward if "prev") & new slides in.
    gsap.to(`.product_title.is--0${prevIndex + 1}`, { 
      y: -100 * dirMultiplier, 
      opacity: 0, 
      duration: 0.5, 
      ease: "power2.out" 
    });
    gsap.fromTo(`.product_title.is--0${currentIndex + 1}`, 
      { y: 100 * dirMultiplier, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
    
    // Animate Subtitles: fade out current, fade in new
    gsap.to(`.product_sub.is--0${prevIndex + 1}`, { 
      opacity: 0, 
      filter: "blur(10px)", 
      duration: 0.5, 
      ease: "power2.out" 
    });
    gsap.to(`.product_sub.is--0${currentIndex + 1}`, { 
      opacity: 1, 
      filter: "blur(0px)", 
      duration: 0.5, 
      ease: "power2.out" 
    });
    
    // Animate Images: current scales down, new scales up
    gsap.to(`.image_box.is--0${prevIndex + 1}`, { 
      scale: 0, 
      opacity: 0, 
      duration: 0.5, 
      ease: "power2.out" 
    });
    gsap.fromTo(`.image_box.is--0${currentIndex + 1}`, 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
    
    // Animate Paragraphs: current goes down (y:30) and fades out; new comes from y:30 into place.
    gsap.to(`.product_paragraph.is--0${prevIndex + 1}`, { 
      y: 30, 
      opacity: 0, 
      filter: "blur(10px)", 
      duration: 0.5, 
      ease: "power2.out" 
    });
    gsap.to(`.product_paragraph.is--0${currentIndex + 1}`, { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)", 
      duration: 0.5, 
      ease: "power2.out" 
    });
    
    // Update the dynamic button link for the new slide.
    updateButtonLink(currentIndex);
  }
  
  // Event listeners for navigation buttons
  document.getElementById("next").addEventListener("click", function(e) {
    e.preventDefault();
    goToSlide(currentIndex + 1, "next");
  });
  
  document.getElementById("prev").addEventListener("click", function(e) {
    e.preventDefault();
    goToSlide(currentIndex - 1, "prev");
  });
  
  // Initialize the dynamic button link on page load.
  updateButtonLink(currentIndex);
});
