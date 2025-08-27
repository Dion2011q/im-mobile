const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = 6969;

// Encryption functionality - integrated directly into server.js
const ENCRYPTION_KEY = "my-32-character-ultra-secure-key!!"; // 32 characters
const ALGORITHM = "aes-256-cbc";

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encryptedData) {
  const parts = encryptedData.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = parts.join(":");
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function loadEncryptedJson(filePath) {
  const encryptedPath = filePath + ".enc";

  try {
    // Check if .enc version exists and migrate it
    if (fs.existsSync(encryptedPath)) {
      const encryptedData = fs.readFileSync(encryptedPath, "utf8");
      const decryptedData = decrypt(encryptedData);
      const parsedData = JSON.parse(decryptedData);

      // Save to original filename with encrypted content
      const newEncryptedData = encrypt(decryptedData);
      fs.writeFileSync(filePath, newEncryptedData, "utf8");

      // Remove .enc version
      fs.unlinkSync(encryptedPath);

      return parsedData;
    }

    // Try to load from original file (encrypted content)
    if (fs.existsSync(filePath)) {
      try {
        const encryptedData = fs.readFileSync(filePath, "utf8");
        const decryptedData = decrypt(encryptedData);
        return JSON.parse(decryptedData);
      } catch (decryptError) {
        // If decryption fails, assume it's unencrypted and encrypt it
        const data = fs.readFileSync(filePath, "utf8");
        const parsedData = JSON.parse(data);

        // Save encrypted version
        const encryptedData = encrypt(data);
        fs.writeFileSync(filePath, encryptedData, "utf8");

        return parsedData;
      }
    }

    return null;
  } catch (error) {
    console.error("Error loading encrypted JSON:", error);
    return null;
  }
}

function saveEncryptedJson(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    const encryptedData = encrypt(jsonData);
    fs.writeFileSync(filePath, encryptedData, "utf8");

    return true;
  } catch (error) {
    console.error("Error saving encrypted JSON:", error);
    return false;
  }
}

function encryptJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const data = fs.readFileSync(filePath, "utf8");
    const parsedData = JSON.parse(data);

    // Encrypt and save to the same filename
    const jsonData = JSON.stringify(parsedData, null, 2);
    const encryptedData = encrypt(jsonData);
    fs.writeFileSync(filePath, encryptedData, "utf8");

    return true;
  } catch (error) {
    console.error("Error encrypting JSON file:", error);
    return false;
  }
}

// Migration functionality - integrated directly into server.js
function migrateToEncrypted() {
  console.log("Starting migration to encrypted JSON files...");

  const filesToEncrypt = [
    "data/afspraken.json",
    "data/users.json",
    "data/instellingen.json",
    "data/pauzes.json",
    "data/offertes.json",
    "data/verkoopPrijzen.json",
  ];

  let encryptedCount = 0;

  filesToEncrypt.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`Encrypting ${file}...`);
      if (encryptJsonFile(file)) {
        console.log(`✓ ${file} encrypted successfully`);
        encryptedCount++;
      } else {
        console.log(`✗ Failed to encrypt ${file}`);
      }
    } else {
      console.log(`- ${file} does not exist, skipping`);
    }
  });

  console.log(`\nMigration complete! ${encryptedCount} files encrypted.`);
  console.log(
    "Files maintain their original names but now contain encrypted data.",
  );
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// JSON file storage (encrypted)
const DATA_FILE = "data/afspraken.json";
const USERS_FILE = "data/users.json";
const SETTINGS_FILE = "data/instellingen.json";
const PAUZES_FILE = "data/pauzes.json";
const OFFERTES_FILE = "data/offertes.json";
const VERKOOP_PRIJZEN_FILE = "data/verkoopPrijzen.json";
let reparaties = [];
let nextId = 1;
let users = [];
let nextUserId = 1;
let pauzes = [];
let nextPauzeId = 1;
let instellingen = {
  startTijd: "08:00",
  eindTijd: "17:00",
  afspraakDuur: 15,
  adminPassword: "admin123",
  dagTijden: {
    maandag: { start: "08:00", eind: "17:00", gesloten: false },
    dinsdag: { start: "08:00", eind: "17:00", gesloten: false },
    woensdag: { start: "08:00", eind: "17:00", gesloten: false },
    donderdag: { start: "08:00", eind: "17:00", gesloten: false },
    vrijdag: { start: "08:00", eind: "17:00", gesloten: false },
    zaterdag: { start: "08:00", eind: "17:00", gesloten: true },
    zondag: { start: "08:00", eind: "17:00", gesloten: true },
  },
};
let offertes = [];
let verkoopPrijzen = {};

