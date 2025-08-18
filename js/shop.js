document.addEventListener('DOMContentLoaded', () => {

    // Simuleer een JSON-antwoord van de backend
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
        // Voeg hier meer producten toe
    ];

    const productContainer = document.getElementById('product-container');

    // Functie om een productkaart te creëren
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // De "Bekijk product" knop linkt naar product.html met de product ID als parameter
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

    // Loop over de producten en voeg ze toe aan de container
    products.forEach(product => {
        const card = createProductCard(product);
        productContainer.appendChild(card);
    });

    // Event listener voor de "Voeg toe aan winkelwagen" knop
    productContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = event.target.dataset.productId;
            alert(`Product met ID ${productId} is toegevoegd aan de winkelwagen!`);
            // Hier komt later de logica om het product toe te voegen aan de winkelwagen
        }
    });

});