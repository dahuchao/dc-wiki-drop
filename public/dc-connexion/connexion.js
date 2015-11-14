'use strict';

//Pages service used to communicate Pages REST endpoints
angular.module('dcWiki')

/**
 * Service d'identificaion
 */
.service("IdentificationService", ['$cookies',
    function ($cookies) {
    var jeton = null;

    function isLogin() {
      var isLogin = false;
      if (jeton) {
        isLogin = true
      }
      return isLogin;
    }

    function login(token) {
      jeton = token;
      $cookies.put('cookieJeton', token);
    }

    function logout() {
      jeton = null;
      $cookies.remove('cookieJeton');
    }

    function getToken() {
      var cookieJeton = $cookies.get('cookieJeton');
      return cookieJeton;
    }
    return {
      isLogin: isLogin,
      login: login,
      logout: logout,
      getToken: getToken
    }
}])

/**
 * Création du controleur du wiki
 */
.controller('dcWikiConnexion', ["$rootScope",'$scope', '$location', '$state',
    function ($rootScope, $scope, $location, $state) {
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
    // Connexion pour les test
    $scope.onConnexionTest = function () {
      // Journalisation
      console.log("Connexion de test.");
      $rootScope.PagesService = "PagesLocalesService";
      $state.go("pages");
    }
}]);
