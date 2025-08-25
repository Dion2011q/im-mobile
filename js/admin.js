let isAdminLoggedIn = false;

document
  .getElementById("adminLoginForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("adminPassword").value;

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok) {
        isAdminLoggedIn = true;
        showAdminPanel();
        document.getElementById("loginMessage").innerHTML =
          '<p style="color: green;">Admin toegang verleend!</p>';
      } else {
        document.getElementById("loginMessage").innerHTML =
          '<p style="color: red;">Fout: ' + result.error + "</p>";
      }
    } catch (error) {
      document.getElementById("loginMessage").innerHTML =
        '<p style="color: red;">Er is een fout opgetreden</p>';
    }
  });

function showAdminPanel() {
  document.getElementById("adminLoginSection").style.display = "none";
  document.getElementById("adminPanelSection").style.display = "block";
  laadReparaties();
  laadInstellingen();
  laadVerkoopMerken();
  laadVerkoopPrijzen();
  laadProducten();
}

function adminLogout() {
  isAdminLoggedIn = false;
  document.getElementById("adminLoginSection").style.display = "block";
  document.getElementById("adminPanelSection").style.display = "none";
  document.getElementById("adminPassword").value = "";
  document.getElementById("loginMessage").innerHTML =
    '<p style="color: green;">Succesvol uitgelogd als admin!</p>';
}

