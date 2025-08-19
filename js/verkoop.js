
const telefoonModellen = {
    'Apple': [
        'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
        'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
        'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
        'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
        'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
        'iPhone SE (2022)', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
        'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
        'iPhone 8 Plus', 'iPhone 8', 'iPhone 7 Plus', 'iPhone 7',
        'iPhone SE (2020)', 'iPhone 6s Plus', 'iPhone 6s', 'iPhone 6 Plus', 'iPhone 6',
        'iPhone SE (1st gen)', 'iPhone 5s', 'iPhone 5c', 'iPhone 5',
        'Anders iPhone'
    ],
    'Samsung': [
        'Galaxy Z Fold6', 'Galaxy Z Flip6',
        'Galaxy Z Fold5', 'Galaxy Z Flip5',
        'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
        'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S23 FE',
        'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
        'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy S21 FE',
        'Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20', 'Galaxy S20 FE',
        'Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10+', 'Galaxy Note 10',
        'Galaxy S10+', 'Galaxy S10', 'Galaxy S10e',
        'Galaxy S9+', 'Galaxy S9',
        'Galaxy A75', 'Galaxy A55', 'Galaxy A54', 'Galaxy A53', 'Galaxy A52',
        'Galaxy A35', 'Galaxy A34', 'Galaxy A33', 'Galaxy A25', 'Galaxy A24', 'Galaxy A23', 'Galaxy A22',
        'Galaxy A15', 'Galaxy A14', 'Galaxy A13', 'Galaxy A12',
        'Anders Samsung'
    ],
    'Google': [
        'Pixel 9 Pro Fold', 'Pixel 9 Pro', 'Pixel 9',
        'Pixel 8 Pro', 'Pixel 8',
        'Pixel 7a', 'Pixel 7 Pro', 'Pixel 7',
        'Pixel 6a', 'Pixel 6 Pro', 'Pixel 6',
        'Pixel 5a', 'Pixel 5',
        'Pixel 4a', 'Pixel 4',
        'Pixel 3a', 'Pixel 3',
        'Anders Google'
    ],
    'OnePlus': [
        'OnePlus 12R', 'OnePlus 12', 'OnePlus 11',
        'OnePlus 10 Pro', 'OnePlus 10T',
        'OnePlus 9 Pro', 'OnePlus 9',
        'OnePlus 8T', 'OnePlus 8 Pro', 'OnePlus 8',
        'OnePlus 7T Pro', 'OnePlus 7T', 'OnePlus 7 Pro', 'OnePlus 7',
        'OnePlus 6T', 'OnePlus 6',
        'OnePlus Nord 3', 'OnePlus Nord 2T', 'OnePlus Nord 2', 'OnePlus Nord',
        'OnePlus Nord CE 3', 'OnePlus Nord CE 2', 'OnePlus Nord CE',
        'Anders OnePlus'
    ],
    'Huawei': [
        'P70 Pro', 'P70', 'P60 Pro', 'P60', 'P50 Pro', 'P50',
        'P40 Pro', 'P40', 'P30 Pro', 'P30',
        'Mate 60 Pro+', 'Mate 60 Pro', 'Mate 50 Pro', 'Mate 40 Pro',
        'Nova 12', 'Nova 11', 'Nova 10', 'Nova 9',
        'Y70', 'Y60',
        'Anders Huawei'
    ],
    'Xiaomi': [
        '14 Ultra', '14 Pro', '14',
        '13T Pro', '13T', '13 Pro', '13',
        '12T Pro', '12T', '12 Pro', '12',
        '11T Pro', '11T', '11',
        'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13',
        'Redmi Note 12 Pro', 'Redmi Note 12',
        'Redmi 13C', 'Redmi 12', 'Redmi 11',
        'POCO X6 Pro', 'POCO X6', 'POCO X5 Pro', 'POCO X5',
        'POCO F6 Pro', 'POCO F6', 'POCO F5',
        'Anders Xiaomi'
    ],
    'Oppo': [
        'Find X7 Ultra', 'Find X7', 'Find X6 Pro', 'Find X6',
        'Find X5 Pro', 'Find X5',
        'Reno 11 Pro', 'Reno 11', 'Reno 10 Pro', 'Reno 10',
        'A98', 'A78', 'A58',
        'Anders Oppo'
    ],
    'Sony': [
        'Xperia 1 VI', 'Xperia 1 V', 'Xperia 1 IV',
        'Xperia 5 V', 'Xperia 5 IV',
        'Xperia 10 VI', 'Xperia 10 V', 'Xperia 10 IV',
        'Anders Sony'
    ]
};

const conditieMultipliers = {
    'als-nieuw': 1.0,
    'zeer-goed': 0.85,
    'goed': 0.70,
    'redelijk': 0.55,
    'slecht': 0.30
};

let verkoopPrijzen = {};

document.addEventListener('DOMContentLoaded', function() {
    loadTelefoonMerken();
    loadVerkoopPrijzen();
    laadProducten();
});

