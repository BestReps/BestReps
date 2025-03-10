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
                const pngPath = `/web/pics/extracted_images/image_${paddedIndex}.png`;
                const jpgPath = `/web/pics/extracted_images/image_${paddedIndex}.jpg`;

                // Check both formats dynamically
                return checkImageExists(pngPath)
                    .then(pngExists => {
                        if (pngExists) {
                            console.log(`✅ Found: ${pngPath}`);
                            return { item, imagePath: pngPath };
                        } else {
                            return checkImageExists(jpgPath)
                                .then(jpgExists => {
                                    if (jpgExists) {
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

// Function to check if an image exists
function checkImageExists(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}