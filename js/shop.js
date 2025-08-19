
document.addEventListener('DOMContentLoaded', () => {

    const products = [
        {
            id: 1,
            name: "iPhone 15",
            price: 999.00,
            image: "https://via.placeholder.com/300x300.png?text=iPhone+15"
        },
        {
            id: 2,
            name: "Samsung Galaxy S24",
            price: 899.00,
            image: "https://via.placeholder.com/300x300.png?text=Samsung+Galaxy+S24"
        },
        {
            id: 3,
            name: "Google Pixel 8",
            price: 759.00,
            image: "https://via.placeholder.com/300x300.png?text=Google+Pixel+8"
        }
    ];

    const productContainer = document.getElementById('product-container');

    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">€ ${product.price.toFixed(2)}</p>
                <a href="product.html?id=${product.id}" class="view-product-btn">Bekijk product</a>
                <button class="add-to-cart-btn" data-product-id="${product.id}">Voeg toe aan winkelwagen</button>
            </div>
        `;
        return productCard;
    }

    products.forEach(product => {
        const card = createProductCard(product);
        productContainer.appendChild(card);
    });

    productContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = event.target.dataset.productId;
            alert(`Product met ID ${productId} is toegevoegd aan de winkelwagen!`);
        }
    });

});
