const { glob } = require('glob');
const fs = require('fs');
const path = require('path');

// glob 10 dropped the callback signature and is now promise-based.
const getLcovFiles = (src) => glob(`${src}/**/lcov.info`);

(async function () {
  fs.mkdirSync('coverage', { recursive: true });
  const files = await getLcovFiles('coverage');
  const mergedReport = files.reduce((mergedReport, currFile) => (mergedReport += fs.readFileSync(currFile)), '');
  fs.writeFile(path.resolve('./coverage/lcov.info'), mergedReport, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
})();
