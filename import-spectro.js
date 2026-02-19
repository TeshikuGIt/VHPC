#!/usr/bin/env node

const fs = require("fs");
const csv = require("csv-parser");
const mysql = require("mysql2/promise");

const file = process.argv[2];

if (!file) {
  console.log("Usage: import-spectro <csv-file>");
  process.exit(1);
}

const config = {
  host: "localhost",
  user: "root",
  password: "VHPTDB123",
  database: "vhptest"
};

(async () => {
  const connection = await mysql.createConnection(config);

  const rows = [];

  fs.createReadStream(file)
    .pipe(csv({
      mapHeaders: ({ header }) => header.trim(),
      strict: false
    }))
    .on("data", (data) => {
      // remove empty keys like ""
      Object.keys(data).forEach(k => {
        if (!k) delete data[k];
      });
      rows.push(data);
    })
    .on("end", async () => {

      const validCols = Object.keys(rows[0]).filter(c => c !== "");

      const cols = validCols.map(c => `\`${c}\``).join(", ");
      const placeholders = validCols.map(() => "?").join(", ");

      const sql = `INSERT INTO reading_list (${cols}) VALUES (${placeholders})`;

      for (const row of rows) {
        await connection.execute(sql, validCols.map(c => row[c]));
      }

      await connection.end();
      console.log("✅ Import complete");
      console.log(Object.keys(rows[0]));
    });
})();