// Create data directory if it doesn't exist
if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

// Run migration on server start if needed
const shouldMigrate =
  process.argv.includes("--migrate") ||
  process.env.MIGRATE_TO_ENCRYPTED === "true";
if (shouldMigrate) {
  migrateToEncrypted();
}

// Repair data management (encrypted)
function laadReparaties() {
  try {
    const parsedData = loadEncryptedJson(DATA_FILE);
    if (parsedData) {
      reparaties = parsedData.reparaties || [];
      nextId = parsedData.nextId || 1;
    }
  } catch (error) {
    console.error("Fout bij laden van reparaties:", error);
    reparaties = [];
    nextId = 1;
  }
}

function slaReparatiesOp() {
  try {
    const data = {
      reparaties: reparaties,
      nextId: nextId,
    };
    saveEncryptedJson(DATA_FILE, data);
  } catch (error) {
    console.error("Fout bij opslaan van reparaties:", error);
  }
}

// User data management (encrypted)
function laadUsers() {
  try {
    // Check if encrypted .enc version exists and migrate it
    if (fs.existsSync(USERS_FILE + ".enc")) {
      const encryptedData = fs.readFileSync(USERS_FILE + ".enc", "utf8");
      const decryptedData = decrypt(encryptedData);
      const parsedData = JSON.parse(decryptedData);

      // Save to original filename with encrypted content
      const encryptedContent = encrypt(decryptedData);
      fs.writeFileSync(USERS_FILE, encryptedContent, "utf8");

      // Remove .enc version
      fs.unlinkSync(USERS_FILE + ".enc");

      users = parsedData.users || [];
      nextUserId = parsedData.nextUserId || 1;
      return;
    }

    // Load from original file (encrypted content)
    if (fs.existsSync(USERS_FILE)) {
      const encryptedData = fs.readFileSync(USERS_FILE, "utf8");
      const decryptedData = decrypt(encryptedData);
      const parsedData = JSON.parse(decryptedData);
      users = parsedData.users || [];
      nextUserId = parsedData.nextUserId || 1;
    }
  } catch (error) {
    console.error("Fout bij laden van users:", error);
    users = [];
    nextUserId = 1;
  }
}

function slaUsersOp() {
  try {
    const data = {
      users: users,
      nextUserId: nextUserId,
    };
    const jsonData = JSON.stringify(data, null, 2);
    const encryptedData = encrypt(jsonData);
    fs.writeFileSync(USERS_FILE, encryptedData, "utf8");
  } catch (error) {
    console.error("Fout bij opslaan van users:", error);
  }
}

// Settings management (encrypted)
function laadInstellingen() {
  try {
    const geladen = loadEncryptedJson(SETTINGS_FILE);
    if (geladen) {
      instellingen = {
        ...instellingen,
        ...geladen,
      };
    }
  } catch (error) {
    console.error("Fout bij laden van instellingen:", error);
  }
}

function slaInstellingenOp() {
  try {
    saveEncryptedJson(SETTINGS_FILE, instellingen);
  } catch (error) {
    console.error("Fout bij opslaan van instellingen:", error);
  }
}

// Break management (encrypted)
function laadPauzes() {
  try {
    const parsedData = loadEncryptedJson(PAUZES_FILE);
    if (parsedData) {
      pauzes = parsedData.pauzes || [];
      nextPauzeId = parsedData.nextPauzeId || 1;
    }
  } catch (error) {
    console.error("Fout bij laden van pauzes:", error);
    pauzes = [];
    nextPauzeId = 1;
  }
}

