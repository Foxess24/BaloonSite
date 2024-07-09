const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const axios = require("axios");
//const nodemailer = require("nodemailer");

// Inizializzazione Firebase Admin SDK
const serviceAccount = require("./permission.json");
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://balon-d-or.firebaseio.com",
    storageBucket: "balon-d-or.appspot.com",
  });
  console.log("Firebase Admin SDK inizializzato con successo.");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
}

const app = express();
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
const storage = admin.storage().bucket();
const db = admin.firestore();

// Configurazione Multer per l'upload delle immagini
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite di 5MB per l'immagine
  },
});

// Middleware per il logging delle richieste in arrivo
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

//API
// Endpoint per il login
app.post("/api/loginUtente", async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    // Effettua la richiesta di login a Firebase
    const response = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAUc4bON1FswPaYCBUqyqr7nXJb6Mf-KCs",
      loginData
    );

    res.json(response.data);
  } catch (error) {
    //console.error("Errore durante LOGIN:", error);
    res.status(500).json({ error: "Errore durante LOGIN" });
  }
});

// Endpoint GET utente
app.get("/api/getUtente/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userDoc = await admin
      .firestore()
      .collection("utenti")
      .doc(userId)
      .get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    const userData = userDoc.data();
    res.status(200).json(userData);
  } catch (error) {
    //console.error("Errore durante GET utente:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// Endpoint DELETE utente
app.delete("/api/deleteUtenteByID/:userId", async (req, res) => {
  const id = req.params.userId;

  try {
    await db.doc(`utenti/${id}`).delete();
    await admin.auth().deleteUser(id);

    res.status(200).json({ message: "Utente eliminato con successo" });
  } catch (error) {
    //console.error("Errore durante DELETE utente:", error);
    res.status(500).json({ error: "Errore durante DELETE utente" });
  }
});

// Endpoint POST utente
app.post("/api/createUtente", async (req, res) => {
  const { email, password, nome, cognome, username, admin1 } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    const dati = {
      nome: nome,
      email: email,
      cognome: cognome,
      username: username,
      admin: admin1 === "true" ? true : false,
    };

    await db.collection("utenti").doc(userRecord.uid).set(dati);

    res.status(201).json({ message: "Utente creato con successo" });
  } catch (error) {
    //console.error("Errore POST utente:", error);
    res.status(500).json({ error: "Errore durante POST utente" });
  }
});

// Endpoint GET isAdmin
app.get("/api/isAdmin/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userDoc = await db.collection("utenti").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const isAdmin = userDoc.data().admin === true;
    res.json(isAdmin);
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// Endpoint POST prodotto
app.post("/api/postProdotto", upload.single("immagine"), async (req, res) => {
  try {
    const { nome, codice, quantita, prezzo, descrizione } = req.body;
    const immagine = req.file;

    // Upload dell'immagine nello storage Firebase
    const filePath = `immaginiProdotti/${immagine.originalname}`;
    const fileUpload = storage.file(filePath);
    const fileStream = fileUpload.createWriteStream({
      metadata: {
        contentType: immagine.mimetype,
      },
    });

    fileStream.on("error", (err) => {
      console.error("Errore durante l'upload dell'img:", err);
      res.status(500).json({ error: "Errore durante l'upload dell'img." });
    });

    fileStream.on("finish", async () => {
      try {
        // URL dell'immagine caricata
        const [url] = await fileUpload.getSignedUrl({
          action: "read",
          expires: "01-01-2030",
        });

        await db.collection("prodotti").add({
          nome,
          codice,
          quantita: parseInt(quantita),
          prezzo: parseFloat(prezzo),
          descrizione,
          url, // URL img caricata
        });

        res
          .status(201)
          .json({ message: "Prodotto aggiunto correttamente", url });
      } catch (error) {
        console.error("Errore durante POST prodotto:", error);
        res.status(500).json({ error: "Errore durante POST prodotto" });
      }
    });

    fileStream.end(immagine.buffer);
  } catch (error) {
    //console.error("Errore durante gestione POST prodotto: ", error);
    res.status(500).json({ error: "Errore durante gestione POST prodotto." });
  }
});

// Endpoint GET prodotti
app.get("/api/getProdotti", async (req, res) => {
  try {
    const snapshot = await db.collection("prodotti").get();
    const prodotti = [];

    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      prodotti.push({ id, ...data });
    });

    res.json(prodotti);
  } catch (error) {
    //console.error("Errore durante GET prodotti:", error);
    res.status(500).json({ error: "Errore durante GET prodotti" });
  }
});

// Endpoint GET prodotto per ID
app.get("/api/getProdotto/:id", async (req, res) => {
  try {
    const prodottoId = req.params.id;
    const doc = await db.collection("prodotti").doc(prodottoId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Prodotto non trovato" });
    }

    const prodotto = { id: doc.id, ...doc.data() };
    res.json(prodotto);
  } catch (error) {
    //console.error("Errore durante GET prodotto: ", error);
    res.status(500).json({ error: "Errore GET prodotto." });
  }
});

// Endpoint DELETE prodotto per ID
app.delete("/api/deleteProdotto/:id", async (req, res) => {
  try {
    const idProd = req.params.id;
    await db.collection("prodotti").doc(idProd).delete();

    res.json({ message: "Prodotto eliminato con successo" });
  } catch (error) {
    //console.error("Errore durante DELETE prodotto:", error);
    res.status(500).json({ error: "Errore durante DELETE prodotto" });
  }
});

