'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

// Controleur des pages de wiki
.controller('dcWikiConfigController', ['$injector', '$rootScope', '$state', '$scope', 'dcWikiFormateur',
    function ($injector, $rootScope, $state, $scope, dcWikiFormateur) {
    console.info("Configuration utilisateur.");
    $scope.onChange = function () {
      console.debug("Sélection du langage : %s", $scope.config.langue);
    }
}]);
