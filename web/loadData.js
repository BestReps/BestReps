document.addEventListener("DOMContentLoaded", function () {
  // GSAP ScrollTrigger animation
  gsap.registerPlugin(ScrollTrigger);

  const logoContainer = document.querySelector(".navbar .title");
  const logo = logoContainer.querySelector("img");
  let lastScrollY = window.scrollY;

  // Initial state
  logo.style.width = "600px";
  logoContainer.style.visibility = "visible";

  // Handle scroll events
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Scrolling up
    if (currentScrollY < lastScrollY) {
      gsap.to(logo, {
        width: 600,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(logoContainer, {
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent black background
        duration: 0.3,
        ease: "power2.out",
        onStart: () => {
          logoContainer.style.visibility = "visible";
        },
      });
    }
    // Scrolling down
    else if (currentScrollY > lastScrollY) {
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

  // Dynamically detect the current page's filename
  const path = window.location.pathname;
  // Check if it's the home page (empty path, just "/", or ends with index.html)
  const isHomePage = path === "/" || path === "" || path.endsWith("index.html");

  // Set up search and autocomplete
  const searchInput = document.getElementById("searchInput");
  const autocompleteList = document.createElement("ul");
  autocompleteList.className = "autocomplete-list";
  searchInput.parentNode.appendChild(autocompleteList);

  // Static products data
  const staticProducts = [
    {
      name: "airforce one",
      price_usd: "$13",
      image_url:
        "https://lh7-rt.googleusercontent.com/sheetsz/AHOq17GPbpPR9U63iaaG8yPJDjVdVSS640_cYFzS6vP7-0yTM0ZDv_3pyhEsdDVdB7VUKgRUpTIlem52UhGCjI7LptLBA_TlwiBwKwedtyGV4Ie6g2WSK4BozeDQvDQdN3_Gm9ndqXqcIw=w204-h163?key=p2g3-rzV9ITo2xi2WG5U_ZHr",
      link: "https://cnfans.com/product/?shop_type=weidian&id=7240332207&ref=201196",
      category: "other",
    },
    {
      name: "airforce one mulitiple colour ways",
      price_usd: "$30",
      image_url:
        "https://lh7-rt.googleusercontent.com/sheetsz/AHOq17G1bjriR0FrMFBTOetvjlw0pVHg00uRAYeutTB--U-sbyPkycOYDLTDUwOsYuRcwfXHA3FjJKIDM3U89z2IMgX_E8lCxgL0WfQ-bWhmbayKVU_NYiuWK7jw6g0eGy2PTmxBMAJYPw=w204-h149?key=p2g3-rzV9ITo2xi2WG5U_ZHr",
      link: "https://cnfans.com/product/?shop_type=weidian&id=7240332207&ref=201196",
      category: "other",
    },
    {
      name: "resell batch jordan 4",
      price_usd: "$27",
      image_url:
        "https://lh7-rt.googleusercontent.com/sheetsz/AHOq17FwT3QhtVTtoA5gp2oPNgjLBzBitpaj9t24bSaeamxZ-HYcm1rWUeCdHkcOFVNoNhBRKzGM8CTmYPISC9dB2VljvXJtXTgH0hGMT9Dis3rADG4I7PcrbulkkL47UrFVrAn0RYwy=w204-h149?key=p2g3-rzV9ITo2xi2WG5U_ZHr",
      link: "https://cnfans.com/product/?shop_type=weidian&id=7264688429&ref=201196",
      category: "shoes",
    },
  ];

  fetch("data_cat.json") // Load the categorized data
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched successfully:", data); // Debugging log

      const container = document.getElementById("fashion-container");
      setupSearchAndAutocomplete(data); // Add this line

      if (isHomePage) {
        // Only display the static products on the home page
        console.log("On home page - displaying static products only");
        displayProducts(staticProducts, true);
      } else {
        // Categorize and display products on other pages
        const currentPage = path.split("/").pop() || "index.html";
        const category = currentPage.replace(".html", ""); // Extract category from filename
        console.log("On category page:", category);

        const filteredData = data.filter((item) => item.category === category);
        displayProducts(filteredData, false); // Display categorized products, show placeholders for missing images
      }
    })
    .catch((error) => {
      console.error("Error loading data:", error);
      document.getElementById("fashion-container").innerHTML =
        '<div class="error-message">Sorry, there was an error loading the products. Please try again later.</div>';
    });

  // Add the search and autocomplete functionality
  function setupSearchAndAutocomplete(allProducts) {
    // Add the static products to the search data
    const searchProducts = [...allProducts, ...staticProducts];

    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase().trim();

      // Clear previous autocomplete suggestions
      autocompleteList.innerHTML = "";

      if (searchTerm.length > 0) {
        const matches = searchProducts
          .filter(
            (product) =>
              product.name && product.name.toLowerCase().includes(searchTerm)
          )
          .slice(0, 5);

        matches.forEach((product) => {
          const li = document.createElement("li");
          li.textContent = product.name;
          li.addEventListener("click", () => {
            searchInput.value = product.name;
            filterResults(searchProducts, product.name.toLowerCase());
            autocompleteList.innerHTML = "";
          });
          autocompleteList.appendChild(li);
        });
      }

      filterResults(searchProducts, searchTerm);
    });

    // Hide autocomplete when clicking outside
    document.addEventListener("click", function (e) {
      if (e.target !== searchInput) {
        autocompleteList.innerHTML = "";
      }
    });
  }

  function filterResults(allProducts, searchTerm) {
    const items = document.querySelectorAll(".fashion-item");
    let foundItems = 0;
    const container = document.getElementById("fashion-container");

    const existingMessage = container.querySelector(".no-results");
    if (existingMessage) {
      existingMessage.remove();
    }

    items.forEach((item) => {
      const name = item.querySelector("h3").textContent.toLowerCase();
      if (searchTerm === "" || name.includes(searchTerm)) {
        item.classList.remove("hidden");
        foundItems++;
      } else {
        item.classList.add("hidden");
      }
    });

    if (foundItems === 0 && searchTerm !== "") {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent = "Item not found";
      container.appendChild(noResults);
    }
  }
});

