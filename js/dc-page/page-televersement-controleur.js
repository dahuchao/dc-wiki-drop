/**
 * Gestion des téléversement
 */
module.exports = function ($state, $injector, $rootScope, $scope, $mdBottomSheet) {
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
}
