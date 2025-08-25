
let producten = [];

document.addEventListener('DOMContentLoaded', function() {
    laadProducten();
    setupFilters();
});

async function laadProducten() {
    try {
        const response = await fetch('/api/producten');
        if (response.ok) {
            producten = await response.json();
            toonProducten(producten);
        } else {
            toonGeenProducten();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        toonGeenProducten();
    }
}

function toonProducten(productenLijst) {
    const grid = document.getElementById('productenGrid');
    const geenProductenSection = document.getElementById('geenProducten');
    
    if (productenLijst.length === 0) {
        toonGeenProducten();
        return;
    }
    
    geenProductenSection.style.display = 'none';
    
    let html = '';
    productenLijst.forEach(product => {
        html += `
            <div class="product-card" data-merk="${product.merk}" data-conditie="${product.conditie}">
                <img src="${product.afbeelding || '/img/logo.jpeg'}" alt="${product.naam}" class="product-image" onerror="this.src='/img/logo.jpeg'">
                <div class="product-title">${product.naam}</div>
                <div class="product-conditie ${product.conditie.toLowerCase().replace(' ', '-')}">${product.conditie}</div>
                <div class="product-prijs">€${parseFloat(product.prijs).toFixed(2)}</div>
                <div class="product-beschrijving">${product.beschrijving || 'Geen beschrijving beschikbaar'}</div>
                <div class="product-buttons">
                    <a href="contact.html" class="btn btn-primary">Meer info</a>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

function toonGeenProducten() {
    document.getElementById('productenGrid').innerHTML = '';
    document.getElementById('geenProducten').style.display = 'block';
}

function setupFilters() {
    const merkFilter = document.getElementById('merkFilter');
    const conditieFilter = document.getElementById('conditieFilter');
    
    merkFilter.addEventListener('change', filterProducten);
    conditieFilter.addEventListener('change', filterProducten);
}

function filterProducten() {
    const merkFilter = document.getElementById('merkFilter').value;
    const conditieFilter = document.getElementById('conditieFilter').value;
    
    let gefilterdeProducten = producten;
    
    if (merkFilter) {
        gefilterdeProducten = gefilterdeProducten.filter(product => 
            product.merk === merkFilter
        );
    }
    
    if (conditieFilter) {
        gefilterdeProducten = gefilterdeProducten.filter(product => 
            product.conditie === conditieFilter
        );
    }
    
    toonProducten(gefilterdeProducten);
}
