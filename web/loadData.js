document.addEventListener("DOMContentLoaded", function () {
  // Dynamically detect the current page's filename
  const currentPage = window.location.pathname.split("/").pop();

  // Set up search and autocomplete
  const searchInput = document.getElementById("searchInput");
  const autocompleteList = document.createElement("ul");
  autocompleteList.className = "autocomplete-list";
  searchInput.parentNode.appendChild(autocompleteList);

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

      if (currentPage === "index.html") {
        // Randomize and display products on index.html
        const shuffledData = shuffleArray(data); // Shuffle all data
        console.log("Shuffled data:", shuffledData); // Debugging log
        displayProducts(shuffledData.slice(0, 6), true); // Display 6 random products, hide missing images
      } else {
        // Categorize and display products on other pages
        const category = currentPage.replace(".html", ""); // Extract category from filename
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
    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase().trim();

      // Clear previous autocomplete suggestions
      autocompleteList.innerHTML = "";

      if (searchTerm.length > 0) {
        const matches = allProducts
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
            filterResults(allProducts, product.name.toLowerCase());
            autocompleteList.innerHTML = "";
          });
          autocompleteList.appendChild(li);
        });
      }

      filterResults(allProducts, searchTerm);
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

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  console.log("Original array:", array); // Debugging log
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  console.log("Shuffled array:", array); // Debugging log
  return array;
}

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
