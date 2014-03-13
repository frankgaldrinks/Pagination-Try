module.exports = function (app) {
  var indexController = require("../controllers/index")();

  app.get('/', indexController.index);
  app.get('/list', indexController.list);
};