function slaPauzesOp() {
  try {
    const data = {
      pauzes: pauzes,
      nextPauzeId: nextPauzeId,
    };
    saveEncryptedJson(PAUZES_FILE, data);
  } catch (error) {
    console.error("Fout bij opslaan van pauzes:", error);
  }
}

// Quotation file management (encrypted)
function readOffertes() {
  try {
    const data = loadEncryptedJson(OFFERTES_FILE);
    return data || [];
  } catch (error) {
    return [];
  }
}

function writeOffertes(offertesData) {
  saveEncryptedJson(OFFERTES_FILE, offertesData);
}

// Sales price file management (encrypted)
function laadVerkoopPrijzen() {
  try {
    const data = loadEncryptedJson(VERKOOP_PRIJZEN_FILE);
    verkoopPrijzen = data || {};
  } catch (error) {
    console.error("Fout bij laden van verkoopprijzen:", error);
    verkoopPrijzen = {};
  }
}

function slaVerkoopPrijzenOp() {
  try {
    saveEncryptedJson(VERKOOP_PRIJZEN_FILE, verkoopPrijzen);
  } catch (error) {
    console.error("Fout bij opslaan van verkoopprijzen:", error);
  }
}

// Load data on server start
laadReparaties();
laadUsers();
laadInstellingen();
laadPauzes();
laadVerkoopPrijzen();

// API endpoint to manually trigger migration
app.post("/api/migrate-encrypt", (req, res) => {
  try {
    migrateToEncrypted();
    res.json({ success: true, message: "Migration completed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Migration failed: " + error.message });
  }
});

// User routes
app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alle velden zijn verplicht" });
  }

  const bestaandeUser = users.find((u) => u.username === username);
  if (bestaandeUser) {
    return res.status(400).json({ error: "Gebruikersnaam bestaat al" });
  }

  const bestaandeEmail = users.find((u) => u.email === email);
  if (bestaandeEmail) {
    return res.status(400).json({ error: "Email bestaat al" });
  }

  const user = {
    id: nextUserId++,
    username,
    email,
    password,
    aangemaakt: new Date().toISOString(),
  };

  users.push(user);
  slaUsersOp();
  res.json({ success: true, userId: user.id, username: user.username });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Gebruikersnaam en wachtwoord zijn verplicht" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) {
    return res
      .status(400)
      .json({ error: "Ongeldige gebruikersnaam of wachtwoord" });
  }

  res.json({ success: true, userId: user.id, username: user.username });
});

app.post("/api/admin-login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Wachtwoord is verplicht" });
  }

  if (password !== instellingen.adminPassword) {
    return res.status(400).json({ error: "Onjuist admin wachtwoord" });
  }

  res.json({ success: true, message: "Admin toegang verleend" });
});

// Repair routes
app.get("/api/reparaties", (req, res) => {
  const gesorteerdeReparaties = reparaties.sort((a, b) => {
    const datumA = new Date(a.datum + "T" + a.tijd);
    const datumB = new Date(b.datum + "T" + b.tijd);
    return datumA - datumB;
  });
  res.json(gesorteerdeReparaties);
});

app.get("/api/reparaties/user/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  const userReparaties = reparaties
    .filter((r) => r.userId === userId)
    .sort((a, b) => {
      const datumA = new Date(a.datum + "T" + a.tijd);
      const datumB = new Date(b.datum + "T" + b.tijd);
      return datumA - datumB;
    });

  res.json(userReparaties);
});

app.get("/api/reparaties/:id", (req, res) => {
  const reparatieId = parseInt(req.params.id);
  const reparatie = reparaties.find((r) => r.id === reparatieId);

  if (!reparatie) {
    return res.status(404).json({ error: "Reparatie niet gevonden" });
  }

  res.json(reparatie);
});

app.get("/api/beschikbare-tijden/:datum", (req, res) => {
  const datum = req.params.datum;
  const bezetteTijden = reparaties
    .filter((r) => r.datum === datum)
    .map((r) => r.tijd);

  const alleTijden = genereerTijdSlots(datum);
  const beschikbareTijden = alleTijden.filter(
    (tijd) => !bezetteTijden.includes(tijd),
  );

  res.json(beschikbareTijden);
});