async function laadReparaties() {
  if (!isAdminLoggedIn) return;

  try {
    const response = await fetch("/api/reparaties");
    const reparaties = await response.json();

    if (reparaties.length === 0) {
      document.getElementById("reparatiesLijst").innerHTML =
        "<p>Geen reparaties gepland</p>";
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

    reparaties.forEach((reparatie) => {
      const statusClass =
        reparatie.status === "Gereed" ? "status-gereed" : "status-gepland";
      const offerteKnop =
        reparatie.status === "Gepland" && !reparatie.heeftOfferte
          ? `<button class="btn btn-primary" onclick="toonOfferteModal(${reparatie.id}, '${reparatie.klantNaam}', '${reparatie.beschrijving.replace(/'/g, "\\'")}')">Offerte maken</button>`
          : reparatie.heeftOfferte
            ? '<span style="color: green; font-size: 12px;">✓ Offerte gemaakt</span>'
            : "";

      // Offerte status display
      let offerteStatusDisplay = "Geen offerte";
      if (reparatie.heeftOfferte) {
        const offerteStatus = reparatie.offerteStatus || "Pending";
        let statusClass = "status-pending";
        let statusText = offerteStatus;

        if (offerteStatus === "Geaccepteerd") {
          statusClass = "status-geaccepteerd";
          statusText = "✓ Geaccepteerd";
        } else if (offerteStatus === "Afgewezen") {
          statusClass = "status-afgewezen";
          statusText = "✗ Afgewezen";
        } else {
          statusText = "⏳ Wacht op antwoord";
        }

        offerteStatusDisplay = `<span class="status-badge ${statusClass}">${statusText}</span>`;

        if (reparatie.offertePrijs) {
          offerteStatusDisplay += `<br><small>€${parseFloat(reparatie.offertePrijs).toFixed(2)}</small>`;
        }
      }

      const actieKnoppen =
        reparatie.status === "Gepland"
          ? `${offerteKnop}
           <button class="completed-btn" onclick="markeerAlsGereed(${reparatie.id})">Gereed</button>
           <button class="delete-btn" onclick="verwijderReparatie(${reparatie.id})">Verwijder</button>`
          : `<span class="gereed-datum">Gereed op: ${new Date(reparatie.gereedOp).toLocaleDateString("nl-NL")}</span>
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
          <td>${reparatie.username || "Onbekend"}</td>
          <td class="actie-knoppen">${actieKnoppen}</td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    document.getElementById("reparatiesLijst").innerHTML = html;
  } catch (error) {
    document.getElementById("reparatiesLijst").innerHTML =
      '<p style="color: red;">Fout bij laden van reparaties</p>';
  }
}

async function verwijderReparatie(id) {
  if (!isAdminLoggedIn) return;

  if (confirm("Weet je zeker dat je deze reparatie wilt verwijderen?")) {
    try {
      const response = await fetch(`/api/reparaties/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        laadReparaties();
      } else {
        alert("Fout bij verwijderen");
      }
    } catch (error) {
      alert("Fout bij verwijderen");
    }
  }
}

async function markeerAlsGereed(id) {
  if (!isAdminLoggedIn) return;

  if (
    confirm("Weet je zeker dat je deze reparatie als gereed wilt markeren?")
  ) {
    try {
      const response = await fetch(`/api/reparaties/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Gereed" }),
      });

      if (response.ok) {
        laadReparaties();
        alert("Reparatie gemarkeerd als gereed!");
      } else {
        const error = await response.json();
        alert("Fout: " + error.error);
      }
    } catch (error) {
      alert("Fout bij markeren als gereed");
    }
  }
}

async function laadInstellingen() {
  if (!isAdminLoggedIn) return;

  try {
    const response = await fetch("/api/instellingen");
    const instellingen = await response.json();

    document.getElementById("afspraakDuur").value =
      instellingen.afspraakDuur || 15;

    const dagen = [
      "maandag",
      "dinsdag",
      "woensdag",
      "donderdag",
      "vrijdag",
      "zaterdag",
      "zondag",
    ];
    dagen.forEach((dag) => {
      const dagTijden = instellingen.dagTijden && instellingen.dagTijden[dag];
      if (dagTijden) {
        document.getElementById(`${dag}_start`).value =
          dagTijden.start || "08:00";
        document.getElementById(`${dag}_eind`).value =
          dagTijden.eind || "17:00";
        document.getElementById(`${dag}_gesloten`).checked =
          dagTijden.gesloten || false;
      }
    });

    laadPauzes();
  } catch (error) {
    console.error("Fout bij laden van instellingen:", error);
  }
}

async function laadPauzes() {
  if (!isAdminLoggedIn) return;

  try {
    const response = await fetch("/api/pauzes");
    const pauzes = await response.json();

    let html = "<h5>Huidige Pauzes:</h5>";
    if (pauzes.length === 0) {
      html += "<p>Geen pauzes ingesteld</p>";
    } else {
      html += "<ul>";
      pauzes.forEach((pauze) => {
        html += `
          <li>
            ${pauze.datum} van ${pauze.start} tot ${pauze.eind} - ${pauze.beschrijving}
            <button onclick="verwijderPauze(${pauze.id})">Verwijder</button>
          </li>
        `;
      });
      html += "</ul>";
    }

    document.getElementById("pauzeLijst").innerHTML = html;
  } catch (error) {
    console.error("Fout bij laden van pauzes:", error);
  }
}

async function slaInstellingenOp() {
  if (!isAdminLoggedIn) return;

  const afspraakDuur = parseInt(document.getElementById("afspraakDuur").value);
  const nieuwAdminPassword =
    document.getElementById("nieuwAdminPassword").value;

  if (!afspraakDuur) {
    alert("Vul de afspraakduur in");
    return;
  }

  if (afspraakDuur < 5 || afspraakDuur > 120) {
    alert("Afspraakduur moet tussen 5 en 120 minuten zijn");
    return;
  }

  const dagen = [
    "maandag",
    "dinsdag",
    "woensdag",
    "donderdag",
    "vrijdag",
    "zaterdag",
    "zondag",
  ];
  const dagTijden = {};

  dagen.forEach((dag) => {
    dagTijden[dag] = {
      start: document.getElementById(`${dag}_start`).value,
      eind: document.getElementById(`${dag}_eind`).value,
      gesloten: document.getElementById(`${dag}_gesloten`).checked,
    };
  });

  const requestBody = {
    afspraakDuur,
    dagTijden,
  };

  if (nieuwAdminPassword && nieuwAdminPassword.trim() !== "") {
    requestBody.adminPassword = nieuwAdminPassword;
  }

  try {
    const response = await fetch("/api/instellingen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      alert("Instellingen opgeslagen!");
      if (nieuwAdminPassword && nieuwAdminPassword.trim() !== "") {
        document.getElementById("nieuwAdminPassword").value = "";
        alert("Admin wachtwoord is gewijzigd!");
      }
    } else {
      alert("Fout bij opslaan van instellingen");
    }
  } catch (error) {
    alert("Fout bij opslaan van instellingen");
  }
}

async function voegPauzeToe() {
  if (!isAdminLoggedIn) return;

  const datum = document.getElementById("pauzeDatum").value;
  const start = document.getElementById("pauzeStart").value;
  const eind = document.getElementById("pauzeEind").value;
  const beschrijving = document.getElementById("pauzeBeschrijving").value;

  if (!datum || !start || !eind || !beschrijving) {
    alert("Vul alle pauze velden in");
    return;
  }

  if (start >= eind) {
    alert("Start tijd moet voor eind tijd zijn");
    return;
  }

  try {
    const response = await fetch("/api/pauzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datum,
        start,
        eind,
        beschrijving,
      }),
    });

    if (response.ok) {
      alert("Pauze toegevoegd!");
      document.getElementById("pauzeDatum").value = "";
      document.getElementById("pauzeStart").value = "";
      document.getElementById("pauzeEind").value = "";
      document.getElementById("pauzeBeschrijving").value = "";
      laadPauzes();
    } else {
      alert("Fout bij toevoegen van pauze");
    }
  } catch (error) {
    alert("Fout bij toevoegen van pauze");
  }
}

async function verwijderPauze(id) {
  if (!isAdminLoggedIn) return;

  if (confirm("Weet je zeker dat je deze pauze wilt verwijderen?")) {
    try {
      const response = await fetch(`/api/pauzes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        laadPauzes();
      } else {
        alert("Fout bij verwijderen van pauze");
      }
    } catch (error) {
      alert("Fout bij verwijderen van pauze");
    }
  }
}

function maakCelUitklappbaar(inhoud, id) {
  if (!inhoud) {
    inhoud = "Geen beschrijving";
  }

  const korteTekst =
    inhoud.length > 50 ? inhoud.substring(0, 50) + "..." : inhoud;
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
  document.querySelectorAll(".expanded-content").forEach((el) => {
    el.style.display = "none";
  });

  const uitgebreidElement = document.getElementById(`uitgebreid_${id}`);
  if (uitgebreidElement) {
    uitgebreidElement.style.display = "block";
  }
}

function sluitUitgebreideInhoud(id) {
  const uitgebreidElement = document.getElementById(`uitgebreid_${id}`);
  if (uitgebreidElement) {
    uitgebreidElement.style.display = "none";
  }
}

// Offerte per afspraak functions
let huidigAfspraakId = null;

function toonOfferteModal(afspraakId, klantNaam, beschrijving) {
  huidigAfspraakId = afspraakId;

  const modal = document.createElement("div");
  modal.className = "expanded-content";
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

  const probleem = document.getElementById("offerteProbleem").value;
  const werkzaamheden = document.getElementById("offerteWerkzaamheden").value;
  const prijs = document.getElementById("offertePrijs").value;

  if (!probleem.trim() || !werkzaamheden.trim() || !prijs) {
    alert("Vul alle velden in");
    return;
  }

  if (parseFloat(prijs) <= 0) {
    alert("Prijs moet groter zijn dan 0");
    return;
  }

  try {
    const response = await fetch(
      `/api/reparaties/${huidigAfspraakId}/offerte`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          probleem,
          werkzaamheden,
          prijs: parseFloat(prijs),
        }),
      },
    );

    if (response.ok) {
      alert("Offerte succesvol aangemaakt!");
      document.querySelector(".expanded-content").remove();
      laadReparaties();
    } else {
      const error = await response.json();
      alert("Fout: " + error.error);
    }
  } catch (error) {
    alert("Fout bij aanmaken van offerte");
  }
}

