let currentUser = null;

// Check if user is logged in
if (localStorage.getItem('userId')) {
  currentUser = {
    id: localStorage.getItem('userId'),
    username: localStorage.getItem('username')
  };
  showAccountSection();
} else {
  document.getElementById('loginSection').style.display = 'block';
}

// Login form
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

    if (response.ok) {
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      currentUser = { id: data.userId, username: data.username };
      showAccountSection();
    } else {
      showMessage(data.error, 'error');
    }
  } catch (error) {
    showMessage('Er is een fout opgetreden', 'error');
  }
});

// Register form
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

    if (response.ok) {
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      currentUser = { id: data.userId, username: data.username };
      showAccountSection();
    } else {
      showMessage(data.error, 'error');
    }
  } catch (error) {
    showMessage('Er is een fout opgetreden', 'error');
  }
});

function showAccountSection() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('accountSection').style.display = 'block';
  document.getElementById('welcomeUser').textContent = currentUser.username;
  laadMijnReparaties();
  laadMijnOffertes();
}

function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  currentUser = null;
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('accountSection').style.display = 'none';
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  showMessage('Succesvol uitgelogd!', 'success');
}

// ✅ Status vertaal functie
function vertaalStatus(status) {
  switch (status) {
    case 'Pending':
      return 'In afwachting';
    case 'Geaccepteerd':
      return 'Geaccepteerd';
    case 'Afgewezen':
      return 'Afgewezen';
    default:
      return status || 'Onbekend';
  }
}

