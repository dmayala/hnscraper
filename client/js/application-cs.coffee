App =
  'Models': {}
  'ViewModels': {}
  'BindingHandlers': {}

# Models
class App.Models.Article
  constructor: (object) ->
    @.rank = ko.observable(object.rank)
    @.title = ko.observable(object.title)
    @.url = ko.observable(object.url)
    @.points = ko.observable(object.points)
    @.username = ko.observable(object.username)
    @.comments = ko.observable(object.comments)

# ViewModels
class App.ViewModels.Articles 
  constructor: ->

    # Initializer
    @.init = =>
      @.fetch()

    # Properties
    @.headings = ko.observableArray()
    @.keys = ko.observableArray()
    @.activeSort

    # Methods
    @.fetch = ->
      $.get('api/scrape', (data) =>
        @.headings.push(new App.Models.Article(i)) for i in data

        # Copy property names
        @.keys($.map(@.headings()[0], (index, key) -> 
            return {'sortPropertyName': key, 'asc': true}
        ))

        @.activeSort = @.keys()[0]
      )

    @sortOrder = (key) =>
      (if @.activeSort is key then (key.asc = not key.asc) else (@.activeSort = key))
      prop = @.activeSort.sortPropertyName
      ascSort = (a, b) ->
        (if a[prop]() < b[prop]() then -1 else (if a[prop]() > b[prop]() then 1 else (if a[prop]() is b[prop]() then 0 else 0)))

      descSort = (a, b) ->
        ascSort b, a

      sortFunc = (if @.activeSort.asc then ascSort else descSort)
      @.headings.sort sortFunc
    
    @.init()

# Binding Handlers
App.BindingHandlers.createHeaderRow = ->
  ko.bindingHandlers.createHeaderRow = init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
    for property of valueAccessor()
      $(element).append "<th>" + property + "</th>"

App.BindingHandlers.createTableRow = ->
  ko.bindingHandlers.createTableRow = init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
    for property of valueAccessor()
      $(element).append "<td data-bind=\"text: " + property + "\"></td>"

# Initializer
App.start = ->
  for i of App.BindingHandlers
    App.BindingHandlers[i]()
  ko.applyBindings new App.ViewModels.Articles()

# Start Application on DOM Ready
$ App.start