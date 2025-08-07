const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// JSON file storage
const DATA_FILE = 'data/afspraken.json';
const USERS_FILE = 'data/users.json';
const SETTINGS_FILE = 'data/instellingen.json';
const PAUZES_FILE = 'data/pauzes.json';
const OFFERTES_FILE = 'data/offertes.json'; // Added for quotations
let reparaties = [];
let nextId = 1;
let users = [];
let nextUserId = 1;
let pauzes = [];
let nextPauzeId = 1;
let instellingen = {
  startTijd: '08:00',
  eindTijd: '17:00',
  afspraakDuur: 15,
  adminPassword: 'admin123',
  dagTijden: {
    maandag: { start: '08:00', eind: '17:00', gesloten: false },
    dinsdag: { start: '08:00', eind: '17:00', gesloten: false },
    woensdag: { start: '08:00', eind: '17:00', gesloten: false },
    donderdag: { start: '08:00', eind: '17:00', gesloten: false },
    vrijdag: { start: '08:00', eind: '17:00', gesloten: false },
    zaterdag: { start: '08:00', eind: '17:00', gesloten: true },
    zondag: { start: '08:00', eind: '17:00', gesloten: true }
  }
};
let offertes = []; // Added for quotations

// Create data directory if it doesn't exist
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Load repair data from JSON file
function laadReparaties() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      reparaties = parsedData.reparaties || [];
      nextId = parsedData.nextId || 1;
    }
  } catch (error) {
    console.error('Fout bij laden van reparaties:', error);
    reparaties = [];
    nextId = 1;
  }
}

// Save repair data to JSON file
function slaReparatiesOp() {
  try {
    const data = {
      reparaties: reparaties,
      nextId: nextId
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fout bij opslaan van reparaties:', error);
  }
}

// Load users from JSON file
function laadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      users = parsedData.users || [];
      nextUserId = parsedData.nextUserId || 1;
    }
  } catch (error) {
    console.error('Fout bij laden van users:', error);
    users = [];
    nextUserId = 1;
  }
}

// Save users to JSON file
function slaUsersOp() {
  try {
    const data = {
      users: users,
      nextUserId: nextUserId
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fout bij opslaan van users:', error);
  }
}

// Load settings from JSON file
function laadInstellingen() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
      const geladen = JSON.parse(data);
      instellingen = {
        ...instellingen,
        ...geladen
      };
    }
  } catch (error) {
    console.error('Fout bij laden van instellingen:', error);
  }
}

// Load breaks from JSON file
function laadPauzes() {
  try {
    if (fs.existsSync(PAUZES_FILE)) {
      const data = fs.readFileSync(PAUZES_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      pauzes = parsedData.pauzes || [];
      nextPauzeId = parsedData.nextPauzeId || 1;
    }
  } catch (error) {
    console.error('Fout bij laden van pauzes:', error);
    pauzes = [];
    nextPauzeId = 1;
  }
}

// Save breaks to JSON file
function slaPauzesOp() {
  try {
    const data = {
      pauzes: pauzes,
      nextPauzeId: nextPauzeId
    };
    fs.writeFileSync(PAUZES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fout bij opslaan van pauzes:', error);
  }
}

// Save settings to JSON file
function slaInstellingenOp() {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(instellingen, null, 2));
  } catch (error) {
    console.error('Fout bij opslaan van instellingen:', error);
  }
}

