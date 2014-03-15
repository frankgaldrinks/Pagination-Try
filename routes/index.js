module.exports = function (app) {
  var indexController = require("../controllers/index")();

  app.get('/', indexController.index);
  app.get('/states', indexController.states);
  app.get('/countries', indexController.countries);
  app.get('/ytest', indexController.ytest);
};