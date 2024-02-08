const debounceSearch = debounce(searchProducts, 200);
var divContainer = document.getElementById("containeritems");
var searchForm = document.getElementById("searchForm");
var searchInput = document.getElementById("searchInput");
const pageCategory = getPageCategory();

function loadApi() {
    fetch('https://mocki.io/v1/5c698084-1e13-4abb-be1d-360d47c5a168')
        .then(response => response.json())
        .then(data => {
            if (pageCategory === 'Hoodie') {
                displayProducts(data.filter(item => item.category === 'Hoodie'));
            } else if (pageCategory === 'Pants') {
                displayProducts(data.filter(item => item.category === 'Pants'));
            } else if (pageCategory === 'Backpack') {
                displayProducts(data.filter(item => item.category === 'Backpack'));
            } else if (pageCategory === 'Belts') {
                displayProducts(data.filter(item => item.category === 'Belts'));
            } else if (pageCategory === 'Shoes') {
                displayProducts(data.filter(item => item.category === 'Shoes'));
            } else if (pageCategory === 'Socks') {
                displayProducts(data.filter(item => item.category === 'Socks'));
            } else {
                displayProducts(data);
            }
        });
}

function getProductsHoodie() {
    fetch('https://mocki.io/v1/5c698084-1e13-4abb-be1d-360d47c5a168', { method: 'get' })
        .then(response => response.json())
        .then(data => {
            // Display only Hoodie products
            displayProducts(data.filter(item => item.category === 'Hoodie'));
        });
}

function getProductsPants() {
    fetch('https://mocki.io/v1/5c698084-1e13-4abb-be1d-360d47c5a168', { method: 'get' })
        .then(response => response.json())
        .then(data => {
            // Display only Pants products
            displayProducts(data.filter(item => item.category === 'Pants'));
        });
}

function getProductsBackpack() {
    fetch('https://mocki.io/v1/5c698084-1e13-4abb-be1d-360d47c5a168', { method: 'get' })
        .then(response => response.json())
        .then(data => {
            // Display only Pants Backpack
            displayProducts(data.filter(item => item.category === 'Backpack'));
        });
}

function getProductsBelts() {
    fetch('https://mocki.io/v1/5c698084-1e13-4abb-be1d-360d47c5a168', { method: 'get' })
        .then(response => response.json())
        .then(data => {
            // Display only Belts products
            displayProducts(data.filter(item => item.category === 'Belts'));
        });
}

function getProductsShoes() {
    fetch('https://mocki.io/v1/5c698084-1e13-4abb-be1d-360d47c5a168', { method: 'get' })
        .then(response => response.json())
        .then(data => {
            // Display only Shoes products
            displayProducts(data.filter(item => item.category === 'Shoes'));
        });
}

function getProductsSocks() {
    fetch('https://mocki.io/v1/5c698084-1e13-4abb-be1d-360d47c5a168', { method: 'get' })
        .then(response => response.json())
        .then(data => {
            // Display only Socks products
            displayProducts(data.filter(item => item.category === 'Socks'));
        });
}

function displayProducts(data) {
    divContainer.innerHTML = ''; // Clear the container before adding new items

    if (data.length === 0) {
        // No matching products found
        divContainer.innerHTML = 'No products found.';
        return;
    }

    data.forEach(item => {
        const { name, price, imgSrc, category } = item;
        const productElement = createProductElement(name, price, imgSrc, category);
        divContainer.appendChild(productElement);
    });
}

function createProductElement(title, price, thumbnail) {
    const divPrd = document.createElement("div");
    divPrd.classList.add("item");
    divPrd.innerHTML = `
        <div class="product-title">${title}</div>
        <div class="product-price">${price}</div>
        <img class='img_item' src='${thumbnail}' loading='lazy'>
        <button class="add-to-cart-button" onclick="addToCart('${title}', '${price}', '${thumbnail}')">Add to Cart</button>
    `;
    return divPrd;
}
function searchProducts(query) {
    fetch('https://mocki.io/v1/5c698084-1e13-4abb-be1d-360d47c5a168', { method: 'get' })
        .then(response => response.json())
        .then(Data => {
            divContainer.innerHTML = '';

            const isProductsPage = window.location.pathname.includes('Products.html');
            
            const filteredData = Data.filter(item =>
                (isProductsPage || item.category === pageCategory) &&
                (item.name.toLowerCase().includes(query.toLowerCase()) ||
                    item.price.toString().includes(query))
            );

            if (filteredData.length === 0) {
                // No matching products found
                if (isProductsPage) {
                    // If it's the Products Page, display "No products found."
                    divContainer.innerHTML = 'No products found.';
                    return;
                }
            }
            
            // If there are matching products, proceed to display them
            filteredData.forEach(item => {
                const { name, price, imgSrc, category } = item;
                const productElement = createProductElement(name, price, imgSrc, category);
                divContainer.appendChild(productElement);
            });
        });
}

function debounce(func, delay) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

window.onload = function () {
    if (pageCategory === 'Hoodie') {
        getProductsHoodie();
    } else if (pageCategory === 'Pants') {
        getProductsPants();
    }else if (pageCategory === 'Backpack') {
        getProductsBackpack();
    }else if (pageCategory === 'Belts') {
        getProductsBelts();
    }else if (pageCategory === 'Shoes') {
        getProductsShoes();
    }else if (pageCategory === 'Socks') {
        getProductsSocks();
    } else {
        loadApi();
    }

    // Add submit event listener to the search form
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        var searchTerm = searchInput.value;
        searchProducts(searchTerm);
    });

    // Add input event listener to the search input
    searchInput.addEventListener('input', function () {
        var searchTerm = searchInput.value;
        debounceSearch(searchTerm);
    });    
};

function getPageCategory() { 
    // Get the current page URL 
    const currentPageUrl = window.location.pathname; 
     
    // Extract the category from the URL (assuming URLs like "Products.html" and "Hoodie.html") 
    const categoryMatch = currentPageUrl.match(/\/(\w+)\.html/); 
     
    // Return the category or a default value (e.g., 'All' or 'Products') 
    return categoryMatch ? categoryMatch[1] : '/Products.html'; 
}