'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

// Controleur des pages de wiki
.controller('dcPageTestController', ['$rootScope', '$state', '$scope', 'PagesLocalesService', 'dcWikiFormateur', '$mdBottomSheet',
    function ($rootScope, $state, $scope, PagesService, dcWikiFormateur, $mdBottomSheet) {
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
    $scope.showListBottomSheet = function ($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'page-doc-televersement.html',
        controller: 'ListBottomSheetCtrl',
        targetEvent: $event
      }).then(function (clickedItem) {
        $scope.alert = clickedItem['name'] + ' clicked!';
      });
    };
}]);
