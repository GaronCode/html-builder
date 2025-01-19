
const fsp = require("node:fs/promises");
const dirPath = __dirname + '/files/';
const destPath = __dirname + '/files-copy/';
async function main() {
  try {
    console.log('Try to create directory [files-copy]...');
    await fsp.mkdir(destPath);
    console.log('Directory created!');

  } catch (error) {
    console.log('Directory already exist!');
  }
  await copy(dirPath, destPath)
  async function copy(from, to) {
    try {
      const data = await fsp.readdir(from);

      data.forEach(async file => {
        const filePath = `${from}/${file}`;
        const stats = await fsp.stat(filePath);

        if (stats.isFile()) {
          console.log(`Copy asset [${file}]...`);

          try {
            await fsp.copyFile(filePath, `${to}/${file}`);
          } catch (error) {
            console.log(`Error during file copying [${file}]!`);
          }

          return;
        }

        if (stats.isDirectory()) {
          await fsp.mkdir(to + file + '/');
          return await copy(from + file + '/', to + file + '/');
        }

      });


    } catch (error) {
      console.log('Faled to read directory [files]!',);

    }
  }



}
main();
