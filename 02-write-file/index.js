const fsp = require("node:fs/promises");
const fs = require("node:fs");
const readline = require("node:readline");

const filePath = `${__dirname}/text.txt`;

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion() {
  return new Promise((resolve) => {
    userInterface.question("[Enter text to save]:", userInput => resolve(userInput))
  })
}




const textFile = fs.createWriteStream(filePath, {
  flags: 'a'
});

const main = async () => {
  console.log('Read file [text.txt]...');
  let fileIsEmpty = true, isNewFile = false;
  try {
    const stats = await fsp.stat(filePath);
    fileIsEmpty = stats.size === 0;
  } catch (err) {
    console.log('[text.txt] not found. Creating new one...');
    isNewFile = true;
  }


  if (!fileIsEmpty) {
    console.log('File is not empty. Adding text to existing file.');
  }
  if (!isNewFile && fileIsEmpty) {
    console.log('File is empty. Add some text to it.');
  }


  let userInput = '';
  do {
    userInput = await askQuestion();
    if (userInput.toLocaleLowerCase() === 'exit') {
      break;
    }
    textFile.write(fileIsEmpty ? userInput : `\n${userInput}`);
    fileIsEmpty = false;

  } while (true);

  userInterface.close()
}
main();

process.on('exit', () => {
  textFile.close();
  console.log("\nBy By!")
}) 