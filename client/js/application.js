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

  // Methods
  this.fetch = function () {
    $.get('api/scrape', function (data) {
      data.forEach(function(i) {
        self.headings.push(new App.Models.Article(i));
      });
    });
  }

  this.sortByUsername = function () {
    this.headings.sort(function(a, b) {
      return a.username().toLowerCase() < b.username().toLowerCase() ? -1 : 1;
    });
  };

  this.sortByRank = function () {
    this.headings.sort(function(a, b) {
      return a.rank() < b.rank() ? -1 : 1;
    });
  }

  this.todo = function () {
    // does nothing. to do.
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