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
            data.slice(0, 100).forEach((item, index) => {  // Testing with first 10 items
                const { link } = item;
                const paddedIndex = index.toString().padStart(3, '0');
                const imagePath = `pics/extracted_images/image_${paddedIndex}.jpg`;

                const div = document.createElement("div");
                div.className = "fashion-item";
                div.innerHTML = `
                    <div class="image-container">
                        <img src="${imagePath}" 
                             alt="Product image" 
                             onerror="this.src='pictures/placeholder.png'"
                             loading="lazy">
                    </div>
                    <div class="item-details">
                        <a href="${link}" target="_blank" class="item-link">View Product</a>
                    </div>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error loading data:", error);
            document.getElementById("fashion-container").innerHTML = 
                '<p class="error">Sorry, there was an error loading the products. Please try again later.</p>';
        });
});
