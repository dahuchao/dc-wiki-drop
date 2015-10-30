'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki', ['ngMaterial', 'angularFileUpload', 'ngSanitize', 'ui.router', 'ngResource', 'ngCookies'])

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
      templateUrl: "connexion.html",
      controller: "dcWikiConnexion"
    })
    .state("wiki", {
      url: "/",
      controller: "dcWikiRedirect"
    })
    .state("televersement", {
      url: "/pages/{page}/televersement",
      templateUrl: "televersement.html",
      controller: "dcTeleversementController"
    })
    .state("pages", {
      url: "/pages/{page}",
      templateUrl: "page.html",
      controller: "dcPageController"
    })
    .state("test", {
      url: "/test/pages/{page}",
      templateUrl: "page.html",
      controller: "dcPageTestController"
    })
    .state("docs", {
      url: "/docs/{doc}",
      templateUrl: "doc.html",
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

// Controleur des pages de wiki
.controller('dcDocController', ['DocumentsLocalService', '$state', '$scope',
    function (DocumentsService, $state, $scope) {
    // Calcul du nom du document demandé
    var nomDoc = encodeURI($state.params.doc);
    // Si le nom du document est bien définie
    if (!nomDoc.match("undefined")) {
      // Journalisation
      console.log('* Lecture du document : ' + nomDoc);
      // Téléchargement de la page
      DocumentsService.resoudreLien(nomDoc, function (lien) {
        // Journalisation
        console.log('* Document : ' + lien.url);
        // Ouverture du document
        $scope.url = lien.url;
      }, function (reason) {
        if (reason.status === 404) {
          // Journalisation
          console.log('* Erreur : nom du document indéfinit.');
        }
        if (reason.status === 401) {
          // Changement d'état pour ouvrir le wiki
          $state.go('connexion');
        } else {
          // Journalisation
          console.log('* Erreur : nom du document indéfinit.');
        }
      });
    }
    }])

// Controleur des pages de wiki
.controller('dcTeleversementController', ['FileUploader', '$state', '$scope',
    function (FileUploader, $state, $scope) {
    var uploader = $scope.uploader = new FileUploader({
      url: '/docs'
    });

    uploader.onAfterAddingFile = function (fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };
    }])

// Controleur des pages de wiki
.controller('dcPageController', ['$rootScope', '$state', '$scope', 'PagesDropboxService', 'dcWikiFormateur',
    function ($rootScope, $state, $scope, PagesService, dcWikiFormateur) {
    console.info("Emission Ajouter de texte.");
    $scope.onHPlus = function () {
      $rootScope.$broadcast('hPlus', '+');
    };
    $scope.onHMoins = function () {
      $rootScope.$broadcast('hMoins', '+');
    };
    $scope.onAjouterLien = function () {
      $rootScope.$broadcast('ajouterLien');
    };
    $scope.onAjouterGras = function () {
      $rootScope.$broadcast('ajouterGras');
    };
    $scope.onAjouterSouligne = function () {
      $rootScope.$broadcast('ajouterSouligne');
    };
    $scope.onAjouterItalic = function () {
      $rootScope.$broadcast('ajouterItalic');
    };
    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      // Calcul du nom de la page demandée
      var nomPage = encodeURI($state.params.page);
      // Pour les tests redéfinition du nom de la page
      //var nomPage = '206.txt';
      // Si le nom de la page n'est pas définie
      if (nomPage.match("undefined")) {
        // Nom de la page par défaut
        nomPage = 'homepage';
      }
      var nomPageDropbox = nomPage + '.txt';
      // Journalisation
      console.log('* Lecture de la page de wiki : ' + nomPageDropbox);
      // Téléchargement de la page
      PagesService.telecharger(nomPageDropbox, function (page) {
        // Enregistrement du contenu de la page de wiki
        $scope.pagecontenu = page;
        // Calcul du code html de la page de wiki
        $scope.pagehtml = dcWikiFormateur($scope.pagecontenu);
        // Lecture de la date de mise à jour
        $scope.dateMaj = page.dateMaj;
      }, function (reason) {
        if (reason.status === 404) {
          $scope.pagecontenu = "+ " + nomPage;
          $scope.edition = true;
        }
        if (reason.status === 401) {
          $scope.pagehtml = "erreur";
          $scope.edition = false;
          // Changement d'état pour ouvrir le wiki
          $state.go('connexion');
        }
        // Une erreur s'est produite
        $scope.pagehtml = "erreur";
        console.error("Erreur : " + angular.fromJson(reason));
      });
    });
    // Mise à l'écoute de l'évènement d'enregistrement de la page de wiki
    $scope.$on('onEnregistrement', function () {
      // Calcul du nom de la page
      var nomPage = encodeURI($state.params.page);
      // Si le nom de la page n'est pas définie
      if (nomPage.match("undefined")) {
        // Nom de la page par défaut
        nomPage = 'homepage';
      }
      // Calcul du nom de page complet
      nomPage = nomPage + '.txt';
      // Si le nom de la page n'est pas définie
      if (!nomPage.match("undefined")) {
        console.log('* Enregistrement de la page de wiki : ' + nomPage);
        // Journalisation
        console.log('* Relecture de la page avant enregistrement.');
        // Modification du contenu de la page de wiki
        var page = $scope.pagecontenu;
        // Enregistrement des modifications
        PagesService.enregistrer(nomPage, page);
        // Calcul du code html de la page de wiki
        $scope.pagehtml = dcWikiFormateur($scope.pagecontenu);
        // Lecture de la date de mise à jour
        $scope.dateMaj = page.dateMaj;
      }
    });
}])