// Quotation file management
function readOffertes() {
  try {
    const data = fs.readFileSync(OFFERTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeOffertes(offertesData) {
  fs.writeFileSync(OFFERTES_FILE, JSON.stringify(offertesData, null, 2));
}


// Load data on server start
laadReparaties();
laadUsers();
laadInstellingen();
laadPauzes();
// Load quotations on server start (optional, if you want to persist quotations)
// if (fs.existsSync(OFFERTES_FILE)) {
//   offertes = readOffertes();
// }


// User routes
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' });
  }

  const bestaandeUser = users.find(u => u.username === username);
  if (bestaandeUser) {
    return res.status(400).json({ error: 'Gebruikersnaam bestaat al' });
  }

  const bestaandeEmail = users.find(u => u.email === email);
  if (bestaandeEmail) {
    return res.status(400).json({ error: 'Email bestaat al' });
  }

  const user = {
    id: nextUserId++,
    username,
    email,
    password,
    aangemaakt: new Date().toISOString()
  };

  users.push(user);
  slaUsersOp();
  res.json({ success: true, userId: user.id, username: user.username });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Gebruikersnaam en wachtwoord zijn verplicht' });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(400).json({ error: 'Ongeldige gebruikersnaam of wachtwoord' });
  }

  res.json({ success: true, userId: user.id, username: user.username });
});

app.post('/api/admin-login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Wachtwoord is verplicht' });
  }

  if (password !== instellingen.adminPassword) {
    return res.status(400).json({ error: 'Onjuist admin wachtwoord' });
  }

  res.json({ success: true, message: 'Admin toegang verleend' });
});

// Repair routes
app.get('/api/reparaties', (req, res) => {
  const gesorteerdeReparaties = reparaties.sort((a, b) => {
    const datumA = new Date(a.datum + 'T' + a.tijd);
    const datumB = new Date(b.datum + 'T' + b.tijd);
    return datumA - datumB;
  });
  res.json(gesorteerdeReparaties);
});

app.get('/api/reparaties/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);

  const userReparaties = reparaties
    .filter(r => r.userId === userId)
    .sort((a, b) => {
      const datumA = new Date(a.datum + 'T' + a.tijd);
      const datumB = new Date(b.datum + 'T' + b.tijd);
      return datumA - datumB;
    });

  res.json(userReparaties);
});

app.get('/api/reparaties/:id', (req, res) => {
  const reparatieId = parseInt(req.params.id);
  const reparatie = reparaties.find(r => r.id === reparatieId);

  if (!reparatie) {
    return res.status(404).json({ error: 'Reparatie niet gevonden' });
  }

  res.json(reparatie);
});

app.get('/api/beschikbare-tijden/:datum', (req, res) => {
  const datum = req.params.datum;
  const bezetteTijden = reparaties
    .filter(r => r.datum === datum)
    .map(r => r.tijd);

  const alleTijden = genereerTijdSlots(datum);
  const beschikbareTijden = alleTijden.filter(tijd => !bezetteTijden.includes(tijd));

  res.json(beschikbareTijden);
});

app.post('/api/reparaties', (req, res) => {
  const { klantNaam, beschrijving, datum, tijd, userId } = req.body;

  if (!klantNaam || !beschrijving || !datum || !tijd || !userId) {
    return res.status(400).json({ error: 'Vul alle verplichte velden in' });
  }

  const user = users.find(u => u.id === parseInt(userId));
  if (!user) {
    return res.status(400).json({ error: 'Ongeldige gebruiker' });
  }

  const bestaandeReparatie = reparaties.find(r => r.datum === datum && r.tijd === tijd);
  if (bestaandeReparatie) {
    return res.status(400).json({ error: 'Deze tijd is al bezet. Kies een andere tijd.' });
  }

  const reparatie = {
    id: nextId++,
    klantNaam,
    beschrijving,
    datum,
    tijd,
    eindTijd: berekenEindTijd(tijd),
    status: 'Gepland',
    userId: parseInt(userId),
    username: user.username,
    aangemaakt: new Date().toISOString()
  };

  reparaties.push(reparatie);
  slaReparatiesOp();
  res.json(reparatie);
});

app.delete('/api/reparaties/:id', (req, res) => {
  const id = parseInt(req.params.id);
  reparaties = reparaties.filter(r => r.id !== id);
  slaReparatiesOp();
  res.json({ success: true });
});