// Sales price management
const telefoonModellenAdmin = {
  Apple: [
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 12 mini",
    "iPhone SE (2022)",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone XS Max",
    "iPhone XS",
    "iPhone XR",
    "iPhone X",
    "iPhone 8 Plus",
    "iPhone 8",
    "iPhone 7 Plus",
    "iPhone 7",
    "iPhone SE (2020)",
    "iPhone 6s Plus",
    "iPhone 6s",
    "iPhone 6 Plus",
    "iPhone 6",
    "iPhone SE (1st gen)",
    "Anders iPhone",
  ],
  Samsung: [
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
    "Galaxy S23 Ultra",
    "Galaxy S23+",
    "Galaxy S23",
    "Galaxy S23 FE",
    "Galaxy S22 Ultra",
    "Galaxy S22+",
    "Galaxy S22",
    "Galaxy S21 Ultra",
    "Galaxy S21+",
    "Galaxy S21",
    "Galaxy S21 FE",
    "Galaxy S20 Ultra",
    "Galaxy S20+",
    "Galaxy S20",
    "Galaxy S20 FE",
    "Galaxy Note 20 Ultra",
    "Galaxy Note 20",
    "Galaxy Note 10+",
    "Galaxy Note 10",
    "Galaxy S10+",
    "Galaxy S10",
    "Galaxy S10e",
    "Galaxy S9+",
    "Galaxy S9",
    "Galaxy A75",
    "Galaxy A55",
    "Galaxy A54",
    "Galaxy A53",
    "Galaxy A52",
    "Galaxy A34",
    "Galaxy A33",
    "Galaxy A25",
    "Galaxy A24",
    "Galaxy A23",
    "Galaxy A22",
    "Galaxy A15",
    "Galaxy A14",
    "Galaxy A13",
    "Galaxy A12",
    "Anders Samsung",
  ],
  Google: [
    "Pixel 8 Pro",
    "Pixel 8",
    "Pixel 7a",
    "Pixel 7 Pro",
    "Pixel 7",
    "Pixel 6a",
    "Pixel 6 Pro",
    "Pixel 6",
    "Pixel 5a",
    "Pixel 5",
    "Pixel 4a",
    "Pixel 4",
    "Pixel 3a",
    "Pixel 3",
    "Anders Google",
  ],
  OnePlus: [
    "OnePlus 12",
    "OnePlus 11",
    "OnePlus 10 Pro",
    "OnePlus 10T",
    "OnePlus 9 Pro",
    "OnePlus 9",
    "OnePlus 8T",
    "OnePlus 8 Pro",
    "OnePlus 8",
    "OnePlus 7T Pro",
    "OnePlus 7T",
    "OnePlus 7 Pro",
    "OnePlus 7",
    "OnePlus 6T",
    "OnePlus 6",
    "OnePlus Nord 3",
    "OnePlus Nord 2T",
    "OnePlus Nord 2",
    "OnePlus Nord",
    "OnePlus Nord CE 3",
    "OnePlus Nord CE 2",
    "OnePlus Nord CE",
    "Anders OnePlus",
  ],
  Huawei: [
    "P60 Pro",
    "P60",
    "P50 Pro",
    "P50",
    "P40 Pro",
    "P40",
    "P30 Pro",
    "P30",
    "Mate 60 Pro",
    "Mate 50 Pro",
    "Mate 40 Pro",
    "Nova 11",
    "Nova 10",
    "Nova 9",
    "Y70",
    "Y60",
    "Anders Huawei",
  ],
  Xiaomi: [
    "14 Ultra",
    "14",
    "13T Pro",
    "13T",
    "13 Pro",
    "13",
    "12T Pro",
    "12T",
    "12 Pro",
    "12",
    "11T Pro",
    "11T",
    "11",
    "Redmi Note 13 Pro",
    "Redmi Note 13",
    "Redmi Note 12 Pro",
    "Redmi Note 12",
    "Redmi 12",
    "POCO X5 Pro",
    "POCO X5",
    "POCO F5",
    "Anders Xiaomi",
  ],
};

