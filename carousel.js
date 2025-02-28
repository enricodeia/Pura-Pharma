document.addEventListener("DOMContentLoaded", function () {
    let currentIndex = 0;
    const totalSlides = 8; // Ensure this matches the number of slides
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");
    const dynamicButton = document.getElementById("dinamic-button");

    const productTitles = document.querySelectorAll("[class*='product_title']");
    const productSubs = document.querySelectorAll("[class*='product_sub']");
    const imageBoxes = document.querySelectorAll("[class*='image_box']");
    const productParagraphs = document.querySelectorAll("[class*='product_paragraph']");

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

    function updateCarousel(index, direction) {
        let nextIndex = (index + (direction ? 1 : -1) + totalSlides) % totalSlides;
        
        // Animate Product Titles
        gsap.to(productTitles[index], { y: -100, duration: 0.5, ease: "power2.out" });
        gsap.fromTo(productTitles[nextIndex], { y: 100 }, { y: 0, duration: 0.5, ease: "power2.out" });

        // Animate Product Subtitles
        gsap.to(productSubs[index], { opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "power2.out" });
        gsap.fromTo(productSubs[nextIndex], { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" });

        // Animate Image Boxes
        gsap.to(imageBoxes[index], { scale: 0, opacity: 0, duration: 0.6, ease: "power2.out" });
        gsap.fromTo(imageBoxes[nextIndex], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" });

        // Animate Product Paragraphs
        gsap.to(productParagraphs[index], { opacity: 0, y: 30, filter: "blur(10px)", duration: 0.5, ease: "power2.out" });
        gsap.fromTo(productParagraphs[nextIndex], { opacity: 0, y: 30, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" });

        // Update Dynamic Button Link
        dynamicButton.href = productLinks[nextIndex];

        // Update current index
        currentIndex = nextIndex;
    }

    nextButton.addEventListener("click", () => updateCarousel(currentIndex, true));
    prevButton.addEventListener("click", () => updateCarousel(currentIndex, false));
});
