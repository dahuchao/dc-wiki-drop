'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki', ['ng-file-model', 'ngMaterial', 'ngSanitize', 'ui.router', 'ngResource', 'ngCookies'])

/**
 * Configuration des routes de l'application
 */
.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
  //$urlRouterProvider.otherwise("/connexion");
  $urlRouterProvider.when("/", "/pages/homepage");
  $urlRouterProvider.when("/pages", "/pages/homepage");
  $stateProvider
    .state("connexion", {
      url: "/connexion",
      templateUrl: "dc-connexion/connexion.html",
      controller: "dcWikiConnexion"
    })
    .state("configuration", {
      url: "/configuration",
      templateUrl: "dc-configuration/configuration.html",
      controller: "dcWikiConfigController"
    })
    .state("wiki", {
      url: "/",
      controller: "dcWikiRedirect"
    })
    .state("pages", {
      url: "/pages/{page}",
      templateUrl: "dc-page/page.html",
      controller: "dcPageController"
    })
    .state("docs", {
      url: "/documents/{doc}",
      templateUrl: "dc-document/document.html",
      controller: "dcDocController"
    });
  //$locationProvider.html5Mode(true);
  $mdThemingProvider.theme('default').primaryPalette('brown').accentPalette('orange');
})

/**
 * Configuration du controle de bonne connexion
 */
.run(function ($rootScope, $state, IdentificationService) {
  $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
    console.info("Vérification du jeton de sécurité de l'utilisateur.");
    // Si le changement d'état concerne le wiki et si l'utilisateur n'est pas loger
    if (toState.wiki && !IdentificationService.isLogin()) {
      // User isn’t authenticated
      $state.transitionTo("connexion");
      event.preventDefault();
    }
  });
})

/**
 * Création du controleur du wiki
 */
.controller('dcWikiRedirect', ['$state', '$rootScope', '$scope', '$location', '$resource', 'IdentificationService',
    function ($state, $rootScope, $scope, $location, $resource, IdentificationService) {
    // Journalisation
    console.log('* dcWikiRedirect sur wiki.');
    // Changement d'état pour ouvrir le wiki
    //$state.go('wiki');
  }]);
