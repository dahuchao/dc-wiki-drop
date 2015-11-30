"use strict";

//Pages service used to communicate Pages REST endpoints
angular.module("dcWiki")

// Controleur des pages de wiki
.controller("dcPageController", ["$injector", "$rootScope", "$state", "$scope", "dcWikiFormateur", "$mdBottomSheet",
    function ($injector, $rootScope, $state, $scope, dcWikiFormateur, $mdBottomSheet) {
    console.info("Emission Ajouter de texte.");
    $scope.onHPlus = function () {
      $rootScope.$broadcast("hPlus", "+");
    };
    $scope.onHMoins = function () {
      $rootScope.$broadcast("hMoins", "+");
    };
    $scope.onAjouterGras = function () {
      $rootScope.$broadcast("ajouterGras");
    };
    $scope.onAjouterSouligne = function () {
      $rootScope.$broadcast("ajouterSouligne");
    };
    $scope.onAjouterItalic = function () {
      $rootScope.$broadcast("ajouterItalic");
    };
    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      // Calcul du nom de la page demandée
      var nomPage = encodeURI($state.params.page);
      // Pour les tests redéfinition du nom de la page
      //var nomPage = '206.txt';
      // Si le nom de la page n'est pas définie
      if (nomPage.match("undefined") || nomPage == "") {
        // Nom de la page par défaut
        nomPage = "homepage";
      }
      var nomPageDropbox = nomPage + ".txt";
      // Journalisation
      console.log("* Lecture de la page de wiki : " + nomPageDropbox);
      // Calcul du nom du service
      var nomService = $rootScope.PagesService;
      // Si le nom du service est bien renseigné
      if (nomService == undefined) {
        // Changement d'état pour ouvrir le wiki
        $state.go("connexion");
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
          // Si la page n'existe pas
          if (reason.status === 404) {
            // Decodage du nom de la page
            var nomPremierChapitre = decodeURIComponent(nomPage);
            // Création du premier chapitre de la page avec son nom
            $scope.pagecontenu = "+ " + nomPremierChapitre;
            // Passage en mode édition
            $rootScope.edition = true;
          }
          if (reason.status === 401) {
            $scope.pagehtml = "erreur";
            $rootScope.edition = false;
            // Changement d'état pour ouvrir le wiki
            $state.go("connexion");
          }
          // Une erreur s'est produite
          $scope.pagehtml = "erreur";
          //console.error("Erreur : " + angular.fromJson(reason));
        });
      }
    });
    // Mise à l'écoute de l'évènement d'enregistrement de la page de wiki
    $scope.$on("onEnregistrement", function () {
      // Calcul du nom de la page
      var nomPage = encodeURI($state.params.page);
      // Si le nom de la page n'est pas définie
      if (nomPage.match("undefined") || nomPage == "") {
        // Nom de la page par défaut
        nomPage = "homepage";
      }
      // Calcul du nom de page complet
      nomPage = nomPage + '.txt';
      console.log("* Enregistrement de la page de wiki : " + nomPage);
      // Journalisation
      console.log("* Relecture de la page avant enregistrement.");
      // Modification du contenu de la page de wiki
      var page = $scope.pagecontenu;
      // Calcul du nom du service
      var nomService = $rootScope.PagesService;
      // Si le nom du service est bien renseigné
      if (nomService == undefined) {
        // Changement d'état pour ouvrir le wiki
        $state.go("connexion");
      } else {
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
        $scope.$broadcast("onEnregistrement");
      }
      // Permutation du mode édition en mode lecture ou inversement
      $rootScope.edition = false;
      // Fermeture du menu
      $scope.menuPrincipalFerme = true;
    };
    $scope.onOuvertureTeleversement = function () {
      $mdBottomSheet.show({
        templateUrl: "dc-document/televersement.html",
        controller: "TeleversementController",
        //targetEvent: $event
      }).then(function (clickedItem) {
        console.info("Parcourir..." + $scope.fichier);
      });
    };
}])

/**
 * Gestion des téléversement
 */
.controller("TeleversementController", ["$state", "$injector", "$rootScope", "$scope", "$mdBottomSheet", function ($state, $injector, $rootScope, $scope, $mdBottomSheet) {
  $scope.test = "test";
  $scope.onAjouterLienDoc = function () {
    $rootScope.$broadcast("ajouterLienDoc", $scope.lienDoc);
    $mdBottomSheet.hide();
  };
  $scope.onTeleverser = function () {
    // Calcul du fichier
    const fichier = $scope.fichier;
    // Journalisation du nom du fichier
    console.info("Televerser le fichier %s", fichier.name);
    //    {
    //    "lastModified": 1438583972000,
    //    "lastModifiedDate": "2015-08-03T06:39:32.000Z",
    //    "name": "gitignore_global.txt",
    //    "size": 236,
    //    "type": "text/plain",
    //    "data": "data:text/plain;base64,DQojaWdub3JlIHRodW1ibmFpbHMgY3JlYXRlZCBieSB3aW5kb3dz…xoDQoqLmJhaw0KKi5jYWNoZQ0KKi5pbGsNCioubG9nDQoqLmRsbA0KKi5saWINCiouc2JyDQo="
    //}
    // Calcul du nom du service
    var nomService = $rootScope.PagesService;
    // Si le nom du service est bien renseigné
    if (nomService == undefined) {
      // Changement d'état pour ouvrir le wiki
      $state.go("connexion");
    } else {
      // Calcul du nom du fichier
      const nomPage = fichier.name;
      // Calcul du contenu du document
      const contenuPage = fichier.data;
      // Recherche du service
      var PagesService = $injector.get(nomService);
      // Enregistrement des modifications
      PagesService.televerserDocument(nomPage, contenuPage);
      // Documentation du lien
      $scope.lienDoc = "doc://" + nomPage;
    }
  };
}]);
