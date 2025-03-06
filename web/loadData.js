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
            data.forEach(item => {
                const { name, price, link } = item;
                const div = document.createElement("div");
                div.className = "fashion-item";
                div.innerHTML = `
                    <p>${name}</p>
                    <a href="${link}" target="_blank">Link</a>
                    <p>${price}</p>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => console.error("Error loading data:", error));
});
