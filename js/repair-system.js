
let currentUser = null;


if (localStorage.getItem('userId')) {
  currentUser = {
    id: localStorage.getItem('userId'),
    username: localStorage.getItem('username')
  };
  showReparatieSection();
} else {
  document.getElementById('loginSection').style.display = 'block';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = {
        id: data.userId,
        username: data.username
      };
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      showReparatieSection();
      showMessage('Succesvol ingelogd!', 'success');
    } else {
      showMessage(data.error, 'error');
    }
  } catch (error) {
    showMessage('Er is een fout opgetreden', 'error');
  }
});


document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = {
        id: data.userId,
        username: data.username
      };
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      showReparatieSection();
      showMessage('Account aangemaakt en ingelogd!', 'success');
    } else {
      showMessage(data.error, 'error');
    }
  } catch (error) {
    showMessage('Er is een fout opgetreden', 'error');
  }
});






// Phone models by brand
const phoneModels = {
  'Apple': ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16', 'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 mini', 'iPhone 13', 'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 mini', 'iPhone 12', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11', 'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X', 'iPhone 8 Plus', 'iPhone 8', 'iPhone 7 Plus', 'iPhone 7', 'iPhone SE (3rd gen)', 'iPhone SE (2nd gen)', 'iPhone SE (1st gen)', 'iPhone 6s Plus', 'iPhone 6s', 'iPhone 6 Plus', 'iPhone 6', 'iPhone 5s', 'iPhone 5c', 'iPhone 5', 'iPhone 4S', 'iPhone 4', 'iPhone 3GS', 'iPhone 3G', 'iPhone (1st gen)'],
  'Samsung': ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22', 'Galaxy S21 FE', 'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy S20 FE', 'Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20', 'Galaxy S10 Lite', 'Galaxy S10+', 'Galaxy S10', 'Galaxy S10e', 'Galaxy S9+', 'Galaxy S9', 'Galaxy S8 Active', 'Galaxy S8+', 'Galaxy S8', 'Galaxy S7 Edge', 'Galaxy S7 Active', 'Galaxy S7', 'Galaxy S6 Edge+', 'Galaxy S6 Edge', 'Galaxy S6 Active', 'Galaxy S6', 'Galaxy S5 Neo', 'Galaxy S5 Active', 'Galaxy S5 mini', 'Galaxy S5', 'Galaxy S4 Zoom', 'Galaxy S4 Active', 'Galaxy S4 mini', 'Galaxy S4', 'Galaxy S3 Neo', 'Galaxy S3 mini', 'Galaxy S3', 'Galaxy S2 Plus', 'Galaxy S2', 'Galaxy S', 'Galaxy Z Fold 6', 'Galaxy Z Fold 5', 'Galaxy Z Fold 4', 'Galaxy Z Fold 3', 'Galaxy Z Fold 2', 'Galaxy Z Fold', 'Galaxy Z Flip 6', 'Galaxy Z Flip 5', 'Galaxy Z Flip 4', 'Galaxy Z Flip 3', 'Galaxy Z Flip', 'Galaxy A73', 'Galaxy A72', 'Galaxy A71', 'Galaxy A70', 'Galaxy A55', 'Galaxy A54', 'Galaxy A53', 'Galaxy A52', 'Galaxy A51', 'Galaxy A50', 'Galaxy A34', 'Galaxy A33', 'Galaxy A32', 'Galaxy A31', 'Galaxy A30', 'Galaxy A25', 'Galaxy A24', 'Galaxy A23', 'Galaxy A22', 'Galaxy A21', 'Galaxy A20', 'Galaxy A15', 'Galaxy A14', 'Galaxy A13', 'Galaxy A12', 'Galaxy A11', 'Galaxy A10', 'Galaxy A9', 'Galaxy A8', 'Galaxy A7', 'Galaxy A6', 'Galaxy A5', 'Galaxy A3', 'Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10 Lite', 'Galaxy Note 10+', 'Galaxy Note 10', 'Galaxy Note 9', 'Galaxy Note 8', 'Galaxy Note FE', 'Galaxy Note 7', 'Galaxy Note 5', 'Galaxy Note Edge', 'Galaxy Note 4', 'Galaxy Note 3 Neo', 'Galaxy Note 3', 'Galaxy Note 2', 'Galaxy Note', 'Galaxy M54', 'Galaxy M53', 'Galaxy M52', 'Galaxy M51', 'Galaxy M50', 'Galaxy M34', 'Galaxy M33', 'Galaxy M32', 'Galaxy M31', 'Galaxy M30', 'Galaxy M23', 'Galaxy M22', 'Galaxy M21', 'Galaxy M20', 'Galaxy M14', 'Galaxy M13', 'Galaxy M12', 'Galaxy M11', 'Galaxy M10', 'Galaxy J8', 'Galaxy J7', 'Galaxy J6', 'Galaxy J5', 'Galaxy J4', 'Galaxy J3', 'Galaxy J2', 'Galaxy J1'],
  'Google': ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8a', 'Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6a', 'Pixel 6 Pro', 'Pixel 6', 'Pixel 5a', 'Pixel 5', 'Pixel 4a 5G', 'Pixel 4a', 'Pixel 4 XL', 'Pixel 4', 'Pixel 3a XL', 'Pixel 3a', 'Pixel 3 XL', 'Pixel 3', 'Pixel 2 XL', 'Pixel 2', 'Pixel XL', 'Pixel', 'Nexus 6P', 'Nexus 5X', 'Nexus 6', 'Nexus 5', 'Nexus 4', 'Nexus S', 'Nexus One'],
  'OnePlus': ['OnePlus 12', 'OnePlus 11', 'OnePlus 10T', 'OnePlus 10 Pro', 'OnePlus 9RT', 'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 8T', 'OnePlus 8 Pro', 'OnePlus 8', 'OnePlus 7T Pro', 'OnePlus 7T', 'OnePlus 7 Pro', 'OnePlus 7', 'OnePlus 6T', 'OnePlus 6', 'OnePlus 5T', 'OnePlus 5', 'OnePlus 3T', 'OnePlus 3', 'OnePlus 2', 'OnePlus One', 'OnePlus Nord 3', 'OnePlus Nord CE 3 Lite', 'OnePlus Nord CE 3', 'OnePlus Nord CE 2 Lite', 'OnePlus Nord CE 2', 'OnePlus Nord 2T', 'OnePlus Nord 2', 'OnePlus Nord CE', 'OnePlus Nord', 'OnePlus Nord N30', 'OnePlus Nord N20', 'OnePlus Nord N10', 'OnePlus Nord N100', 'OnePlus Ace 2V', 'OnePlus Ace 2', 'OnePlus Ace Pro'],
  'Xiaomi': ['Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'Xiaomi 14', 'Xiaomi 13T Pro', 'Xiaomi 13T', 'Xiaomi 13 Ultra', 'Xiaomi 13 Pro', 'Xiaomi 13 Lite', 'Xiaomi 13', 'Xiaomi 12T Pro', 'Xiaomi 12T', 'Xiaomi 12S Ultra', 'Xiaomi 12S Pro', 'Xiaomi 12S', 'Xiaomi 12 Pro', 'Xiaomi 12 Lite', 'Xiaomi 12', 'Xiaomi 11T Pro', 'Xiaomi 11T', 'Xiaomi 11 Ultra', 'Xiaomi 11 Pro', 'Xiaomi 11 Lite NE', 'Xiaomi 11 Lite', 'Xiaomi 11', 'Xiaomi 10T Pro', 'Xiaomi 10T Lite', 'Xiaomi 10T', 'Xiaomi 10S', 'Xiaomi 10 Ultra', 'Xiaomi 10 Pro', 'Xiaomi 10', 'Xiaomi 9T Pro', 'Xiaomi 9T', 'Xiaomi 9 SE', 'Xiaomi 9', 'Xiaomi 8 Pro', 'Xiaomi 8 SE', 'Xiaomi 8', 'Xiaomi 6X', 'Xiaomi 6', 'Xiaomi 5s Plus', 'Xiaomi 5s', 'Xiaomi 5c', 'Xiaomi 5', 'Xiaomi 4c', 'Xiaomi 4i', 'Xiaomi 4', 'Xiaomi 3', 'Xiaomi 2S', 'Xiaomi 2A', 'Xiaomi 2', 'Mi Mix 4', 'Mi Mix 3', 'Mi Mix 2S', 'Mi Mix 2', 'Mi Mix', 'Mi Max 3', 'Mi Max 2', 'Mi Max', 'Mi Note 10 Lite', 'Mi Note 10 Pro', 'Mi Note 10', 'Mi Note 3', 'Mi Note 2', 'Mi Note Pro', 'Mi Note', 'Redmi Note 13 Pro+', 'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12T Pro', 'Redmi Note 12 Pro+', 'Redmi Note 12 Pro', 'Redmi Note 12', 'Redmi Note 11T Pro', 'Redmi Note 11 Pro+', 'Redmi Note 11 Pro', 'Redmi Note 11S', 'Redmi Note 11', 'Redmi Note 10T', 'Redmi Note 10 Pro Max', 'Redmi Note 10 Pro', 'Redmi Note 10S', 'Redmi Note 10', 'Redmi Note 9T', 'Redmi Note 9 Pro Max', 'Redmi Note 9 Pro', 'Redmi Note 9S', 'Redmi Note 9', 'Redmi Note 8T', 'Redmi Note 8 Pro', 'Redmi Note 8', 'Redmi Note 7S', 'Redmi Note 7 Pro', 'Redmi Note 7', 'Redmi Note 6 Pro', 'Redmi Note 6', 'Redmi Note 5 Pro', 'Redmi Note 5A', 'Redmi Note 5', 'Redmi Note 4X', 'Redmi Note 4', 'Redmi Note 3', 'Redmi Note 2', 'Redmi Note', 'Redmi K70 Pro', 'Redmi K70', 'Redmi K60 Ultra', 'Redmi K60 Pro', 'Redmi K60', 'Redmi K50 Ultra', 'Redmi K50 Pro', 'Redmi K50', 'Redmi K40 Ultra', 'Redmi K40 Pro+', 'Redmi K40 Pro', 'Redmi K40', 'Redmi K30 Ultra', 'Redmi K30 Pro', 'Redmi K30', 'Redmi K20 Pro', 'Redmi K20', 'Redmi 13C', 'Redmi 13', 'Redmi 12C', 'Redmi 12', 'Redmi 11 Prime', 'Redmi 10C', 'Redmi 10A', 'Redmi 10', 'Redmi 9T', 'Redmi 9 Prime', 'Redmi 9C', 'Redmi 9A', 'Redmi 9', 'Redmi 8A Pro', 'Redmi 8A', 'Redmi 8', 'Redmi 7A', 'Redmi 7', 'Redmi 6 Pro', 'Redmi 6A', 'Redmi 6', 'Redmi 5 Plus', 'Redmi 5A', 'Redmi 5', 'Redmi 4X', 'Redmi 4A', 'Redmi 4 Prime', 'Redmi 4', 'Redmi 3X', 'Redmi 3S', 'Redmi 3 Pro', 'Redmi 3', 'Redmi 2 Prime', 'Redmi 2A', 'Redmi 2', 'Redmi 1S', 'POCO X6 Pro', 'POCO X6', 'POCO X5 Pro', 'POCO X5', 'POCO X4 Pro', 'POCO X4 GT', 'POCO X3 Pro', 'POCO X3 NFC', 'POCO X3', 'POCO X2', 'POCO M6 Pro', 'POCO M6', 'POCO M5s', 'POCO M5', 'POCO M4 Pro', 'POCO M4', 'POCO M3 Pro', 'POCO M3', 'POCO M2 Pro', 'POCO M2', 'POCO F5 Pro', 'POCO F5', 'POCO F4 GT', 'POCO F4', 'POCO F3 GT', 'POCO F3', 'POCO F2 Pro', 'POCO F1', 'POCO C65', 'POCO C55', 'POCO C50', 'POCO C40', 'POCO C31'],
  'Huawei': ['P60 Pro+', 'P60 Pro', 'P60 Art', 'P60', 'P50 Pro+', 'P50 Pro', 'P50E', 'P50', 'P40 Pro+', 'P40 Pro', 'P40', 'P30 Pro', 'P30 Lite', 'P30', 'P20 Pro', 'P20 Lite', 'P20', 'P10 Plus', 'P10 Lite', 'P10', 'P9 Plus', 'P9 Lite', 'P9', 'P8 Max', 'P8 Lite', 'P8', 'P7', 'P6', 'Mate 60 RS', 'Mate 60 Pro+', 'Mate 60 Pro', 'Mate 60', 'Mate 50 RS', 'Mate 50 Pro', 'Mate 50E', 'Mate 50', 'Mate 40 RS', 'Mate 40 Pro+', 'Mate 40 Pro', 'Mate 40E', 'Mate 40', 'Mate 30 RS', 'Mate 30 Pro', 'Mate 30', 'Mate 20 RS', 'Mate 20 X', 'Mate 20 Pro', 'Mate 20 Lite', 'Mate 20', 'Mate 10 Pro', 'Mate 10 Lite', 'Mate 10', 'Mate 9 Pro', 'Mate 9 Lite', 'Mate 9', 'Mate 8', 'Mate 7', 'Mate S', 'Nova 12 Ultra', 'Nova 12 Pro', 'Nova 12', 'Nova 11 Ultra', 'Nova 11 Pro', 'Nova 11i', 'Nova 11', 'Nova 10 Pro', 'Nova 10', 'Nova 9 Pro', 'Nova 9', 'Nova 8 Pro', 'Nova 8', 'Nova 7 SE', 'Nova 7 Pro', 'Nova 7i', 'Nova 7', 'Nova 6 SE', 'Nova 6', 'Nova 5T Pro', 'Nova 5T', 'Nova 5i Pro', 'Nova 5i', 'Nova 5 Pro', 'Nova 5', 'Nova 4e', 'Nova 4', 'Nova 3i', 'Nova 3', 'Nova 2s', 'Nova 2 Plus', 'Nova 2i', 'Nova 2', 'Nova Plus', 'Nova', 'Honor 90 Pro', 'Honor 90', 'Honor 80 Pro', 'Honor 80', 'Honor 70 Pro+', 'Honor 70 Pro', 'Honor 70', 'Honor 60 Pro+', 'Honor 60 Pro', 'Honor 60', 'Honor 50 Pro+', 'Honor 50 Pro', 'Honor 50', 'Honor 30 Pro+', 'Honor 30 Pro', 'Honor 30S', 'Honor 30', 'Honor 20 Pro', 'Honor 20i', 'Honor 20', 'Honor 10 Lite', 'Honor 10i', 'Honor 10', 'Honor 9X Pro', 'Honor 9X', 'Honor 9 Lite', 'Honor 9i', 'Honor 9', 'Honor 8X Max', 'Honor 8X', 'Honor 8 Pro', 'Honor 8 Lite', 'Honor 8', 'Honor 7X', 'Honor 7C', 'Honor 7A', 'Honor 7', 'Honor 6X', 'Honor 6 Plus', 'Honor 6', 'Honor View 20', 'Honor View 10', 'Honor Magic 5 Pro', 'Honor Magic 5', 'Honor Magic 4 Pro', 'Honor Magic 4', 'Honor Magic 3 Pro+', 'Honor Magic 3 Pro', 'Honor Magic 3', 'Honor Magic 2', 'Honor Magic', 'Y9 Prime 2019', 'Y9s', 'Y9a', 'Y9 2019', 'Y9 2018', 'Y8p', 'Y8s', 'Y7p', 'Y7s', 'Y7a', 'Y7 Prime 2019', 'Y7 Pro 2019', 'Y7 2019', 'Y7 Prime 2018', 'Y7 2018', 'Y7 Prime 2017', 'Y7 2017', 'Y6s 2019', 'Y6 Pro 2019', 'Y6 Prime 2018', 'Y6 2018', 'Y6 Pro 2017', 'Y6 2017', 'Y5 Prime 2018', 'Y5 2019', 'Y5 Lite 2018', 'Y5 2018', 'Y5 2017', 'Y3 2018', 'Y3 2017'],
  'Oppo': ['Find X7 Ultra', 'Find X7 Pro', 'Find X7', 'Find X6 Pro', 'Find X6', 'Find X5 Pro', 'Find X5', 'Find X3 Pro', 'Find X3 Neo', 'Find X3 Lite', 'Find X3', 'Find X2 Pro', 'Find X2 Neo', 'Find X2 Lite', 'Find X2', 'Find X', 'Find 7a', 'Find 7', 'Find 5', 'Find Way', 'Reno 11 Pro', 'Reno 11', 'Reno 10 Pro+', 'Reno 10 Pro', 'Reno 10', 'Reno 9 Pro+', 'Reno 9 Pro', 'Reno 9', 'Reno 8T', 'Reno 8 Pro+', 'Reno 8 Pro', 'Reno 8', 'Reno 7 Pro', 'Reno 7', 'Reno 6 Pro+', 'Reno 6 Pro', 'Reno 6', 'Reno 5 Pro+', 'Reno 5 Pro', 'Reno 5', 'Reno 4 Pro', 'Reno 4', 'Reno 3 Pro', 'Reno 3', 'Reno 2Z', 'Reno 2F', 'Reno 2', 'Reno 10x Zoom', 'Reno', 'A98', 'A96', 'A94', 'A92s', 'A92', 'A91', 'A78', 'A77', 'A76', 'A74', 'A73', 'A72', 'A58', 'A57', 'A56', 'A55', 'A54', 'A53s', 'A53', 'A52', 'A38', 'A36', 'A35', 'A34', 'A33', 'A32', 'A31', 'A18', 'A16s', 'A16', 'A15s', 'A15', 'A12', 'A11x', 'A11', 'A9 2020', 'A9', 'A8', 'A7x', 'A7', 'A5s', 'A5 2020', 'A5', 'A3s', 'A3', 'A1k', 'A1', 'K11', 'K10', 'K9 Pro', 'K9', 'K7x', 'K7', 'K5', 'K3', 'K1', 'F21 Pro', 'F19s', 'F19 Pro+', 'F19 Pro', 'F19', 'F17 Pro', 'F17', 'F15', 'F11 Pro', 'F11', 'F9 Pro', 'F9', 'F7', 'F5', 'F3 Plus', 'F3', 'F1s', 'F1 Plus', 'F1', 'RealMe GT 5 Pro', 'RealMe GT 5', 'RealMe GT Neo 6', 'RealMe GT Neo 5', 'RealMe GT Neo 3T', 'RealMe GT Neo 3', 'RealMe GT Neo 2T', 'RealMe GT Neo 2', 'RealMe GT Neo', 'RealMe GT 2 Pro', 'RealMe GT 2', 'RealMe GT Master', 'RealMe GT', 'RealMe 11 Pro+', 'RealMe 11 Pro', 'RealMe 11', 'RealMe 10 Pro+', 'RealMe 10 Pro', 'RealMe 10', 'RealMe 9 Pro+', 'RealMe 9 Pro', 'RealMe 9i', 'RealMe 9', 'RealMe 8 Pro', 'RealMe 8i', 'RealMe 8', 'RealMe 7 Pro', 'RealMe 7i', 'RealMe 7', 'RealMe 6 Pro', 'RealMe 6i', 'RealMe 6', 'RealMe 5 Pro', 'RealMe 5i', 'RealMe 5s', 'RealMe 5', 'RealMe 3 Pro', 'RealMe 3i', 'RealMe 3', 'RealMe 2 Pro', 'RealMe 2', 'RealMe 1', 'RealMe C67', 'RealMe C65', 'RealMe C63', 'RealMe C55', 'RealMe C53', 'RealMe C51', 'RealMe C35', 'RealMe C33', 'RealMe C31', 'RealMe C25Y', 'RealMe C25s', 'RealMe C25', 'RealMe C21Y', 'RealMe C21', 'RealMe C20', 'RealMe C17', 'RealMe C15', 'RealMe C12', 'RealMe C11', 'RealMe C3', 'RealMe C2', 'RealMe C1'],
  'Nothing': ['Phone (2a)', 'Phone (2)', 'Phone (1)', 'Ear (stick)', 'Ear (2)', 'Ear (1)'],
  'Fairphone': ['Fairphone 5', 'Fairphone 4', 'Fairphone 3+', 'Fairphone 3', 'Fairphone 2', 'Fairphone 1'],
  'Sony': ['Xperia 1 V', 'Xperia 1 IV', 'Xperia 1 III', 'Xperia 1 II', 'Xperia 1', 'Xperia 5 V', 'Xperia 5 IV', 'Xperia 5 III', 'Xperia 5 II', 'Xperia 5', 'Xperia 10 V', 'Xperia 10 IV', 'Xperia 10 III', 'Xperia 10 II', 'Xperia 10', 'Xperia XZ3', 'Xperia XZ2 Premium', 'Xperia XZ2 Compact', 'Xperia XZ2', 'Xperia XZ1 Compact', 'Xperia XZ1', 'Xperia XZs', 'Xperia XZ Premium', 'Xperia XZ', 'Xperia X Performance', 'Xperia X Compact', 'Xperia X', 'Xperia Z5 Premium', 'Xperia Z5 Compact', 'Xperia Z5', 'Xperia Z3+', 'Xperia Z3 Compact', 'Xperia Z3', 'Xperia Z2', 'Xperia Z1 Compact', 'Xperia Z1', 'Xperia Z Ultra', 'Xperia Z', 'Xperia Pro-I', 'Xperia Pro'],
  'LG': ['G8X ThinQ', 'G8s ThinQ', 'G8 ThinQ', 'G7 One', 'G7 ThinQ', 'G6+', 'G6', 'G5 SE', 'G5', 'G4 Stylus', 'G4', 'G3 Stylus', 'G3 Beat', 'G3', 'G2 Mini', 'G2', 'Optimus G Pro', 'Optimus G', 'V60 ThinQ', 'V50 ThinQ', 'V40 ThinQ', 'V35 ThinQ', 'V30+', 'V30', 'V20', 'V10', 'Velvet', 'Wing', 'K92', 'K61', 'K52', 'K51S', 'K51', 'K50S', 'K50', 'K42', 'K41S', 'K40S', 'K40', 'K30 2019', 'K30', 'K20 2019', 'K20', 'K11+', 'K11', 'K10 2018', 'K10 2017', 'K10', 'K8 2018', 'K8 2017', 'K8', 'K7', 'K4 2017', 'K4', 'Q92', 'Q70', 'Q60', 'Q52', 'Q51', 'Stylo 6', 'Stylo 5', 'Stylo 4', 'Stylo 3'],
  'Nokia': ['G60', 'G50', 'G42', 'G22', 'G21', 'G20', 'G11', 'G10', 'X30', 'X20', 'X10', 'C32', 'C31', 'C30', 'C21 Plus', 'C21', 'C20 Plus', 'C20', 'C12', 'C10', 'C5 Endi', 'C3', 'C2', 'C1', '8.3 5G', '5.4', '3.4', '2.4', '1.4', '9 PureView', '8.3', '8.1', '7.2', '7.1', '6.2', '6.1', '5.1', '4.2', '3.1', '2.1', '1', 'Lumia 950 XL', 'Lumia 950', 'Lumia 930', 'Lumia 925', 'Lumia 920', 'Lumia 900', 'Lumia 830', 'Lumia 820', 'Lumia 800', 'Lumia 735', 'Lumia 730', 'Lumia 720', 'Lumia 710', 'Lumia 700', 'Lumia 650', 'Lumia 640 XL', 'Lumia 640', 'Lumia 635', 'Lumia 630', 'Lumia 625', 'Lumia 620', 'Lumia 610', 'Lumia 535', 'Lumia 532', 'Lumia 530', 'Lumia 525', 'Lumia 520', 'Lumia 510'],
  'Motorola': ['Edge 50 Ultra', 'Edge 50 Pro', 'Edge 50', 'Edge 40 Neo', 'Edge 40 Pro', 'Edge 40', 'Edge 30 Ultra', 'Edge 30 Pro', 'Edge 30 Neo', 'Edge 30', 'Edge 20 Pro', 'Edge 20', 'Edge+', 'Edge', 'Razr 50 Ultra', 'Razr 50', 'Razr 40 Ultra', 'Razr 40', 'Razr+', 'Razr 5G', 'Razr 2019', 'G85', 'G84', 'G82', 'G73', 'G72', 'G71', 'G62', 'G60s', 'G60', 'G54', 'G53', 'G52', 'G51', 'G50', 'G42', 'G41', 'G40 Fusion', 'G34', 'G32', 'G31', 'G30', 'G24 Power', 'G24', 'G23', 'G22', 'G21', 'G20', 'G14', 'G13', 'G12', 'G10 Power', 'G10', 'G9 Power', 'G9 Play', 'G9 Plus', 'G8 Power', 'G8 Play', 'G8 Plus', 'G8', 'G7 Power', 'G7 Play', 'G7 Plus', 'G7', 'G6 Play', 'G6 Plus', 'G6', 'G5S Plus', 'G5S', 'G5 Plus', 'G5', 'G4 Play', 'G4 Plus', 'G4', 'Moto X Style', 'Moto X Play', 'Moto X 2014', 'Moto X', 'One Vision', 'One Power', 'One Macro', 'One Hyper', 'One Fusion+', 'One Fusion', 'One Action', 'ThinkPhone', 'Defy 2021'],
  'HTC': ['U23 Pro', 'U20 5G', 'U19e', 'U12+ life', 'U12+', 'U11+ life', 'U11+', 'U11 life', 'U11', 'U Ultra', 'U Play', '10 evo', '10', 'One X10', 'One A9s', 'One A9', 'One M9+', 'One M9', 'One M8s', 'One M8', 'One mini 2', 'One mini', 'One Max', 'One M7', 'One X+', 'One X', 'One V', 'One S', 'Desire 22 Pro', 'Desire 21 Pro', 'Desire 20+', 'Desire 20 Pro', 'Desire 19s', 'Desire 19+', 'Desire 12s', 'Desire 12+', 'Desire 12', 'Desire 10 Pro', 'Desire 10 Lifestyle', 'Desire 830', 'Desire 825', 'Desire 820', 'Desire 816', 'Desire 728', 'Desire 626', 'Desire 620', 'Desire 610', 'Desire 601', 'Desire 600', 'Desire 526', 'Desire 510', 'Desire 500', 'Desire 320', 'Desire 310'],
  'BlackBerry': ['KEY2 LE', 'KEY2', 'KEYone', 'DTEK60', 'DTEK50', 'Priv', 'Passport', 'Classic', 'Leap', 'Z30', 'Z10', 'Q10', 'Q5', 'Curve 9380', 'Curve 9370', 'Curve 9360', 'Curve 9350', 'Curve 9320', 'Torch 9860', 'Torch 9850', 'Torch 9810', 'Torch 9800', 'Bold 9930', 'Bold 9900', 'Bold 9790', 'Bold 9780'],
  'Asus': ['ROG Phone 8 Pro', 'ROG Phone 8', 'ROG Phone 7 Ultimate', 'ROG Phone 7', 'ROG Phone 6 Pro', 'ROG Phone 6', 'ROG Phone 5s Pro', 'ROG Phone 5s', 'ROG Phone 5 Ultimate', 'ROG Phone 5 Pro', 'ROG Phone 5', 'ROG Phone 3', 'ROG Phone 2', 'ROG Phone', 'Zenfone 11 Ultra', 'Zenfone 10', 'Zenfone 9', 'Zenfone 8 Flip', 'Zenfone 8', 'Zenfone 7 Pro', 'Zenfone 7', 'Zenfone 6', 'Zenfone 5Z', 'Zenfone 5', 'Zenfone 4 Pro', 'Zenfone 4', 'Zenfone 3 Ultra', 'Zenfone 3 Deluxe', 'Zenfone 3', 'Zenfone 2', 'Zenfone', 'PadFone X', 'PadFone S', 'PadFone Infinity', 'PadFone 2', 'PadFone'],
  'Vivo': ['X100 Ultra', 'X100 Pro', 'X100', 'X90 Pro+', 'X90 Pro', 'X90', 'X80 Pro', 'X80', 'X70 Pro+', 'X70 Pro', 'X70', 'X60 Pro+', 'X60 Pro', 'X60', 'X51', 'X50 Pro+', 'X50 Pro', 'X50', 'X30 Pro', 'X30', 'X27 Pro', 'X27', 'X23', 'X21', 'X20 Plus', 'X20', 'X9s Plus', 'X9s', 'X9 Plus', 'X9', 'X7 Plus', 'X7', 'X6 Plus', 'X6', 'X5 Pro', 'X5Max', 'X5', 'X3', 'iQOO 12 Pro', 'iQOO 12', 'iQOO 11 Pro', 'iQOO 11', 'iQOO 10 Pro', 'iQOO 10', 'iQOO 9 Pro', 'iQOO 9', 'iQOO 8 Pro', 'iQOO 8', 'iQOO 7', 'iQOO 5 Pro', 'iQOO 5', 'iQOO 3', 'iQOO', 'iQOO Neo 9 Pro', 'iQOO Neo 9', 'iQOO Neo 8 Pro', 'iQOO Neo 8', 'iQOO Neo 7 Pro', 'iQOO Neo 7', 'iQOO Neo 6', 'iQOO Neo 5', 'iQOO Neo 3', 'iQOO Z9', 'iQOO Z8', 'iQOO Z7', 'iQOO Z6', 'iQOO Z5', 'iQOO Z3', 'iQOO Z1', 'V30 Pro', 'V30', 'V29 Pro', 'V29', 'V27 Pro', 'V27', 'V25 Pro', 'V25', 'V23 Pro', 'V23', 'V21e', 'V21', 'V20 SE', 'V20', 'V19', 'V17 Pro', 'V17', 'V15 Pro', 'V15', 'V11 Pro', 'V11', 'V9', 'V7+', 'V7', 'V5 Plus', 'V5', 'V3Max', 'V3', 'Y100t', 'Y100', 'Y78+', 'Y78', 'Y77', 'Y76s', 'Y76', 'Y75s', 'Y75', 'Y74s', 'Y73s', 'Y73', 'Y72 5G', 'Y72', 'Y71', 'Y70s', 'Y70', 'Y69', 'Y67', 'Y66', 'Y65', 'Y55s', 'Y55', 'Y53s', 'Y53', 'Y51', 'Y50', 'Y36', 'Y35', 'Y33s', 'Y33', 'Y31', 'Y30', 'Y28', 'Y27', 'Y22s', 'Y22', 'Y21s', 'Y21', 'Y20s', 'Y20', 'Y19', 'Y17', 'Y16', 'Y15', 'Y12s', 'Y12', 'Y11', 'Y9s', 'Y9', 'Y7s', 'Y7', 'Y6', 'Y5s', 'Y3', 'Y1s'],
  'TCL': ['50 Pro NXTPAPER', '50 C755', '50 SE', '50', '40 SE', '40 R', '40 NXTPAPER', '30 XE', '30 SE', '30 5G', '30+', '30', '20 Pro 5G', '20 SE', '20 5G', '20+', '20', '10 TabMax', '10 Plus', '10 SE', '10 5G', '10', 'Plex', '305i', '305', '403'],
  'Honor': ['Magic 6 Ultimate', 'Magic 6 Pro', 'Magic 6', 'Magic 5 Ultimate', 'Magic 5 Pro', 'Magic 5', 'Magic 4 Ultimate', 'Magic 4 Pro', 'Magic 4', 'Magic 3 Ultimate', 'Magic 3 Pro+', 'Magic 3 Pro', 'Magic 3', '200 Pro', '200', '200 Lite', '100 Pro', '100', '90 Pro', '90', '90 Lite', '80 Pro', '80', '80 SE', '70 Pro', '70', '70 Lite', '60 Pro', '60', '60 SE', '50 Pro', '50', '50 Lite', 'X50i+', 'X50i', 'X50', 'X40i', 'X40', 'X30i', 'X30', 'X20 SE', 'X20', 'X10 Max', 'X10', 'X9b', 'X9a', 'X9', 'X8b', 'X8a', 'X8', 'X7b', 'X7a', 'X7', 'X6a', 'X6', 'X5', 'Play 8T', 'Play 7T Pro', 'Play 7T', 'Play 6T Pro', 'Play 6T', 'Play 40C', 'Play 40A', 'Play 40', 'Play 30 Plus', 'Play 30', 'Play 20e', 'Play 20', 'Play 8A', 'Play 8', 'Play 7C', 'Play 7A', 'Play 7', 'Play 6C', 'Play 6A', 'Play 6', 'Play 5T Pro', 'Play 5T', 'Play 5A', 'Play 5', 'Play 4T Pro', 'Play 4T', 'Play 4C', 'Play 4A', 'Play 4', 'Play 3e', 'Play 3', 'Pad X9', 'Pad X8a', 'Pad X8', 'Pad V8 Pro', 'Pad V8', 'Pad V7 Pro', 'Pad V7', 'Pad V6', 'Pad 9', 'Pad 8', 'View 20', 'View 10 Lite', 'View 10']
};