function loadTelefoonMerken() {
    const merkSelect = document.getElementById('telefoonMerk');

    Object.keys(telefoonModellen).forEach(merk => {
        const option = document.createElement('option');
        option.value = merk;
        option.textContent = merk;
        merkSelect.appendChild(option);
    });
}

async function loadVerkoopPrijzen() {
    try {
        const response = await fetch('/api/verkoop-prijzen');
        if (response.ok) {
            verkoopPrijzen = await response.json();
        }
    } catch (error) {
        console.error('Error loading sales prices:', error);
    }
}

document.getElementById('telefoonMerk').addEventListener('change', function() {
    const selectedMerk = this.value;
    const modelSelect = document.getElementById('telefoonModel');

    modelSelect.innerHTML = '<option value="">Selecteer model</option>';

    if (selectedMerk && telefoonModellen[selectedMerk]) {
        telefoonModellen[selectedMerk].forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
});

document.getElementById('priceEstimatorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const merk = document.getElementById('telefoonMerk').value;
    const model = document.getElementById('telefoonModel').value;
    const conditie = document.getElementById('conditie').value;
    const opslag = document.getElementById('opslagcapaciteit').value;

    if (!merk || !model || !conditie) {
        alert('Vul alle verplichte velden in');
        return;
    }

    calculatePrice(merk, model, conditie, opslag);
});

function calculatePrice(merk, model, conditie, opslag) {
    const modelKey = `${merk}-${model}`;
    let basisPrijs = 0;

    if (verkoopPrijzen[modelKey]) {
        basisPrijs = verkoopPrijzen[modelKey].prijs;
    } else {
        basisPrijs = getDefaultPrice(merk, model);
    }

    const conditieMultiplier = conditieMultipliers[conditie] || 0.5;
    let finalPrice = basisPrijs * conditieMultiplier;

    if (opslag && opslag !== 'Onbekend') {
        const storageBonus = getStorageBonus(opslag);
        finalPrice += storageBonus * conditieMultiplier;
    }

    finalPrice = Math.round(finalPrice / 5) * 5;

    finalPrice = Math.max(finalPrice, 10);

    displayPrice(finalPrice);
}

function getDefaultPrice(merk, model) {
    const brandBasePrice = {
        'Apple': 400,
        'Samsung': 300,
        'Google': 250,
        'OnePlus': 200,
        'Huawei': 150,
        'Xiaomi': 150
    };

    let basePrice = brandBasePrice[merk] || 100;

    if (model.includes('Pro') || model.includes('Ultra') || model.includes('Max')) {
        basePrice *= 1.5;
    } else if (model.includes('Plus') || model.includes('+')) {
        basePrice *= 1.3;
    }

    if (model.includes('15') || model.includes('24')) {
        basePrice *= 1.4;
    } else if (model.includes('14') || model.includes('23')) {
        basePrice *= 1.2;
    } else if (model.includes('13') || model.includes('22')) {
        basePrice *= 1.0;
    } else if (model.includes('12') || model.includes('21')) {
        basePrice *= 0.8;
    } else if (model.includes('11') || model.includes('20')) {
        basePrice *= 0.6;
    } else {
        basePrice *= 0.4;
    }

    return Math.max(basePrice, 50);
}

function getStorageBonus(opslag) {
    const storageBonus = {
        '32GB': 0,
        '64GB': 10,
        '128GB': 25,
        '256GB': 50,
        '512GB': 75,
        '1TB': 100
    };

    return storageBonus[opslag] || 0;
}

function displayPrice(price) {
    document.getElementById('estimatedPrice').textContent = `€${price}`;
    document.getElementById('priceResult').style.display = 'block';

    document.getElementById('priceResult').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

async function laadProducten() {
    try {
        const response = await fetch('/api/producten');
        const producten = await response.json();

        displayProducten(producten);
    } catch (error) {
        console.error('Fout bij laden van producten:', error);
    }
}

function displayProducten(producten) {
    let productGrid = document.getElementById('productGrid');

    if (!productGrid) {
        const verkoopSection = document.querySelector('#verkoop');
        if (verkoopSection) {
            productGrid = document.createElement('div');
            productGrid.id = 'productGrid';
            productGrid.className = 'product-grid';
            verkoopSection.appendChild(productGrid);
        } else {
            return;
        }
    }

    if (producten.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Geen producten beschikbaar</p>';
        return;
    }

    productGrid.innerHTML = '';

    producten.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const hoofdFoto = product.fotos && product.fotos.length > 0 ? product.fotos[0] : '/img/logo.jpeg';

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${hoofdFoto}" alt="${product.titel}" onclick="window.open('product.html?id=${product.id}', '_blank')">
            </div>
            <div class="product-content">
                <h3>${product.titel}</h3>
                <div class="product-price">€${parseFloat(product.prijs).toFixed(2)}</div>
                <p class="product-description">${product.beschrijving.substring(0, 100)}${product.beschrijving.length > 100 ? '...' : ''}</p>
                <button class="btn btn-primary" onclick="window.open('product.html?id=${product.id}', '_blank')">
                    Bekijk Product
                </button>
            </div>
        `;

        productGrid.appendChild(productCard);
    });
}
