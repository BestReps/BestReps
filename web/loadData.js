document.addEventListener("DOMContentLoaded", function() {
    // Dynamically detect the category from the page's filename
    const category = window.location.pathname.split('/').pop().replace('.html', '');

    fetch("data_cat.json")  // Load the categorized data
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Filter data for the current category
            const filteredData = data.filter(item => item.category === category);

            const container = document.getElementById("fashion-container");
            
            // Process items
            filteredData.slice(0, 3000).forEach((item, index) => {
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
                        img.style.display = "none"; // Hide the broken image
                    };

                    div.innerHTML = `
                        <div class="item-info">
                            <h3>${name || 'Product Name'}</h3>
                            <p>Price: ${price_usd || 'Price not available'}</p>
                            <a href="${link}" target="_blank" class="item-link">View Product</a>
                        </div>
                    `;
                    div.prepend(img); // Add the image to the top of the div
                } else {
                    // Fallback if image_url is not available
                    div.innerHTML = `
                        <div class="image-placeholder">Image not available</div>
                        <div class="item-info">
                            <h3>${name || 'Product Name'}</h3>
                            <p>Price: ${price_usd || 'Price not available'}</p>
                            <a href="${link}" target="_blank" class="item-link">View Product</a>
                        </div>
                    `;
                }
                
                container.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error loading data:", error);
            document.getElementById("fashion-container").innerHTML = 
                '<div class="error-message">Sorry, there was an error loading the products. Please try again later.</div>';
        });
});

// Function to open the modal
function openModal(link) {
    const modal = document.getElementById("popupModal");
    const iframe = document.getElementById("popupFrame");
    iframe.src = link;
    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("popupModal");
    modal.style.display = "none";
}