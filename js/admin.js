let isAdminLoggedIn = false;


document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('adminPassword').value;

  try {
    const response = await fetch('/api/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    const result = await response.json();

    if (response.ok) {
      isAdminLoggedIn = true;
      showAdminPanel();
      document.getElementById('loginMessage').innerHTML = '<p style="color: green;">Admin toegang verleend!</p>';
    } else {
      document.getElementById('loginMessage').innerHTML = '<p style="color: red;">Fout: ' + result.error + '</p>';
    }
  } catch (error) {
    document.getElementById('loginMessage').innerHTML = '<p style="color: red;">Er is een fout opgetreden</p>';
  }
});

function showAdminPanel() {
  document.getElementById('adminLoginSection').style.display = 'none';
  document.getElementById('adminPanelSection').style.display = 'block';
  laadReparaties();
  laadInstellingen();
}

function adminLogout() {
  isAdminLoggedIn = false;
  document.getElementById('adminLoginSection').style.display = 'block';
  document.getElementById('adminPanelSection').style.display = 'none';
  document.getElementById('adminPassword').value = '';
  document.getElementById('loginMessage').innerHTML = '<p style="color: green;">Succesvol uitgelogd als admin!</p>';
}

async function laadReparaties() {
  if (!isAdminLoggedIn) return;

  try {
    const response = await fetch('/api/reparaties');
    const reparaties = await response.json();

    if (reparaties.length === 0) {
      document.getElementById('reparatiesLijst').innerHTML = '<p>Geen reparaties gepland</p>';
      return;
    }

    let html = `
      <table class="reparaties-tabel">
        <thead>
          <tr>
            <th>ID</th>
            <th>Klant</th>
            <th>Beschrijving</th>
            <th>Datum</th>
            <th>Start Tijd</th>
            <th>Eind Tijd</th>
            <th>Status</th>
            <th>Offerte Status</th>
            <th>Gebruiker</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
    `;

    reparaties.forEach(reparatie => {
      const statusClass = reparatie.status === 'Gereed' ? 'status-gereed' : 'status-gepland';
      const offerteKnop = reparatie.status === 'Gepland' && !reparatie.heeftOfferte 
        ? `<button class="btn btn-primary" onclick="toonOfferteModal(${reparatie.id}, '${reparatie.klantNaam}', '${reparatie.beschrijving.replace(/'/g, "\\'")}')">Offerte maken</button>`
        : reparatie.heeftOfferte ? '<span style="color: green; font-size: 12px;">✓ Offerte gemaakt</span>' : '';
      
      // Offerte status display
      let offerteStatusDisplay = 'Geen offerte';
      if (reparatie.heeftOfferte) {
        const offerteStatus = reparatie.offerteStatus || 'Pending';
        let statusClass = 'status-pending';
        let statusText = offerteStatus;
        
        if (offerteStatus === 'Geaccepteerd') {
          statusClass = 'status-geaccepteerd';
          statusText = '✓ Geaccepteerd';
        } else if (offerteStatus === 'Afgewezen') {
          statusClass = 'status-afgewezen';
          statusText = '✗ Afgewezen';
        } else {
          statusText = '⏳ Wacht op antwoord';
        }
        
        offerteStatusDisplay = `<span class="status-badge ${statusClass}">${statusText}</span>`;
        
        if (reparatie.offertePrijs) {
          offerteStatusDisplay += `<br><small>€${parseFloat(reparatie.offertePrijs).toFixed(2)}</small>`;
        }
      }
      
      const actieKnoppen = reparatie.status === 'Gepland' 
        ? `${offerteKnop}
           <button class="completed-btn" onclick="markeerAlsGereed(${reparatie.id})">Gereed</button>
           <button class="delete-btn" onclick="verwijderReparatie(${reparatie.id})">Verwijder</button>`
        : `<span class="gereed-datum">Gereed op: ${new Date(reparatie.gereedOp).toLocaleDateString('nl-NL')}</span>
           <button class="delete-btn" onclick="verwijderReparatie(${reparatie.id})">Verwijder</button>`;

      html += `
        <tr>
          <td>${reparatie.id}</td>
          <td>${reparatie.klantNaam}</td>
          <td>${maakCelUitklappbaar(reparatie.beschrijving, reparatie.id)}</td>
          <td>${reparatie.datum}</td>
          <td>${reparatie.tijd}</td>
          <td>${reparatie.eindTijd}</td>
          <td><span class="status-badge ${statusClass}">${reparatie.status}</span></td>
          <td>${offerteStatusDisplay}</td>
          <td>${reparatie.username || 'Onbekend'}</td>
          <td class="actie-knoppen">${actieKnoppen}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    document.getElementById('reparatiesLijst').innerHTML = html;

  } catch (error) {
    document.getElementById('reparatiesLijst').innerHTML = '<p style="color: red;">Fout bij laden van reparaties</p>';
  }
}

async function verwijderReparatie(id) {
  if (!isAdminLoggedIn) return;

  if (confirm('Weet je zeker dat je deze reparatie wilt verwijderen?')) {
    try {
      const response = await fetch(`/api/reparaties/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        laadReparaties(); 
      } else {
        alert('Fout bij verwijderen');
      }
    } catch (error) {
      alert('Fout bij verwijderen');
    }
  }
}

