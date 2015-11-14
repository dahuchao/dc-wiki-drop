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
      templateUrl: "dc-configuration/config.html",
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
      url: "/docs/{doc}",
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

// Controleur de la page de téléchargement de documents
.controller('dcTeleversementController', ['$scope', 'PagesDropboxService',
    function ($scope, PagesService) {
    $scope.onTeleverser = function () {

      var lastModified = $scope.fichier.lastModified; //": 1438583972000,
      var lastModifiedDate = $scope.fichier.lastModifiedDate; //": "2015-08-03T06:39:32.000Z",
      var name = $scope.fichier.name; //": "gitignore_global.txt",
      var size = $scope.fichier.size; //": 236,
      var type = $scope.fichier.type; //": "text/plain",
      var data = $scope.fichier.data; //": "data:text/plain;base64,DQojaWdub3JlIHRodW1ibmFpbHMgY3JlYXRlZCBieSB3aW5kb3dz…xoDQoqLmJhaw0KKi5jYWNoZQ0KKi5pbGsNCioubG9nDQoqLmRsbA0KKi5saWINCiouc2JyDQo="

      PagesService.enregistrer(name, data);

    };
}])

/**
 * Gestion des téléversement
 */
.controller('ListBottomSheetCtrl', function ($scope, $mdBottomSheet) {
  $scope.items = [
    {
      name: 'Share',
      icon: 'share-arrow'
    },
    {
      name: 'Upload',
      icon: 'upload'
    },
    {
      name: 'Copy',
      icon: 'copy'
    },
    {
      name: 'Print this page',
      icon: 'print'
    },
  ];
  $scope.listItemClick = function ($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
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