app.put('/api/reparaties/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is verplicht' });
  }

  const reparatie = reparaties.find(r => r.id === id);
  if (!reparatie) {
    return res.status(404).json({ error: 'Reparatie niet gevonden' });
  }

  reparatie.status = status;
  if (status === 'Gereed') {
    reparatie.gereedOp = new Date().toISOString();
  }

  slaReparatiesOp();
  res.json(reparatie);
});

// Settings routes
app.get('/api/instellingen', (req, res) => {
  res.json(instellingen);
});

app.post('/api/instellingen', (req, res) => {
  const { afspraakDuur, dagTijden, adminPassword } = req.body;

  if (afspraakDuur !== undefined) {
    if (afspraakDuur < 5 || afspraakDuur > 120) {
      return res.status(400).json({ error: 'Afspraakduur moet tussen 5 en 120 minuten zijn' });
    }
    instellingen.afspraakDuur = parseInt(afspraakDuur);
  }

  if (dagTijden) {
    instellingen.dagTijden = dagTijden;
  }

  if (adminPassword !== undefined) {
    instellingen.adminPassword = adminPassword;
  }

  slaInstellingenOp();
  res.json({ success: true });
});

function berekenEindTijd(startTijd) {
  const [uren, minuten] = startTijd.split(':').map(Number);
  const startMinuten = uren * 60 + minuten;
  const eindMinuten = startMinuten + instellingen.afspraakDuur;
  const eindUren = Math.floor(eindMinuten / 60);
  const restMinuten = eindMinuten % 60;
  return `${eindUren.toString().padStart(2, '0')}:${restMinuten.toString().padStart(2, '0')}`;
}

// Break routes
app.get('/api/pauzes', (req, res) => {
  const gesorteerde = pauzes.sort((a, b) => {
    const datumA = new Date(a.datum + 'T' + a.start);
    const datumB = new Date(b.datum + 'T' + b.start);
    return datumA - datumB;
  });
  res.json(gesorteerde);
});

app.post('/api/pauzes', (req, res) => {
  const { datum, start, eind, beschrijving } = req.body;

  if (!datum || !start || !eind || !beschrijving) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' });
  }

  if (start >= eind) {
    return res.status(400).json({ error: 'Start tijd moet voor eind tijd zijn' });
  }

  const pauze = {
    id: nextPauzeId++,
    datum,
    start,
    eind,
    beschrijving,
    aangemaakt: new Date().toISOString()
  };

  pauzes.push(pauze);
  slaPauzesOp();
  res.json(pauze);
});

app.delete('/api/pauzes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pauzes = pauzes.filter(p => p.id !== id);
  slaPauzesOp();
  res.json({ success: true });
});

// Repair-based quotation API endpoints
// API endpoint: Create quotation for a repair
app.post('/api/reparaties/:id/offerte', (req, res) => {
  const reparatieId = parseInt(req.params.id);
  const { probleem, werkzaamheden, prijs } = req.body;

  if (!probleem || !werkzaamheden || !prijs) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' });
  }

  const reparatie = reparaties.find(r => r.id === reparatieId);
  if (!reparatie) {
    return res.status(404).json({ error: 'Reparatie niet gevonden' });
  }

  if (reparatie.heeftOfferte) {
    return res.status(400).json({ error: 'Deze reparatie heeft al een offerte' });
  }

  // Add quotation to repair
  reparatie.heeftOfferte = true;
  reparatie.offerteProbleem = probleem;
  reparatie.offerteWerkzaamheden = werkzaamheden;
  reparatie.offertePrijs = parseFloat(prijs);
  reparatie.offerteStatus = 'Pending';
  reparatie.offerteAangemaakt = new Date().toISOString();

  slaReparatiesOp();
  res.json({ success: true, message: 'Offerte toegevoegd aan reparatie' });
});

