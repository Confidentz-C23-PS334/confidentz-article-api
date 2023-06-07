const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

// Middleware untuk mengurai body permintaan menjadi JSON
app.use(bodyParser.json());

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('./rest-api-firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Baca file JSONL
const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('data.jsonl');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  // Parsing baris sebagai objek JSON
  const data = JSON.parse(line);

  // Simpan data ke koleksi "artikel" di Cloud Firestore
  db.collection('artikel').add(data)
    .catch((error) => {
      console.error('Gagal memasukkan data:', error);
    });
});

// Mendapatkan semua data
app.get('/artikel', (req, res) => {
  db.collection('artikel').get()
    .then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      res.json(data);
    })
    .catch((error) => {
      console.error('Error retrieving data:', error);
      res.status(500).send('Error retrieving data');
    });
});

// Mendapatkan data berdasarkan ID
app.get('/artikel/:id', (req, res) => {
  const id = req.params.id;
  const docRef = db.collection('artikel').doc(id);
  docRef.get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        res.json(data);
      } else {
        res.status(404).send('Data not found');
      }
    })
    .catch((error) => {
      console.error('Error retrieving data:', error);
      res.status(500).send('Error retrieving data');
    });
});

// Menambahkan data baru
app.post('/artikel', (req, res) => {
  const data = req.body;
  db.collection('artikel').add(data)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('Error writing data:', error);
      res.status(500).send('Error writing data');
    });
});

// Mengupdate data berdasarkan ID
app.put('/artikel/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const docRef = db.collection('artikel').doc(id);
  docRef.update(data)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error updating data:', error);
      res.status(500).send('Error updating data');
    });
});

// Menghapus data berdasarkan ID
app.delete('/artikel/:id', (req, res) => {
  const id = req.params.id;
  const docRef = db.collection('artikel').doc(id);
  docRef.delete()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error deleting data:', error);
      res.status(500).send('Error deleting data');
    });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


//Command
/* GET /data: Ambil semua data
GET /data/:id: Ambil data berdasarkan ID
POST /data: Tambah data baru
PUT /data/:id: Update data berdasarkan ID
DELETE /data/:id: Hapus data berdasarkan ID*/