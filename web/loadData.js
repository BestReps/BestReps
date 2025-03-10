document.addEventListener("DOMContentLoaded", function() {
    fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById("fashion-container");
            
            // Process items
            const loadItems = data.slice(0, 20).map((item, index) => {
                const { link } = item;
                const paddedIndex = (index + 1).toString().padStart(3, '0'); // Start at 001
                const pngPath = `/pics/extracted_images/image_${paddedIndex}.png`;
                const jpgPath = `/pics/extracted_images/image_${paddedIndex}.jpg`;

                // Check both formats dynamically
                return checkImageStatus(pngPath)
                    .then(pngStatus => {
                        if (pngStatus === 200) {
                            console.log(`✅ Found: ${pngPath}`);
                            return { item, imagePath: pngPath };
                        } else {
                            return checkImageStatus(jpgPath)
                                .then(jpgStatus => {
                                    if (jpgStatus === 200) {
                                        console.log(`✅ Found: ${jpgPath}`);
                                        return { item, imagePath: jpgPath };
                                    } else {
                                        console.log(`❌ Not Found: ${pngPath} or ${jpgPath}`);
                                        return { item, imagePath: null };
                                    }
                                });
                        }
                    })
                    .then(result => {
                        const div = document.createElement("div");
                        div.className = "fashion-item";
                        
                        if (result.imagePath) {
                            // Create the image element
                            const img = document.createElement("img");
                            img.alt = "Fashion item";
                            img.onclick = () => openModal(link);

                            // Set the src attribute
                            img.src = result.imagePath;

                            // Suppress 404 errors for this image
                            img.onerror = () => {
                                console.log(`⚠️ Suppressed 404 for: ${result.imagePath}`);
                                img.style.display = "none"; // Hide the broken image
                            };

                            div.innerHTML = `
                                <div class="item-info">
                                    <h3>${item.name || 'Product Name'}</h3>
                                    <p>Price: ${item.price || 'Price not available'}</p>
                                    <a href="${link}" target="_blank" class="item-link">View Product</a>
                                </div>
                            `;
                            div.prepend(img); // Add the image to the top of the div
                        } else {
                            // Fallback if neither JPG nor PNG exists
                            div.innerHTML = `
                                <div class="image-placeholder">Image not available</div>
                                <div class="item-info">
                                    <h3>Name: ${item.name || 'Product Name'}</h3>
                                    <p>Price: ${item.price || 'Price not available'}</p>
                                    <a href="${link}" target="_blank" class="item-link">View Product</a>
                                </div>
                            `;
                        }
                        
                        container.appendChild(div);
                    });
            });
            
            // Handle all promises
            return Promise.all(loadItems);
        })
        .catch(error => {
            console.error("Error loading data:", error);
            document.getElementById("fashion-container").innerHTML = 
                '<div class="error-message">Sorry, there was an error loading the products. Please try again later.</div>';
        });
});

// Function to check the HTTP status of an image
function checkImageStatus(url) {
    return fetch(url, { method: 'HEAD' })
        .then(response => {
            return response.status; // Return the status code
        })
        .catch(() => {
            return 404; // Return 404 without logging an error
        });
}