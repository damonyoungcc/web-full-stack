const path = require('path');
const fs = require('fs');
const sequelize = require('./dbConn');

const files = fs.readdirSync(path.resolve(__dirname, './models/'));
const js_files = files.filter((f) => {
  return f.endsWith('.js');
}, files);
console.log(js_files);
module.exports = {};
for (const f of js_files) {
  console.log(`import model from file ${f}...`);
  const name = f.substring(0, f.length - 3);
  module.exports[name] = require(path.resolve(__dirname, `./models/${f}`));
}
module.exports.sync = () => {
  return sequelize.sync();
};
