document.addEventListener("DOMContentLoaded", function() {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("fashion-container");
            data.forEach(item => {
                const [name, link, price_yen, price_usd] = item;
                const div = document.createElement("div");
                div.className = "fashion-item";
                div.innerHTML = `
                    <p>${name}</p>
                    <a href="${link}" target="_blank">${link}</a>
                    <p>${price_yen}</p>
                    <p>${price_usd}</p>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => console.error("Error loading data:", error));
});