async function markeerAlsGereed(id) {
  if (!isAdminLoggedIn) return;

  if (confirm('Weet je zeker dat je deze reparatie als gereed wilt markeren?')) {
    try {
      const response = await fetch(`/api/reparaties/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Gereed' })
      });

      if (response.ok) {
        laadReparaties();
        alert('Reparatie gemarkeerd als gereed!');
      } else {
        const error = await response.json();
        alert('Fout: ' + error.error);
      }
    } catch (error) {
      alert('Fout bij markeren als gereed');
    }
  }
}

async function laadInstellingen() {
  if (!isAdminLoggedIn) return;

  try {
    const response = await fetch('/api/instellingen');
    const instellingen = await response.json();

    document.getElementById('afspraakDuur').value = instellingen.afspraakDuur || 15;


    const dagen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
    dagen.forEach(dag => {
      const dagTijden = instellingen.dagTijden && instellingen.dagTijden[dag];
      if (dagTijden) {
        document.getElementById(`${dag}_start`).value = dagTijden.start || '08:00';
        document.getElementById(`${dag}_eind`).value = dagTijden.eind || '17:00';
        document.getElementById(`${dag}_gesloten`).checked = dagTijden.gesloten || false;
      }
    });

    laadPauzes();

  } catch (error) {
    console.error('Fout bij laden van instellingen:', error);
  }
}

async function laadPauzes() {
  if (!isAdminLoggedIn) return;

  try {
    const response = await fetch('/api/pauzes');
    const pauzes = await response.json();

    let html = '<h5>Huidige Pauzes:</h5>';
    if (pauzes.length === 0) {
      html += '<p>Geen pauzes ingesteld</p>';
    } else {
      html += '<ul>';
      pauzes.forEach(pauze => {
        html += `
          <li>
            ${pauze.datum} van ${pauze.start} tot ${pauze.eind} - ${pauze.beschrijving}
            <button onclick="verwijderPauze(${pauze.id})">Verwijder</button>
          </li>
        `;
      });
      html += '</ul>';
    }

    document.getElementById('pauzeLijst').innerHTML = html;

  } catch (error) {
    console.error('Fout bij laden van pauzes:', error);
  }
}

async function slaInstellingenOp() {
  if (!isAdminLoggedIn) return;

  const afspraakDuur = parseInt(document.getElementById('afspraakDuur').value);
  const nieuwAdminPassword = document.getElementById('nieuwAdminPassword').value;

  if (!afspraakDuur) {
    alert('Vul de afspraakduur in');
    return;
  }

  if (afspraakDuur < 5 || afspraakDuur > 120) {
    alert('Afspraakduur moet tussen 5 en 120 minuten zijn');
    return;
  }


  const dagen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
  const dagTijden = {};

  dagen.forEach(dag => {
    dagTijden[dag] = {
      start: document.getElementById(`${dag}_start`).value,
      eind: document.getElementById(`${dag}_eind`).value,
      gesloten: document.getElementById(`${dag}_gesloten`).checked
    };
  });

  const requestBody = {
    afspraakDuur,
    dagTijden
  };


  if (nieuwAdminPassword && nieuwAdminPassword.trim() !== '') {
    requestBody.adminPassword = nieuwAdminPassword;
  }

  try {
    const response = await fetch('/api/instellingen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      alert('Instellingen opgeslagen!');
      if (nieuwAdminPassword && nieuwAdminPassword.trim() !== '') {
        document.getElementById('nieuwAdminPassword').value = '';
        alert('Admin wachtwoord is gewijzigd!');
      }
    } else {
      alert('Fout bij opslaan van instellingen');
    }
  } catch (error) {
    alert('Fout bij opslaan van instellingen');
  }
}

async function voegPauzeToe() {
  if (!isAdminLoggedIn) return;

  const datum = document.getElementById('pauzeDatum').value;
  const start = document.getElementById('pauzeStart').value;
  const eind = document.getElementById('pauzeEind').value;
  const beschrijving = document.getElementById('pauzeBeschrijving').value;

  if (!datum || !start || !eind || !beschrijving) {
    alert('Vul alle pauze velden in');
    return;
  }

  if (start >= eind) {
    alert('Start tijd moet voor eind tijd zijn');
    return;
  }

  try {
    const response = await fetch('/api/pauzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        datum,
        start,
        eind,
        beschrijving
      })
    });

    if (response.ok) {
      alert('Pauze toegevoegd!');
      document.getElementById('pauzeDatum').value = '';
      document.getElementById('pauzeStart').value = '';
      document.getElementById('pauzeEind').value = '';
      document.getElementById('pauzeBeschrijving').value = '';
      laadPauzes();
    } else {
      alert('Fout bij toevoegen van pauze');
    }
  } catch (error) {
    alert('Fout bij toevoegen van pauze');
  }
}

async function verwijderPauze(id) {
  if (!isAdminLoggedIn) return;

  if (confirm('Weet je zeker dat je deze pauze wilt verwijderen?')) {
    try {
      const response = await fetch(`/api/pauzes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        laadPauzes();
      } else {
        alert('Fout bij verwijderen van pauze');
      }
    } catch (error) {
      alert('Fout bij verwijderen van pauze');
    }
  }
}

