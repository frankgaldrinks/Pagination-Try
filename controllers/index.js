var data = require('../lib/data');
var Paginate = require('../lib/paginator')
var pagin = require('nodejs-yapaginate');

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

module.exports = function () {
  var functions = {};

  functions.index = function (req, res) {
    res.render('index', {title: "Pagination Test"});
  };

  functions.states = function (req, res) {
    //make this so you can send in an object of defaults like page, display
    var dataCount = data.states.length;
    
    var Paginator = new Paginate(dataCount, querydefaults);
    var queries = Paginator.validateReqQuery({display: req.query.display, page: req.query.page});

    res.locals.renderPagination = Paginator.renderPagination(req);

    states = data.states.slice(queries.beginRange, queries.endRange);
    res.render('states', {title: "Pagination Test", states: states });
  };

  functions.countries = function (req, res) {
    //make this so you can send in an object of defaults like page, display
    var dataCount = data.countries.length;
    
    var Paginator = new Paginate(dataCount, querydefaults);
    var queries = Paginator.validateReqQuery({display: req.query.display, page: req.query.page});

    res.locals.renderPagination = Paginator.renderPagination(req);

    countries = data.countries.slice(queries.beginRange, queries.endRange);
    res.render('countries', {title: "Pagination Test", countries: countries });
  };

  functions.ytest = function (req, res) {
    var perpage = req.query.perpage || 10;
    console.log(pagin({totalItem:100, itemPerPage:10, currentPage:1, url:'/mybeautifulapp'}));
  };



  return functions;
};