// API endpoint: Get quotations for user's repairs
app.get('/api/reparaties/user/:userId/offertes', (req, res) => {
  const userId = parseInt(req.params.userId);
  
  const userReparaties = reparaties
    .filter(r => r.userId === userId && r.heeftOfferte)
    .sort((a, b) => {
      const datumA = new Date(a.datum + 'T' + a.tijd);
      const datumB = new Date(b.datum + 'T' + b.tijd);
      return datumA - datumB;
    });

  res.json(userReparaties);
});

// API endpoint: Accept quotation for repair
app.put('/api/reparaties/:id/offerte/accept', (req, res) => {
  const reparatieId = parseInt(req.params.id);
  
  const reparatie = reparaties.find(r => r.id === reparatieId);
  if (!reparatie) {
    return res.status(404).json({ error: 'Reparatie niet gevonden' });
  }

  if (!reparatie.heeftOfferte) {
    return res.status(400).json({ error: 'Deze reparatie heeft geen offerte' });
  }

  if (reparatie.offerteStatus !== 'Pending') {
    return res.status(400).json({ error: 'Offerte is al beantwoord' });
  }

  reparatie.offerteStatus = 'Geaccepteerd';
  reparatie.offerteGeaccepteerdOp = new Date().toISOString();

  slaReparatiesOp();
  res.json({ success: true, message: 'Offerte geaccepteerd' });
});

// API endpoint: Reject quotation for repair
app.put('/api/reparaties/:id/offerte/reject', (req, res) => {
  const reparatieId = parseInt(req.params.id);
  
  const reparatie = reparaties.find(r => r.id === reparatieId);
  if (!reparatie) {
    return res.status(404).json({ error: 'Reparatie niet gevonden' });
  }

  if (!reparatie.heeftOfferte) {
    return res.status(400).json({ error: 'Deze reparatie heeft geen offerte' });
  }

  if (reparatie.offerteStatus !== 'Pending') {
    return res.status(400).json({ error: 'Offerte is al beantwoord' });
  }

  reparatie.offerteStatus = 'Afgewezen';
  reparatie.offerteAfgewezenOp = new Date().toISOString();

  slaReparatiesOp();
  res.json({ success: true, message: 'Offerte afgewezen' });
});


function getDagNaam(datum) {
  const dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  const date = new Date(datum);
  return dagen[date.getDay()];
}

function genereerTijdSlots(datum = null) {
  let startTijd, eindTijd;

  if (datum) {
    const dagNaam = getDagNaam(datum);
    const dagInstellingen = instellingen.dagTijden[dagNaam];

    if (dagInstellingen && dagInstellingen.gesloten) {
      return [];
    }

    startTijd = dagInstellingen ? dagInstellingen.start : instellingen.startTijd;
    eindTijd = dagInstellingen ? dagInstellingen.eind : instellingen.eindTijd;
  } else {
    startTijd = instellingen.startTijd;
    eindTijd = instellingen.eindTijd;
  }

  const tijden = [];
  const [startUur, startMinuut] = startTijd.split(':').map(Number);
  const [eindUur, eindMinuut] = eindTijd.split(':').map(Number);
  const startTotaalMinuten = startUur * 60 + startMinuut;
  const eindTotaalMinuten = eindUur * 60 + eindMinuut;
  const intervalMinuten = instellingen.afspraakDuur;

  for (let minuten = startTotaalMinuten; minuten < eindTotaalMinuten; minuten += intervalMinuten) {
    const uren = Math.floor(minuten / 60);
    const restMinuten = minuten % 60;
    const tijd = `${uren.toString().padStart(2, '0')}:${restMinuten.toString().padStart(2, '0')}`;

    const tijdInPauze = pauzes.some(pauze => {
      if (datum && pauze.datum === datum) {
        return tijd >= pauze.start && tijd < pauze.eind;
      }
      return false;
    });

    if (!tijdInPauze) {
      tijden.push(tijd);
    }
  }

  return tijden;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server draait op poort ${PORT}`);
});