/**
 * Création du controleur du wiki
 */
.controller('dcWikiRedirect', ['$state', '$rootScope', '$scope', '$location', '$resource', 'IdentificationService',
    function ($state, $rootScope, $scope, $location, $resource, IdentificationService) {
    // Journalisation
    console.log('* dcWikiRedirect sur wiki.');
    // Changement d'état pour ouvrir le wiki
    //$state.go('wiki');
  }])

/**
 * Création du controleur du wiki
 */
.controller('dcWikiController', ['$state', '$rootScope', '$scope', '$location', '$resource', 'IdentificationService', '$mdSidenav',
    function ($state, $rootScope, $scope, $location, $resource, IdentificationService, $mdSidenav) {
    $scope.basculeMenu = function (menuId) {
      $mdSidenav(menuId).toggle();
    };
    // Fermeture du menu
    $scope.menuPrincipalFerme = true;
    // Calcul de l'URL
    var token = $location.url();
    // Expression régulière pour calculer le token
    var reg = new RegExp("/access_token=(.*)&.*&.*", "g");
    // Si l'URL porte un token de controle d'accès
    if (token.match(reg)) {
      // Calcul du token
      token = token.replace(reg, "Bearer $1");
      // Enregistrement du jeton de controle d'accès
      $rootScope.jeton = token;
      // Login
      IdentificationService.login(token);
      // Journalisation du jeton
      console.log("Jeton : " + $rootScope.jeton);
      // Changement d'état pour ouvrir le wiki
      $state.go('wiki');
    }
    $scope.onRetour = function () {
      // Changement d'état pour ouvrir le wiki
      $state.go('wiki');
    }
    $scope.onOuvertureMenu = function () {
      // Ouverture du menu
      $scope.menuPrincipalFerme = !$scope.menuPrincipalFerme;
    };
    $scope.onDeconnexion = function () {
      // Déconnexion du service
      IdentificationService.logout();
      // Changement d'état pour déconnexion
      $state.go('connexion');
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
    };
    $scope.edition = false;
    $scope.onAnnuler = function () {
      // Permutation du mode édition en mode lecture
      $scope.edition = false;
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
    };
    $scope.onEdition = function () {
      // Permutation du mode lecture en mode édition
      $scope.edition = true;
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
    };
    $scope.onEnregistrer = function () {
      // Si la page a été éditée
      if ($scope.edition === true) {
        // Diffusion de l'évènement aux scopes enfants
        $scope.$broadcast('onEnregistrement');
      }
      // Permutation du mode édition en mode lecture ou inversement
      $scope.edition = false;
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
    };
}]);
