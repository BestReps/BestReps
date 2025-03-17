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

    // Convert image URL to WebP
    const webpUrl = image_url.replace(/\.(jpg|jpeg|png)/, ".webp");

    const div = document.createElement("div");
    div.className = "fashion-item";

    if (image_url) {
      const img = document.createElement("img");
      img.alt = `${name} - High Quality Replica ${item.category}`; // SEO-friendly alt text
      img.width = "300"; // Standard product image width
      img.height = "300"; // Standard product image height
      img.loading = "lazy"; // Add lazy loading
      img.onclick = () => openModal(link);

      // Add picture element for WebP support
      const picture = document.createElement("picture");
      const sourceWebP = document.createElement("source");
      sourceWebP.srcset = webpUrl;
      sourceWebP.type = "image/webp";

      img.src = image_url; // Fallback image
      picture.appendChild(sourceWebP);
      picture.appendChild(img);

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
      div.prepend(picture);
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