function laadVerkoopMerken() {
  const merkSelect = document.getElementById("verkoopMerk");

  merkSelect.addEventListener("change", function () {
    const selectedMerk = this.value;
    const modelSelect = document.getElementById("verkoopModel");

    modelSelect.innerHTML = '<option value="">Selecteer model</option>';

    if (selectedMerk && telefoonModellenAdmin[selectedMerk]) {
      telefoonModellenAdmin[selectedMerk].forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  });
}

async function laadVerkoopPrijzen() {
  if (!isAdminLoggedIn) return;

  try {
    const response = await fetch("/api/verkoop-prijzen");
    const prijzen = await response.json();

    let html = "";
    if (Object.keys(prijzen).length === 0) {
      html = "<p>Geen prijzen ingesteld</p>";
    } else {
      html = '<div class="prijzen-grid">';
      Object.entries(prijzen).forEach(([key, data]) => {
        const [merk, model] = key.split("-");
        html += `
          <div class="prijs-item">
            <div class="prijs-info">
              <strong>${merk} ${model}</strong><br>
              <span class="prijs">€${data.prijs}</span>
            </div>
            <button class="btn btn-danger btn-small" onclick="verwijderVerkoopPrijs('${key}')">Verwijder</button>
          </div>
        `;
      });
      html += "</div>";
    }

    document.getElementById("verkoopPrijzenLijst").innerHTML = html;
  } catch (error) {
    document.getElementById("verkoopPrijzenLijst").innerHTML =
      '<p style="color: red;">Fout bij laden van prijzen</p>';
  }
}

async function slaVerkoopPrijsOp() {
  if (!isAdminLoggedIn) return;

  const merk = document.getElementById("verkoopMerk").value;
  const model = document.getElementById("verkoopModel").value;
  const prijs = parseFloat(document.getElementById("verkoopPrijs").value);

  if (!merk || !model || !prijs || prijs < 0) {
    alert("Vul alle velden correct in");
    return;
  }

  try {
    const response = await fetch("/api/verkoop-prijzen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merk,
        model,
        prijs,
      }),
    });

    if (response.ok) {
      alert("Prijs opgeslagen!");
      document.getElementById("verkoopMerk").value = "";
      document.getElementById("verkoopModel").innerHTML =
        '<option value="">Selecteer eerst merk</option>';
      document.getElementById("verkoopPrijs").value = "";
      laadVerkoopPrijzen();
    } else {
      alert("Fout bij opslaan van prijs");
    }
  } catch (error) {
    alert("Fout bij opslaan van prijs");
  }
}