// Endpoint GET ordini
app.get("/api/getOrdini", async (req, res) => {
  try {
    const snapshot = await db.collection("ordini").get();
    const ordini = [];

    snapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      ordini.push({ id, ...data });
    });

    res.json(ordini);
  } catch (error) {
    //console.error("Errore durante GET ordini:", error);
    res.status(500).json({ error: "Errore durante GET ordini" });
  }
});

// Endpoint DELETE ordine
app.delete("/api/deleteOrdine/:id", async (req, res) => {
  try {
    const idOrdine = req.params.id;
    const snapshot = await db
      .collection("ordini")
      .where("id", "==", idOrdine)
      .get();

    // Verifico se l'ordine esiste
    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "Ordine non trovato con ID specificato." });
    }

    const documento = snapshot.docs[0];
    await documento.ref.delete();

    //console.log(`Ordine ${idOrdine} eliminato con successo.`);
    res.status(200).json({ message: `${idOrdine} eliminato con successo.` });
  } catch (error) {
    //console.error("Errore DELETE ordine:", error);
    res.status(500).json({ error: "Errore DELETE ordine." });
  }
});

// Endpoint PUT ordine
app.put("/api/putOrdine/:id", async (req, res) => {
  try {
    const idOrdine = req.params.id;

    const ordineRef = await db
      .collection("ordini")
      .where("id", "==", idOrdine)
      .get();

    // Verifico se ordine esiste e segno come evaso
    if (!ordineRef.empty) {
      const ordineDoc = ordineRef.docs[0];
      await ordineDoc.ref.update({ evaso: true });
      res.status(200).json({
        message: `${idOrdine} update.`,
      });
    } else {
      res.status(404).json({ error: "Ordine non trovato." });
    }
  } catch (error) {
    //console.error("Errore durante PUT: ", error);
    res.status(500).json({ error: "Errore durante PUT." });
  }
});

// Endpoint PUT quantità disponibile da ADD
app.put("/api/putQuantitaAdd/:id", async (req, res) => {
  try {
    const idProdotto = req.params.id;
    const newQuantita = req.body.newQuantita;

    await db
      .collection("prodotti")
      .doc(idProdotto)
      .update({ quantita: newQuantita });

    res.status(200).json({
      message: `Quantità di ${idProdotto} aggiornata.`,
    });
  } catch (error) {
    //console.error("Errore durante PUT quantità del prodotto:", error);
    res.status(500).json({
      error: "Errore durante PUT quantità del prodotto.",
    });
  }
});

// Endpoint PUT quantità disponibile da REMOVE
app.put("/api/putQuantitaRemove/:id", async (req, res) => {
  try {
    const idProd = req.params.id;
    const { quantitaSel, quantitaOld } = req.body;

    const prodottoRef = db.collection("prodotti").doc(idProd);
    // Ottieni i dati del prodotto attuale
    const snapshot = await prodottoRef.get();
    // Verifica se il prodotto esiste nel database
    if (!snapshot.exists) {
      res.status(404).json({ error: "Prodotto non trovato" });
      return;
    }

    const newQuantita = quantitaOld + quantitaSel;
    await prodottoRef.update({ quantita: newQuantita });
    res.status(200).json({ message: "Quantità aggiornata con successo" });
  } catch (error) {
    //console.error("Errore durante PUT quantità del prodotto:", error);
    res.status(500).json({
      error: "Err PUT quantita",
    });
  }
});

// Endpoint POST ordine
app.post("/api/postOrdine", async (req, res) => {
  try {
    const datiOrdine = req.body;
    await db.collection("ordini").add(datiOrdine);

    res.status(200).json({ message: "POST eseguito correttamente." });
  } catch (error) {
    //console.error("Errore durante POST ordine:", error);
    res.status(500).json({ error: "Errore durante POST ordine." });
  }
});

/*// Endpoint POST per recupero password dimenticata DA RIVEDERE
app.post("/api/forgotPSW", async (req, res) => {
  const { email } = req.body;

  try {
    // Configurazione del trasportatore per nodemailer con Temp Mail
    const transporter = nodemailer.createTransport({
      host: "smtp.temp-mail.org",
      port: 587,
      secure: false,
      auth: {
        user: "poboc23488@sfpixel.com", // Indirizzo email temporaneo di Temp Mail
        pass: "", // Password dell'account Temp Mail
      },
    });

    // Opzioni dell'email
    const mailOptions = {
      from: "poboc23488@sfpixel.com", // Inserisci qui il tuo indirizzo email
      to: email,
      subject: "Recupero password",
      text: "La tua password è stata reimpostata con successo.", // Messaggio di testo dell'email
    };

    // Invio dell'email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Errore invio mail:", error);
        res
          .status(500)
          .json({ error: "Errore durante reset password, RITENTA." });
      } else {
        console.log("Email inviata: " + info.response);
        res
          .status(200)
          .json({ message: "Email inviata. Controlla casella di posta." });
      }
    });
  } catch (error) {
    console.error("Errore invio mail:", error);
    res.status(500).json({ error: "Errore durante reset password, RITENTA." });
  }
});*/

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server attivo su porta ${PORT}`);
});
