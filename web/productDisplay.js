export function displayProducts(products, hideMissingImages) {
  console.log("📦 Displaying Products:", {
    count: products.length,
    hideMissingImages,
    products,
  });

  const container = document.getElementById("fashion-container");
  container.innerHTML = "";

  products.forEach((item) => {
    const { link, image_url, name, price_usd } = item;

    const div = document.createElement("div");
    div.className = "fashion-item";

    if (image_url) {
      const img = document.createElement("img");
      img.alt = "Fashion item";
      img.onclick = () => openModal(link);
      img.src = image_url;

      img.onerror = () => {
        console.log(`⚠️ Suppressed 404 for: ${image_url}`);
        if (hideMissingImages) {
          div.style.display = "none";
        } else {
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
      div.prepend(img);
    } else if (!hideMissingImages) {
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
      container.appendChild(div);
    }
  });
}
