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
            const loadItems = data.slice(0, 50).map((item, index) => {
                const { link } = item;
                const paddedIndex = index.toString().padStart(3, '0');
                const jpgPath = `pics/extracted_images/image_${paddedIndex}.jpg`;
                const pngPath = `pics/extracted_images/image_${paddedIndex}.png`;
                
                // Check which image exists (JPG or PNG)
                return checkImageExists(jpgPath)
                    .then(jpgExists => {
                        if (jpgExists) {
                            return { item, imagePath: jpgPath };
                        } else {
                            return checkImageExists(pngPath)
                                .then(pngExists => {
                                    return { item, imagePath: pngExists ? pngPath : null };
                                });
                        }
                    })
                    .then(result => {
                        const div = document.createElement("div");
                        div.className = "fashion-item";
                        
                        if (result.imagePath) {
                            div.innerHTML = `
                                <img src="${result.imagePath}" alt="Fashion item" onclick="openModal('${link}')">
                                <div class="item-info">
                                    <h3>Name: ${item.name || 'Product Name'}</h3>
                                    <p>Price: ${item.price || 'Price not available'}</p>
                                    <a href="${link}" target="_blank" class="item-link">View Product</a>
                                </div>
                            `;
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