// Add event listener for phone brand selection
document.getElementById('telefoonMerk').addEventListener('change', function() {
  const merkSelect = this;
  const modelSelect = document.getElementById('telefoonModel');
  const andersTelefoonBeschrijving = document.getElementById('andersTelefoonBeschrijving');
  
  if (merkSelect.value === '') {
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="">Selecteer eerst een merk</option>';
    andersTelefoonBeschrijving.style.display = 'none';
    document.getElementById('andersTelefoonTekst').required = false;
  } else if (merkSelect.value === 'Anders') {
    modelSelect.disabled = true;
    modelSelect.innerHTML = '<option value="Anders telefoon">Anders telefoon</option>';
    modelSelect.value = 'Anders telefoon';
    andersTelefoonBeschrijving.style.display = 'block';
    document.getElementById('andersTelefoonTekst').required = true;
  } else {
    modelSelect.disabled = false;
    modelSelect.innerHTML = '<option value="">Selecteer model</option>';
    
    const models = phoneModels[merkSelect.value] || [];
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = `${merkSelect.value} ${model}`;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
    
    andersTelefoonBeschrijving.style.display = 'none';
    document.getElementById('andersTelefoonTekst').required = false;
  }
});

// Add event listener for "Anders" radio button
document.querySelectorAll('input[name="probleem"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const andersBeschrijving = document.getElementById('andersBeschrijving');
    if (this.value === 'Anders') {
      andersBeschrijving.style.display = 'block';
      document.getElementById('andersTekst').required = true;
    } else {
      andersBeschrijving.style.display = 'none';
      document.getElementById('andersTekst').required = false;
    }
  });
});