app.post("/api/reparaties", (req, res) => {
  const { klantNaam, beschrijving, datum, tijd, userId } = req.body;

  if (!klantNaam || !beschrijving || !datum || !tijd || !userId) {
    return res.status(400).json({ error: "Vul alle verplichte velden in" });
  }

  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) {
    return res.status(400).json({ error: "Ongeldige gebruiker" });
  }

  const bestaandeReparatie = reparaties.find(
    (r) => r.datum === datum && r.tijd === tijd,
  );
  if (bestaandeReparatie) {
    return res
      .status(400)
      .json({ error: "Deze tijd is al bezet. Kies een andere tijd." });
  }

  const reparatie = {
    id: nextId++,
    klantNaam,
    beschrijving,
    datum,
    tijd,
    eindTijd: berekenEindTijd(tijd),
    status: "Gepland",
    userId: parseInt(userId),
    username: user.username,
    aangemaakt: new Date().toISOString(),
  };

  reparaties.push(reparatie);
  slaReparatiesOp();
  res.json(reparatie);
});

app.delete("/api/reparaties/:id", (req, res) => {
  const id = parseInt(req.params.id);
  reparaties = reparaties.filter((r) => r.id !== id);
  slaReparatiesOp();
  res.json({ success: true });
});

app.put("/api/reparaties/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is verplicht" });
  }

  const reparatie = reparaties.find((r) => r.id === id);
  if (!reparatie) {
    return res.status(404).json({ error: "Reparatie niet gevonden" });
  }

  reparatie.status = status;
  if (status === "Gereed") {
    reparatie.gereedOp = new Date().toISOString();
  }

  slaReparatiesOp();
  res.json(reparatie);
});

// Settings routes
app.get("/api/instellingen", (req, res) => {
  res.json(instellingen);
});

