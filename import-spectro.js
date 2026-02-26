#!/usr/bin/env node

const fs = require("fs");
const csv = require("csv-parser");
const mysql = require("mysql2/promise");

const file = process.argv[2];

if (!file) {
  console.log("Usage: import-spectro <csv-file>");
  process.exit(1);
}

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

function isValidRow(row) {
  const cct = parseFloat(row['CCT(K)']);
  if (!isNaN(cct) && (cct < 3000 || cct > 6000)) {
    return { valid: false, reason: `CCT ${cct} out of range (3000-6000)` };
  }
  const peakSignal = parseFloat(row['Peak Signal']);
  if (!isNaN(peakSignal) && (peakSignal < 50000 || peakSignal > 100000)) {
    return { valid: false, reason: `Peak Signal ${peakSignal} out of range (50000-100000)` };
  }
  return { valid: true };
}

(async () => {
  const passconnection = await mysql.createConnection(passConfig);
  const discardedConnection = await mysql.createConnection(discardedConfig);
  const allConnection = await mysql.createConnection(allConfig);

  const rows = [];
  let discarded = 0;
  const discardedRows = [];
  const discardedLog = [];

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
      const validation = isValidRow(data);
      if (validation.valid) {
        rows.push(data);
      } else {
        discarded++;
        discardedRows.push({ ...data, discard_reason: validation.reason });
        discardedLog.push(`${data['Barcode'] || 'Unknown'}: ${validation.reason}`);
      }
    })
    .on("end", async () => {

      const validCols = Object.keys(rows[0]).filter(c => c !== "");

      const cols = validCols.map(c => `\`${c}\``).join(", ");
      const placeholders = validCols.map(() => "?").join(", ");

      const sql = `INSERT INTO reading_list (${cols}) VALUES (${placeholders})`;

      for (const row of rows) {
        await allConnection.execute(sql, validCols.map(c => row[c]));
      }

      // Handle discarded rows
      if (discardedRows.length > 0) {
        const discardedCols = [...validCols, 'discard_reason'];
        const discardedColsStr = discardedCols.map(c => `\`${c}\``).join(", ");
        const discardedPlaceholders = discardedCols.map(() => "?").join(", ");

        // const createDiscardedTableSql = `CREATE TABLE IF NOT EXISTS discarded_readings (${discardedCols.map(c => c === 'discard_reason' ? `\`${c}\` TEXT` : `\`${c}\` VARCHAR(255)`).join(", ")})`;
        // await discardedConnection.execute(createDiscardedTableSql);

        const discardedSql = `INSERT INTO discarded_readings (${discardedColsStr}) VALUES (${discardedPlaceholders})`;
        for (const row of discardedRows) {
          await discardedConnection.execute(discardedSql, discardedCols.map(c => row[c]));
        }
      }

      // if (passRows.length > 0) {
      //   const passCols = [...validCols];
      //   const passColsStr = passCols.map(c => `\`${c}\``).join(", ");
      //   const passPlaceholders = passCols.map(() => "?").join(", ");

      //   // const createDiscardedTableSql = `CREATE TABLE IF NOT EXISTS discarded_readings (${discardedCols.map(c => c === 'discard_reason' ? `\`${c}\` TEXT` : `\`${c}\` VARCHAR(255)`).join(", ")})`;
      //   // await discardedConnection.execute(createDiscardedTableSql);

      //   const passSql = `INSERT INTO reading_list (${passColsStr}) VALUES (${passPlaceholders})`;
      //   for (const row of discardedRows) {
      //     await allConnection.execute(passSql, passCols.map(c => row[c]));
      //   }
      // }

      await passconnection.end();
      await discardedConnection.end();
      await allConnection.end();
      console.log(Object.keys(rows[0]));
      console.log(`Imported ${rows.length + discarded} rows, discarded ${discarded} rows, passed ${rows.length} rows.`);
      if (discarded > 0) {
        console.log(`Discarded barcodes: ${discardedLog.join('\n')}`);
      }
      console.log("✅ Import complete");
    });

    

})();