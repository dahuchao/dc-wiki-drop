'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

// Controleur des pages de wiki
.controller("dcDocController", ["$state", "$scope",
    function ($state, $scope) {
    // Calcul du nom du document demandé
    var nomDoc = encodeURI($state.params.doc);
    // Si le nom du document est bien définie
    if (!nomDoc.match("undefined")) {
      // Journalisation
      console.log('* Lecture du document : ' + nomDoc);
      // Calcul du nom du service
      var nomService = $rootScope.DocumentsService;
      // Si le nom du service est bien renseigné
      if (nomService == undefined) {
        // Changement d'état pour ouvrir le wiki
        $state.go("connexion");
      } else {
        // Recherche du service
        var DocumentsService = $injector.get(nomService);
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
    }
}]);
