var data = require('../lib/data');
var Paginate = require('../lib/paginator')

var querydefaults = {
  page: {
    default: 1,
    min: 1,
    max: false,
    allowed: false
  },
  display: {
    default: 10,
    min: 10,
    max: 100,
    allowed: [10,25,50,100]
  }
}

function validateReqQuery (req, queryname) {
  var passed = true;

  if (typeof req.query[queryname] === undefined) {
    return false;
  }

  if (!validator.isNumeric(req.query[queryname])) {
    return false;
  }

  if (parseInt(req.query[queryname]) === 0) {
    return false;
  }

  return true;
}

module.exports = function () {
  var functions = {};

  functions.index = function (req, res) {
    res.render('index', {title: "Pagination Test"});
  };

  functions.list = function (req, res) {
    //make this so you can send in an object of defaults like page, display
    var dataCount = data.length;
    
    var Paginator = new Paginate(dataCount, querydefaults);

    
    var queries = Paginator.validateReqQuery({display: req.query.display, page: req.query.page});
    // var page = validateReqQuery(req, "page") ? req.query.page : 1;
    // var display = validateReqQuery(req, "display") ? req.query.display : 10;

    var states = data.slice(queries.beginRange, queries.endRange);

    res.locals.renderPagination = Paginator.renderPagination(dataCount);

    res.render('list', {title: "Pagination Test", states: states });
  };

  return functions;
};