app.post("/api/instellingen", (req, res) => {
  const { afspraakDuur, dagTijden, adminPassword } = req.body;

  if (afspraakDuur !== undefined) {
    if (afspraakDuur < 5 || afspraakDuur > 120) {
      return res
        .status(400)
        .json({ error: "Afspraakduur moet tussen 5 en 120 minuten zijn" });
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
  const [uren, minuten] = startTijd.split(":").map(Number);
  const startMinuten = uren * 60 + minuten;
  const eindMinuten = startMinuten + instellingen.afspraakDuur;
  const eindUren = Math.floor(eindMinuten / 60);
  const restMinuten = eindMinuten % 60;
  return `${eindUren.toString().padStart(2, "0")}:${restMinuten.toString().padStart(2, "0")}`;
}

// Break routes
app.get("/api/pauzes", (req, res) => {
  const gesorteerde = pauzes.sort((a, b) => {
    const datumA = new Date(a.datum + "T" + a.start);
    const datumB = new Date(b.datum + "T" + b.start);
    return datumA - datumB;
  });
  res.json(gesorteerde);
});

app.post("/api/pauzes", (req, res) => {
  const { datum, start, eind, beschrijving } = req.body;

  if (!datum || !start || !eind || !beschrijving) {
    return res.status(400).json({ error: "Alle velden zijn verplicht" });
  }

  if (start >= eind) {
    return res
      .status(400)
      .json({ error: "Start tijd moet voor eind tijd zijn" });
  }

  const pauze = {
    id: nextPauzeId++,
    datum,
    start,
    eind,
    beschrijving,
    aangemaakt: new Date().toISOString(),
  };

  pauzes.push(pauze);
  slaPauzesOp();
  res.json(pauze);
});

app.delete("/api/pauzes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pauzes = pauzes.filter((p) => p.id !== id);
  slaPauzesOp();
  res.json({ success: true });
});

// Repair-based quotation API endpoints
app.post("/api/reparaties/:id/offerte", (req, res) => {
  const reparatieId = parseInt(req.params.id);
  const { probleem, werkzaamheden, prijs } = req.body;

  if (!probleem || !werkzaamheden || !prijs) {
    return res.status(400).json({ error: "Alle velden zijn verplicht" });
  }

  const reparatie = reparaties.find((r) => r.id === reparatieId);
  if (!reparatie) {
    return res.status(404).json({ error: "Reparatie niet gevonden" });
  }

  if (reparatie.heeftOfferte) {
    return res
      .status(400)
      .json({ error: "Deze reparatie heeft al een offerte" });
  }

  reparatie.heeftOfferte = true;
  reparatie.offerteProbleem = probleem;
  reparatie.offerteWerkzaamheden = werkzaamheden;
  reparatie.offertePrijs = parseFloat(prijs);
  reparatie.offerteStatus = "Pending";
  reparatie.offerteAangemaakt = new Date().toISOString();

  slaReparatiesOp();
  res.json({ success: true, message: "Offerte toegevoegd aan reparatie" });
});

app.get("/api/reparaties/user/:userId/offertes", (req, res) => {
  const userId = parseInt(req.params.userId);

  const userReparaties = reparaties
    .filter((r) => r.userId === userId && r.heeftOfferte)
    .sort((a, b) => {
      const datumA = new Date(a.datum + "T" + a.tijd);
      const datumB = new Date(b.datum + "T" + b.tijd);
      return datumA - datumB;
    });

  res.json(userReparaties);
});

app.put("/api/reparaties/:id/offerte/accept", (req, res) => {
  const reparatieId = parseInt(req.params.id);

  const reparatie = reparaties.find((r) => r.id === reparatieId);
  if (!reparatie) {
    return res.status(404).json({ error: "Reparatie niet gevonden" });
  }

  if (!reparatie.heeftOfferte) {
    return res.status(400).json({ error: "Deze reparatie heeft geen offerte" });
  }

  if (reparatie.offerteStatus !== "Pending") {
    return res.status(400).json({ error: "Offerte is al beantwoord" });
  }

  reparatie.offerteStatus = "Geaccepteerd";
  reparatie.offerteGeaccepteerdOp = new Date().toISOString();

  slaReparatiesOp();
  res.json({ success: true, message: "Offerte geaccepteerd" });
});

app.put("/api/reparaties/:id/offerte/reject", (req, res) => {
  const reparatieId = parseInt(req.params.id);

  const reparatie = reparaties.find((r) => r.id === reparatieId);
  if (!reparatie) {
    return res.status(404).json({ error: "Reparatie niet gevonden" });
  }

  if (!reparatie.heeftOfferte) {
    return res.status(400).json({ error: "Deze reparatie heeft geen offerte" });
  }

  if (reparatie.offerteStatus !== "Pending") {
    return res.status(400).json({ error: "Offerte is al beantwoord" });
  }

  reparatie.offerteStatus = "Afgewezen";
  reparatie.offerteAfgewezenOp = new Date().toISOString();

  slaReparatiesOp();
  res.json({ success: true, message: "Offerte afgewezen" });
});

// Sales price management API endpoints
app.get("/api/verkoop-prijzen", (req, res) => {
  res.json(verkoopPrijzen);
});

app.post("/api/verkoop-prijzen", (req, res) => {
  const { merk, model, prijs } = req.body;

  if (!merk || !model || !prijs) {
    return res.status(400).json({ error: "Alle velden zijn verplicht" });
  }

  if (prijs < 0) {
    return res.status(400).json({ error: "Prijs moet positief zijn" });
  }

  const key = `${merk}-${model}`;
  verkoopPrijzen[key] = {
    merk,
    model,
    prijs: parseFloat(prijs),
    laatstGewijzigd: new Date().toISOString(),
  };

  slaVerkoopPrijzenOp();
  res.json({ success: true, message: "Prijs opgeslagen" });
});

// Delete verkoop prijs
app.delete("/api/verkoop-prijzen/:key", (req, res) => {
  try {
    const { key } = req.params;

    laadVerkoopPrijzen();

    if (verkoopPrijzen[key]) {
      delete verkoopPrijzen[key];
      slaVerkoopPrijzenOp();
      res.json({ success: true, message: "Prijs succesvol verwijderd" });
    } else {
      res.status(404).json({ error: "Prijs niet gevonden" });
    }
  } catch (error) {
    console.error("Error deleting verkoop prijs:", error);
    res.status(500).json({ error: "Server fout bij verwijderen van prijs" });
  }
});

// Products management
let producten = [];

function loadProducten() {
  try {
    if (fs.existsSync("./data/producten.json")) {
      const data = fs.readFileSync("./data/producten.json", "utf8");
      producten = JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading products:", error);
    producten = [];
  }
}

function saveProducten() {
  try {
    fs.writeFileSync(
      "./data/producten.json",
      JSON.stringify(producten, null, 2),
    );
  } catch (error) {
    console.error("Error saving products:", error);
  }
}

// Get all products
app.get("/api/producten", (req, res) => {
  loadProducten();
  res.json(producten);
});

// Add new product
app.post("/api/producten", (req, res) => {
  const { naam, merk, conditie, prijs, beschrijving, afbeelding } = req.body;

  if (!naam || !merk || !conditie || !prijs) {
    return res.status(400).json({ error: "Vul alle verplichte velden in" });
  }

  loadProducten();

  const nieuwProduct = {
    id: Date.now(),
    naam,
    merk,
    conditie,
    prijs: parseFloat(prijs),
    beschrijving: beschrijving || "",
    afbeelding: afbeelding || "",
    toegevoegdOp: new Date().toISOString(),
  };

  producten.push(nieuwProduct);
  saveProducten();

  res.json({ success: true, product: nieuwProduct });
});

// Delete product
app.delete("/api/producten/:id", (req, res) => {
  const { id } = req.params;

  loadProducten();

  const index = producten.findIndex((p) => p.id === parseInt(id));
  if (index !== -1) {
    producten.splice(index, 1);
    saveProducten();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Product niet gevonden" });
  }
});

app.get("/api/schat-prijs", (req, res) => {
  const { merk, model } = req.query;

  if (!merk || !model) {
    return res.status(400).json({ error: "Merk en model zijn verplicht" });
  }

  const key = `${merk}-${model}`;
  const prijsInfo = verkoopPrijzen[key];

  if (!prijsInfo) {
    return res
      .status(404)
      .json({ error: "Prijs voor dit model niet gevonden" });
  }

  res.json({
    merk: prijsInfo.merk,
    model: prijsInfo.model,
    geschattePrijs: prijsInfo.prijs,
  });
});

function getDagNaam(datum) {
  const dagen = [
    "zondag",
    "maandag",
    "dinsdag",
    "woensdag",
    "donderdag",
    "vrijdag",
    "zaterdag",
  ];
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

    startTijd = dagInstellingen
      ? dagInstellingen.start
      : instellingen.startTijd;
    eindTijd = dagInstellingen ? dagInstellingen.eind : instellingen.eindTijd;
  } else {
    startTijd = instellingen.startTijd;
    eindTijd = instellingen.eindTijd;
  }

  const tijden = [];
  const [startUur, startMinuut] = startTijd.split(":").map(Number);
  const [eindUur, eindMinuut] = eindTijd.split(":").map(Number);
  const startTotaalMinuten = startUur * 60 + startMinuut;
  const eindTotaalMinuten = eindUur * 60 + eindMinuut;
  const intervalMinuten = instellingen.afspraakDuur;

for (
  let minuten = startTotaalMinuten;
  minuten < eindTotaalMinuten;
  minuten += intervalMinuten
) {
  const uren = Math.floor(minuten / 60);
  const restMinuten = minuten % 60;
  const tijd = `${uren.toString().padStart(2, "0")}:${restMinuten
    .toString()
    .padStart(2, "0")}`;

  const tijdInPauze = pauzes.some((pauze) => {
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

// ⬇️ extra erbij: zip-download route
const archiver = require("archiver");

app.get("/download-data", (req, res) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  res.attachment("data.zip");
  archive.pipe(res);
  archive.directory(path.join(__dirname, "../data"), false);
  archive.finalize();
});

// server starten
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server draait op poort ${PORT}`);
  console.log(
    "To migrate existing files to encrypted format, restart with --migrate flag or set MIGRATE_TO_ENCRYPTED=true",
  );
});