// Function to display products
function displayProducts(products, hideMissingImages) {
  const container = document.getElementById("fashion-container");
  container.innerHTML = ""; // Clear the container

  console.log("Displaying products:", products); // Debugging log

  products.forEach((item, index) => {
    const { link, image_url, name, price_usd } = item;

    const div = document.createElement("div");
    div.className = "fashion-item";

    if (image_url) {
      // Create the image element
      const img = document.createElement("img");
      img.alt = "Fashion item";
      img.onclick = () => openModal(link);

      // Set the src attribute
      img.src = image_url;

      // Suppress 404 errors for this image
      img.onerror = () => {
        console.log(`⚠️ Suppressed 404 for: ${image_url}`);
        if (hideMissingImages) {
          // Hide the entire product if the image is missing (for index.html)
          div.style.display = "none";
        } else {
          // Hide only the image and show a placeholder (for other pages)
          img.style.display = "none";
          div.innerHTML = `
                        <div class="image-placeholder">Image not available</div>
                        <div class="item-info">
                            <h3>${name || "Product Name"}</h3>
                            <p>Price: ${price_usd || "Price not available"}</p>
                            <a href="${link}" target="_blank" class="item-link">View Product</a>
                        </div>
                    `;
        }
      };

      div.innerHTML = `
                <div class="item-info">
                    <h3>${name || "Product Name"}</h3>
                    <p>Price: ${price_usd || "Price not available"}</p>
                    <a href="${link}" target="_blank" class="item-link">View Product</a>
                </div>
            `;
      div.prepend(img); // Add the image to the top of the div
    } else if (!hideMissingImages) {
      // Fallback if image_url is not available (only for other pages)
      div.innerHTML = `
                <div class="image-placeholder">Image not available</div>
                <div class="item-info">
                    <h3>${name || "Product Name"}</h3>
                    <p>Price: ${price_usd || "Price not available"}</p>
                    <a href="${link}" target="_blank" class="item-link">View Product</a>
                </div>
            `;
    }

    if (!hideMissingImages || image_url) {
      // Only append the product if it's not hidden
      container.appendChild(div);
    }
  });
}

// Function to open the modal
function openModal(link) {
  const modal = document.getElementById("popupModal");
  const iframe = document.getElementById("popupFrame");
  iframe.src = link;
  modal.style.display = "block";

  // Add click handler for outside clicks
  modal.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("popupModal");
  const iframe = document.getElementById("popupFrame");
  modal.style.display = "none";
  iframe.src = ""; // Clear the iframe source
}
