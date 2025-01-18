const fsp = require("node:fs/promises");
const dirPath = __dirname + '/files';
const destPath = __dirname + '/files-copy';
async function main() {

  try {
    console.log('Try to create directory [files-copy]...');
    await fsp.mkdir(destPath);
    console.log('Directory created!');

  } catch (error) {
    console.log('Directory already exist!');
  }

  try {
    console.log('Try to read directory [files]...');
    const data = await fsp.readdir(dirPath);
    console.log('Read complete!');
    console.log('Start copy files...');
    data.forEach(async file => {
      const filePath = `${dirPath}/${file}`;
      const stats = await fsp.stat(filePath);

      if (stats.isFile()) {
        console.log(`Copy file [${file}]...`);

        try {
          await fsp.copyFile(filePath, `${destPath}/${file}`);
        } catch (error) {
          console.log(`Error during file copying [${file}]!`);
        }
      }

    });


  } catch (error) {
    console.log('Faled to read directory [files]!',);

  }




}
main();
