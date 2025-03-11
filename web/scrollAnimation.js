export function initScrollAnimation() {
  const logoContainer = document.querySelector(".navbar .title");
  const logo = logoContainer.querySelector("img");
  let lastScrollY = window.scrollY;
  let isHidden = false;
  let scrollTimeout = null;

  // Initial state
  logo.style.width = "600px";
  logoContainer.style.visibility = "visible";
  logoContainer.style.opacity = "1";

  // Function to force show logo
  function forceShowLogo() {
    // Kill any ongoing animations
    gsap.killTweensOf(logo);
    gsap.killTweensOf(logoContainer);

    isHidden = false;

    // Set immediate values first to ensure visibility
    logoContainer.style.visibility = "visible";
    logo.style.opacity = "1";

    gsap.set(logo, { width: 600 });
    gsap.set(logoContainer, {
      backgroundColor: lastScrollY <= 0 ? "transparent" : "rgba(0, 0, 0, 0.8)",
    });
  }

  // Function to handle scroll events
  function handleScroll() {
    const currentScrollY = window.scrollY;
    const threshold = 100;

    // For top of page, force show the logo regardless of state
    if (currentScrollY <= threshold) {
      forceShowLogo();
    }
    // Scrolling up (not at the top)
    else if (currentScrollY < lastScrollY) {
      isHidden = false;
      gsap.to(logo, {
        width: 600,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(logoContainer, {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
          logoContainer.style.visibility = "visible";
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
  }

  // Debounced scroll handler to check final position
  window.addEventListener("scroll", () => {
    handleScroll();

    // Clear previous timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set a timeout to check position after scrolling stops
    scrollTimeout = setTimeout(() => {
      // If we're at the top, force show the logo
      if (window.scrollY <= 100) {
        forceShowLogo();
      }
    }, 150); // Wait 150ms after scrolling stops
  });

  // Force check on page load
  requestAnimationFrame(() => {
    if (window.scrollY <= 100) {
      forceShowLogo();
    }
  });
}
