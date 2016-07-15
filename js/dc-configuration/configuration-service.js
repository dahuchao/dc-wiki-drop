module.exports = function ($injector, $rootScope, $state, $scope, dcWikiFormateur) {
    console.info("Configuration utilisateur.");
    $scope.onChange = function () {
      console.debug("Sélection du langage : %s", $scope.config.langue);
    }
}