function maakCelUitklappbaar(inhoud, id) {
  if (!inhoud) {
    inhoud = 'Geen beschrijving';
  }

  const korteTekst = inhoud.length > 50 ? inhoud.substring(0, 50) + '...' : inhoud;
  return `
    <div class="cell-content">
      <button class="verder-lezen-btn" onclick="toonVolledigeInhoud('${id}')">Verder lezen</button>
      <span class="truncated" id="kort_${id}">${korteTekst}</span>
      <div class="expanded-content" id="uitgebreid_${id}" style="display: none;" onclick="sluitUitgebreideInhoud('${id}')">
        <div class="expanded-content-inner" onclick="event.stopPropagation()">
          <button class="sluit-btn" onclick="sluitUitgebreideInhoud('${id}')">&times;</button>
          <h3>Volledige Beschrijving</h3>
          <div style="margin-top: 20px; white-space: pre-line; line-height: 1.6;">${inhoud}</div>
        </div>
      </div>
    </div>
  `;
}

function toonVolledigeInhoud(id) {
  // Hide all other expanded content first
  document.querySelectorAll('.expanded-content').forEach(el => {
    el.style.display = 'none';
  });

  const uitgebreidElement = document.getElementById(`uitgebreid_${id}`);
  if (uitgebreidElement) {
    uitgebreidElement.style.display = 'block';
  }
}

function sluitUitgebreideInhoud(id) {
  const uitgebreidElement = document.getElementById(`uitgebreid_${id}`);
  if (uitgebreidElement) {
    uitgebreidElement.style.display = 'none';
  }
}

// Offerte per afspraak functions
let huidigAfspraakId = null;

function toonOfferteModal(afspraakId, klantNaam, beschrijving) {
  huidigAfspraakId = afspraakId;
  
  const modal = document.createElement('div');
  modal.className = 'expanded-content';
  modal.innerHTML = `
    <div class="expanded-content-inner">
      <button class="sluit-btn" onclick="this.closest('.expanded-content').remove()">&times;</button>
      <h3>Offerte maken voor ${klantNaam}</h3>
      <div style="margin-top: 20px;">
        <p><strong>Afspraak ID:</strong> ${afspraakId}</p>
        <p><strong>Huidige beschrijving:</strong></p>
        <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin-bottom: 20px;">${beschrijving}</div>
        
        <div class="form-group">
          <label><strong>Probleem beschrijving:</strong></label>
          <textarea id="offerteProbleem" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Beschrijf het probleem dat moet worden opgelost..."></textarea>
        </div>
        
        <div class="form-group">
          <label><strong>Werkzaamheden:</strong></label>
          <textarea id="offerteWerkzaamheden" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Beschrijf wat er gedaan moet worden..."></textarea>
        </div>
        
        <div class="form-group">
          <label><strong>Prijs (€):</strong></label>
          <input type="number" id="offertePrijs" step="0.01" min="0" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" placeholder="0.00">
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <button class="btn btn-success" onclick="maakAfspraakOfferte()">Offerte Bevestigen</button>
          <button class="btn btn-secondary" onclick="this.closest('.expanded-content').remove()">Annuleren</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

async function maakAfspraakOfferte() {
  if (!isAdminLoggedIn || !huidigAfspraakId) return;

  const probleem = document.getElementById('offerteProbleem').value;
  const werkzaamheden = document.getElementById('offerteWerkzaamheden').value;
  const prijs = document.getElementById('offertePrijs').value;

  if (!probleem.trim() || !werkzaamheden.trim() || !prijs) {
    alert('Vul alle velden in');
    return;
  }

  if (parseFloat(prijs) <= 0) {
    alert('Prijs moet groter zijn dan 0');
    return;
  }

  try {
    const response = await fetch(`/api/reparaties/${huidigAfspraakId}/offerte`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        probleem,
        werkzaamheden,
        prijs: parseFloat(prijs)
      })
    });

    if (response.ok) {
      alert('Offerte succesvol aangemaakt!');
      document.querySelector('.expanded-content').remove();
      laadReparaties();
    } else {
      const error = await response.json();
      alert('Fout: ' + error.error);
    }
  } catch (error) {
    alert('Fout bij aanmaken van offerte');
  }
}

// Close expanded content when clicking outside or pressing ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    document.querySelectorAll('.expanded-content').forEach(el => {
      el.style.display = 'none';
    });
  }
});