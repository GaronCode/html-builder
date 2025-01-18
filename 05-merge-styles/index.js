const fsp = require("node:fs/promises");
const fs = require("node:fs");

const bundleName = 'bundle.css';
const dirFrom = __dirname + '/styles';
const outputFile = __dirname + '/project-dist/' + bundleName


async function main() {


  try {
    console.log(`Try to open [${bundleName}] file for read...`);
    const outputStream = fs.createWriteStream(outputFile);
    try {
      console.log(`Read CSS files from [styles] directory...`);
      const data = await fsp.readdir(dirFrom);
      data.reduce(async (prom, file) => {
        return prom.then(async () => {
          const filePath = `${dirFrom}/${file}`;
          const stats = await fsp.stat(filePath);
          if (!stats.isFile()) return;
          const splited = file.split('.');
          if (splited.length < 2 || splited.at(-1) !== 'css') return;

          const fileData = await fsp.readFile(filePath, { encoding: 'utf8' });
          console.log(`Write [${file}] to [${bundleName}]...`);

          outputStream.write(`/* [${file}] */\n${fileData}\n`);
        });



      }, Promise.resolve());

    } catch (error) {
      console.log('Error during read [styles] directory!', error);

    }


  } catch (error) {
    console.log(`Error during file [${bundleName}] opening!`, error);
  }

  // try {
  //   console.log('Try to read directory [files]...');
  //   const data = await fsp.readdir(dirPath);
  //   console.log('Read complete!');
  //   console.log('Start copy files...');
  //   data.forEach(async file => {
  //     const filePath = `${dirPath}/${file}`;
  //     const stats = await fsp.stat(filePath);

  //     if (stats.isFile()) {
  //       console.log(`Copy file [${file}]...`);

  //       try {
  //         await fsp.copyFile(filePath, `${destPath}/${file}`);
  //       } catch (error) {
  //         console.log(`Error during file copying [${file}]!`);
  //       }
  //     }

  //   });


  // } catch (error) {
  //   console.log('Faled to read directory [files]!',);

  // }




}
main();


