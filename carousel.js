document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded, now running GSAP set...");

  // This line sets the first product title to invisible & translated down by 100px
  gsap.set(".product_title.is--01", {
    opacity: 0,
    y: 100
  });

  console.log("Set .product_title.is--01 to opacity: 0 and y: 100 via GSAP");
});
