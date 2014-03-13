var validator = require('validator');

var Paginator = function (count, data) {

  var self = this;
  
  self.page = 1;
  self.display = 10;

  self.validateReqQuery = function (queryobjs) {
    var returnQueries = {};
    for (prop in queryobjs) {

      var passed = self.checkQueries(queryobjs[prop]);
      
      //do a check here to make sure that the default page can only be the maximum ceiling
      //so we'll need to send in the count and also that the maximum display in not more than 100
      self[prop] = passed ? parseInt(queryobjs[prop]) : self[prop];
     
      returnQueries[prop] = self[prop];
    }

    returnQueries.endRange = self.page * self.display;
    returnQueries.beginRange = returnQueries.endRange - self.display;
    return returnQueries;
  };

  self.checkQueries = function (value) {

    if (typeof value === undefined) {
      return false;
    }

    if (!validator.isNumeric(value)) {
      return false;
    }

    if (parseInt(value) === 0) {
      return false;
    }

    return true;
  };

  self.renderPagination = function (count) {
    var paginationRow = "";
    var blockCount = Math.ceil(count / self.display);
    var link = "";

    for (var i = 1; i <= blockCount; i++) {
      link = "/list?page=" + i + "&display=" + self.display;
      var pageClass = "";
      var click = "";
      if (i === self.page) {
          pageClass = "active";
          click = " <span class=sr-only>(current)</span>"
      }
      paginationRow += "<li class='" + pageClass + "'><a href='" + link + "'>" + i + click + "</a></li>";
    }

    var prevClass = self.page === 1 ? "disabled": "";
    var prevVal = self.page === 1 ? 1 : self.page - 1;
    var prev = "/list?page=" + prevVal + "&display=" + self.display;
    prev = "<li class=" + prevClass +"><a href=" + prev + ">«</a></li>";

    var nextClass = self.page === blockCount ? "disabled": "";
    var nextVal = self.page === blockCount ? self.page : self.page + 1;
    var next = "/list?page=" + nextVal + "&display=" + self.display;
    next = "<li class=" + nextClass + "><a href=" + next + ">»</a></li>";

    return prev + paginationRow + next;
  }
};

module.exports = Paginator;