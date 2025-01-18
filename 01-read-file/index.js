const fs = require('node:fs');
const readline = require('node:readline');
const filePath = `${__dirname}/text.txt`;
try {
  const file = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false
  });
  console.log(`open file`);
  console.log(`----BEGIN----text.txt----BEGIN----`);
  let index = 1;
  file.on('line', (line) => {
    console.log(`[${index++}]: ${line}`);
  });
  file.on('close', () => {

    console.log(`-----END-----text.txt-----END-----`);
  })

} catch (error) {
  console.log(`Error open file ${filePath}`);

}