document.getElementById('repairForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!currentUser) {
    showMessage('Je moet ingelogd zijn', 'error');
    return;
  }
  
  // Validate form data
  const klantNaam = document.getElementById('klantNaam').value;
  const telefoonMerk = document.getElementById('telefoonMerk').value;
  const telefoonModel = document.getElementById('telefoonModel').value;
  const probleem = document.querySelector('input[name="probleem"]:checked');
  const beschrijving = document.getElementById('beschrijving').value;
  const datum = document.getElementById('datum').value;
  const tijd = document.getElementById('tijd').value;
  
  if (!klantNaam || !telefoonMerk || !telefoonModel || !probleem || !datum || !tijd) {
    showMessage('Vul alle verplichte velden in', 'error');
    return;
  }
  
  // If "Anders telefoon" is selected, check if description is provided
  if (telefoonModel === 'Anders telefoon') {
    const andersTelefoonTekst = document.getElementById('andersTelefoonTekst').value;
    if (!andersTelefoonTekst.trim()) {
      showMessage('Vul het telefoon model in als je "Anders" selecteert', 'error');
      return;
    }
  }
  
  // If "Anders" is selected, check if description is provided
  if (probleem.value === 'Anders') {
    const andersTekst = document.getElementById('andersTekst').value;
    if (!andersTekst.trim()) {
      showMessage('Beschrijf het probleem als je "Anders" selecteert', 'error');
      return;
    }
  }
  
  // Show confirmation section
  toonBevestiging(klantNaam, telefoonModel, probleem.value, beschrijving, datum, tijd);
});

