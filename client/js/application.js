var App = {
  'Models': {},
  'ViewModels': {},
  'BindingHandlers': {}
};

// Models
App.Models.Article = function (object) {
  this.rank = ko.observable(object.rank);
  this.title = ko.observable(object.title);
  this.url = ko.observable(object.url);
  this.points = ko.observable(object.points);
  this.username = ko.observable(object.username);
  this.comments = ko.observable(object.comments);
}

// ViewModels
App.ViewModels.Articles = function () {

  var self = this;

  // Initializer
  this.init = function () {
    self.fetch();
  }

  // Properties
  this.headings = ko.observableArray();
  this.keys = ko.observableArray();
  this.activeSort;

  // Methods
  this.fetch = function () {
    $.get('api/scrape', function (data) {
      data.forEach(function(i) {
        self.headings.push(new App.Models.Article(i));
      });

      // Copy property names
      self.keys($.map(self.headings()[0], function (index, key) {
        return {'sortPropertyName': key, 'asc': true};
      }));
      self.activeSort = self.keys()[0];
    });
  }

  this.sortOrder = function (key) {

    self.activeSort === key ? (key.asc = !key.asc) : (self.activeSort = key); 
    var prop = self.activeSort.sortPropertyName;
    var ascSort = function(a,b){ return a[prop]() < b[prop]() ? -1 : a[prop]() > b[prop]() ? 1 : a[prop]() == b[prop]() ? 0 : 0; };
    var descSort = function(a,b){ return ascSort(b,a); };
    var sortFunc = self.activeSort.asc ? ascSort : descSort;
    self.headings.sort(sortFunc);
  }

  this.init();

}

// Binding Handlers
App.BindingHandlers.createHeaderRow = function () {
  ko.bindingHandlers.createHeaderRow = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      for (var property in valueAccessor()) {
        $(element).append('<th>' + property + '</th>');
      }
    }
  };
}

App.BindingHandlers.createTableRow = function () {
  ko.bindingHandlers.createTableRow = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      for (var property in valueAccessor()) {
        $(element).append('<td data-bind="text: ' + property + '"></td>');
      }
    }
  };
}

// Initializer
App.start = function() {
  for (var i in App.BindingHandlers) {
    App.BindingHandlers[i]();
  }
  ko.applyBindings(new App.ViewModels.Articles());
}

// Start Application on DOM Ready
$(App.start);
