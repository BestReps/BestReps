document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.createElement('ul');
    autocompleteList.className = 'autocomplete-list';
    searchInput.parentNode.appendChild(autocompleteList);
    
    let allProducts = [];

    // Load products from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            console.log('Products loaded:', allProducts.length);
        })
        .catch(error => console.error('Error loading products:', error));

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Clear previous autocomplete suggestions
        autocompleteList.innerHTML = '';
        
        if (searchTerm.length > 0) {
            // Filter matching products
            const matches = allProducts
                .filter(product => product.name && product.name.toLowerCase().includes(searchTerm))
                .slice(0, 5); // Limit to 5 suggestions

            // Add matching suggestions
            matches.forEach(product => {
                const li = document.createElement('li');
                li.textContent = product.name;
                li.addEventListener('click', () => {
                    searchInput.value = product.name;
                    filterResults(product.name.toLowerCase());
                    autocompleteList.innerHTML = ''; // Clear suggestions
                });
                autocompleteList.appendChild(li);
            });
        }

        filterResults(searchTerm);
    });

    // Hide autocomplete when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            autocompleteList.innerHTML = '';
        }
    });

    function filterResults(searchTerm) {
        const items = document.querySelectorAll('.fashion-item');
        let foundItems = 0;
        const container = document.getElementById('fashion-container');
        
        // Remove existing no-results message if it exists
        const existingMessage = container.querySelector('.no-results');
        if (existingMessage) {
            existingMessage.remove();
        }

        items.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            if (searchTerm === '' || name.includes(searchTerm)) {
                item.classList.remove('hidden');
                foundItems++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Show "no results" message if no items were found
        if (foundItems === 0 && searchTerm !== '') {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'Item not found';
            container.appendChild(noResults);
        }
    }
});
