const express = require('express');
const mysql = require('mysql2/promise');
const QRCode = require('qrcode');

const app = express();
const port = 3000;

const passConfig = {
  host: "localhost",
  user: "root",
  password: "VHPTDB123",
  database: "sdata"
};

const discardedConfig = {
  host: "localhost",
  user: "root",
  password: "VHPTDB123",
  database: "fdata"
};

const allConfig = {
  host: "localhost",
  user: "root",
  password: "VHPTDB123",
  database: "alldata"
};

app.use(express.static('.')); // serve static files

app.get('/api/data', async (req, res) => {
  try {
    const connection = await mysql.createConnection(allConfig);
    const [rows] = await connection.execute('SELECT * FROM reading_list LIMIT 20'); // limit for demo
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/discarded', async (req, res) => {
  try {
    const connection = await mysql.createConnection(discardedConfig);
    const [rows] = await connection.execute('SELECT * FROM discarded_readings LIMIT 20'); // limit for demo
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Explicit endpoint for passed readings (reading_list)
app.get('/api/passed', async (req, res) => {
  try {
    const connection = await mysql.createConnection(passConfig);
    const [rows] = await connection.execute('SELECT * FROM reading_list LIMIT 100'); // increase limit for Passed view
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/qr/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const connection = await mysql.createConnection(allConfig);

    const [rows] = await connection.execute(
      'SELECT Barcode FROM reading_list WHERE id = ?',
      [id]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).send('Not found');
    }

    const barcode = rows[0].Barcode;

    const qrText = `http://localhost:3000/View.html?id=${id}`;

    const qrImage = await QRCode.toBuffer(qrText);

    res.type('png');
    res.send(qrImage);

  } catch (error) {
    console.error(error);
    res.status(500).send('QR generation failed');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});