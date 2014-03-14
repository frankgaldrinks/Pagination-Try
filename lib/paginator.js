var validator = require('validator');
//TODOS
//Potentially make this route middleware so you can use it on any route that needs
//pagination instead of putting it in the controller and bulking it up
var Paginator = function (count, data) {

  var self = this;
  
  self.count = count;
  self.page = data.page;
  self.display = data.display;

  //a quick and dirty way to make this work is to make sure we send in the display first
  self.validateReqQuery = function (queryobjs) {
    var returnQueries = {};
    for (prop in queryobjs) {

      var passed = self.checkQueries(prop,queryobjs[prop]);
      
      //do a check here to make sure that the default page can only be the maximum ceiling
      //so we'll need to send in the count and also that the maximum display in not more than 100
      self[prop].val = passed ? parseInt(queryobjs[prop]) : self[prop].default;
     
      returnQueries[prop] = self[prop].val;
    }

    returnQueries.endRange = self.page.val * self.display.val;
    returnQueries.beginRange = returnQueries.endRange - self.display.val;
    return returnQueries;
  };

  self.checkQueries = function (prop,value) {

    if (typeof value === undefined) {
      return false;
    }

    if (!validator.isNumeric(value)) {
      return false;
    }

    value = parseInt(value);
    
    if (value === 0) {
      return false;
    }

    //its kind of redundent to check the max if we also check the allowed
    if (prop === "display" && (value > self[prop].max || self[prop].allowed.indexOf(value) === -1)) {
      return false;
    }

    //we know the value is valid because we passed above, therefor we can reference it and not self.val
    if (prop === "page" && value > Math.ceil(self.count / self.display.val)) {
      return false;
    }

    return true;
  };

  self.renderPagination = function (req) {
    var paginationRow = "";
    var blockCount = Math.ceil(self.count / self.display.val);
    var link = "";
    var path = req.path;

    //make all this push onto an array instead of concatenated string

    for (var i = 1; i <= blockCount; i++) {
      link = path + "?page=" + i + "&display=" + self.display.val;
      var pageClass = "";
      var click = "";
      if (i === self.page.val) {
          pageClass = "active";
          click = " <span class=sr-only>(current)</span>"
      }
      paginationRow += "<li class='" + pageClass + "'><a href='" + link + "'>" + i + click + "</a></li>";
    }

    var prevClass = self.page.val === 1 ? "disabled": "";
    var prevVal = self.page.val === 1 ? 1 : self.page.val - 1;
    var prev = path + "?page=" + prevVal + "&display=" + self.display.val;
    prev = "<li class=" + prevClass +"><a href=" + prev + ">«</a></li>";

    var nextClass = self.page.val === blockCount ? "disabled": "";
    var nextVal = self.page.val === blockCount ? self.page.val : self.page.val + 1;
    var next = path + "?page=" + nextVal + "&display=" + self.display.val;
    next = "<li class=" + nextClass + "><a href=" + next + ">»</a></li>";

    return prev + paginationRow + next;
  }
};

module.exports = Paginator;