async function laadMijnReparaties() {
  if (!currentUser) {
    document.getElementById('reparatiesLijst').innerHTML = '<p style="color: red;">Je moet ingelogd zijn</p>';
    return;
  }

  try {
    const response = await fetch(`/api/reparaties/user/${currentUser.id}`);
    const reparaties = await response.json();

    if (reparaties.length === 0) {
      document.getElementById('reparatiesLijst').innerHTML = '<p>Je hebt nog geen reparaties gepland</p>';
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Klant</th>
            <th>Beschrijving</th>
            <th>Datum</th>
            <th>Start Tijd</th>
            <th>Eind Tijd</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    reparaties.forEach(reparatie => {
      html += `
        <tr>
          <td>${reparatie.id}</td>
          <td>${reparatie.klantNaam}</td>
          <td>${reparatie.beschrijving || 'Geen beschrijving'}</td>
          <td>${reparatie.datum}</td>
          <td>${reparatie.tijd}</td>
          <td>${reparatie.eindTijd}</td>
          <td>
            <span class="status ${reparatie.status.toLowerCase()}">${vertaalStatus(reparatie.status)}</span>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    document.getElementById('reparatiesLijst').innerHTML = html;

  } catch (error) {
    document.getElementById('reparatiesLijst').innerHTML = '<p style="color: red;">Fout bij laden van reparaties</p>';
  }
}

async function laadMijnOffertes() {
  if (!currentUser) {
    document.getElementById('offertesLijst').innerHTML = '<p style="color: red;">Je moet ingelogd zijn</p>';
    return;
  }

  try {
    const response = await fetch(`/api/reparaties/user/${currentUser.id}/offertes`);
    const offertes = await response.json();

    if (offertes.length === 0) {
      document.getElementById('offertesLijst').innerHTML = '<p>Je hebt geen offertes ontvangen voor je afspraken</p>';
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>Afspraak ID</th>
            <th>Klant</th>
            <th>Probleem</th>
            <th>Werkzaamheden</th>
            <th>Prijs</th>
            <th>Status</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
    `;

    offertes.forEach(offerte => {
      const statusClass = offerte.offerteStatus === 'Geaccepteerd' ? 'status-geaccepteerd' : 
                          offerte.offerteStatus === 'Afgewezen' ? 'status-afgewezen' : 'status-pending';

      const acties = offerte.offerteStatus === 'Pending' ? 
        `<button class="btn" onclick="bekijkOfferteDetails(${offerte.id})">Bekijk & Accepteer</button>` :
        `<button class="btn btn-secondary" onclick="bekijkOfferteDetails(${offerte.id})">Bekijk</button>`;

      html += `
        <tr>
          <td>${offerte.id}</td>
          <td>${offerte.klantNaam}</td>
          <td>${offerte.offerteProbleem ? (offerte.offerteProbleem.length > 30 ? offerte.offerteProbleem.substring(0, 30) + '...' : offerte.offerteProbleem) : 'Geen beschrijving'}</td>
          <td>${offerte.offerteWerkzaamheden ? (offerte.offerteWerkzaamheden.length > 30 ? offerte.offerteWerkzaamheden.substring(0, 30) + '...' : offerte.offerteWerkzaamheden) : 'Geen beschrijving'}</td>
          <td>€${parseFloat(offerte.offertePrijs || 0).toFixed(2)}</td>
          <td>
            <span class="status ${statusClass.replace('status-', '')}">${vertaalStatus(offerte.offerteStatus)}</span>
          </td>
          <td>${acties}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    document.getElementById('offertesLijst').innerHTML = html;

  } catch (error) {
    document.getElementById('offertesLijst').innerHTML = '<p style="color: red;">Fout bij laden van offertes</p>';
  }
}

async function bekijkOfferteDetails(afspraakId) {
  if (!currentUser) return;

  try {
    const response = await fetch(`/api/reparaties/${afspraakId}`);
    const reparatie = await response.json();

    if (!reparatie.offerteProbleem) {
      alert('Geen offerte gevonden voor deze afspraak');
      return;
    }

    const kanAccepteren = reparatie.offerteStatus === 'Pending';

    const modal = document.createElement('div');
    modal.className = 'offerte-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="this.closest('.offerte-modal').remove()">&times;</span>
        <h2>Offerte voor Afspraak #${reparatie.id}</h2>
        <div class="offerte-details">
          <p><strong>Klant:</strong> ${reparatie.klantNaam}</p>
          <p><strong>Afspraak datum:</strong> ${reparatie.datum} om ${reparatie.tijd}</p>
          <div>
            <strong>Oorspronkelijke beschrijving:</strong>
            <div class="beschrijving-box">${reparatie.beschrijving}</div>
          </div>
          <div>
            <strong>Probleem Analyse:</strong>
            <div class="beschrijving-box">${reparatie.offerteProbleem}</div>
          </div>
          <div>
            <strong>Voorgestelde Werkzaamheden:</strong>
            <div class="beschrijving-box">${reparatie.offerteWerkzaamheden}</div>
          </div>
          <p><strong>Prijs:</strong> <span class="prijs">€${parseFloat(reparatie.offertePrijs).toFixed(2)}</span></p>
          <p><strong>Status:</strong> ${vertaalStatus(reparatie.offerteStatus)}</p>
        </div>
        ${kanAccepteren ? `
          <div class="offerte-acties">
            <button class="btn btn-success" onclick="accepteerAfspraakOfferte(${reparatie.id})">Accepteren</button>
            <button class="btn btn-danger" onclick="weigerAfspraakOfferte(${reparatie.id})">Afwijzen</button>
          </div>
        ` : ''}
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .offerte-modal {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8); z-index: 9999;
        display: flex; align-items: center; justify-content: center; padding: 20px;
      }
      .modal-content {
        background: white; border-radius: 8px; padding: 30px; max-width: 600px; width: 100%;
        max-height: 80vh; overflow-y: auto; position: relative;
      }
      .close {
        position: absolute; top: 15px; right: 20px; font-size: 28px; font-weight: bold;
        cursor: pointer; color: #aaa;
      }
      .close:hover { color: #000; }
      .beschrijving-box {
        background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 5px;
        white-space: pre-line; line-height: 1.6;
      }
      .prijs { font-size: 24px; font-weight: bold; color: #007bff; }
      .offerte-acties { margin-top: 20px; text-align: center; }
      .offerte-acties .btn { margin: 0 10px; }
      .btn-success { background: #28a745; }
      .btn-success:hover { background: #218838; }
      .btn-danger { background: #dc3545; }
      .btn-danger:hover { background: #c82333; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
  } catch (error) {
    alert('Fout bij laden van offerte details');
  }
}

async function accepteerAfspraakOfferte(afspraakId) {
  if (!currentUser) return;

  if (confirm('Weet je zeker dat je deze offerte wilt accepteren?')) {
    try {
      const response = await fetch(`/api/reparaties/${afspraakId}/offerte/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Offerte geaccepteerd! We gaan aan de slag met je reparatie.');
        document.querySelector('.offerte-modal').remove();
        laadMijnOffertes();
        laadMijnReparaties();
      } else {
        const error = await response.json();
        alert('Fout: ' + error.error);
      }
    } catch (error) {
      alert('Fout bij accepteren van offerte');
    }
  }
}

async function weigerAfspraakOfferte(afspraakId) {
  if (!currentUser) return;

  if (confirm('Weet je zeker dat je deze offerte wilt afwijzen?')) {
    try {
      const response = await fetch(`/api/reparaties/${afspraakId}/offerte/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Offerte afgewezen.');
        document.querySelector('.offerte-modal').remove();
        laadMijnOffertes();
      } else {
        const error = await response.json();
        alert('Fout: ' + error.error);
      }
    } catch (error) {
      alert('Fout bij afwijzen van offerte');
    }
  }
}

function showMessage(message, type) {
  const messageEl = document.getElementById('message');
  messageEl.innerHTML = `<p class="${type}">${message}</p>`;
  setTimeout(() => {
    messageEl.innerHTML = '';
  }, 5000);
}
