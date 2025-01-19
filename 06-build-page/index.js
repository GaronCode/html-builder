const fsp = require("node:fs/promises");
const fs = require("node:fs");
const readline = require('node:readline');



const outputDir = 'project-dist';
const outputTemplateName = 'template.html';
const outputCssName = 'style.css';
const assetsDirName = 'assets';

const enterPoint = "template.html";
const componentsDir = __dirname + '/components/';
const stylesDir = __dirname + '/styles/';
const assetsDir = __dirname + '/assets/';


function logComplete(...a) {
  console.log("\x1b[32m", ...a, "\x1b[0m");
}
function logError(...a) {
  console.log("\x1b[31m", ...a, "\x1b[0m");
}
function logHeader(...a) {
  console.log("\x1b[46m", ...a, "\x1b[0m");
}

const outputFullPath = __dirname + '/' + outputDir + '/';
async function main() {
  console.log("\x1b[0m", 'HTML Builder 0.0.1 Started!');

  const outputDirPath = __dirname + '/' + outputDir;
  logHeader('Clearing old project build...');
  try {
    await fsp.rm(outputDirPath, { recursive: true, force: true });
    logComplete("Crearing complete!", '\n');
  } catch (error) {
    logError('Error clearing old build dir! ', error);
  }
  try {
    await fsp.mkdir(outputDirPath);
  } catch (error) {
    logError('Error then create build dir! ', error);
  }
  logHeader(`Create [${outputTemplateName}] bundle file...`);
  const templateStream = fs.createWriteStream(outputFullPath + outputTemplateName);
  const enterPointStream = fs.createReadStream(__dirname + '/' + enterPoint);


  const rlInterface = readline.createInterface({
    input: enterPointStream,
    crlfDelay: Infinity
  });

  for await (let HTML_Line of rlInterface) {
    let startIndex = HTML_Line.indexOf("{{");
    if (startIndex === -1) {
      templateStream.write(HTML_Line + '\n');
      continue;
    }
    let endIndex;

    while (startIndex !== -1) {
      templateStream.write(HTML_Line.slice(0, startIndex));
      endIndex = HTML_Line.indexOf("}}");

      const componentName = HTML_Line.slice(startIndex + 2, endIndex)
      try {
        const componentFilePath = componentsDir + componentName + '.html'
        console.log(`Inject [${componentName}]...`);
        const fileData = await fsp.readFile(componentFilePath);
        templateStream.write(' ' + fileData + ' ');
      } catch (error) {
        logError(`Error inject [${componentName}]!`);
      }

      HTML_Line = HTML_Line.slice(endIndex + 2);
      startIndex = HTML_Line.indexOf("{{");


    }
    templateStream.write(HTML_Line + '\n');







  }
  logComplete(`Bundling [${outputTemplateName}] complete!\n`);

  ///////////////////////////////////////////////////////
  try {
    logHeader(`Create CSS [${outputCssName}] bundle file...`);
    const dirFrom = stylesDir;
    const outputStream = fs.createWriteStream(outputFullPath + outputCssName);
    try {
      console.log(`Read CSS files from [styles] directory...`);
      const data = await fsp.readdir(dirFrom);
      await data.reduce(async (prom, file) => {
        return prom.then(async () => {
          const filePath = `${dirFrom}${file}`;
          const stats = await fsp.stat(filePath);
          if (!stats.isFile()) return;
          const splited = file.split('.');
          if (splited.length < 2 || splited.at(-1) !== 'css') return;

          const fileData = await fsp.readFile(filePath, { encoding: 'utf8' });
          console.log(`Write [${file}] to [${outputCssName}]...`);

          outputStream.write(`/* [${file}] */\n${fileData}\n`);
        });



      }, Promise.resolve());

      logComplete(`Bundling CSS [${outputCssName}] complete!\n`);
    } catch (error) {
      logError(`Error when include CSS [${outputCssName}] files`, error);

    }


  } catch (error) {
    logError(`Error during create CSS [${outputCssName}] bundle file\n`, error);
  }


  ///////////////////////////////////////////////////////////
  logHeader(`Add assets to [${outputDir}] folder...`);

  try {
    console.log(`Create directory [${assetsDirName}]...`);
    await fsp.mkdir(outputFullPath + assetsDirName);
    console.log('Directory created!');

  } catch (error) {
    console.log('Error creating directory!', error);
  }
  console.log('Start copy files...');
  console.log(assetsDir, outputFullPath + assetsDirName);

  await copy(assetsDir, outputFullPath + assetsDirName + '/')
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