async function verwijderVerkoopPrijs(key) {
  if (!isAdminLoggedIn) return;

  if (confirm("Weet je zeker dat je deze prijs wilt verwijderen?")) {
    try {
      const response = await fetch(`/api/verkoop-prijzen/${encodeURIComponent(key)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        laadVerkoopPrijzen();
        alert("Prijs succesvol verwijderd!");
      } else {
        let errorMessage = "Onbekende fout";
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        alert("Fout bij verwijderen van prijs: " + errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Fout bij verwijderen van prijs: " + error.message);
    }
  }
}

// Product management functions
async function laadProducten() {
  if (!isAdminLoggedIn) return;

  try {
    const response = await fetch("/api/producten");
    const producten = await response.json();

    let html = "";
    if (producten.length === 0) {
      html = "<p>Geen producten toegevoegd</p>";
    } else {
      producten.forEach((product) => {
        html += `
          <div class="product-item">
            <div class="product-header">
              <div class="product-name">${product.naam}</div>
              <button class="btn btn-danger btn-small" onclick="verwijderProduct(${product.id})">Verwijder</button>
            </div>
            <div class="product-info"><strong>Merk:</strong> ${product.merk}</div>
            <div class="product-info"><strong>Conditie:</strong> ${product.conditie}</div>
            <div class="product-info"><strong>Beschrijving:</strong> ${product.beschrijving || "Geen beschrijving"}</div>
            <div class="product-prijs">€${parseFloat(product.prijs).toFixed(2)}</div>
          </div>
        `;
      });
    }

    document.getElementById("productenLijst").innerHTML = html;
  } catch (error) {
    document.getElementById("productenLijst").innerHTML =
      '<p style="color: red;">Fout bij laden van producten</p>';
  }
}

async function voegProductToe() {
  if (!isAdminLoggedIn) return;

  const naam = document.getElementById("productNaam").value;
  const merk = document.getElementById("productMerk").value;
  const conditie = document.getElementById("productConditie").value;
  const prijs = parseFloat(document.getElementById("productPrijs").value);
  const beschrijving = document.getElementById("productBeschrijving").value;
  const afbeelding = document.getElementById("productAfbeelding").value;

  if (!naam || !merk || !conditie || !prijs || prijs < 0) {
    alert("Vul alle verplichte velden correct in");
    return;
  }

  try {
    const response = await fetch("/api/producten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        naam,
        merk,
        conditie,
        prijs,
        beschrijving,
        afbeelding,
      }),
    });

    if (response.ok) {
      alert("Product toegevoegd!");
      document.getElementById("productNaam").value = "";
      document.getElementById("productMerk").value = "";
      document.getElementById("productConditie").value = "";
      document.getElementById("productPrijs").value = "";
      document.getElementById("productBeschrijving").value = "";
      document.getElementById("productAfbeelding").value = "";
      laadProducten();
    } else {
      alert("Fout bij toevoegen van product");
    }
  } catch (error) {
    alert("Fout bij toevoegen van product");
  }
}

async function verwijderProduct(id) {
  if (!isAdminLoggedIn) return;

  if (confirm("Weet je zeker dat je dit product wilt verwijderen?")) {
    try {
      const response = await fetch(`/api/producten/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        laadProducten();
      } else {
        alert("Fout bij verwijderen van product");
      }
    } catch (error) {
      alert("Fout bij verwijderen van product");
    }
  }
}

// Close expanded content when clicking outside or pressing ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    document.querySelectorAll(".expanded-content").forEach((el) => {
      el.style.display = "none";
    });
  }
});