function toonBevestiging(klantNaam, telefoonModel, probleem, beschrijving, datum, tijd) {
  // Hide form, show confirmation
  document.getElementById('reparatieForm').style.display = 'none';
  document.getElementById('bevestigingSection').style.display = 'block';
  
  // Format date for display
  const datumFormatted = new Date(datum).toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format phone model description
  let telefoonModelTekst = telefoonModel;
  if (telefoonModel === 'Anders telefoon') {
    const andersTelefoonTekst = document.getElementById('andersTelefoonTekst').value;
    telefoonModelTekst = andersTelefoonTekst;
  }
  
  // Format problem description
  let probleemTekst = probleem;
  if (probleem === 'Anders') {
    const andersTekst = document.getElementById('andersTekst').value;
    probleemTekst = `Anders: ${andersTekst}`;
  }
  
  // Fill confirmation details
  document.getElementById('confirmKlantNaam').textContent = klantNaam;
  document.getElementById('confirmTelefoonModel').textContent = telefoonModelTekst;
  document.getElementById('confirmProbleem').textContent = probleemTekst;
  document.getElementById('confirmBeschrijving').textContent = beschrijving || 'Geen extra opmerkingen';
  document.getElementById('confirmDatum').textContent = datumFormatted;
  document.getElementById('confirmTijd').textContent = tijd;
}

