import { initScrollAnimation } from "./scrollAnimation.js";
import { staticProducts, fetchProductData } from "./productData.js";
import { setupSearchAndAutocomplete, filterResults } from "./searchHandler.js";
import { openModal, closeModal } from "./modalHandler.js";
import { displayProducts } from "./productDisplay.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Initialize scroll animation
  initScrollAnimation();

  const searchInput = document.getElementById("searchInput");
  const path = window.location.pathname;
  const isHomePage = path === "/" || path === "" || path.endsWith("index.html");

  try {
    const data = await fetchProductData();
    setupSearchAndAutocomplete(searchInput, data, staticProducts);

    if (isHomePage) {
      displayProducts(staticProducts, true);
    } else {
      const category = path.split("/").pop().replace(".html", "");
      const filteredData = data.filter((item) => item.category === category);
      displayProducts(filteredData, false);
    }
  } catch (error) {
    console.error("Error loading data:", error);
    document.getElementById("fashion-container").innerHTML =
      '<div class="error-message">Sorry, there was an error loading the products. Please try again later.</div>';
  }
});

// Make modal functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
