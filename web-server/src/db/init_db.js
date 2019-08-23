const model = require('./init_models');
model.sync({ force: true }).then(() => {
  console.log('all table is create done.');
});