function wijzigGegevens() {
  // Show form, hide confirmation
  document.getElementById('reparatieForm').style.display = 'block';
  document.getElementById('bevestigingSection').style.display = 'none';
}

async function bevestigReparatie() {
  if (!currentUser) {
    showMessage('Je moet ingelogd zijn', 'error');
    return;
  }
  
  const klantNaam = document.getElementById('klantNaam').value;
  const telefoonModel = document.getElementById('telefoonModel').value;
  const probleem = document.querySelector('input[name="probleem"]:checked').value;
  const beschrijving = document.getElementById('beschrijving').value;
  const datum = document.getElementById('datum').value;
  const tijd = document.getElementById('tijd').value;
  
  // Create phone model description
  let telefoonModelTekst = telefoonModel;
  if (telefoonModel === 'Anders telefoon') {
    const andersTelefoonTekst = document.getElementById('andersTelefoonTekst').value;
    telefoonModelTekst = andersTelefoonTekst;
  }
  
  // Create full description
  let volledigeBeschrijving = `Telefoon: ${telefoonModelTekst} | Probleem: ${probleem}`;
  if (probleem === 'Anders') {
    const andersTekst = document.getElementById('andersTekst').value;
    volledigeBeschrijving = `Telefoon: ${telefoonModelTekst} | Probleem: Anders: ${andersTekst}`;
  }
  if (beschrijving.trim()) {
    volledigeBeschrijving += ` | Extra opmerkingen: ${beschrijving}`;
  }
  
  try {
    const response = await fetch('/api/reparaties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        klantNaam,
        beschrijving: volledigeBeschrijving,
        datum,
        tijd,
        userId: currentUser.id
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showMessage('Reparatie succesvol ingepland!', 'success');
      
      // Reset form and views
      document.getElementById('repairForm').reset();
      document.getElementById('tijd').innerHTML = '<option value="">Selecteer eerst een datum</option>';
      document.getElementById('andersTelefoonBeschrijving').style.display = 'none';
      document.getElementById('andersTelefoonTekst').required = false;
      document.getElementById('andersBeschrijving').style.display = 'none';
      document.getElementById('andersTekst').required = false;
      document.getElementById('reparatieForm').style.display = 'block';
      document.getElementById('bevestigingSection').style.display = 'none';
    } else {
      showMessage(data.error, 'error');
    }
  } catch (error) {
    showMessage('Er is een fout opgetreden', 'error');
  }
}


document.getElementById('datum').addEventListener('change', async (e) => {
  const datum = e.target.value;
  
  if (!datum) {
    document.getElementById('tijd').innerHTML = '<option value="">Selecteer eerst een datum</option>';
    return;
  }
  
  try {
    const response = await fetch(`/api/beschikbare-tijden/${datum}`);
    const tijden = await response.json();
    
    const tijdSelect = document.getElementById('tijd');
    tijdSelect.innerHTML = '<option value="">Selecteer een tijd</option>';
    
    tijden.forEach(tijd => {
      const option = document.createElement('option');
      option.value = tijd;
      option.textContent = tijd;
      tijdSelect.appendChild(option);
    });
    
    if (tijden.length === 0) {
      tijdSelect.innerHTML = '<option value="">Geen beschikbare tijden</option>';
    }
  } catch (error) {
    document.getElementById('tijd').innerHTML = '<option value="">Fout bij laden van tijden</option>';
  }
});

function showReparatieSection() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('reparatieSection').style.display = 'block';
  document.getElementById('welcomeUser').textContent = currentUser.username;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  window.location.reload();
}

function showMessage(message, type = 'info') {
  const messageDiv = document.getElementById('message');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = '';
  }, 5000);
}
