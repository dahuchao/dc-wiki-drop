module.exports = function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
  //$urlRouterProvider.otherwise("/connexion");
  $urlRouterProvider.when("/", "/pages/homepage");
  $urlRouterProvider.when("/pages", "/pages/homepage");
  $stateProvider
    .state("connexion", {
      url: "/connexion",
      templateUrl: "html/connexion.html",
      controller: "dcWikiConnexion"
    })
    .state("configuration", {
      url: "/configuration",
      templateUrl: "html/configuration.html",
      controller: "dcWikiConfigController"
    })
    .state("wiki", {
      url: "/",
      controller: "dcWikiRedirect"
    })
    .state("pages", {
      url: "/pages/{page}",
      templateUrl: "html/page.html",
      controller: "dcPageController"
    })
    .state("docs", {
      url: "/documents/{doc}",
      templateUrl: "html/document.html",
      controller: "dcDocController"
    });
  //$locationProvider.html5Mode(true);
  $mdThemingProvider.theme('default').primaryPalette('brown').accentPalette('orange');
}
