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
      templateUrl: "connexion.html",
      controller: "dcWikiConnexion"
    })
    .state("configuration", {
      url: "/configuration",
      templateUrl: "config.html",
      controller: "dcWikiConfiguration"
    })
    .state("wiki", {
      url: "/",
      controller: "dcWikiRedirect"
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
.controller('dcWikiConfiguration', ['$scope',
    function ($scope) {}])

// Controleur des pages de wiki
.controller('dcPageController', ['$injector', '$rootScope', '$state', '$scope', 'dcWikiFormateur',
    function ($injector, $rootScope, $state, $scope, dcWikiFormateur) {
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
      if (nomPage.match("undefined") || nomPage == "") {
        // Nom de la page par défaut
        nomPage = 'homepage';
      }
      var nomPageDropbox = nomPage + '.txt';
      // Journalisation
      console.log('* Lecture de la page de wiki : ' + nomPageDropbox);
      // Calcul du nom du service
      var nomService = $rootScope.PagesService;
      // Si le nom du service est bien renseigné
      if (nomService == undefined) {
        // Changement d'état pour ouvrir le wiki
        $state.go('connexion');
      } else {
        // Recherche du service
        var PagesService = $injector.get(nomService);
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
            $rootScope.edition = true;
          }
          if (reason.status === 401) {
            $scope.pagehtml = "erreur";
            $rootScope.edition = false;
            // Changement d'état pour ouvrir le wiki
            $state.go('connexion');
          }
          // Une erreur s'est produite
          $scope.pagehtml = "erreur";
          console.error("Erreur : " + angular.fromJson(reason));
        });
      }
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
        // Calcul du nom du service
        var nomService = $scope.PagesService;
        // Recherche du service
        var PagesService = $injector.get(nomService);
        // Enregistrement des modifications
        PagesService.enregistrer(nomPage, page);
        // Calcul du code html de la page de wiki
        $scope.pagehtml = dcWikiFormateur($scope.pagecontenu);
        // Lecture de la date de mise à jour
        $scope.dateMaj = page.dateMaj;
      }
    });
    $rootScope.edition = false;
    $scope.onAnnuler = function () {
      // Permutation du mode édition en mode lecture
      $rootScope.edition = false;
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
    };
    $scope.onEdition = function () {
      // Permutation du mode lecture en mode édition
      $rootScope.edition = true;
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
    };
    $scope.onEnregistrer = function () {
      // Si la page a été éditée
      if ($rootScope.edition === true) {
        // Diffusion de l'évènement aux scopes enfants
        $scope.$broadcast('onEnregistrement');
      }
      // Permutation du mode édition en mode lecture ou inversement
      $rootScope.edition = false;
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
    };
    $scope.alert = '';
    $scope.onOuvertureTeleversement = function ($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'page-doc-televersement.html', //'bottom-sheet-list-template.html',
        controller: 'ListBottomSheetCtrl',
        targetEvent: $event
      }).then(function (clickedItem) {
        $scope.alert = clickedItem['name'] + ' clicked!';
      });
    };
        }])

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
      // Utilisation du service pilote de dropbox
      $rootScope.PagesService = "PagesDropboxService";
      // Changement d'état pour ouvrir le wiki
      $state.go('wiki');
    }
    $scope.onAccueil = function () {
      // Changement d'état pour ouvrir le wiki
      $mdSidenav("gauche").close();
      $state.go('wiki');
    }
    $scope.onOuvertureMenu = function () {
      // Ouverture du menu
      $scope.menuPrincipalFerme = !$scope.menuPrincipalFerme;
    };
    $scope.onDebutRecherche = function () {
      $scope.recherche = true;
    };
    $scope.onFinRecherche = function () {
      $scope.recherche = false;
    };
    $scope.onInitRecherche = function () {
      $scope.termeRecherche = "";
    };
    $scope.onConfiguration = function () {
      // Changement d'état pour déconnexion
      $state.go('configuration');
      // Fermeture du menu
      $mdSidenav("gauche").close();
    };
    $scope.onDeconnexion = function () {
      // Déconnexion du service
      IdentificationService.logout();
      // Changement d'état pour déconnexion
      $state.go('connexion');
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
      $mdSidenav("gauche").close();
    };
}]);
