'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

/** 
 * Création du controleur du wiki
 */
.controller('dcWikiConnexion', ['$scope', '$location',
    function ($scope, $location) {
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
        var url = prot + '://' + host + port + '/wiki/';
        // Journalisation du jeton
        console.log("URL : " + url);
        // URL de redirection
        $scope.redirect_uri = url; //'http://test'
}]);