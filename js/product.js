
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showProductNotFound();
        return;
    }
    
    laadProduct(productId);
});

async function laadProduct(productId) {
    try {
        const response = await fetch(`/api/producten/${productId}`);
        
        if (!response.ok) {
            showProductNotFound();
            return;
        }
        
        const product = await response.json();
        displayProduct(product);
        
    } catch (error) {
        console.error('Fout bij laden van product:', error);
        showProductNotFound();
    }
}

function displayProduct(product) {
    // Hide loading and show product details
    const loadingEl = document.getElementById('productLoading');
    const detailsEl = document.getElementById('productDetails');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (detailsEl) detailsEl.style.display = 'block';
    
    // Set product title
    const titleEl = document.getElementById('productTitle');
    if (titleEl) titleEl.textContent = product.titel;
    
    // Set product price
    const priceEl = document.getElementById('productPrice');
    if (priceEl) priceEl.textContent = `€${parseFloat(product.prijs).toFixed(2)}`;
    
    // Set product description
    const descEl = document.getElementById('productDescription');
    if (descEl) descEl.textContent = product.beschrijving;
    
    // Handle images
    if (product.fotos && product.fotos.length > 0) {
        const mainImageEl = document.getElementById('mainImage');
        const thumbnailGalleryEl = document.getElementById('thumbnailGallery');
        
        if (mainImageEl) {
            mainImageEl.src = product.fotos[0];
            mainImageEl.alt = product.titel;
        }
        
        if (thumbnailGalleryEl && product.fotos.length > 1) {
            thumbnailGalleryEl.innerHTML = '';
            product.fotos.forEach((foto, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = foto;
                thumbnail.alt = `${product.titel} foto ${index + 1}`;
                thumbnail.className = 'thumbnail';
                thumbnail.onclick = () => changeMainImage(foto);
                thumbnailGalleryEl.appendChild(thumbnail);
            });
        }
    } else {
        // Use default image if no photos
        const mainImageEl = document.getElementById('mainImage');
        if (mainImageEl) {
            mainImageEl.src = '/img/logo.jpeg';
            mainImageEl.alt = product.titel;
        }
    }
}

function changeMainImage(imageSrc) {
    const mainImageEl = document.getElementById('mainImage');
    if (mainImageEl) {
        mainImageEl.src = imageSrc;
    }
}

function showProductNotFound() {
    const loadingEl = document.getElementById('productLoading');
    const notFoundEl = document.getElementById('productNotFound');
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (notFoundEl) notFoundEl.style.display = 'block';
}
