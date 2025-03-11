export function initScrollAnimation() {
  const logoContainer = document.querySelector(".navbar .title");
  const logo = logoContainer.querySelector("img");
  let lastScrollY = window.scrollY;
  let isHidden = false;

  // Initial state
  logo.style.width = "600px";
  logoContainer.style.visibility = "visible";
  logoContainer.style.opacity = "1";

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const threshold = 100;

    if (currentScrollY <= threshold || currentScrollY < lastScrollY) {
      isHidden = false;
      gsap.to(logo, {
        width: 600,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(logoContainer, {
        backgroundColor:
          currentScrollY <= 0 ? "transparent" : "rgba(0, 0, 0, 0.8)",
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
          logoContainer.style.visibility = "visible";
          logo.style.opacity = 1;
        },
      });
    } else if (currentScrollY > lastScrollY && !isHidden) {
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
  });
}
