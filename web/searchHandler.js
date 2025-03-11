export function setupSearchAndAutocomplete(
  searchInput,
  allProducts,
  staticProducts
) {
  const searchProducts = [...allProducts, ...staticProducts];
  const autocompleteList = document.createElement("ul");
  autocompleteList.className = "autocomplete-list";
  searchInput.parentNode.appendChild(autocompleteList);

  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase().trim();
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

  document.addEventListener("click", function (e) {
    if (e.target !== searchInput) {
      autocompleteList.innerHTML = "";
    }
  });
}

export function filterResults(allProducts, searchTerm) {
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
