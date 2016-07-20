module.exports = function ($rootScope, $scope, $location, $state) {
    // Calcul de l'URL
    var prot = $location.protocol();
    var host = $location.host();
    var port = $location.port();
    if (port == '80') {
      port = '';
    } else {
      port = ':' + port
    }
    if (host == 'dc-wiki-drop.herokuapp.com') {
      port = '';
    }
    var url = prot + '://' + host + port + '/';
    // Journalisation du jeton
    console.log("URL : " + url);
    // URL de redirection
    $scope.redirect_uri = url; //'http://test'
    // Connexion pour les test
    $scope.onConnexionTest = function () {
      // Journalisation
      console.log("Connexion de test.");
      $rootScope.PagesService = "PagesLocalesService";
      $rootScope.DocumentsService = "DocumentsLocalService";
      $state.go("pages");
    }
}
