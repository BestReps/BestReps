import { initScrollAnimation } from "./scrollAnimation.js";
import { staticProducts, fetchProductData } from "./productData.js";
import { setupSearchAndAutocomplete, filterResults } from "./searchHandler.js";
import { openModal, closeModal } from "./modalHandler.js";
import { displayProducts } from "./productDisplay.js";

document.addEventListener("DOMContentLoaded", async function () {
  // GSAP ScrollTrigger animation
  gsap.registerPlugin(ScrollTrigger);

  const logoContainer = document.querySelector(".navbar .title");
  const logo = logoContainer.querySelector("img");
  let lastScrollY = window.scrollY;
  let isHidden = false; // Track visibility state

  // Initial state
  logo.style.width = "600px";
  logoContainer.style.visibility = "visible";
  logoContainer.style.opacity = "1";

  // Handle scroll events
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const threshold = 100; // Number of pixels from top where logo stays visible

    // Always show logo near top of page or scrolling up
    if (currentScrollY <= threshold || currentScrollY < lastScrollY) {
      isHidden = false;
      gsap.to(logo, {
        width: 600,
        duration: 0.3,
        ease: "power2.out",
      });

      // Only change background color, not opacity
      gsap.to(logoContainer, {
        backgroundColor:
          currentScrollY <= 0 ? "transparent" : "rgba(0, 0, 0, 0.8)",
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
          logoContainer.style.visibility = "visible";
          // Ensure logo stays visible
          logo.style.opacity = 1;
        },
      });
    }
    // Scrolling down and past threshold
    else if (currentScrollY > lastScrollY && !isHidden) {
      isHidden = true;
      gsap.to(logo, {
        width: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      // Only hide the background
      gsap.to(logoContainer, {
        backgroundColor: "transparent",
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          logoContainer.style.visibility = "hidden";
        },
      });
    }

    lastScrollY = currentScrollY;
  });

  // Initialize the rest of your functions directly as needed
  initScrollAnimation();

  const searchInput = document.getElementById("searchInput");
  const path = window.location.pathname;
  const isHomePage = path === "/" || path === "" || path.endsWith("index.html");

  try {
    const data = await fetchProductData();
    const container = document.getElementById("fashion-container");
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
