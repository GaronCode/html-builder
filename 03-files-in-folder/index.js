const fsp = require("node:fs/promises");

async function main() {

  const data = await fsp.readdir(__dirname);

  data.forEach(async file => {
    const stats = await fsp.stat(`${__dirname}/${file}`);

    if (!stats.isFile()) return;

    const splited = file.split('.');

    let name, exe, size = stats.size + 'B';
    if (splited.length === 1) {
      exe = '<none>'
      name = splited[0];
    } else {
      exe = splited.at(-1)
      splited.length = splited.length - 1;
      name = splited.join('');
    }


    console.log(`${name} - ${exe} - ${size}`);


  });

}
main();
